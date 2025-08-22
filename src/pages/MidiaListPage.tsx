import React, { useEffect, useState, useMemo } from "react";
import {
  buscarMidiasDoUsuario,      // Usado para buscar todas sem paginação
  buscarMidiasPaginadas,
  MidiaResponse,
  PaginaMidias,
} from "../services/midiaService";

const REGISTROS_POR_PAGINA = 25;

const MidiaListPage: React.FC = () => {
  const [midias, setMidias] = useState<MidiaResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modoVisualizacao, setModoVisualizacao] =
    useState<"tabela" | "capa">("tabela");
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("Todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // NOVO: Estado para armazenar TODAS as mídias para imprimir
  const [midiasParaImprimir, setMidiasParaImprimir] = useState<MidiaResponse[] | null>(null);

  useEffect(() => {
    const fetchMidias = async () => {
      setCarregando(true);
      try {
        const data = await buscarMidiasPaginadas(paginaAtual - 1, REGISTROS_POR_PAGINA);
        setMidias(data.content);
        setTotalPaginas(data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchMidias();
  }, [paginaAtual]);

  const tiposMidiaDoUsuario = useMemo(() => {
    const tiposUnicos = new Set<string>();
    midias.forEach((midia) => {
      if (midia.tipoMidia) {
        tiposUnicos.add(midia.tipoMidia);
      }
    });
    return Array.from(tiposUnicos).sort();
  }, [midias]);

  const midiasFiltradas =
    tipoSelecionado === "Todos"
      ? midias
      : midias.filter((midia) => midia.tipoMidia === tipoSelecionado);

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  // NOVO: Função para buscar todas as mídias e imprimir
  const handlePrintAll = async () => {
    try {
      setCarregando(true);
      const todasMidias = await buscarMidiasDoUsuario(); // Busca todas sem paginação
      setMidiasParaImprimir(todasMidias);

      // Pequeno delay para renderizar antes do print
      setTimeout(() => {
        window.print();
        setMidiasParaImprimir(null); // Limpa após impressão
        setCarregando(false);
      }, 600);
    } catch (error) {
      console.error("Erro ao carregar mídias para imprimir:", error);
      setCarregando(false);
    }
  };

  if (carregando)
    return <p className="p-6 text-white">🔄 Carregando mídias...</p>;

  return (
    <div id="print-area" className="p-4">
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
          {tiposMidiaDoUsuario.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        {/* ALTERADO: Botão para imprimir TODAS as mídias */}
        <button
          onClick={handlePrintAll}
          className="px-3 py-1 rounded text-sm bg-yellow-600 text-white hover:bg-yellow-700 transition"
        >
          🖨️ Imprimir Todas as Mídias
        </button>
      </div>

      {midias.length === 0 ? (
        <p className="text-white">Nenhuma mídia cadastrada ainda.</p>
      ) : modoVisualizacao === "tabela" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">
                  Título
                </th>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">
                  Gênero
                </th>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">
                  Tipo
                </th>
              </tr>
            </thead>
            <tbody>
              {midiasFiltradas.map((midia, index) => (
                <tr
                  key={midia.id}
                  className={`cursor-pointer transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-200"
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-2 border-b text-[#4B3621]">
                    {midia.tituloAlternativo || (
                      <span className="italic text-gray-400">Sem título</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-[#4B3621]">
                    {midia.generos || (
                      <span className="italic text-gray-400">Sem gênero</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-[#4B3621]">
                    {midia.midiaTipoNome || "-"}
                  </td>
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

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            ◀️ Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
            <button
              key={pagina}
              onClick={() => mudarPagina(pagina)}
              className={`px-3 py-1 rounded ${
                pagina === paginaAtual
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {pagina}
            </button>
          ))}

          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Próxima ▶️
          </button>
        </div>
      )}

      {/* NOVO: Área oculta para imprimir todas as mídias */}
      {midiasParaImprimir && (
        <div className="print-area">
          {midiasParaImprimir.map((midia) => (
            <div key={midia.id} style={{ marginBottom: 20 }}>
              <h2>{midia.tituloOriginal}</h2>
              <p><strong>Sinopse:</strong> {midia.sinopse}</p>
              <p><strong>Gêneros:</strong> {midia.generos}</p>
              <p><strong>Duração:</strong> {midia.duracao} minutos</p>
              <p><strong>Linguagem:</strong> {midia.linguagem}</p>
              <p><strong>Nota Média:</strong> {midia.notaMedia}</p>
            </div>
          ))}
        </div>
      )}


      {/* CSS para impressão: só mostra print-area no print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MidiaListPage;
