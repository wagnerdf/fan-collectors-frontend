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

interface SidebarProps {
  usuario: Usuario;
}

export default function Sidebar({ usuario }: SidebarProps) {
  return (
    <div className="bg-gray-900 text-white w-full sm:w-64 p-4 rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        {usuario.avatarUrl ? (
          <img
            src={usuario.avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-2 border-white object-cover"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center bg-gray-700 rounded-full text-gray-300">
            Sem imagem
          </div>
        )}
        <h2 className="text-lg font-semibold mt-4">{usuario.nome}</h2>
        <p className="text-sm text-gray-400">{usuario.email}</p>
      </div>

      <nav className="space-y-2 text-sm">
        <button className="w-full text-left hover:bg-gray-800 p-2 rounded">Editar Perfil</button>
        <button className="w-full text-left hover:bg-gray-800 p-2 rounded">Minhas Coleções</button>
        <button className="w-full text-left hover:bg-gray-800 p-2 rounded">Amigos</button>
        <button className="w-full text-left hover:bg-gray-800 p-2 rounded">Nova Coleção</button>
      </nav>
    </div>
  );
}
