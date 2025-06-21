import React, { useState } from "react";
import { TopBar } from "./TopBar";
import Feed from "./Feed";

type Pagina = "home" | "perfil" | "editar" | "hobbys";

interface Usuario {
  nome: string;
  email: string;
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
        onSelectPage={setPaginaAtiva} // Passa o setter para o TopBar
      />

      <main className="flex-1 bg-gray-800 text-white p-4">
        <Feed paginaAtiva={paginaAtiva} />
      </main>
    </div>
  );
};
