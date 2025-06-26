import React from "react";

export default function EditarCadastro() {
  return (
    <div className="w-full h-full p-0">
      <div className="bg-gray-900 rounded-2xl shadow-md p-6 h-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Editar Cadastro</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seção: Dados Pessoais */}
          <div className="col-span-full">
            <h2 className="text-xl font-semibold mb-2">Dados Pessoais</h2>
          </div>

          <div>
            <label className="block font-medium">Nome</label>
            <input value="Wagner" disabled type="text" className="w-full border rounded p-1 text-black bg-gray-100"/>
          </div>

          <div>
          <label className="block font-medium">Sobrenome</label>
            <input value="Andrade" disabled type="text" className="w-full border rounded p-1 text-black  bg-gray-100"/>
          </div>

          <div>
          <label className="block font-medium">Data Nascimento</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
          <label className="block font-medium">Sexo</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
          <label className="block font-medium">Telefone</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input type="email" disabled className="w-full border rounded p-1 text-black bg-gray-100"/>
          </div>

          <div className="col-span-2 flex flex-col gap-4 items-center">
            <div className="w-1/2">
              <label className="block font-medium">Senha</label>
              <input type="password" className="w-full border rounded p-1 text-black" />
            </div>

            <div className="w-1/2">
              <label className="block font-medium">Senha (Confirmar)</label>
              <input type="password" className="w-full border rounded p-1 text-black" />
            </div>
          </div>

          {/* Seção: Endereço */}
          <div className="col-span-full mt-6">
            <h2 className="text-xl font-semibold mb-1">Endereço</h2>
          </div>

          <div>
            <label className="block font-medium">CEP</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
            <label className="block font-medium">Rua</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
            <label className="block font-medium">Número</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
            <label className="block font-medium">Complemento</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
            <label className="block font-medium">Bairro</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
            <label className="block font-medium">Cidade</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          <div>
            <label className="block font-medium">Estado</label>
            <input type="text" className="w-full border rounded p-1 text-black" />
          </div>

          {/* Botão de salvar */}
          <div className="col-span-full mt-6 text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
