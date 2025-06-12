import { useEffect, useState } from "react";

interface Usuario {
  id: number;
  nome: string;
  sobreNome: string | null;
  dataNascimento: string | null;
  sexo: string | null;
  email: string;
}

function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:8080/fanCollectorsMedia/api/cadastros/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          console.log("Status da resposta:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("Dados recebidos:", data);
          setUsuario(data);
        })
        .catch((err) => console.error("Erro ao buscar perfil:", err));
    }
  }, []);

  if (!usuario) {
    return <div className="text-white p-8">Carregando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Perfil do Usuário</h2>
        <p><strong>ID:</strong> {usuario.id}</p>
        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Sobrenome:</strong> {usuario.sobreNome || "Não informado"}</p>
        <p><strong>Data de Nascimento:</strong> {usuario.dataNascimento || "Não informada"}</p>
        <p><strong>Sexo:</strong> {usuario.sexo || "Não informado"}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
      </div>
    </div>
  );
}

export default PerfilPage;

