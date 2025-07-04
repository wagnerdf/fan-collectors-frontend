import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditarCadastro() {
  const { token } = useAuth();
  const navigate = useNavigate();

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
  const [sucesso, setSucesso] = useState(false);
  const [errosCampos, setErrosCampos] = useState<{ [key: string]: string }>({});
  const [erroSenha, setErroSenha] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const novosErros: { [key: string]: string } = {};

    if (!dataNascimento) novosErros.dataNascimento = "Campo obrigatório";
    if (!sexo) novosErros.sexo = "Campo obrigatório";
    if (!telefone) novosErros.telefone = "Campo obrigatório";
    if (!cep) novosErros.cep = "Campo obrigatório";
    if (!complemento) novosErros.complemento = "Campo obrigatório";
    if (!rua) novosErros.rua = "Campo obrigatório";
    if (!numero) novosErros.numero = "Campo obrigatório";
    if (!bairro) novosErros.bairro = "Campo obrigatório";
    if (!cidade) novosErros.cidade = "Campo obrigatório";
    if (!estado) novosErros.estado = "Campo obrigatório";

    if (Object.keys(novosErros).length > 0) {
      setErrosCampos(novosErros);
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senha || confirmarSenha) {
      if (senha !== confirmarSenha) {
        setErro("As senhas não coincidem.");
        return;
      }

    if (senha.length > 0 && senha.length < 6) {
      setErroSenha("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setErroSenha("");

      const forca = avaliarForcaSenha(senha);
      if (forca === 'fraca') {
        setErro("A nova senha é muito fraca.");
        return;
      }
    }

    setErro("");
    setErrosCampos({});

    try {
      const payload = {
        dataNascimento,
        sexo,
        telefone,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        novaSenha: senha || undefined,
      };

      console.log("Dados a enviar:", payload);

      await api.put("/api/cadastros/perfilEditar", payload);

      setSucesso(true);
    } catch (err) {
      console.error("Erro ao atualizar cadastro:", err);
      setErro("Erro ao atualizar cadastro. Verifique os dados e tente novamente.");
    }
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
              onFocus={() => {
              setErrosCampos(prev => ({ ...prev, dataNascimento: ""}));
            }} 
            placeholder={errosCampos.dataNascimento ? errosCampos.dataNascimento: ""}
            className={`w-full rounded p-2 text-black ${
              errosCampos.dataNascimento 
                ? "bg-red-500 placeholder-white text-white"
                : "bg-white text-black"
            } border ${errosCampos.dataNascimento ? "border-red-700" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className="block font-medium">Sexo</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              onFocus={() => setErrosCampos((prev) => ({ ...prev, sexo: "" }))}
              className={`w-full rounded p-2.5 ${
                errosCampos.sexo
                  ? "bg-red-500 text-white border border-red-700"
                  : "bg-white text-black border border-gray-300"
              }`}
            >
              <option value="">
                {errosCampos.sexo ? "Campo obrigatório" : "Selecione"}
              </option>
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
            onFocus={() => {
                setErrosCampos(prev => ({ ...prev, telefone: "" }));
              }}
              placeholder={errosCampos.telefone ? errosCampos.telefone : ""}
              className={`w-full rounded p-2 text-black ${
                errosCampos.telefone
                  ? "bg-red-500 placeholder-white text-white"
                  : "bg-white text-black"
              } border ${errosCampos.telefone ? "border-red-700" : "border-gray-300"}`}
            />
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
                onFocus={() => setErroSenha("")}
                placeholder={erroSenha || ""}
                className={`w-full rounded p-1 ${
                  erroSenha
                    ? "bg-red-500 text-white placeholder-white border border-red-700"
                    : "bg-white text-black border border-gray-300"
                }`}
              />
              {forcaSenha && senha && !erroSenha && (
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
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onFocus={() => {
                setErrosCampos(prev => ({ ...prev, cep: "" }));
              }}
              placeholder={errosCampos.cep ? errosCampos.cep : ""}
              className={`w-full rounded p-2 text-black ${
                errosCampos.cep
                  ? "bg-red-500 placeholder-white text-white"
                  : "bg-white text-black"
              } border ${errosCampos.cep ? "border-red-700" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className="block font-medium">Rua</label>
            <input type="text"
            value={rua} 
            onChange={(e) => setRua(e.target.value)}
            onFocus={() => {
              setErrosCampos(prev => ({ ...prev, rua: ""}));
            }} 
            placeholder={errosCampos.rua ? errosCampos.rua: ""}
            className={`w-full rounded p-2 text-black ${
              errosCampos.rua 
                ? "bg-red-500 placeholder-white text-white"
                : "bg-white text-black"
            } border ${errosCampos.rua ? "border-red-700" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className="block font-medium">Número</label>
            <input type="text" 
            value={numero} 
            onChange={(e) => setNumero(e.target.value)} 
            onFocus={() => {
              setErrosCampos(prev => ({ ...prev, numero: ""}));
            }} 
            placeholder={errosCampos.numero ? errosCampos.numero: ""}
            className={`w-full rounded p-2 text-black ${
              errosCampos.numero
                ? "bg-red-500 placeholder-white text-white"
                : "bg-white text-black"
            } border ${errosCampos.numero ? "border-red-700" : "border-gray-300"}`}
            />
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
            onFocus={() => {
              setErrosCampos(prev => ({ ...prev, bairro: ""}));
            }} 
            placeholder={errosCampos.bairro ? errosCampos.bairro: ""}
            className={`w-full rounded p-2 text-black ${
              errosCampos.bairro 
                ? "bg-red-500 placeholder-white text-white"
                : "bg-white text-black"
            } border ${errosCampos.bairro ? "border-red-700" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className="block font-medium">Cidade</label>
            <input type="text"
            value={cidade} 
            onChange={(e) => setCidade(e.target.value)} 
            onFocus={() => {
              setErrosCampos(prev => ({ ...prev, cidade: ""}));
            }} 
            placeholder={errosCampos.cidade ? errosCampos.cidade: ""}
            className={`w-full rounded p-2 text-black ${
              errosCampos.cidade
                ? "bg-red-500 placeholder-white text-white"
                : "bg-white text-black"
            } border ${errosCampos.cidade ? "border-red-700" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className="block font-medium">Estado</label>
            <input type="text"
            value={estado} 
            onChange={(e) => setEstado(e.target.value)} 
            onFocus={() => {
              setErrosCampos(prev => ({ ...prev, estado: ""}));
            }} 
            placeholder={errosCampos.estado ? errosCampos.estado: ""}
            className={`w-full rounded p-2 text-black ${
              errosCampos.estado
                ? "bg-red-500 placeholder-white text-white"
                : "bg-white text-black"
            } border ${errosCampos.estado ? "border-red-700" : "border-gray-300"}`}
            />
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
          {sucesso && (
            <div className="col-span-full text-green-500 font-medium">
              Cadastro atualizado com sucesso! Redirecionando...
            </div>
          )}
        </form>
      </div>
      {sucesso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-green-600 mb-4">Cadastro atualizado com sucesso!</h2>
            <p className="mb-6">Você será redirecionado para o perfil.</p>
            <button
              type="button"
              onClick={() => {
                setSucesso(false);
                setTimeout(() => navigate("/perfil"), 0);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
