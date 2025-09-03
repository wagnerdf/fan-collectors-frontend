import api from "../services/api";

export interface GameBasic {
  id: number;
  name: string;
  year?: number;
  cover_url?: string;
  platforms_name?: string[];
}

export const buscarGamesBasica = async (nome: string): Promise<GameBasic[]> => {
  try {
    const response = await api.post("/api/igdb/games/basica", { nome });
    return response.data || [];
  } catch (error: any) {
    console.error("Erro ao buscar games:", error.response?.data || error.message);
    return []; // retorna array vazio em caso de erro
  }
};
