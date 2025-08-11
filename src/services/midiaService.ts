import api from "../services/api";
const token = localStorage.getItem("fanCollectorsMediaToken");

export interface MidiaResponse {
  id: number;
  tituloOriginal: string;
  tituloAlternativo: string;
  edicao: string;
  colecao: string;
  numeroSerie: string;
  faixas: string;
  classificacaoEtaria: string;
  artistas: string | null;
  diretores: string | null;
  estudio: string;
  formatoAudio: string;
  formatoVideo: string;
  observacoes: string;
  quantidadeItens: number;
  anoLancamento: number;
  capaUrl: string;
  tipoMidia: string;
  sinopse: string | null;
  generos: string | null;
  duracao: number | null;
  linguagem: string | null;
  notaMedia: number | null;
  formatoMidia: string | null;
  temporada: string | null;
}

export type PaginaMidias = {
  content: MidiaResponse[];
  totalPages: number;
  totalElements: number;
};

// Paginada
export async function buscarMidiasPaginadas(
  page: number = 0,
  size: number = 25
): Promise<PaginaMidias> {
  const response = await api.get(`/api/midias/usuario/paginado?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Todas do usuário
export const buscarMidiasDoUsuario = async (): Promise<MidiaResponse[]> => {
  const response = await api.get("/api/midias/usuario", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 🔍 Buscar por termo
export const buscarMidiasPorTermo = async (
  termo: string
): Promise<MidiaResponse[]> => {
  const token = localStorage.getItem("fanCollectorsMediaToken"); // pegar sempre na hora
  const response = await api.get(`/api/midias/buscar`, {
    params: { query: termo }, // nome certo do parâmetro
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

