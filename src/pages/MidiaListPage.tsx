import React, { useEffect, useState } from "react";
import Select, { components, MultiValue } from "react-select";
import {
  buscarMidiasDoUsuario,
  buscarMidiasPaginadas,
  buscarMidiasPorTipos,
  MidiaResponse,
  PaginaMidias
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
  const [midiasParaImprimir, setMidiasParaImprimir] = useState<MidiaResponse[] | null>(null);

  const [tiposMidiaFixos, setTiposMidiaFixos] = useState<TipoMidiaOption[]>([]);
  const [tiposMidiaOptions, setTiposMidiaOptions] = useState<TipoMidiaOption[]>([]);
  const [selectedTipos, setSelectedTipos] = useState<MultiValue<TipoMidiaOption>>([]);

  const ValueContainer = ({ children, ...props }: any) => {
    return (
      <components.ValueContainer {...props}>
        <span style={{ marginRight: "8px", color: "#666", fontWeight: "bold" }}>
          Selecionar tipo:
        </span>
        {children}
      </components.ValueContainer>
    );
  };

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
      setSelectedTipos(tiposUnicos); // seleciona todos inicialmente
    }
  }, [midias, tiposMidiaFixos.length]);

  // Atualizar midias quando checkbox mudar
  useEffect(() => {
    const fetchMidiasFiltradas = async () => {
      setCarregando(true);
      try {
        if (selectedTipos.length > 0) {
          // Junta os tipos selecionados em uma string separada por vírgula
          const tiposSelecionadosStr = selectedTipos.map(t => t.label).join(",");

          const data = await buscarMidiasPorTipos(
            tiposSelecionadosStr,
            paginaAtual - 1,
            REGISTROS_POR_PAGINA
          );

          setMidias(data.content);
          setTotalPaginas(data.totalPages);
        } else {
          // Nenhum tipo selecionado → mostra todas
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

  const handlePrintAll = async () => {
    try {
      setCarregando(true);
      const todasMidias = await buscarMidiasDoUsuario();
      setMidiasParaImprimir(todasMidias);
      setTimeout(() => {
        window.print();
        setMidiasParaImprimir(null);
        setCarregando(false);
      }, 600);
    } catch (error) {
      console.error("Erro ao carregar mídias para imprimir:", error);
      setCarregando(false);
    }
  };

  if (carregando) return <p className="p-6 text-white">🔄 Carregando mídias...</p>;

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
      color: "#000000",
      minHeight: "30px",   // 🔽 altura mínima
      height: "30px",      // 🔽 altura fixa
      fontSize: "14px",    // 🔽 fonte menor
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 6px",    // 🔽 reduz espaço interno
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#000000",
      fontSize: "14px",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0,          // 🔽 remove margens extras
      padding: 0,
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#d1d5db" : "#e5e7eb",
      color: "#000000",
      padding: "4px 8px",  // 🔽 deixa cada opção mais compacta
      fontSize: "14px",
      lineHeight: "18px",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "30px",     // 🔽 ajusta altura dos ícones (setinha, clear, etc.)
    }),
  };

  // 🔹 Novo Control fixo com label "Selecionar tipo"
  const CustomControl = (props: any) => (
    <components.Control {...props}>
      <span style={{ marginLeft: "8px", color: "#444", fontWeight: "bold" }}>
        Selecionar tipo
      </span>
      {props.children}
    </components.Control>
  );

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

        <div style={{ minWidth: 200 }}>
          <Select<TipoMidiaOption, true>
            options={tiposMidiaOptions}
            value={selectedTipos}
            onChange={(val: MultiValue<TipoMidiaOption>) => {
              if (val.length === 0) return;
              setSelectedTipos(val);
              setPaginaAtual(1);
            }}
            isMulti
            closeMenuOnSelect={false}
            components={{
              Option: OptionCheckbox,
              MultiValue: () => null,
              Control: CustomControl // 👈 aqui está fixo "Selecionar tipo"
            }}
            hideSelectedOptions={false}
            styles={customStyles}
          />
        </div>

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
                  <td className="px-4 py-2 border-b text-[#4B3621]">{midia.midiaTipoNome || "-"}</td>
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
              className="bg-white shadow rounded p-2 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
              style={{ flex: "0 0 auto", width: "200px" }} // só controla a largura
            >
              <div className="w-full aspect-[2/3] overflow-hidden rounded bg-gray-200 flex justify-center items-center mb-2">
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
              <h3 className="text-md font-semibold text-center text-[#4B3621] max-w-full line-clamp-2 min-h-[3rem]">
                {midia.tituloAlternativo || "Sem título"}
              </h3>
            </div>
          ))}

        </div>
      )}

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

      {midiasParaImprimir && (
        <div className="print-area">
          {midiasParaImprimir.map((midia) => (
            <div key={midia.id} style={{ marginBottom: 20 }}>
              <h2>{midia.tituloOriginal}</h2>
              <p>
                <strong>Sinopse:</strong> {midia.sinopse}
              </p>
              <p>
                <strong>Gêneros:</strong> {midia.generos}
              </p>
              <p>
                <strong>Duração:</strong> {midia.duracao} minutos
              </p>
              <p>
                <strong>Linguagem:</strong> {midia.linguagem}
              </p>
              <p>
                <strong>Nota Média:</strong> {midia.notaMedia}
              </p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default MidiaListPage;
