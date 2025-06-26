import React, { useState } from "react";

export default function EditarCadastro() {
  const [nome, setNome] = useState("");
  const [sobreNome, setSobreNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");
  //const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !sobreNome || !nome || !dataNascimento || !sexo || !telefone || !cep || !complemento || !rua || !numero || !bairro || !cidade || !estado) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setErro("");
    console.log({
      nome,
      sobreNome,
      email,
      dataNascimento,
      sexo,
      telefone,
      //senha,
      cep,
      complemento,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    });

  }
  return (
    <div className="w-full h-full p-0">
      <div className="bg-gray-900 rounded-2xl shadow-md p-6 h-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Editar Cadastro</h2>
         <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* Seção: Dados Pessoais */}
          <div className="col-span-full">
            <h2 className="text-xl font-semibold mb-2">Dados Pessoais</h2>
          </div>

          <div>
            <label className="block font-medium">Nome</label>
            <input value={nome} disabled type="text" onChange={(e) => setNome(e.target.value)} className="w-full border rounded p-2"/>
          </div>

          <div>
          <label className="block font-medium">Sobrenome</label>
            <input value={sobreNome} disabled type="text" onChange={(e) => setSobreNome(e.target.value)} className="w-full border rounded p-2"/>
          </div>

          <div>
          <label className="block font-medium">Data de Nascimento</label>
          <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="w-full border rounded p-2 text-black"
            />
          </div>

          <div>
            <label className="block font-medium">Sexo</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className="w-full border rounded p-2.5  text-black"
            >
              <option value="">Selecione</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          <div>
          <label className="block font-medium">Telefone</label>
            <input type="text"
            value={telefone} 
            onChange={(e) => setTelefone(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input type="email" disabled
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
          </div>

          <div className="col-span-2 flex flex-col gap-4 items-center">
            <div className="w-1/2">
              <label className="block font-medium">Senha</label>
              <input type="password" 
              className="w-full border rounded p-1 text-black" />
            </div>

            <div className="w-1/2">
              <label className="block font-medium">Confirmar senha</label>
              <input type="password" className="w-full border rounded p-1 text-black" />
            </div>
          </div>

          {/* Seção: Endereço */}
          <div className="col-span-full mt-6">
            <h2 className="text-xl font-semibold mb-1">Endereço</h2>
          </div>

          <div>
            <label className="block font-medium">CEP</label>
            <input type="text" 
            value={cep} 
            onChange={(e) => setCep(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
          </div>

          <div>
            <label className="block font-medium">Rua</label>
            <input type="text"
            value={rua} 
            onChange={(e) => setRua(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
          </div>

          <div>
            <label className="block font-medium">Número</label>
            <input type="text" 
            value={numero} 
            onChange={(e) => setNumero(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
          </div>

          <div>
            <label className="block font-medium">Complemento</label>
            <input type="text"
            value={complemento} 
            onChange={(e) => setComplemento(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
          </div>

          <div>
            <label className="block font-medium">Bairro</label>
            <input type="text"
            value={bairro} 
            onChange={(e) => setBairro(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
          </div>

          <div>
            <label className="block font-medium">Cidade</label>
            <input type="text"
            value={cidade} 
            onChange={(e) => setCidade(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
          </div>

          <div>
            <label className="block font-medium">Estado</label>
            <input type="text"
            value={estado} 
            onChange={(e) => setEstado(e.target.value)} 
            className="w-full border rounded p-2 text-black"/>
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
          {erro && (
            <div className="col-span-full text-red-600 font-medium">
              {erro}
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
