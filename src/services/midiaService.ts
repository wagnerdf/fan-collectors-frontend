import axios from "axios";
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

const baseURL = process.env.REACT_APP_API_URL;

export const buscarMidiasDoUsuario = async (): Promise<MidiaResponse[]> => {
    const response = await axios.get(`${baseURL}/api/midias/usuario`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    });
  return response.data;
};
