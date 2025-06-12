import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: number;
  nome: string;
  sobreNome: string | null;
  email: string;
  dataNascimento: string | null;
  sexo: string | null;
  telefone: string | null;
  avatarUrl: string | null;
}

function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:8080/fanCollectorsMedia/api/cadastros/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUsuario(data))
        .catch((err) => console.error("Erro ao buscar perfil:", err));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!usuario) {
    return <div className="text-white p-8">Carregando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">Perfil do Usuário</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          {usuario.avatarUrl ? (
            <img
              src={usuario.avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center text-xl">
              Sem Foto
            </div>
          )}

          {/* Dados */}
          <div className="text-left w-full">
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Sobrenome:</strong> {usuario.sobreNome || "Não informado"}</p>
            <p><strong>Data de Nascimento:</strong> {usuario.dataNascimento || "Não informada"}</p>
            <p><strong>Sexo:</strong> {usuario.sexo || "Não informado"}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Telefone:</strong> {usuario.telefone || "Não informado"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilPage;
