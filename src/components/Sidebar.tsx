import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  // Estados de Tooltip
  const [hoveredHobby, setHoveredHobby] = useState<HobbyDoUsuario | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [tooltipText, setTooltipText] = useState("");

  // Estado para rotacionar hobbies
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);

  // Estados para as notícias
  const [noticias, setNoticias] = useState<any[]>([]);
  const [indiceNoticia, setIndiceNoticia] = useState(0);

  // Funções de tooltip
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
    const map: { [key: string]: string } = {
      "1": "😴",
      "2": "🙂",
      "3": "😃",
      "4": "😁",
      "5": "😍",
    };
    return map[nivel] ?? "❓";
  };

  const getDescricaoNivel = (nivel: string) => {
    const desc: { [key: string]: string } = {
      "1": "Muito baixo interesse",
      "2": "Baixo interesse",
      "3": "Interesse moderado",
      "4": "Alto interesse",
      "5": "Apaixonado pelo hobby",
    };
    return desc[nivel] ?? "Interesse desconhecido";
  };

  // Rotate hobbies a cada 1 minuto
  useEffect(() => {
    if (usuario.hobbies && usuario.hobbies.length > 0) {
      const interval = setInterval(() => {
        setCurrentHobbyIndex((prev) =>
          prev + 1 >= usuario.hobbies!.length ? 0 : prev + 1
        );
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [usuario.hobbies]);

  // Buscar e rotacionar notícias a cada 2 minutos
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const chaveKey = process.env.REACT_APP_API_ND;
        const response = await axios.get(
          `https://newsdata.io/api/1/news?apikey=${chaveKey}&q=cinema OR music OR games&language=pt`
        );
        setNoticias(response.data.results || []);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };

    fetchNoticias();
  }, []);

  useEffect(() => {
    if (noticias.length > 0) {
      const interval = setInterval(() => {
        setIndiceNoticia((prev) => (prev + 1) % noticias.length);
      }, 600000);
      return () => clearInterval(interval);
    }
  }, [noticias]);

  return (
    <div className="fixed left-3 top-[5.2rem] w-64 h-[calc(100vh-5.2rem)] bg-gray-900 p-4 rounded-t-2xl rounded-br-2xl shadow-lg overflow-y-auto">
      {/* Avatar do usuário */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={usuario.avatarUrl || "/default-user.png"}
          alt="Foto do usuário"
          onError={(e) => (e.currentTarget.src = "/default-user.png")}
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
        <h2 className="text-xl font-bold">{usuario.nome}</h2>
        <p className="text-sm text-gray-400">{usuario.email}</p>
      </div>

      {/* Seção de Hobby */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Hobbies</h3>
        <ul className="space-y-2">
          {usuario.hobbies && usuario.hobbies.length > 0 ? (
            <AnimatePresence mode="wait">
              {(() => {
                const hobby = usuario.hobbies![currentHobbyIndex];
                const emote = getEmojiByNivel(hobby.nivelInteresse);

                return (
                  <motion.li
                    key={hobby.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
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
                      {hobby.nivelInteresse} <span>{emote}</span>
                    </span>
                  </motion.li>
                );
              })()}
            </AnimatePresence>
          ) : (
            <p className="text-gray-500 italic">Nenhum hobby cadastrado.</p>
          )}
        </ul>
      </div>

      {/* Seção de Notícias Animada */}
      <div className="noticia mt-4 p-4 bg-gray-800 rounded-lg">
        <AnimatePresence mode="wait">
          {noticias.length > 0 ? (
            <motion.div
              key={indiceNoticia}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="text-xl font-semibold text-white">
                {noticias[indiceNoticia].title}
              </h4>
              <p className="text-sm text-gray-400">
                {noticias[indiceNoticia].description}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-500"
            >
              Carregando notícias...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Tooltip */}
      <TooltipPortal
        visible={tooltipVisible}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
        text={tooltipText}
      />
    </div>
  );
};
