import React, { useState } from "react";
import { TopBar } from "./TopBar";
import Feed from "./Feed";

type Pagina = "home" | "perfil" | "editar" | "hobbys";

// Interface completa (ajustada para compatibilidade com Feed e Perfil)
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
  usuario: Usuario;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ usuario, onLogout }) => {
  const [paginaAtiva, setPaginaAtiva] = useState<Pagina>("home");

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        usuario={usuario}
        onLogout={onLogout}
        onSelectPage={setPaginaAtiva}
      />

      <main className="flex-1 bg-gray-800 text-white p-4">
        <Feed paginaAtiva={paginaAtiva} usuario={usuario} />
      </main>
    </div>
  );
};
