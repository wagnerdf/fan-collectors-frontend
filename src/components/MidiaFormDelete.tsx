import React, { useEffect, useMemo, useState } from "react";
import { buscarMidiasPorTermo, excluirMidia, MidiaResponse } from "../services/midiaService";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";

interface MidiaFormFilmeSerieDeleteProps {
  focusPesquisa?: () => void;
}

export function MidiaFormFilmeSerieDelete({ focusPesquisa }: MidiaFormFilmeSerieDeleteProps) {
  const [termoBusca, setTermoBusca] = useState("");
  const [midias, setMidias] = useState<MidiaResponse[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Modal de confirmação
  const [modalAberto, setModalAberto] = useState(false);
  const [midiaSelecionada, setMidiaSelecionada] = useState<MidiaResponse | null>(null);

  const midiasFiltradas = useMemo(() => {
    if (!termoBusca) return midias;
    return midias.filter((m) =>
      (m.tituloAlternativo || m.tituloOriginal || "")
        .toLowerCase()
        .includes(termoBusca.toLowerCase())
    );
  }, [termoBusca, midias]);

  useEffect(() => {
    if (!termoBusca) {
      setMidias([]);
      return;
    }

    setCarregando(true);
    buscarMidiasPorTermo(termoBusca)
      .then((res) => setMidias(Array.isArray(res) ? res : []))
      .catch((err) => console.error("Erro ao buscar mídias:", err))
      .finally(() => setCarregando(false));
  }, [termoBusca]);

  const abrirModalExcluir = (midia: MidiaResponse) => {
    setMidiaSelecionada(midia);
    setModalAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!midiaSelecionada) return;

    try {
      setCarregando(true);
      await excluirMidia(midiaSelecionada.id);
      setMidias((prev) => prev.filter((m) => m.id !== midiaSelecionada.id));
      if (focusPesquisa) focusPesquisa();
    } catch (err) {
      console.error("Erro ao excluir mídia:", err);
    } finally {
      setCarregando(false);
      setModalAberto(false);
      setMidiaSelecionada(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">🗑️ Excluir Mídia</h2>

      <input
        type="text"
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        placeholder="Digite nome da mídia..."
        className="w-full mb-4 px-3 py-2 rounded border text-black"
      />

      {carregando && <p className="text-white">🔄 Carregando...</p>}

      {!carregando && midiasFiltradas.length === 0 && <p className="text-white">Nenhuma mídia encontrada.</p>}

      {!carregando && midiasFiltradas.length > 0 && (
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Título</th>
              <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Gênero</th>
              <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Tipo</th>
              <th className="text-left px-4 py-2 border-b font-semibold text-[#4B3621]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {midiasFiltradas.map((midia) => (
              <tr key={midia.id} className="hover:bg-blue-50 cursor-pointer">
                <td className="px-4 py-2 border-b text-[#4B3621]">
                  {midia.tituloAlternativo || midia.tituloOriginal || "-"}
                </td>
                <td className="px-4 py-2 border-b text-[#4B3621]">{midia.generos || "-"}</td>
                <td className="px-4 py-2 border-b text-[#4B3621]">{midia.midiaTipoNome || "-"}</td>
                <td className="px-4 py-2 border-b text-[#4B3621]">
                  <Button
                    onClick={() => abrirModalExcluir(midia)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Dialog de confirmação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmação de exclusão</DialogTitle>
            <DialogDescription>
              Esta ação irá excluir permanentemente a mídia selecionada.
            </DialogDescription>
          </DialogHeader>

          {/* Cartão horizontal com imagem e detalhes */}
          <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
            {/* Imagem da mídia com efeito hover/zoom */}
            {midiaSelecionada?.capaUrl && (
              <img
                src={midiaSelecionada.capaUrl}
                alt={midiaSelecionada.tituloAlternativo || midiaSelecionada.tituloOriginal}
                className="w-full md:w-40 h-auto object-contain rounded shadow mb-4 md:mb-0 md:mr-4 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
              />
            )}

            {/* Detalhes da mídia */}
            <div className="text-center md:text-left">
              <p className="mb-2">
                Tem certeza que deseja excluir a mídia:
              </p>
              <strong className="block text-lg">
                {midiaSelecionada?.tituloAlternativo || midiaSelecionada?.tituloOriginal}{" "}
                {midiaSelecionada?.midiaTipoNome ? `- ${midiaSelecionada.midiaTipoNome}` : ""}
              </strong>
            </div>
          </div>

          {/* Botões */}
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              onClick={() => setModalAberto(false)}
              className="bg-gray-400 hover:bg-gray-500"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmarExclusao}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



    </div>
  );
}
