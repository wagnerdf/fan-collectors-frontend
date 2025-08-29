import React, { useEffect, useState } from "react";
import Select, { components, MultiValue } from "react-select";
import {
  buscarMidiasDoUsuario,
  buscarMidiasPaginadas,
  buscarMidiasPorTipos,
  MidiaResponse,
  buscarMidiaPorId,
  buscarTodasMidiasPorTipos,
  MidiaListagemDto,
} from "../services/midiaService";

const REGISTROS_POR_PAGINA = 25;

type TipoMidiaOption = {
  label: string;
  value: string;
};

const OptionCheckbox = (props: any) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      readOnly
      style={{ marginRight: 8 }}
    />
    <label style={{ color: "#000" }}>{props.label}</label>
  </components.Option>
);

const MidiaListPage: React.FC = () => {
  const [midias, setMidias] = useState<MidiaResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modoVisualizacao, setModoVisualizacao] = useState<"tabela" | "capa">("tabela");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [tiposMidiaFixos, setTiposMidiaFixos] = useState<TipoMidiaOption[]>([]);
  const [tiposMidiaOptions, setTiposMidiaOptions] = useState<TipoMidiaOption[]>([]);
  const [selectedTipos, setSelectedTipos] = useState<MultiValue<TipoMidiaOption>>([]);
  const fecharModal = () => setMidiaSelecionada(null);
  const [midiaSelecionada, setMidiaSelecionada] = useState<MidiaResponse | null>(null);
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);
  const [midiasParaImprimir, setMidiasParaImprimir] = useState<MidiaListagemDto[]>([]);



  // Buscar todas mídias paginadas
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

  useEffect(() => {
    fetchMidias();
  }, [paginaAtual]);

  // Fixar tipos na primeira vez que midias forem carregadas
  useEffect(() => {
    if (midias.length > 0 && tiposMidiaFixos.length === 0) {
      const tiposUnicos = Array.from(new Set(midias.map((m) => m.midiaTipoNome)))
        .filter((tipo): tipo is string => !!tipo)
        .map((tipo) => ({ label: tipo, value: tipo.toLowerCase() }));

      setTiposMidiaFixos(tiposUnicos);
      setTiposMidiaOptions(tiposUnicos);
    }
  }, [midias, tiposMidiaFixos.length]);

  // Atualizar midias quando checkbox mudar
  useEffect(() => {
    const fetchMidiasFiltradas = async () => {
      setCarregando(true);
      try {
        if (selectedTipos.length > 0) {
          const tiposSelecionadosStr = selectedTipos.map(t => t.label).join(",");
          const data = await buscarMidiasPorTipos(
            tiposSelecionadosStr,
            paginaAtual - 1,
            REGISTROS_POR_PAGINA
          );
          setMidias(data.content);
          setTotalPaginas(data.totalPages);
        } else {
          const data = await buscarMidiasPaginadas(paginaAtual - 1, REGISTROS_POR_PAGINA);
          setMidias(data.content);
          setTotalPaginas(data.totalPages);
        }
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchMidiasFiltradas();
  }, [selectedTipos, paginaAtual]);

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) setPaginaAtual(novaPagina);
  };

  if (carregando) return <p className="p-6 text-white">🔄 Carregando mídias...</p>;

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
      color: "#000000",
      minHeight: "30px",
      height: "30px",
      fontSize: "14px",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 6px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#000000",
      fontSize: "14px",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
      zIndex: 9999, // garante que o dropdown fica por cima das capas
      position: "absolute" as const, // evita conflito de layout
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#d1d5db" : "#e5e7eb",
      color: "#000000",
      padding: "4px 8px",
      fontSize: "14px",
      lineHeight: "18px",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "30px",
    }),
  };

  const CustomControl = (props: any) => (
    <components.Control {...props}>
      <span style={{ marginLeft: "8px", color: "#444", fontWeight: "bold", }}>
        Selecionar tipo
      </span>
      {props.children}
    </components.Control>
  );

    const handleMidiaClick = async (id: number) => {
    try {
      const data = await buscarMidiaPorId(id);
      setMidiaSelecionada(data);
    } catch (error) {
      console.error("Erro ao buscar mídia por id:", error);
    }
  };

  const handlePrint = async () => {
      try {
        const tipos = tiposSelecionados.join(",");
        const todasMidias = await buscarTodasMidiasPorTipos(tipos);
        setMidiasParaImprimir(todasMidias);

        setTimeout(() => {
          window.print();
        }, 100);
      } catch (err) {
        console.error("Erro ao buscar mídias para impressão:", err);
      }
    };

  return (
    <div id="print-area" className="p-4 bg-gray-900 rounded-2xl shadow-md h-full" >
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

        <div style={{ minWidth: 200 }}>
          <Select<TipoMidiaOption, true>
            options={tiposMidiaOptions}
            value={selectedTipos}
            onChange={(val: MultiValue<TipoMidiaOption>) => {
              setSelectedTipos(val);  // atualiza SelectBox visualmente
              setTiposSelecionados(val.map(v => v.label)); // envia apenas os nomes para backend
              setPaginaAtual(1); // reset da paginação
            }}
            isMulti
            closeMenuOnSelect={false}
            components={{
              Option: OptionCheckbox,
              MultiValue: () => null,
              Control: CustomControl
            }}
            hideSelectedOptions={false}
            styles={customStyles}
          />
        </div>

        <button
          onClick={handlePrint}
          className="px-3 py-1 rounded text-sm bg-yellow-600 text-white hover:bg-yellow-700 transition"
        >
          🖨️ Imprimir Todas as Mídias 
        </button>
      </div>

      {midias.length === 0 ? (
        <p className="text-white">Nenhuma mídia cadastrada ainda.</p>
      ) : modoVisualizacao === "tabela" ? (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="min-w-full bg-white shadow ">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Título</th>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Gênero</th>
                <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {midias.map((midia, index) => (
                <tr
                  key={midia.id}
                  className={`cursor-pointer transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-200"
                  } hover:bg-blue-50`}
                  onClick={() => handleMidiaClick(midia.id)} // 🔹 Clique abre modal
                >
                  <td className="px-4 py-2 border-b text-[#4B3621]">
                    {midia.tituloAlternativo ? (
                      midia.tituloAlternativo
                    ) : (
                      <span className="italic text-gray-400">Sem título</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-[#4B3621]">
                    {midia.generos ? (
                      midia.generos
                    ) : (
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
          {midias.map((midia) => (
            <div
              key={midia.id}
              className="bg-white shadow rounded p-1 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
              style={{ flex: "0 0 auto", width: "200px" }}
               onClick={() => handleMidiaClick(midia.id)} // 🔹 chama a API para mídia completa
            >
              <div className="w-full h-[280px] rounded bg-gray-200 flex justify-center items-center mb-1 relative">
                <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
                  {midia.midiaTipoNome}
                </span>
                <img
                  src={midia.capaUrl?.startsWith("http") ? midia.capaUrl : `https://${midia.capaUrl}`}
                  alt={midia.tituloAlternativo || "Sem título"}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-sm font-semibold text-center text-[#4B3621] max-w-full line-clamp-2 break-words">
                {midia.tituloAlternativo || "Sem título"}
              </h3>
            </div>
          ))}

        </div>
      )}

      {/* MODAL: abre quando midiaSelecionada tiver valor */}
      {midiaSelecionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          onClick={fecharModal} // clicar no fundo fecha
        >
          <div
            className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto relative p-6"
            onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
          >
            {/* Botão fechar */}
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-2xl font-bold"
              onClick={fecharModal} // X fecha
            >
              &times;
            </button>

            {/* Conteúdo do modal */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Imagem */}
              <div className="flex-shrink-0 w-full md:w-48">
                <img
                  src={midiaSelecionada.capaUrl?.startsWith("http") ? midiaSelecionada.capaUrl : `https://${midiaSelecionada.capaUrl}`}
                  alt={midiaSelecionada.tituloAlternativo || midiaSelecionada.tituloOriginal}
                  className="w-48 h-50 object-contain rounded mb-4 border-2 border-gray-500"
                />
              </div>

              {/* Dados */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-center bg-clip-text text-transparent 
                              bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                  {midiaSelecionada.tituloAlternativo || midiaSelecionada.tituloOriginal}
                </h2>

                <div className="text-sm w-full space-y-4">
                  {/* 🎯 Informações Gerais */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">Informações Gerais</h3>
                    <div className="text-sm space-y-1 w-full mb-4">
                      <p><strong className="text-yellow-400">Gênero:</strong> {midiaSelecionada.generos || "—"}</p>
                      <p><strong className="text-yellow-400">Tipo:</strong> {midiaSelecionada.midiaTipoNome || "—"}</p>
                      <p><strong className="text-yellow-400">Formato:</strong> {midiaSelecionada.formatoMidia || "—"}</p>
                      <p><strong className="text-yellow-400">Duração:</strong> {midiaSelecionada.duracao || "—"} minutos</p>
                      <p><strong className="text-yellow-400">Linguagem:</strong> {midiaSelecionada.linguagem || "—"}</p>
                    </div>
                  </div>

                  {/* ⚙️ Detalhes Técnicos */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">Detalhes Técnicos</h3>
                    <div className="text-sm space-y-1 w-full mb-4">
                      <p><strong className="text-yellow-400">Observações:</strong> {midiaSelecionada.observacoes || "—"}</p>
                      <p><strong className="text-yellow-400">Nota Média:</strong> {midiaSelecionada.notaMedia || "—"}</p>
                    </div>
                  </div>

                  {/* 🎬 Créditos */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">Créditos</h3>
                      <div className="text-sm space-y-1 w-full">
                        <p><strong className="text-yellow-400">Artistas:</strong> {midiaSelecionada.artistas || "—"}</p>
                        <p><strong className="text-yellow-400">Diretores:</strong> {midiaSelecionada.diretores || "—"}</p>
                        <p><strong className="text-yellow-400">Estúdio:</strong> {midiaSelecionada.estudio || "—"}</p>
                      </div>
                  </div>

                  {/* 📖 Sinopse */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">Sinopse</h3>
                      <div className="text-sm space-y-1 w-full mb-4">
                        <p>{midiaSelecionada.sinopse || "—"}</p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-400 disabled:opacity-50"
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
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {pagina}
            </button>
          ))}

          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-400 disabled:opacity-50"
          >
            Próxima ▶️
          </button>
        </div>
      )}

    {midiasParaImprimir && midiasParaImprimir.length > 0 && (
      <div className="print-area">
        <h1 className="text-2xl font-bold mb-2">Relatório de Mídias</h1>
        <p className="mb-1">
          <strong>Data:</strong> {new Date().toLocaleDateString()}
        </p>
        <p className="mb-4">
          <strong>Total de Registros:</strong> {midiasParaImprimir.length}
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-300">
              <th className="border px-4 py-2 text-left w-12">#</th>
              <th className="border px-4 py-2 text-left">Título</th>
              <th className="border px-4 py-2 text-left">Gêneros</th>
              <th className="border px-4 py-2 text-left">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {midiasParaImprimir.map((midia, index) => (
              <tr
                key={midia.id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
              >
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2">{midia.tituloAlternativo}</td>
                <td className="border px-4 py-2">{midia.generos}</td>
                <td className="border px-4 py-2">{midia.midiaTipoNome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    <style>{`
      @media print {
        body * {
          visibility: hidden !important;
        }
        .print-area, .print-area * {
          visibility: visible !important;
        }
        .print-area {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          background: #fff;
          font-size: 8pt;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #000;
        }
        thead {
          background: #ddd !important;
        }
        tbody tr:nth-child(even) {
          background: #f9f9f9 !important;
        }
        tbody tr:nth-child(odd) {
          background: #ffffff !important;
        }
      }
    `}</style>
    
    </div>
  );
};

export default MidiaListPage;
