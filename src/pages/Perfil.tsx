import React from "react";

interface HobbyDoUsuario {
  id: number;
  nomeHobby: string;
  nivelInteresse: string;
  descricaoHobby: string;
}

interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais?: string;
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
  endereco?: Endereco;
  hobbies?: HobbyDoUsuario[];
}

interface PerfilProps {
  usuario: Usuario;
}

export default function Perfil({ usuario }: PerfilProps) {
  const { nome, sobreNome, email, telefone, dataNascimento, sexo, endereco } = usuario;

  return (
    <div className="w-full h-full p-0">
      <div className="bg-gray-900 rounded-2xl shadow-md p-6 h-full overflow-auto text-white">
        <h2 className="text-2xl font-bold mb-6">Perfil do Usuário</h2>

        {/* Bloco 1: Dados Pessoais */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Campo label="Nome" valor={nome} />
            <Campo label="Sobrenome" valor={sobreNome ?? "-"} />
            <Campo label="Email" valor={email} />
            <Campo label="Telefone" valor={telefone} />
            <Campo label="Data de Nascimento" valor={dataNascimento ?? "-"} />
            <Campo label="Sexo" valor={sexo ?? "-"} />
          </div>
        </div>

        {/* Bloco 2: Endereço */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Endereço</h3>
          {endereco ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Campo label="CEP" valor={endereco.cep} />
              <Campo label="Rua" valor={endereco.rua} />
              <Campo label="Número" valor={endereco.numero} />
              <Campo label="Complemento" valor={endereco.complemento ?? "-"} />
              <Campo label="Bairro" valor={endereco.bairro} />
              <Campo label="Cidade" valor={endereco.cidade} />
              <Campo label="Estado" valor={endereco.estado} />
              <Campo label="País" valor={endereco.pais ?? "Brasil"} />
            </div>
          ) : (
            <p className="text-gray-400">Endereço não cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para exibir os campos
function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-400">{label}</label>
      <input
        type="text"
        value={valor}
        readOnly
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none text-gray-300 cursor-not-allowed"
      />
    </div>
  );
}
