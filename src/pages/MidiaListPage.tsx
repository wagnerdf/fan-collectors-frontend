import React, { useEffect, useState } from "react";
import { buscarMidiasDoUsuario, MidiaResponse } from "../services/midiaService";
import api from "../services/api";

const MidiaListPage: React.FC = () => {
  const [midias, setMidias] = useState<MidiaResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modoVisualizacao, setModoVisualizacao] = useState<"tabela" | "capa">("tabela");
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("Todos");
  const [tiposMidia, setTiposMidia] = useState<string[]>([]);

  useEffect(() => {
    const buscarTipos = async () => {
      try {
        const res = await api.get("/api/midia-tipos/ativos");
        const data = res.data;
        setTiposMidia(data.map((item: any) => item.nome));
      } catch (error) {
        console.error("Erro ao carregar tipos de mídia:", error);
      }
    };

    buscarTipos();
  }, []);

  useEffect(() => {
    const fetchMidias = async () => {
      try {
        const data = await buscarMidiasDoUsuario();
        setMidias(data);
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchMidias();
  }, []);

  const midiasFiltradas = tipoSelecionado === "Todos"
    ? midias
    : midias.filter((midia) => midia.tipoMidia === tipoSelecionado);

  if (carregando) return <p className="p-6 text-white">🔄 Carregando mídias...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">🎞️ Minhas Mídias</h2>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <button
          onClick={() => setModoVisualizacao("tabela")}
          className={`px-3 py-1 rounded text-sm ${
            modoVisualizacao === "tabela"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📝 Ver como lista
        </button>

        <button
          onClick={() => setModoVisualizacao("capa")}
          className={`px-3 py-1 rounded text-sm ${
            modoVisualizacao === "capa"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🖼️ Ver como capas
        </button>

        <select
          className="px-3 py-1 rounded border text-sm bg-white text-black"
          value={tipoSelecionado}
          onChange={(e) => setTipoSelecionado(e.target.value)}
        >
          <option value="Todos">🎯 Todos</option>
          {tiposMidia.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
      {midias.length === 0 ? (
        <p className="text-white">Nenhuma mídia cadastrada ainda.</p>
      ) : modoVisualizacao === "tabela" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Título</th>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Gênero</th>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {midiasFiltradas.map((midia) => (
                <tr
                  key={midia.id}
                  className="hover:bg-gray-100 cursor-pointer transition"
                >
                  <td className="px-4 py-2 border-b text-[#4B3621]">
                    {midia.tituloAlternativo || <span className="italic text-gray-400">Sem título</span>}
                  </td>
                  <td className="px-4 py-2 border-b text-[#4B3621]">
                    {midia.generos || <span className="italic text-gray-400">Sem gênero</span>}
                  </td>
                  <td className="px-4 py-2 border-b text-[#4B3621]">{midia.tipoMidia || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
            className="flex flex-wrap justify-start gap-4"
            style={{ rowGap: "1rem", columnGap: "1rem" }}
            >
            {midiasFiltradas.map((midia) => (
                <div
                key={midia.id}
                className="bg-white shadow rounded p-2 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
                style={{ flex: "0 0 auto", width: "250px" }}
                >
                <div className="w-full h-[350px] overflow-hidden rounded bg-gray-200 flex justify-center items-center mb-2">
                    <img
                    src={
                        midia.capaUrl?.startsWith("http")
                        ? midia.capaUrl
                        : `https://${midia.capaUrl}`
                    }
                    alt={midia.tituloAlternativo || "Sem título"}
                    className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="text-md font-semibold text-center text-[#4B3621] max-w-full truncate">
                    {midia.tituloAlternativo || "Sem título"}
                </h3>
                </div>
            ))}
        </div>

      )}
    </div>
  );
};

export default MidiaListPage;
