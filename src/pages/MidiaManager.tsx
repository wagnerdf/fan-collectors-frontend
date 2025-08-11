import React, { useState, useEffect, useRef } from "react";
import { MidiaForm } from "../components/MidiaForm";
import { MidiaFormFilmeSerie } from "../components/MidiaFormFilmeSerie";
import { buscarMidiasPorTermo, MidiaResponse } from "../services/midiaService";

export function MidiaManager() {
  const [abaAtiva, setAbaAtiva] = useState<"cadastrar" | "editar" | "excluir">("cadastrar");

  // Estado da busca e resultados
  const [buscaMidia, setBuscaMidia] = useState("");
  const [resultados, setResultados] = useState<MidiaResponse[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Mídia selecionada para editar
  const [midiaSelecionada, setMidiaSelecionada] = useState<MidiaResponse | null>(null);

  // Debounce para buscar 300ms após parar de digitar
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (buscaMidia.trim().length === 0) {
      setResultados([]);
      setErro(null);
      setMidiaSelecionada(null);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setCarregando(true);
      buscarMidiasPorTermo(buscaMidia)
        .then((res) => {
          setResultados(res);
          setErro(null);
          setMidiaSelecionada(null); // limpa seleção ao alterar busca
        })
        .catch(() => {
          setErro("Erro ao buscar mídias.");
          setResultados([]);
          setMidiaSelecionada(null);
        })
        .finally(() => setCarregando(false));
    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [buscaMidia]);

  // Quando usuário clica em resultado da busca
  const handleSelecionarMidia = (midia: MidiaResponse) => {
    setMidiaSelecionada(midia);
    setResultados([]);
    setBuscaMidia(midia.tituloOriginal);
    setErro(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gerenciar Mídias</h2>

      {/* Abas */}
      <div className="flex space-x-4 mb-6">
        {["cadastrar", "editar", "excluir"].map((aba) => (
          <button
            key={aba}
            className={`px-4 py-2 rounded ${
              abaAtiva === aba ? "bg-blue-800 text-white" : "bg-gray-400"
            }`}
            onClick={() => {
              setAbaAtiva(aba as typeof abaAtiva);
              // Limpa estados da aba editar ao mudar para outra aba
              if (aba !== "editar") {
                setBuscaMidia("");
                setResultados([]);
                setMidiaSelecionada(null);
                setErro(null);
                setCarregando(false);
              }
            }}
          >
            {aba.charAt(0).toUpperCase() + aba.slice(1)}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {abaAtiva === "cadastrar" && (
        <div>
          <MidiaForm />
        </div>
      )}

      {abaAtiva === "editar" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Buscar Mídia para Edição</h3>

          <div className="relative mb-4">
            <input
              type="text"
              value={buscaMidia}
              onChange={(e) => setBuscaMidia(e.target.value)}
              placeholder="Digite o nome da mídia..."
              className="border border-gray-400 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500 text-black"
              autoComplete="off"
            />

            {/* Dropdown de resultados */}
            {resultados.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto z-10 rounded shadow-md text-black">
                {resultados.map((midia) => (
                  <li
                    key={midia.id}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelecionarMidia(midia)}
                  >
                    {midia.tituloAlternativo || midia.tituloOriginal}{" "}
                    <span className="text-gray-600">
                      ({midia.tituloOriginal && midia.tituloAlternativo ? midia.tituloOriginal : ""})
                    </span>
                  </li>
                ))}

              </ul>
            )}

            {carregando && (
              <div className="absolute bg-white border border-gray-300 w-full mt-1 p-2 text-gray-600">
                Carregando...
              </div>
            )}

            {erro && !carregando && (
              <p className="text-red-600 mt-2">{erro}</p>
            )}
          </div>

          {/* Formulário de edição */}
          {midiaSelecionada && (
            <>
              {midiaSelecionada.tipoMidia === "Filme/Série" && (
                <MidiaFormFilmeSerie dados={midiaSelecionada} />
              )}
              {midiaSelecionada.tipoMidia === "Jogo" && (
                <p>Formulário específico para Jogos (a implementar)</p>
              )}
              {midiaSelecionada.tipoMidia === "Música" && (
                <p>Formulário específico para Música (a implementar)</p>
              )}
            </>
          )}
        </div>
      )}

      {abaAtiva === "excluir" && (
        <div>
          <p>Funcionalidade de exclusão de mídia será aqui.</p>
        </div>
      )}
    </div>
  );
}
