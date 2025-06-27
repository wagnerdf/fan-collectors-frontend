import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EditarCadastro() {
  const { token } = useAuth();

  const [nome, setNome] = useState("");
  const [sobreNome, setSobreNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [erro, setErro] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [forcaSenha, setForcaSenha] = useState<'fraca' | 'media' | 'forte' | null>(null);
  const [senhasConferem, setSenhasConferem] = useState(true);

  function avaliarForcaSenha(senha: string): 'fraca' | 'media' | 'forte' {
    let pontuacao = 0;
    if (senha.length >= 8) pontuacao++;
    if (/[a-z]/.test(senha)) pontuacao++;
    if (/[A-Z]/.test(senha)) pontuacao++;
    if (/[0-9]/.test(senha)) pontuacao++;
    if (/[^A-Za-z0-9]/.test(senha)) pontuacao++;

    if (pontuacao <= 2) return 'fraca';
    if (pontuacao === 3 || pontuacao === 4) return 'media';
    return 'forte';
  }
  

  useEffect(() => {
      async function carregarDados() {
        try {
          const response = await api.get("/api/cadastros/perfil");

          const data = response.data;

          setNome(data.nome || "");
          setSobreNome(data.sobreNome || "");
          setEmail(data.email || "");
          setDataNascimento((data.dataNascimento || "").split("T")[0]);
          setSexo(data.sexo || "");
          setTelefone(data.telefone || "");

          if (data.endereco) {
            setCep(data.endereco.cep || "");
            setRua(data.endereco.rua || "");
            setNumero(data.endereco.numero || "");
            setComplemento(data.endereco.complemento || "");
            setBairro(data.endereco.bairro || "");
            setCidade(data.endereco.cidade || "");
            setEstado(data.endereco.estado || "");
          }
        } catch (error) {
          console.error("Erro ao carregar dados do perfil:", error);
          setErro("Erro ao carregar dados do perfil.");
        }
      }

      carregarDados();
    }, [token]);

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      if (!dataNascimento || !sexo || !telefone || !cep || !complemento || !rua || !numero || !bairro || !cidade || !estado) {
        setErro("Preencha todos os campos obrigatórios.");
        return;
      }

      if (senha || confirmarSenha) {
        if (senha !== confirmarSenha) {
          setErro("As senhas não coincidem.");
          return;
        }

        const forca = avaliarForcaSenha(senha);
        if (forca === 'fraca') {
          setErro("A nova senha é muito fraca.");
          return;
        }
      }

      setErro("");

      const payload: any = {
        dataNascimento,
        sexo,
        telefone,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      };

      if (senha) {
        payload.novaSenha = senha;
      }

      console.log("Dados a enviar:", payload);

      api.put("/api/cadastros/perfilEditar", payload)
        .then(() => {
          alert("Cadastro atualizado com sucesso!");
        })
        .catch((err) => {
          console.error("Erro ao atualizar cadastro:", err);
          setErro("Erro ao atualizar cadastro.");
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
            className="w-full border rounded p-2 "/>
          </div>

          <div className="col-span-2 flex flex-col gap-4 items-center">
            <div className="w-1/2">
              <label className="block font-medium">Nova Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setForcaSenha(avaliarForcaSenha(e.target.value));
                  setSenhasConferem(e.target.value === confirmarSenha);
                }}
                className="w-full border rounded p-1 text-black"
              />
              {forcaSenha && senha && (
                <p className={`text-sm mt-1 ${
                  forcaSenha === 'fraca' ? 'text-red-500' :
                  forcaSenha === 'media' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  Senha {forcaSenha}
                </p>
              )}
            </div>

            <div className="w-1/2">
                <label className="block font-medium">Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => {
                    setConfirmarSenha(e.target.value);
                    setSenhasConferem(senha === e.target.value);
                  }}
                  className="w-full border rounded p-1 text-black"
                />
                {!senhasConferem && (
                  <p className="text-sm text-red-500 mt-1">As senhas não coincidem.</p>
                )}
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
