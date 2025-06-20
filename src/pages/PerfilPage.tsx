import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { TopBar } from "../components/TopBar";
import { Sidebar } from "../components/Sidebar";
import Feed from "../components/Feed";

interface HobbyDoUsuario {
  id: number;
  nomeHobby: string;
  nivelInteresse: string;
  descricaoHobby: string;
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchDados = async () => {
      const token = localStorage.getItem("fanCollectorsMediaToken");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const perfilRes = await api.get("/api/cadastros/perfil");
        const perfilData = perfilRes.data;

        const hobbiesRes = await api.get("/cadastro-hobby/meus");
        const hobbiesData = hobbiesRes.data ?? [];

        setUsuario({
          ...perfilData,
          hobbies: hobbiesData,
        });
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar dados do perfil.");
      }
    };

    fetchDados();
  }, [navigate]);


  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  if (!usuario) {
    return <div className="text-white p-8">Carregando perfil...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("fanCollectorsMediaToken");
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
