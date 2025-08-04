import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { TopBar } from "../components/TopBar";
import { Sidebar } from "../components/Sidebar";
import Feed from "../components/Feed";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

type Pagina = "home" | "perfil" | "editar" | "hobbys" | "midias" | "visualizarMidias";

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
  const [paginaAtiva, setPaginaAtiva] = useState<Pagina>("perfil");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  const carregarUsuario = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    if (location.pathname.includes("/perfil")) {
      setPaginaAtiva("perfil");
    }

    carregarUsuario();
  }, [location, carregarUsuario]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSelectPage = (pagina: Pagina) => {
    if (pagina === "home") {
      navigate("/");
      return;
    }
    setPaginaAtiva(pagina);
  };

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  if (!usuario) {
    return <div className="text-white p-8">Carregando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col">
      <TopBar
        onLogout={handleLogout}
        usuario={usuario}
        onSelectPage={handleSelectPage}
      />
      <div className="flex flex-1 flex-col sm:flex-row gap-5 p-4 pl-64">
        <Sidebar
          usuario={{
            ...usuario,
            avatarUrl: usuario.avatarUrl ?? "/default-user.png",
            hobbies: usuario.hobbies ?? [],
          }}
        />
        <div className="flex-1 ml-6">
          <Feed paginaAtiva={paginaAtiva} usuario={usuario} carregarUsuario={carregarUsuario} />
        </div>
      </div>
    </div>
  );
}

export default PerfilPage; 
