import React from "react";
import Perfil from "../pages/Perfil";
import EditarCadastro from "../pages/EditarCadastro";
import MeusHobbysPage from "../pages/MeusHobbysPage";

type Pagina = "home" | "perfil" | "editar" | "hobbys";

interface FeedProps {
  paginaAtiva: Pagina;
}

export default function Feed({ paginaAtiva }: FeedProps) {
  switch (paginaAtiva) {
    case "perfil":
      return <Perfil />;
    case "editar":
      return <EditarCadastro />;
    case "hobbys":
      return <MeusHobbysPage />;
    case "home":
    default:
      return (
        <div className="flex-1 p-4 text-white">
          {/* Conteúdo da home, se quiser */}
          <h2>Bem-vindo ao fanCollectorsMedia</h2>
        </div>
      );
  }
}
