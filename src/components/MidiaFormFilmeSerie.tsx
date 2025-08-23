import React, { useEffect, useMemo, useState } from "react";
import { atualizarCamposLivres, buscarMidiaTipos } from "../services/midiaService";
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
  focusPesquisa?: () => void;
  tiposMidia?: number[];
}

// Função utilitária para formatar labels
const formatarLabel = (nome: string) => {
  return nome
    .replace(/([A-Z])/g, " $1")       // adiciona espaço antes de letras maiúsculas
    .replace(/^./, (letra) => letra.toUpperCase())  // primeira letra maiúscula
    .trim();                           // remove espaços extras
};

export function MidiaFormFilmeSerie({
  dados,
  onNovaBusca,
  focusPesquisa,
  tiposMidia,
}: MidiaFormFilmeSerieProps) {
  const initial = useMemo(() => {
    const coverFromTMDB = dados?.poster_path
      ? `https://image.tmdb.org/t/p/w500${dados.poster_path}`
      : undefined;

    return {
      ...dados,
      capa_url: dados?.capa_url || dados?.capaUrl || coverFromTMDB || "",
    };
  }, [dados]);

  const [dadosMidia, setDadosMidia] = useState<any>(initial);
  const [temporada, setTemporada] = useState(dados?.temporada || "");
  const [modoEdicao, setModoEdicao] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState(false);

  // Tipos de mídia e seleção
  const [opcoesMidia, setOpcoesMidia] = useState<{ id: number; nome: string }[]>([]);
  const [midiaTipoId, setMidiaTipoId] = useState<number | undefined>(dados?.midiaTipoId);
  const [carregandoTipos, setCarregandoTipos] = useState(true);

  // Atualiza dados e temporada ao receber novos props
  useEffect(() => {
    setDadosMidia(initial);
    setTemporada(dados?.temporada || "");
    setModoEdicao(true);
    setMidiaTipoId(dados?.midiaTipoId || undefined);
  }, [initial, dados?.temporada, dados?.midiaTipoId]);

  // Buscar tipos de mídia permitidos
  useEffect(() => {
    if (!tiposMidia || tiposMidia.length === 0) {
      setCarregandoTipos(false);
      return;
    }

    const fetchTipos = async () => {
      try {
        setCarregandoTipos(true);
        const res = await buscarMidiaTipos(tiposMidia);
        setOpcoesMidia(res);

        // Seta o valor padrão do select com base no que vem da pesquisa
        if (dados?.midiaTipoId) {
          setMidiaTipoId(dados.midiaTipoId);
        } else if (res.length > 0) {
          setMidiaTipoId(res[0].id);
        }

        setCarregandoTipos(false);
      } catch (err) {
        console.error("Erro ao buscar tipos de mídia:", err);
        setCarregandoTipos(false);
      }
    };

    fetchTipos();
  }, [tiposMidia, dados?.midiaTipoId]);

  const camposTMDB = [
    "formatoMidia",
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
    "diretores",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modoEdicao) {
      if (onNovaBusca) onNovaBusca();
      return;
    }

    try {
      setSalvando(true);

      // Pega o nome do tipo de mídia selecionado
      const tipoSelecionado = opcoesMidia.find((op) => op.id === midiaTipoId);

      const dto = {
        observacoes: dadosMidia.observacoes,
        temporada: temporada || undefined,
        formatoMidia: dadosMidia.formatoMidia,
        midiaTipoId: midiaTipoId,
        midiaTipoNome: tipoSelecionado?.nome || "",  // adiciona o nome do tipo de mídia
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
            {/* Observações e Tipo de Mídia lado a lado */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1 text-white">Observações</label>
              <input
                type="text"
                name="observacoes"
                placeholder="Digite observações da mídia"
                className="w-full border px-3 py-2 rounded bg-white"
                value={dadosMidia.observacoes || ""}
                onChange={(e) => setDadosMidia({ ...dadosMidia, observacoes: e.target.value })}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1 text-white">Tipo de Mídia</label>
              <select
                className="w-full border px-3 py-2 rounded bg-white"
                value={midiaTipoId}
                onChange={(e) => setMidiaTipoId(Number(e.target.value))}
              >
                {carregandoTipos ? (
                  <option value={0}>Carregando tipos...</option>
                ) : (
                  opcoesMidia.map((opcao) => (
                    <option key={opcao.id} value={opcao.id}>
                      {opcao.nome}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Temporada para TV */}
            {dadosMidia.formatoMidia === "tv" && (
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium mb-1 text-white">Temporada da Série</label>
                <input
                  type="text"
                  value={temporada}
                  onChange={(e) => setTemporada(e.target.value)}
                  placeholder="Ex: 1ª Temporada"
                  className="w-full border px-3 py-2 rounded bg-white"
                />
              </div>
            )}

            {/* Outros campos TMDB */}
            {camposTMDB.map((campo) => {
              if (campo === "temporada") return null; // já tratado
              return (
                <div key={campo}>
                  <label className="block text-sm font-medium mb-1 text-white">
                    {formatarLabel(campo)}
                  </label>
                  <input
                    type="text"
                    name={campo}
                    className="w-full border px-3 py-2 rounded bg-gray-200 cursor-not-allowed"
                    value={dadosMidia[campo] || ""}
                    readOnly
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalError ? "Erro" : "Sucesso"}</DialogTitle>
            <DialogDescription>{modalMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowModal(false);
                if (!modalError && focusPesquisa) focusPesquisa();
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
