import api from "../services/api";

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
  midiaTipoId: number;
  midiaTipoNome: string;
}

export type PaginaMidias = {
  content: MidiaResponse[];
  totalPages: number;
  totalElements: number;
};

// 📄 Paginada
export async function buscarMidiasPaginadas(
  page: number = 0,
  size: number = 25
): Promise<PaginaMidias> {
  const response = await api.get(`/api/midias/usuario/paginado?page=${page}&size=${size}`);
  return response.data;
}

// 📄 Todas do usuário
export const buscarMidiasDoUsuario = async (): Promise<MidiaResponse[]> => {
  const response = await api.get("/api/midias/usuario");
  return response.data;
};

// 🔍 Buscar por termo
export const buscarMidiasPorTermo = async (termo: string): Promise<MidiaResponse[]> => {
  const response = await api.get(`/api/midias/buscar`, {
    params: { query: termo },
  });
  return response.data;
};

// ✏️ Atualizar campos livres
export interface MidiaCamposLivresDto {
  observacoes?: string;
  temporada?: string;
  midiaTipoNome?: string;
  formatoMidia?: string;
}

export const atualizarCamposLivres = async (
  id: number,
  dados: MidiaCamposLivresDto
): Promise<void> => {
  await api.patch(`/api/midias/${id}/editar-campos-livres`, dados);
};

// 📋 Buscar tipos de mídia
export const buscarMidiaTipos = async (ids: number[]) => {
  const params = ids.join(",");
  const res = await api.get(`/api/midias/selecao?ids=${params}`);
  return res.data;
};

// ❌ Excluir mídia
export const excluirMidia = async (id: number) => {
  const res = await api.delete(`/api/midias/${id}`);
  return res.data;
};

// 📄 Buscar mídias do usuário filtrando por tipoNome
export async function buscarMidiasPorTipos(
  tipos: string, // já será string tipo1,tipo2,tipo3
  page: number = 0,
  size: number = 25
): Promise<PaginaMidias> {
  const response = await api.get(
    `/api/midias/tipos-nomes?tipos=${tipos}&page=${page}&size=${size}`
  );
  return response.data;
}

// 📄 Buscar mídias do usuário por ID
export const buscarMidiaPorId = async (id: number) => {
  const res = await api.get(`/api/midias/${id}`);
  return res.data;
};