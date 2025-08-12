import React, { useEffect, useMemo, useState } from "react";

export function MidiaFormFilmeSerie({
  dados,
  onNovaBusca
}: {
  dados: any;
  onNovaBusca?: () => void;
}) {
  // Normaliza o campo de capa (aceita capa_url, capaUrl ou poster_path)
  const initial = useMemo(() => {
    const coverFromTMDB = dados?.poster_path
      ? `https://image.tmdb.org/t/p/w500${dados.poster_path}`
      : undefined;

    return {
      ...dados,
      capa_url: dados?.capa_url || dados?.capaUrl || coverFromTMDB || ""
    };
  }, [dados]);

  const [dadosMidia, setDadosMidia] = useState<any>(initial);
  const [temporada, setTemporada] = useState(dados?.temporada || "");
  const [modoEdicao, setModoEdicao] = useState(true);

  useEffect(() => {
    // atualiza quando a prop dados mudar
    setDadosMidia(initial);
  }, [initial]);

  const camposTMDB = [
    "observações",
    "tipoMidia",
    "tituloAlternativo",
    "tituloOriginal",
    "temporada",
    "anoLancamento",
    "formatoVideo",
    "estudio",
    "classificacaoEtaria",
    "capaUrl",
    "sinopse",
    "generos",
    "duracao",
    "linguagem",
    "notaMedia",
    "artistas",
    "diretores"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modoEdicao) {
      // Salvar alterações
      console.log("🔹 Salvando alterações:", dadosMidia);
      setModoEdicao(false);
    } else {
      // Nova busca (limpa os campos)
      setDadosMidia({});
      setTemporada("");
      setModoEdicao(true);
      if (onNovaBusca) onNovaBusca();
    }
  };

  return (
    <form className="space-y-4 text-black" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Imagem da capa — usa o campo normalizado capa_url */}
        {dadosMidia?.capa_url ? (
          <div className="w-48 flex-shrink-0">
            <img
              src={dadosMidia.capa_url}
              alt="Capa da mídia"
              className="rounded shadow object-cover w-full h-auto"
            />
          </div>
        ) : (
          <div className="w-48 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded p-2 text-sm text-gray-500">
            Sem capa
          </div>
        )}

        {/* Campos lado a lado */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Temporada (só série) */}
          {dadosMidia.mediaType === "Série" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
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

          {/* Campos vindos da TMDB */}
          {camposTMDB.map((campo) => (
            <div key={campo}>
              <label className="block text-sm font-medium capitalize mb-1 text-white">
                {campo.replace(/_/g, " ")}
              </label>
              <input
                type="text"
                name={campo}
                className={`w-full border px-3 py-2 rounded ${
                  campo !== "observações"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-white"
                }`}
                value={dadosMidia[campo] || ""}
                readOnly={campo !== "observações"}
                onChange={(e) =>
                  setDadosMidia({
                    ...dadosMidia,
                    [campo]: e.target.value
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button" // evita submit
        className={`px-4 py-2 rounded transition text-white ${
          modoEdicao
            ? "bg-blue-800 hover:bg-blue-900"
            : "bg-yellow-600 hover:bg-yellow-700"
        }`}
        disabled={true} // opcional: deixa visualmente desabilitado
      >
        {modoEdicao ? "Salvar Alterações" : "Nova Busca"}
      </button>
    </form>
  );
}
