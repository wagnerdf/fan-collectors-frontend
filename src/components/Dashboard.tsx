import React, { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import Feed from "./Feed";
import api from "../services/api";

type Pagina = "home" | "perfil" | "editar" | "hobbys";

interface HobbyDoUsuario {
  id: number;
  nomeHobby: string;
  nivelInteresse: string;
  descricaoHobby: string;
}

interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais?: string;
}

interface Usuario {
  id: number;
  nome: string;
  sobreNome: string | null;
  email: string;
  dataNascimento: string | null;
  sexo: string | null;
  telefone: string;
  avatarUrl: string | null;
  endereco?: Endereco;
  hobbies?: HobbyDoUsuario[];
}

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [paginaAtiva, setPaginaAtiva] = useState<Pagina>("home");
  const [error, setError] = useState<string | null>(null);

  const carregarUsuario = async () => {
    try {
      const perfilRes = await api.get("/api/cadastros/perfil");
      const perfilData = perfilRes.data;

      const hobbiesRes = await api.get("/cadastro-hobby/meus");
      const hobbiesData = hobbiesRes.data ?? [];

      setUsuario({
        ...perfilData,
        hobbies: hobbiesData,
      });
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar usuário no Dashboard:", err);
      setError("Erro ao carregar dados do usuário.");
      setUsuario(null);
    }
  };

  useEffect(() => {
    carregarUsuario();
  }, []);

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  if (!usuario) {
    return <div className="text-white p-8">Carregando usuário...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        usuario={usuario}
        onLogout={onLogout}
        onSelectPage={setPaginaAtiva}
      />

      <main className="flex-1 bg-gray-800 text-white p-4">
        <Feed
          paginaAtiva={paginaAtiva}
          usuario={usuario}
          carregarUsuario={carregarUsuario} // passa função para atualizar usuário
        />
      </main>
    </div>
  );
};
