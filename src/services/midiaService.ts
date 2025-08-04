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

export const buscarMidiasDoUsuario = async (): Promise<MidiaResponse[]> => {
    const response = await api.get("/api/midias/usuario", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    });
  return response.data;
};
