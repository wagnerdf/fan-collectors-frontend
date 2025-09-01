import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";

interface Game {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: {
    url: string;
  };
}

interface MidiaFormJGProps {
  pesquisa: string;
  onPesquisaChange: (value: string) => void;
}

const MidiaFormJG: React.FC<MidiaFormJGProps> = ({ pesquisa, onPesquisaChange }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const fetchGames = async (search: string) => {
    if (!search) {
      setGames([]);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/api/games?search=${encodeURIComponent(search)}`);
      setGames(response.data);
    } catch (error) {
      console.error('Erro ao buscar jogos-------: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (pesquisa.length > 2) {
        fetchGames(pesquisa);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [pesquisa]);

  return (
    <div className="flex-1 relative">
      <label className="block mb-1 font-medium text-gray-200 text-sm">Buscar Jogo</label>
      <input
        type="text"
        value={pesquisa}
        onChange={(e) => {
          onPesquisaChange(e.target.value);
          setSelectedGame(null);
        }}
        placeholder="Digite para buscar na IGDB..."
        className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {loading && <p className="text-sm text-gray-400 mt-1">Carregando...</p>}

      {games.length > 0 && !selectedGame && (
        <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto z-10 rounded shadow-md text-black">
          {games.map((game) => (
            <li
              key={game.id}
              onClick={() => {
                setSelectedGame(game);
                onPesquisaChange(game.name);
                setGames([]);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
            >
              {game.cover && (
                <img
                  src={game.cover.url.startsWith("//") ? `https:${game.cover.url.replace("t_thumb", "t_cover_small")}` : game.cover.url.replace("t_thumb", "t_cover_small")}
                  alt={game.name}
                  className="w-8 h-8 object-cover rounded"
                />
              )}
              <span className="text-sm">{game.name}</span>
              {game.first_release_date && (
                <span className="ml-auto text-xs text-gray-500">
                  {new Date(game.first_release_date * 1000).getFullYear()}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedGame && (
        <div className="mt-2 p-3 border rounded bg-gray-50 shadow-sm">
          <p className="font-medium text-sm">{selectedGame.name}</p>
          {selectedGame.cover && (
            <img
              src={
                selectedGame.cover.url.startsWith("//")
                  ? `https:${selectedGame.cover.url.replace("t_thumb", "t_cover_big")}`
                  : selectedGame.cover.url.replace("t_thumb", "t_cover_big")
              }
              alt={selectedGame.name}
              className="mt-2 rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MidiaFormJG;
