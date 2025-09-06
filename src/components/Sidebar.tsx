import React, { useEffect, useState, useRef } from "react";
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

  // Contadores
  const [contadorCache, setContadorCache] = useState(600); // 10 minutos
  const noticiaTimerRef = useRef<number>(0); // tempo decorrido da notícia
  const animationFrameRef = useRef<number>();
  const noticiaBoxRef = useRef<HTMLDivElement>(null);

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

  // Rotação hobbies a cada 1 minuto
  useEffect(() => {
    if (usuario.hobbies && usuario.hobbies.length > 0) {
      const interval = setInterval(() => {
        setCurrentHobbyIndex(prev => (prev + 1) % usuario.hobbies!.length);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [usuario.hobbies]);

  // Buscar notícias da API
  const buscarNoticias = async () => {
    try {
      const chaveKey = process.env.REACT_APP_API_ND;
      const response = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${chaveKey}&q=cinema OR music OR games OR literatura OR cultura&language=pt`
      );

      if (response.data.results && response.data.results.length > 0) {
        const limitadas = response.data.results.slice(0, 10);
        setNoticias(limitadas);
        setIndiceNoticia(0);
        setContadorCache(600);
        noticiaTimerRef.current = 0;
      }
    } catch (error) {
      console.error("Erro ao buscar notícia:", error);
    }
  };

  useEffect(() => {
    buscarNoticias();
  }, []);

  // Atualizar cache a cada 10 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      buscarNoticias();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Contador de cache regressivo
  useEffect(() => {
    const timer = setInterval(() => {
      setContadorCache(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animação fluida da barra de próxima notícia
  useEffect(() => {
    const animate = (timestamp: number) => {
      noticiaTimerRef.current += 1 / 60;
      if (noticiaTimerRef.current >= 60) {
        setIndiceNoticia(prev => (prev + 1) % noticias.length);
        noticiaTimerRef.current = 0;

        // voltar scroll para topo ao mudar notícia
        if (noticiaBoxRef.current) noticiaBoxRef.current.scrollTop = 0;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, [noticias]);

  const proximaNoticia = () => {
    setIndiceNoticia(prev => (prev + 1) % noticias.length);
    noticiaTimerRef.current = 0;
    if (noticiaBoxRef.current) noticiaBoxRef.current.scrollTop = 0;
  };
  const noticiaAnterior = () => {
    setIndiceNoticia(prev => (prev - 1 + noticias.length) % noticias.length);
    noticiaTimerRef.current = 0;
    if (noticiaBoxRef.current) noticiaBoxRef.current.scrollTop = 0;
  };

  const formatarTempo = (segundos: number) => {
    const m = Math.floor(segundos / 60);
    const s = Math.floor(segundos % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
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
      <div className="noticia mt-4 p-2 bg-gray-800 rounded-lg flex flex-col h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh]">
        {/* Conteúdo rolável */}
        <div
          ref={noticiaBoxRef}
          className="overflow-y-auto overflow-x-hidden flex-1 pr-2 custom-scroll"
        >
          <AnimatePresence mode="wait">
            {noticias[indiceNoticia] ? (
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

        {/* Botões e barras fixas */}
        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <button
              onClick={noticiaAnterior}
              className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs"
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

          <div className="space-y-1">
            <div className="relative h-2 w-full bg-gray-600 rounded">
              <div
                className="absolute h-2 bg-green-400 rounded transition-all duration-100"
                style={{ width: `${(noticiaTimerRef.current / 60) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              Próxima notícia em: {formatarTempo(60 - noticiaTimerRef.current)}
            </p>

            <div className="relative h-2 w-full bg-gray-600 rounded">
              <div
                className="absolute h-2 bg-blue-400 rounded transition-all duration-1000"
                style={{ width: `${((600 - contadorCache) / 600) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              Atualização de cache em: {formatarTempo(contadorCache)}
            </p>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <TooltipPortal
        visible={tooltipVisible}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
        text={tooltipText}
      />

      {/* Scroll custom */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
          border-radius: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.6);
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};
