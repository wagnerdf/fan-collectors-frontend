import React from "react";
import Perfil from "../pages/Perfil";
import EditarCadastro from "../pages/EditarCadastro";
import MeusHobbysPage from "../pages/MeusHobbysPage";

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
  bairro: string;
  cidade: string;
  estado: string;
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

interface FeedProps {
  paginaAtiva: Pagina;
  usuario: Usuario;
}

export default function Feed({ paginaAtiva, usuario }: FeedProps) {
  switch (paginaAtiva) {
    case "perfil":
      return <Perfil usuario={usuario} />;
    case "editar":
      return <EditarCadastro />;
    case "hobbys":
      return <MeusHobbysPage />;
    case "home":
    default:
      return (
        <div className="flex-1 p-4 text-white">
          <h2>Bem-vindo ao fanCollectorsMedia</h2>
        </div>
      );
  }
}
