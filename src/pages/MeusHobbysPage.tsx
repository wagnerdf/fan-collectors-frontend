import { useEffect, useState } from "react";
import api from "../services/api";

interface Hobby {
  id: number;
  nome: string;
  descricao: string;
}

interface HobbySelecionado {
  hobbyId: number;
  nivelInteresse: number;
}

export default function MeusHobbysPage() {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [selecionados, setSelecionados] = useState<Record<number, number>>({}); // { [hobbyId]: nivel }

  useEffect(() => {
    api.get("/hobbies") // Endpoint que retorna todos os hobbies
      .then((response) => {
        setHobbies(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar hobbies:", error);
      });
  }, []);

  const handleChangeNivel = (hobbyId: number, nivel: number) => {
    setSelecionados((prev) => ({ ...prev, [hobbyId]: nivel }));
  };

  const handleSalvar = async () => {
    const payload = Object.entries(selecionados).map(([hobbyId, nivel]) => ({
      hobbyId: Number(hobbyId),
      nivelInteresse: nivel,
    }));

    try {
      await api.post("/cadastro-hobby", payload); // ← Backend deve aceitar lista
      alert("Hobbies salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar hobbies:", err);
      alert("Erro ao salvar hobbies.");
    }
  };

  return (
    <div className="w-full h-full p-0">
      <div className="bg-gray-900 rounded-2xl shadow-md p-6 h-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Meus Hobby's</h2>

        <div className="space-y-4">
          {hobbies.map((hobby) => (
            <div key={hobby.id} className="bg-gray-800 p-4 rounded-xl text-white">
              <h3 className="text-lg font-semibold">{hobby.nome}</h3>
              <p className="text-sm text-gray-300">{hobby.descricao}</p>

              <label className="block mt-2 text-sm">
                Nível de Interesse:
                <select
                  className="ml-2 bg-gray-700 border border-gray-600 rounded px-2 py-1"
                  value={selecionados[hobby.id] || ""}
                  onChange={(e) => handleChangeNivel(hobby.id, Number(e.target.value))}
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
          <button
            onClick={handleSalvar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
