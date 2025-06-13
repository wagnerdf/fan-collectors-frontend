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
    }
  }, []);

  if (!usuario) {
    return <div className="text-white p-8">Carregando perfil...</div>;
  }

return (
  <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
    <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-3xl">
      <h2 className="text-2xl mb-6 border-b pb-2">Perfil do Usuário</h2>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {usuario.avatarUrl ? (
          <img
            src={usuario.avatarUrl}
            alt="Avatar do usuário"
            className="w-32 h-32 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center bg-gray-700 rounded-full text-gray-300 text-sm">
            Sem imagem
          </div>
        )}

        <div className="text-sm md:text-base space-y-2">
          <p><strong>ID:</strong> {usuario.id}</p>
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Sobrenome:</strong> {usuario.sobreNome || "Não informado"}</p>
          <p><strong>Data de Nascimento:</strong> {usuario.dataNascimento || "Não informada"}</p>
          <p><strong>Sexo:</strong> {usuario.sexo || "Não informado"}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Telefone:</strong> {usuario.telefone || "Não informado"}</p>
        </div>
      </div>

      {/* Botão de logout */}
      <div className="mt-8 flex justify-end">
        <button
        onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
        }}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
        >
        Logout
        </button>
      </div>
    </div>
  </div>
);

}

export default PerfilPage;
