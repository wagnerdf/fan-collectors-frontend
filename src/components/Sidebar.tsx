import React from "react";

interface HobbyDoUsuario {
  id: number;
  nome: string;
  nivelInteresse: string;
}

interface Usuario {
  nome: string;
  email: string;
  avatarUrl: string;
  hobbies?: HobbyDoUsuario[];
}

interface SidebarProps {
  usuario: Usuario;
}
export const Sidebar: React.FC<SidebarProps> = ({ usuario }) => {
  return (
    <div className="bg-gray-900 text-white p-4 w-full sm:w-64 rounded-xl shadow-md space-y-6">
      {/* Imagem + Nome + Email */}
      <div className="flex flex-col items-center mb-4">
        <img
        src={usuario.avatarUrl ?? "/default-user.png"}
        alt="Foto do usuário"
        className="w-24 h-24 rounded-full object-cover mb-2"
        />
        <h2 className="text-xl font-bold">{usuario.nome}</h2>
        <p className="text-sm text-gray-400">{usuario.email}</p>
      </div>

      {/* Lista de Hobbies */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Hobbies</h3>
        <ul className="space-y-2">
          {usuario.hobbies && usuario.hobbies.length > 0 ? (
            usuario.hobbies.map((hobby) => (
              <li
                key={hobby.id}
                className="bg-gray-800 rounded-lg p-2 flex justify-between items-center hover:bg-gray-700 transition"
              >
                <span>{hobby.nome}</span>
                <span className="text-sm text-gray-400 italic">
                  {hobby.nivelInteresse}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 italic">Nenhum hobby cadastrado.</p>
          )}
        </ul>
      </div>
    </div>
  );
};
