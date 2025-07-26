import React, { useState, useEffect } from "react";
import api from "../services/api";

const tiposApiTMDB = ["Blu-ray", "DVD", "VHS"];

export function MidiaForm() {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [tituloBusca, setTituloBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [dadosSelecionados, setDadosSelecionados] = useState<any>(null);
  const [isBuscando, setIsBuscando] = useState(false);
  const [tiposMidia, setTiposMidia] = useState<string[]>([]);

  const camposTMDB = [
    "titulo_original",
    "titulo_alternativo",
    "nome_serie",
    "ano_lancamento",
    "formato_video",
    "estudio",
    "regiao",
    "edicao",
    "classificacao_etaria",
    "estado_conservacao",
    "observações",
    "valor_pago",
    "adquirido_em",
    "capa_url",
    "sinopse",
    "generos",
    "duracao",
    "linguagem",
    "nota_media",
    "artistas",
    "diretores"
  ];

  const apiKey = "22316a026b9ee70cf67365ca2c63992a";

  // Carrega tipos de mídia apenas uma vez
  useEffect(() => {
    api
      .get("/api/midia-tipos/ativos")
      .then((res) => {
        console.log("Dados recebidos:", res.data);
        const tipos = res.data.map((item: any) => item.nome);
        setTiposMidia(tipos);
      })
      .catch((err) => console.error("Erro ao carregar tipos de mídia:", err));
  }, []);

  // Buscar automaticamente com debounce
  useEffect(() => {
    if (!tituloBusca || !tiposApiTMDB.includes(tipoSelecionado)) {
      setResultadosBusca([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      buscarTMDB();
    }, 500); // aguarda 500ms

    return () => clearTimeout(delayDebounce); // limpa o timeout anterior
  }, [tituloBusca]);

  const buscarTMDB = async () => {
    setIsBuscando(true);
    const query = encodeURIComponent(tituloBusca);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=pt-BR`;

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

  const selecionarFilme = async (filme: any) => {
    const id = filme.id;

    // Buscar créditos (diretores e artistas)
    const urlCreditos = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=pt-BR`;

    const resCreditos = await fetch(urlCreditos);
    const dataCreditos = await resCreditos.json();

    const diretores = dataCreditos.crew
      .filter((m: any) => m.job === "Director")
      .map((m: any) => m.name)
      .join(", ");

    const artistas = dataCreditos.cast
      .slice(0, 5)
      .map((a: any) => a.name)
      .join(", ");

    setDadosSelecionados({
      titulo_original: filme.original_title || "",
      titulo_alternativo: filme.title || "",
      nome_serie: "",
      ano_lancamento: filme.release_date?.split("-")[0] || "",
      formato_video: "HD",
      estudio: "", // pode vir de outro endpoint
      regiao: "1",
      edicao: "",
      classificacao_etaria: "",
      estado_conservacao: "",
      observações: "",
      valor_pago: "",
      adquirido_em: "",
      capa_url: filme.poster_path
        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
        : "",
      sinopse: filme.overview || "",
      generos: filme.genre_ids?.join(", ") || "", // podemos mapear IDs para nomes se quiser
      duracao: filme.runtime || "",
      linguagem: filme.original_language || "",
      nota_media: filme.vote_average || "",
      artistas,
      diretores
    });

    setResultadosBusca([]);
    setTituloBusca("");
  };


  return (
    <div className="space-y-6 text-black">
      {/* Linha tipo + busca */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Tipo de Mídia</label>
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

        {tiposApiTMDB.includes(tipoSelecionado) && (
          <div className="flex-1">
            <label className="block mb-1 font-medium">Buscar título</label>
            <input
              type="text"
              value={tituloBusca}
              onChange={(e) => setTituloBusca(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Digite para buscar na TMDB..."
            />
          </div>
        )}
      </div>

      {/* Resultados da busca */}
      {isBuscando && (
        <p className="text-sm text-gray-500 italic">Buscando...</p>
      )}
      {resultadosBusca.length > 0 && (
        <div className="border rounded p-2 bg-gray-100 max-h-60 overflow-auto">
          <ul>
            {resultadosBusca.map((filme) => (
              <li
                key={filme.id}
                className="p-2 hover:bg-blue-100 cursor-pointer rounded"
                onClick={() => selecionarFilme(filme)}
              >
                {filme.title} ({filme.release_date?.split("-")[0] || "?"})
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
            {camposTMDB.map((campo) => (
              <div key={campo}>
                <label className="block text-sm font-medium capitalize mb-1">
                  {campo.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  name={campo}
                  className="w-full border px-3 py-2 rounded"
                  value={dadosSelecionados[campo] || ""}
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
    </div>
  );
}
