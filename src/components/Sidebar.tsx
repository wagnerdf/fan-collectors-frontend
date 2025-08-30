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
  // Tooltip
  const [hoveredHobby, setHoveredHobby] = useState<HobbyDoUsuario | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [tooltipText, setTooltipText] = useState("");

  // Rotação hobbies
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);

  // Notícias
  const [noticias, setNoticias] = useState<any[]>([]);
  const [indiceNoticia, setIndiceNoticia] = useState(0);

  // Tooltip functions
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
    if (hoveredHobby) setTooltipPosition({ x: e.clientX + 16, y: e.clientY - 10 });
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
        setCurrentHobbyIndex(prev =>
          prev + 1 >= usuario.hobbies!.length ? 0 : prev + 1
        );
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [usuario.hobbies]);

  // Buscar notícia da API e adicionar ao cache
  const buscarNoticia = async () => {
    try {
      const chaveKey = process.env.REACT_APP_API_ND;
      const response = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${chaveKey}&q=cinema OR music OR games&language=pt`
      );
      const novaNoticia = response.data.results?.[0]; // pega a primeira do resultado
      if (novaNoticia) {
        setNoticias(prev => [...prev, novaNoticia]);
        setIndiceNoticia(noticias.length); // aponta para a última carregada
      }
    } catch (error) {
      console.error("Erro ao buscar notícia:", error);
    }
  };

  // Carregar a primeira notícia ao montar
  useEffect(() => {
    if (noticias.length === 0) buscarNoticia();
  }, []);

  // Rotação automática de notícias a cada 10 minutos
  useEffect(() => {
    if (noticias.length > 0) {
      const interval = setInterval(() => {
        setIndiceNoticia(prev => {
          if (prev < noticias.length - 1) return prev + 1;
          else {
            buscarNoticia(); // só busca nova quando chegar no fim
            return prev;
          }
        });
      }, 600000); // 10 min
      return () => clearInterval(interval);
    }
  }, [noticias]);

  // Navegação manual
  const proximaNoticia = () => {
    if (indiceNoticia < noticias.length - 1) {
      setIndiceNoticia(prev => prev + 1);
    } else {
      buscarNoticia();
    }
  };

  const noticiaAnterior = () => {
    if (indiceNoticia > 0) setIndiceNoticia(prev => prev - 1);
  };

  return (
    <div className="fixed left-3 top-[5.2rem] w-64 h-[calc(100vh-5.2rem)] bg-gray-900 p-4 rounded-t-2xl rounded-br-2xl shadow-lg overflow-y-auto">
      {/* Avatar */}
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

      {/* Hobbies */}
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

      {/* Notícias */}
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
              <h4 className="text-lg font-semibold text-white mb-2">
                {noticias[indiceNoticia].title}
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                {noticias[indiceNoticia].description}
              </p>

              {/* Link para site original */}
              {noticias[indiceNoticia].link && (
                <a
                  href={noticias[indiceNoticia].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm"
                >
                  Ler notícia completa
                </a>
              )}

              {/* Navegação manual */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={noticiaAnterior}
                  disabled={indiceNoticia === 0}
                  className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs disabled:opacity-50"
                >
                  ⬅ Anterior
                </button>
                <button
                  onClick={proximaNoticia}
                  className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs"
                >
                  Próxima ➡
                </button>
              </div>
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
