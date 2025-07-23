import React, { useState } from "react";

const tiposApiTMDB = ["Blu-ray", "DVD", "VHS"];

export function MidiaForm() {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [tituloBusca, setTituloBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [dadosSelecionados, setDadosSelecionados] = useState<any>(null);

  const camposTMDB = [
    "nome",
    "titulo_original",
    "titulo_alternativo",
    "nome_serie",
    "ano_lancamento",
    "formato_video",
    "artista_diretor",
    "estudio",
    "regiao",
    "edicao",
    "classificacao_etaria",
    "estado_conservacao",
    "observações",
    "valor_pago",
    "adquirido_em",
    "capa_url"
  ];

  const buscarTMDB = async () => {
    if (!tituloBusca) return;

    const apiKey = "SUA_API_KEY_TMDB"; // Substitua pela sua chave da TMDB
    const query = encodeURIComponent(tituloBusca);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=pt-BR`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setResultadosBusca(data.results || []);
    } catch (err) {
      console.error("Erro ao buscar na TMDB:", err);
    }
  };

  const selecionarFilme = (filme: any) => {
    setDadosSelecionados({
      nome: filme.title,
      titulo_original: filme.original_title,
      titulo_alternativo: "",
      nome_serie: "",
      ano_lancamento: filme.release_date?.split("-")[0] || "",
      formato_video: "HD",
      artista_diretor: "", // Pode ser buscado com outra chamada
      estudio: "",
      regiao: "1",
      edicao: "",
      classificacao_etaria: "",
      estado_conservacao: "",
      observações: "",
      valor_pago: "",
      adquirido_em: "",
      capa_url: filme.poster_path
        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
        : ""
    });
    setResultadosBusca([]);
  };

  return (
    <div className="space-y-6 text-black">
      {/* Select + Busca lado a lado */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        {/* Select de tipo de mídia */}
        <div className="flex-1">
          <label className="block mb-1 font-medium">Tipo de Mídia</label>
          <select
            className="w-full border px-3 py-2 rounded bg-white text-black"
            value={tipoSelecionado}
            onChange={(e) => setTipoSelecionado(e.target.value)}
          >
            <option value="">Selecione um tipo...</option>
            {tiposApiTMDB.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Busca só aparece se tipo for suportado */}
        {tiposApiTMDB.includes(tipoSelecionado) && (
          <div className="flex-1">
            <label className="block mb-1 font-medium">Buscar título</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tituloBusca}
                onChange={(e) => setTituloBusca(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Buscar título na TMDB..."
              />
              <button
                onClick={buscarTMDB}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Buscar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resultados da busca */}
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

      {/* Campos preenchidos automaticamente */}
      {dadosSelecionados && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      )}
    </div>
  );
}
