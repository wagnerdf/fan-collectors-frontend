import React, { useEffect, useMemo, useState } from "react";
import { atualizarCamposLivres } from "../services/midiaService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface MidiaFormFilmeSerieProps {
  dados: any;
  onNovaBusca?: () => void;
  focusPesquisa?: () => void; // nova prop para foco e limpeza
}

export function MidiaFormFilmeSerie({ dados, onNovaBusca, focusPesquisa }: MidiaFormFilmeSerieProps) {
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
  const [salvando, setSalvando] = useState(false);

  // estados do modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState(false);

  useEffect(() => {
    setDadosMidia(initial);
    setTemporada(dados?.temporada || "");
    setModoEdicao(true);
  }, [initial, dados?.temporada]);

  const camposTMDB = [
    "observacoes",
    "formatoMidia",
    "midiaTipoNome",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modoEdicao) {
      if (onNovaBusca) onNovaBusca();
      return;
    }

    try {
      setSalvando(true);

      const dto = {
        observacoes: dadosMidia.observacoes,
        temporada: temporada || undefined,
        formatoMidia: dadosMidia.formatoMidia
      };

      await atualizarCamposLivres(dadosMidia.id, dto);

      setModalMessage("Mídia atualizada com sucesso!");
      setModalError(false);
      setShowModal(true);

      setModoEdicao(false);
      setSalvando(false);
    } catch (erro) {
      console.error("Erro ao atualizar mídia:", erro);
      setModalMessage("Ocorreu um erro ao atualizar a mídia. Tente novamente.");
      setModalError(true);
      setShowModal(true);
      setSalvando(false);
    }
  };

  return (
    <form className="space-y-4 text-black" onSubmit={handleSubmit}>
      {modoEdicao && (
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Imagem da capa */}
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
            {dadosMidia.formatoMidia === "tv" && (
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Temporada da Série
                </label>
                <input
                  type="text"
                  value={temporada}
                  onChange={(e) => setTemporada(e.target.value)}
                  className="w-full border px-3 py-2 rounded bg-white"
                  placeholder="Ex: 1ª Temporada"
                />
              </div>
            )}

            {camposTMDB.map((campo) => {
              const isEditable = campo === "observacoes" || campo === "temporada";
              if (campo === "temporada" && dadosMidia.formatoMidia !== "tv") return null;

              return (
                <div key={campo}>
                  <label className="block text-sm font-medium capitalize mb-1 text-white">
                    {campo.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    name={campo}
                    className={`w-full border px-3 py-2 rounded ${
                      isEditable ? "bg-white" : "bg-gray-300 cursor-not-allowed"
                    }`}
                    value={campo === "temporada" ? temporada : dadosMidia[campo] || ""}
                    readOnly={!isEditable}
                    onChange={(e) => {
                      if (campo === "temporada") setTemporada(e.target.value);
                      else setDadosMidia({ ...dadosMidia, [campo]: e.target.value });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        className={`px-4 py-2 rounded transition text-white ${
          modoEdicao ? "bg-blue-800 hover:bg-blue-900" : "bg-yellow-600 hover:bg-yellow-700"
        }`}
        disabled={salvando}
      >
        {modoEdicao ? (salvando ? "Salvando..." : "Salvar Alterações") : "Nova Busca"}
      </button>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalError ? "Erro" : "Sucesso"}</DialogTitle>
            <DialogDescription>
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowModal(false);
                if (!modalError && focusPesquisa) {
                  focusPesquisa(); // limpa e foca input de pesquisa
                }
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
