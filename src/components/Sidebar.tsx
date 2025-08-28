import React, { useEffect, useState } from "react";
import TooltipPortal from "../components/TooltipPortal";

interface HobbyDoUsuario {
  id: number;
  nomeHobby: string;
  nivelInteresse: string;
  descricaoHobby: string;
}

interface Usuario {
  nome: string;
  email: string;
  avatarUrl: string;
  hobbies?: HobbyDoUsuario[];
}

interface SidebarProps {
  usuario: Usuario;
}

export const Sidebar: React.FC<SidebarProps> = ({ usuario }) => {
  const [hoveredHobby, setHoveredHobby] = useState<HobbyDoUsuario | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [tooltipText, setTooltipText] = useState<string>("");

  useEffect(() => {
    console.log("Hobbies atualizados na Sidebar:", usuario.hobbies);
  }, [usuario.hobbies]);

  const handleMouseEnter = (hobby: HobbyDoUsuario, mensagemPersonalizada?: string) => (e: React.MouseEvent) => {
    const timeout = setTimeout(() => {
      setHoveredHobby(hobby);
      setTooltipText(mensagemPersonalizada ?? hobby.descricaoHobby);
      setTooltipVisible(true);
      setTooltipPosition({ x: e.clientX + 16, y: e.clientY - 10 });
    }, 300);
    setTooltipTimeout(timeout);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredHobby) {
      setTooltipPosition({ x: e.clientX + 16, y: e.clientY - 10 });
    }
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    setTooltipVisible(false);
    setHoveredHobby(null);
    setTooltipText("");
  };

  const getEmojiByNivel = (nivel: string) => {
    const mapa: { [key: string]: string } = {
      "1": "😴",
      "2": "🙂",
      "3": "😃",
      "4": "😁",
      "5": "😍",
    };
    return mapa[nivel] ?? "❓";
  };

  const getDescricaoNivel = (nivel: string) => {
    const descricao: { [key: string]: string } = {
      "1": "Muito baixo interesse",
      "2": "Baixo interesse",
      "3": "Interesse moderado",
      "4": "Alto interesse",
      "5": "Apaixonado pelo hobby",
    };
    return descricao[nivel] ?? "Interesse desconhecido";
  };

  return (
    <div className="fixed left-3 top-[5.2rem] w-64 h-[calc(100vh-5.2rem)] bg-gray-900 p-4 rounded-t-2xl rounded-br-2xl shadow-lg overflow-y-auto">
      <div className="flex flex-col items-center mb-4">
        <img
          src={usuario.avatarUrl || "/default-user.png"}
          alt="Foto do usuário"
          onError={(e) => {
            e.currentTarget.src = "/default-user.png";
          }}
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
        <h2 className="text-xl font-bold">{usuario.nome}</h2>
        <p className="text-sm text-gray-400">{usuario.email}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Hobbies</h3>
        <ul className="space-y-2">
          {usuario.hobbies && usuario.hobbies.length > 0 ? (
            usuario.hobbies.map((hobby) => {
              const emoticon = getEmojiByNivel(hobby.nivelInteresse);

              return (
                <li
                  key={hobby.id}
                  onMouseEnter={handleMouseEnter(hobby)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="bg-gray-800 rounded-lg p-2 flex justify-between items-center hover:bg-gray-700 transition relative"
                >
                  <span>{hobby.nomeHobby}</span>
                  <span
                    onMouseEnter={handleMouseEnter(hobby, getDescricaoNivel(hobby.nivelInteresse))}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="text-sm text-gray-400 italic flex items-center gap-1"
                  >
                    {hobby.nivelInteresse} <span>{emoticon}</span>
                  </span>
                </li>
              );
            })
          ) : (
            <p className="text-gray-500 italic">Nenhum hobby cadastrado.</p>
          )}
        </ul>
      </div>

      <TooltipPortal
        visible={tooltipVisible}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
        text={tooltipText}
      />

    </div>
  );
};
