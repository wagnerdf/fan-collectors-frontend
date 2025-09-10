import React, { useState, useEffect } from "react";
import api from "../services/api";
//import { apiKey } from "../env-config";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import MidiaFormJG from "../components/MidiaFormJG";

const tiposApiTMDB = ["Blu-ray", "DVD", "VHS"];

export function MidiaForm() {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [tituloBusca, setTituloBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [dadosSelecionados, setDadosSelecionados] = useState<any>(null);
  const [isBuscando, setIsBuscando] = useState(false);
  const [tiposMidia, setTiposMidia] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState(""); // Filme ou Série
  const [temporada, setTemporada] = useState(""); // Campo extra para série
  const [mapaGeneros, setMapaGeneros] = useState<{ [key: number]: string }>({});
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mostrarModalErro, setMostrarModalErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");



  const camposTMDB = [
    "observações",
    "titulo_original",
    "titulo_alternativo",
    "ano_lancamento",
    "formato_video",
    "estudio",
    "classificacao_etaria",
    "capa_url",
    "sinopse",
    "generos",
    "duracao",
    "linguagem",
    "nota_media",
    "artistas",
    "diretores",
    "formatoMidia"
  ];

  const apiKey = process.env.REACT_APP_API_TMDB;

  useEffect(() => {
    const carregarGeneros = async () => {
      try {
        const [resFilmes, resSeries] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`),
          fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=pt-BR`)
        ]);

        const dataFilmes = await resFilmes.json();
        const dataSeries = await resSeries.json();

        const todosGeneros = [...dataFilmes.genres, ...dataSeries.genres];
        const mapa: { [key: number]: string } = {};
        todosGeneros.forEach((g: any) => {
          mapa[g.id] = g.name;
        });

        setMapaGeneros(mapa);
      } catch (err) {
        console.error("Erro ao carregar gêneros:", err);
      }
    };

    carregarGeneros();
  }, []);

  useEffect(() => {
    api
      .get("/api/midia-tipos/ativos")
      .then((res) => {
        const tipos = res.data.map((item: any) => item.nome);
        setTiposMidia(tipos);
      })
      .catch((err) => console.error("Erro ao carregar tipos de mídia:", err));
  }, []);

  useEffect(() => {
    if (!tituloBusca || !tiposApiTMDB.includes(tipoSelecionado)) {
      setResultadosBusca([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      buscarTMDB();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [tituloBusca]);

  const buscarTMDB = async () => {
    setIsBuscando(true);
    const query = encodeURIComponent(tituloBusca);
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&language=pt-BR`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setResultadosBusca(data.results || []);
    } catch (err) {
      console.error("Erro ao buscar na TMDB:", err);
    } finally {
      setIsBuscando(false);
    }
  };

  const selecionarFilme = async (item: any) => {
    const id = item.id;
    const tipo = item.media_type;

    setMediaType(tipo === "tv" ? "Série" : "Filme");

    const detalhesUrl = tipo === "movie"
      ? `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`
      : `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=pt-BR`;

    const creditosUrl = tipo === "movie"
      ? `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=pt-BR`
      : `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=pt-BR`;

    const classificacaoUrl = tipo === "movie"
      ? `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`
      : `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${apiKey}`;

    const [resDetalhes, resCreditos, resClassificacao] = await Promise.all([
      fetch(detalhesUrl),
      fetch(creditosUrl),
      fetch(classificacaoUrl)
    ]);

    const dataDetalhes = await resDetalhes.json();
    const dataCreditos = await resCreditos.json();
    const dataClassificacao = await resClassificacao.json();

    const diretores = dataCreditos.crew
      ?.filter((m: any) => m.job === "Director" || m.job === "Director of Photography")
      .map((m: any) => m.name)
      .join(", ") || "";

    const artistas = dataCreditos.cast
      ?.slice(0, 5)
      .map((a: any) => a.name)
      .join(", ") || "";

    let classificacao = "";
    if (tipo === "movie") {
      const br = dataClassificacao.results?.find((r: any) => r.iso_3166_1 === "BR");
      classificacao = br?.release_dates?.[0]?.certification || "";
    } else {
      const br = dataClassificacao.results?.find((r: any) => r.iso_3166_1 === "BR");
      classificacao = br?.rating || "";
    }

  setDadosSelecionados({
    titulo_original: item.original_title || item.original_name || "",
    titulo_alternativo: item.title || item.name || "",
    ano_lancamento:
      item.release_date?.split("-")[0] ||
      item.first_air_date?.split("-")[0] ||
      "",
    formato_video: "HD",
    estudio: dataDetalhes.production_companies?.[0]?.name || "",
    edicao: "",
    classificacao_etaria: classificacao,
    observações: "",
    capa_url: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "",
    sinopse: item.overview || "",
    generos: item.genre_ids
      ?.map((id: number) => mapaGeneros[id])
      .filter(Boolean)
      .join(", ") || "",
    duracao:
      dataDetalhes.runtime ||
      (dataDetalhes.episode_run_time?.[0] || "") ||
      "",
    linguagem: item.original_language || "",
    nota_media: item.vote_average || "",
    artistas,
    diretores,
    formatoMidia: tipo === "tv" ? "Série" : "Filme" // <-- AQUI
  });

    setResultadosBusca([]);
    setTituloBusca("");
  };

  const handleSalvarMidia = async () => {
    try {
      // Busca o tipo selecionado para obter o ID correspondente
      const tiposResponse = await api.get("/api/midia-tipos/ativos");
      const tipoSelecionadoObj = tiposResponse.data.find(
        (tipo: any) => tipo.nome === tipoSelecionado
      );

      if (!tipoSelecionadoObj) {
        alert("Tipo de mídia inválido ou não encontrado.");
        return;
      }

  const payload = {
    tituloOriginal: dadosSelecionados.titulo_original,
    tituloAlternativo: dadosSelecionados.titulo_alternativo,
    edicao: dadosSelecionados.edicao,
    colecao: "", // pode abrir input depois
    numeroSerie: "",
    faixas: "",
    classificacaoEtaria: dadosSelecionados.classificacao_etaria,
    artistas: dadosSelecionados.artistas,
    diretores: dadosSelecionados.diretores,
    estudio: dadosSelecionados.estudio,
    formatoAudio: "",
    formatoVideo: dadosSelecionados.formato_video,
    observacoes: dadosSelecionados.observações,
    quantidadeItens: 1,
    anoLancamento: dadosSelecionados.ano_lancamento,
    capaUrl: dadosSelecionados.capa_url,
    sinopse: dadosSelecionados.sinopse,
    generos: dadosSelecionados.generos,
    duracao: dadosSelecionados.duracao,
    linguagem: dadosSelecionados.linguagem,
    notaMedia: dadosSelecionados.nota_media,
    formatoMidia: dadosSelecionados.formatoMidia,
    temporada: temporada,
    midiaTipoId: tipoSelecionadoObj.id,   // ✅ id do tipo
    midiaTipoNome: tipoSelecionado        // ✅ nome vindo do select
  };

      await api.post("/api/midias", payload);

      setMostrarModalSucesso(true);
      setDadosSelecionados(null); // limpa o formulário
      setTemporada("");
    } catch (error: any) {
      console.error("Erro ao salvar a mídia:", error);
      setMensagemErro("Erro ao salvar a mídia. Tente novamente.");
      setMostrarModalErro(true);
    }
  };



  return (
    <div className="space-y-6 text-black">
      {/* Linha tipo + busca */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
              <label className="text-white font-semibold mb-4">Buscar tipo de Mídia</label>
              <div className="p-4">
              <h2 className="text-2xl font-bold text-white mb-4">➕ Cadastrar Mídia</h2>
              </div>

              <select
                className="w-full border px-3 py-2 rounded bg-white text-black"
                value={tipoSelecionado}
                onChange={(e) => setTipoSelecionado(e.target.value)}
              >
                <option value="">Selecione um tipo...</option>
                {tiposMidia.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Só mostra o input de busca TMDB se NÃO for Jogos Games */}
              {tipoSelecionado === "Jogos Games" ? (
                <MidiaFormJG
                  pesquisa={tituloBusca}
                  onPesquisaChange={setTituloBusca}
                />
              ) : tiposApiTMDB.includes(tipoSelecionado) ? (
              <div className="flex-1">
                <label className="block mb-1 font-medium text-gray-200">Buscar título</label>
                <input
                  type="text"
                  value={tituloBusca}
                  onChange={(e) => setTituloBusca(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Digite para buscar na TMDB..."
                />
              </div>
            ) : null}
          
      </div>


      {/* Resultados da busca */}
      {isBuscando && (
        <p className="text-sm text-gray-500 italic">Buscando...</p>
      )}
      {resultadosBusca.length > 0 && (
        <div className="border rounded p-2 bg-gray-100 max-h-60 overflow-auto">
          <ul>
            {resultadosBusca.map((item) => (
              <li
                key={item.id}
                className="p-2 hover:bg-blue-100 cursor-pointer rounded"
                onClick={() => selecionarFilme(item)}
              >
                {item.title || item.name} (
                {item.release_date?.split("-")[0] ||
                  item.first_air_date?.split("-")[0] ||
                  "?"}
                )
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Campos preenchidos e capa lado a lado */}
      {dadosSelecionados && (
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Imagem da capa */}
          {dadosSelecionados.capa_url && (
            <div className="w-48 flex-shrink-0">
              <img
                src={dadosSelecionados.capa_url}
                alt="Capa da mídia"
                className="rounded shadow"
              />
            </div>
          )}

          {/* Campos preenchidos */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo observações */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">
                Observações
              </label>
              <input
                type="text"
                value={dadosSelecionados.observações || ""}
                onChange={(e) =>
                  setDadosSelecionados({
                    ...dadosSelecionados,
                    observações: e.target.value
                  })
                }
                className="w-full border px-3 py-2 rounded bg-white"
              />
            </div>

            {/* Campo condicional: Temporada (apenas para série) */}
            {mediaType === "Série" && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-200">
                  Temporada da Série
                </label>
                <input
                  type="text"
                  value={temporada}
                  onChange={(e) => setTemporada(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Ex: 1ª Temporada"
                />
              </div>
            )}

            {/* Campo adicional: Tipo detectado */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">
                Tipo detectado
              </label>
              <input
                type="text"
                value={mediaType}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-300 cursor-not-allowed"
              />
            </div>

            {/* Demais campos vindos da TMDB */}
            {camposTMDB
              .filter((campo) => campo !== "observações") // já exibido acima
              .map((campo) => (
                <div key={campo}>
                  <label className="block text-sm font-medium capitalize mb-1 text-gray-200">
                    {campo.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    name={campo}
                    className={`w-full border px-3 py-2 rounded ${
                      campo !== "observações" ? "bg-gray-300 cursor-not-allowed" : "bg-white"
                    }`}
                    value={dadosSelecionados[campo] || ""}
                    readOnly={campo !== "observações"}
                    onChange={(e) =>
                      setDadosSelecionados({
                        ...dadosSelecionados,
                        [campo]: e.target.value
                      })
                    }
                  />
                </div>
            ))}
          </div>
        </div>
      )}

      {dadosSelecionados && (
        <div className="mt-4">
          <button
            onClick={handleSalvarMidia}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Salvar Mídia
          </button>
        </div>
      )}
      <SuccessModal
        show={mostrarModalSucesso}
        message="Mídia salva com sucesso!"
        onClose={() => setMostrarModalSucesso(false)}
      />
      <ErrorModal
        show={mostrarModalErro}
        message={mensagemErro}
        onClose={() => setMostrarModalErro(false)}
      />
    </div>
  );
}
