import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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


  const handleMouseEnter = (hobby: HobbyDoUsuario, mensagemPersonalizada?: string) => (e: React.MouseEvent) => {
    const timeout = setTimeout(() => {
      setHoveredHobby(hobby); // Isso identifica QUAL hobby está sendo mostrado
      setTooltipText(mensagemPersonalizada ?? hobby.descricaoHobby); // Isso define o QUE será mostrado
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
    setTooltipText(""); // limpa o texto
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
    <div className="bg-gray-900 text-white p-4 w-full sm:w-64 rounded-xl shadow-md space-y-6 relative">
      <div className="flex flex-col items-center mb-4">
        <img
          src={usuario.avatarUrl ?? "/default-user.png"}
          alt="Foto do usuário"
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
                onMouseEnter={handleMouseEnter(hobby)} // mostra descricaoHobby padrão
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="bg-gray-800 rounded-lg p-2 flex justify-between items-center hover:bg-gray-700 transition relative"
              >
                <span>{hobby.nomeHobby}</span>
                <span
                  onMouseEnter={handleMouseEnter(hobby, getDescricaoNivel(hobby.nivelInteresse))} // mostra descricao do nível
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

      {/* Tooltip com animação */}
      <AnimatePresence>
        {tooltipVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              zIndex: 9999,
              pointerEvents: "none",
            }}
            className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs"
          >
            {tooltipText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
