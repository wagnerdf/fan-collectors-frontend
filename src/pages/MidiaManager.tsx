import React, { useState, useEffect, useRef } from "react";
import { MidiaForm } from "../components/MidiaForm";
import { MidiaFormFilmeSerie } from "../components/MidiaFormFilmeSerie";
import { buscarMidiasPorTermo, MidiaResponse } from "../services/midiaService";

export function MidiaManager() {
  const [abaAtiva, setAbaAtiva] = useState<"cadastrar" | "editar" | "excluir">("cadastrar");
  const [buscaMidia, setBuscaMidia] = useState("");
  const [resultados, setResultados] = useState<MidiaResponse[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [midiaSelecionada, setMidiaSelecionada] = useState<MidiaResponse | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const buscaPorClique = useRef(false); // flag para saber se veio de clique
  const inputRef = useRef<HTMLInputElement | null>(null); // ref para focar input ao abrir editar

  // Função para mapear midiaTipoId para array de tipos
  const getTiposMidia = (midiaTipoId: number): number[] => {
    if ([1, 2, 6].includes(midiaTipoId)) return [1, 2, 6];
    if ([9, 10, 11].includes(midiaTipoId)) return [9, 10, 11];
    if ([3, 4, 5].includes(midiaTipoId)) return [3, 4, 5];
    return [midiaTipoId]; // fallback
  };

  // Array de tipos de mídia baseado na seleção
  const tiposMidia = midiaSelecionada ? getTiposMidia(midiaSelecionada.midiaTipoId) : [];


  useEffect(() => {
    if (buscaMidia.trim().length === 0) {
      setResultados([]);
      setErro(null);
      if (!buscaPorClique.current) setMidiaSelecionada(null);
      return;
    }

    if (buscaPorClique.current) {
      buscaPorClique.current = false;
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setCarregando(true);
      buscarMidiasPorTermo(buscaMidia)
        .then((res) => {
          setResultados(res);
          setErro(null);
          setMidiaSelecionada(null);
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

  const handleSelecionarMidia = (midia: MidiaResponse) => {
    if (midiaSelecionada?.id === midia.id) {
      buscaPorClique.current = false;
      setMidiaSelecionada(null);
      setBuscaMidia("");
      setResultados([]);
      setErro(null);
      setCarregando(true);
      setTimeout(() => {
        setCarregando(false);
        inputRef.current?.focus();
      }, 150);
      return;
    }

    buscaPorClique.current = true;
    setMidiaSelecionada(midia);
    setBuscaMidia(midia.tituloOriginal || midia.tituloAlternativo || "");
    setResultados([]);
    setErro(null);
  };

  const handleAbaClick = (novaAba: "cadastrar" | "editar" | "excluir") => {
    setAbaAtiva(novaAba);
    buscaPorClique.current = false;
    setBuscaMidia("");
    setResultados([]);
    setMidiaSelecionada(null);
    setErro(null);
    setCarregando(false);
    if (novaAba === "editar") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const limparEFocarInput = () => {
    setBuscaMidia("");
    setResultados([]);
    setMidiaSelecionada(null);
    setTimeout(() => inputRef.current?.focus(), 50);
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
            onClick={() => handleAbaClick(aba as "cadastrar" | "editar" | "excluir")}
          >
            {aba.charAt(0).toUpperCase() + aba.slice(1)}
          </button>
        ))}
      </div>

      {abaAtiva === "cadastrar" && <MidiaForm />}

      {abaAtiva === "editar" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Buscar Mídia para Edição</h3>

          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="text"
              value={buscaMidia}
              onChange={(e) => setBuscaMidia(e.target.value)}
              placeholder="Digite o nome da mídia..."
              className="border border-gray-400 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500 text-black"
              autoComplete="off"
            />

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
                      {midia.midiaTipoNome ? `- ${midia.midiaTipoNome}` : ""}
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

            {erro && !carregando && <p className="text-red-600 mt-2">{erro}</p>}
          </div>

          {midiaSelecionada && (
            <>
              {[1, 2, 6].includes(midiaSelecionada.midiaTipoId) ? (
                <MidiaFormFilmeSerie
                  dados={midiaSelecionada}
                  focusPesquisa={limparEFocarInput}
                  tiposMidia={tiposMidia} // ✅ variável dinâmica populada
                />
              ) : [9, 10, 11].includes(midiaSelecionada.midiaTipoId) ? (
                <p>Formulário específico para Jogos (a implementar)</p>
              ) : [3, 4, 5].includes(midiaSelecionada.midiaTipoId) ? (
                <p>Formulário específico para Música (a implementar)</p>
              ) : (
                <p>Tipo de mídia ainda não implementado</p>
              )}
            </>
          )}
        </div>
      )}

      {abaAtiva === "excluir" && <p>Funcionalidade de exclusão de mídia será aqui.</p>}
    </div>
  );
}
