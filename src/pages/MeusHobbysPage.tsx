import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface Hobby {
  id: number;
  nome: string;
  descricao: string;
}

interface HobbySelecionado {
  hobbyId: number;
  nivelInteresse: number;
}

interface MeusHobbysPageProps {
  carregarUsuario: () => void;
}

export default function MeusHobbysPage({ carregarUsuario }: MeusHobbysPageProps) {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [selecionados, setSelecionados] = useState<Record<number, number>>({});
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    buscarTodosHobbies();
    buscarHobbiesDoUsuario();
  }, []);

  const buscarTodosHobbies = async () => {
    try {
      const response = await api.get("/api/hobbies");
      setHobbies(response.data);
    } catch (error) {
      console.error("Erro ao buscar hobbies:", error);
    }
  };

  const buscarHobbiesDoUsuario = async () => {
    try {
      const response = await api.get("/cadastro-hobby/meus");
      const interesses: Record<number, number> = {};
      response.data.forEach((item: HobbySelecionado) => {
        interesses[item.hobbyId] = item.nivelInteresse;
      });
      setSelecionados(interesses);
    } catch (error) {
      console.error("Erro ao buscar hobbies do usuário:", error);
    }
  };

  const handleChangeNivel = (hobbyId: number, nivel: number) => {
    if (isNaN(nivel) || nivel === 0) {
      setSelecionados((prev) => {
        const novo = { ...prev };
        delete novo[hobbyId];
        return novo;
      });
    } else {
      setSelecionados((prev) => ({ ...prev, [hobbyId]: nivel }));
    }
  };

  const handleSalvar = async () => {
    const payload = hobbies.map((hobby) => ({
      hobbyId: hobby.id,
      nivelInteresse: selecionados[hobby.id] ?? null,
    }));

    try {
      await api.post("/api/hobbies/lista", payload);
      setModalAberto(true); // abre o modal
    } catch (err) {
      console.error("Erro ao salvar hobbies:", err);
      alert("Erro ao salvar hobbies.");
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    carregarUsuario(); // ← atualiza o usuário no sistema (incluindo o Sidebar)
  };

  return (
    <div className="w-full h-full p-0">
      <div className="bg-gray-900 rounded-2xl shadow-md p-6 h-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Meus Hobby's</h2>

        <div className="space-y-4">
          {hobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="bg-gray-800 p-4 rounded-xl text-white flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{hobby.nome}</h3>
                <p className="text-sm text-gray-300">{hobby.descricao}</p>
              </div>

              <label className="flex flex-col items-end text-sm">
                Nível:
                <select
                  className="ml-2 bg-gray-700 border border-gray-600 rounded px-2 py-1"
                  value={selecionados[hobby.id] ?? ""}
                  onChange={(e) =>
                    handleChangeNivel(hobby.id, Number(e.target.value))
                  }
                >
                  <option value="">Escolha</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSalvar}>Salvar</Button>
        </div>
      </div>

      {/* Modal de confirmação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Hobbies atualizados com sucesso!</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="success" onClick={handleFecharModal}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
