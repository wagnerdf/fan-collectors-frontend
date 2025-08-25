import api from "../services/api";
import axios from "axios";

// Pega token do localStorage
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
  const response = await api.get(`/api/midias/usuario/paginado?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// 📄 Todas do usuário
export const buscarMidiasDoUsuario = async (): Promise<MidiaResponse[]> => {
  const response = await api.get("/api/midias/usuario", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 🔍 Buscar por termo
export const buscarMidiasPorTermo = async (termo: string): Promise<MidiaResponse[]> => {
  const token = localStorage.getItem("fanCollectorsMediaToken"); // pegar sempre na hora
  const response = await api.get(`/api/midias/buscar`, {
    params: { query: termo },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✏️ Atualizar campos livres (observacoes, temporada e midiaTipoNome)
export interface MidiaCamposLivresDto {
  observacoes?: string;
  temporada?: string;
  midiaTipoNome?: string;
}

// Atualiza os campos livres da mídia: observacao, temporada, formatoMidia e midiaTipoNome
export const atualizarCamposLivres = async (
  id: number,
  dados: { observacao?: string; temporada?: string; midiaTipoNome?: string; formatoMidia?: string }
): Promise<void> => {
  const token = localStorage.getItem("fanCollectorsMediaToken");
  await api.patch(`/api/midias/${id}/editar-campos-livres`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const buscarMidiaTipos = async (ids: number[]) => {
  const params = ids.join(",");
  const res = await api.get(`/api/midias/selecao?ids=${params}`);
  return res.data;
};

export const excluirMidia = async (id: number) => {
  const res = await api.delete(`/api/midias/${id}`);
  return res.data; // caso o backend retorne alguma confirmação, senão pode omitir
};

// 📄 Buscar mídias do usuário filtrando por tipoNome
export async function buscarMidiasPorTipos(
  tipos: string,  // já será string tipo1,tipo2,tipo3
  page: number = 0,
  size: number = 25
): Promise<PaginaMidias> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não autenticado");

  const response = await api.get(
    `/api/midias/tipos-nomes?tipos=${tipos}&page=${page}&size=${size}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
}



