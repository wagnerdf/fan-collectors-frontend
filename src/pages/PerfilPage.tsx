import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { TopBar } from "../components/TopBar";
import { Sidebar } from "../components/Sidebar";
import Feed from "../components/Feed";

interface HobbyDoUsuario {
  id: number;
  nome: string;
  nivelInteresse: string;
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
  hobbies?: HobbyDoUsuario[];
}

function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetch(`${API_BASE_URL}/api/cadastros/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Dados recebidos do backend:", data); // 👈 Aqui imprime no console
        setUsuario(data);
      })
      .catch((err) => console.error("Erro ao buscar perfil:", err));
  }
}, []);

  if (!usuario) {
    return <div className="text-white p-8">Carregando perfil...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col">
      <TopBar onLogout={handleLogout} usuario={usuario} />
      <div className="flex flex-1 flex-col sm:flex-row gap-4 p-4">
        <Sidebar
          usuario={{
            ...usuario,
            avatarUrl: usuario.avatarUrl ?? "/default-user.png",
            hobbies: usuario.hobbies ?? [],
          }}
        />
        <Feed />
      </div>
    </div>
  );
}

export default PerfilPage;
