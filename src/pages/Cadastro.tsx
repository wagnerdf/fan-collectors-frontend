import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cadastrarIcon from '../assets/cadastrar.png';
import voltarIcon from '../assets/voltarHome.png';
import casaIcon from '../assets/casa.png';

function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    sobreNome: '',
    dataNascimento: '',
    sexo: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    avatarUrl: '',
    status: 'ATIVO',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
    hobbies: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [forcaSenha, setForcaSenha] = useState<'fraca' | 'media' | 'forte' | null>(null);
  const [senhasConferem, setSenhasConferem] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name in formData.endereco) {
      let novoValor = value;
      if (name === 'cep') {
        novoValor = novoValor.replace(/\D/g, '').slice(0, 8);
      }

      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [name]: novoValor,
        },
      }));

      if (name === 'cep' && novoValor.length < 8) {
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: '',
            bairro: '',
            cidade: '',
            estado: '',
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === 'senha') {
      const novaForca = avaliarForcaSenha(value);
      setForcaSenha(novaForca);
      setSenhasConferem(value === formData.confirmarSenha);
    }
    if (name === 'confirmarSenha') {
      setSenhasConferem(value === formData.senha);
    }
  };

  useEffect(() => {
    const cep = formData.endereco.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              endereco: {
                ...prev.endereco,
                rua: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.uf || '',
              },
            }));
          }
        });
    }
  }, [formData.endereco.cep]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
    if (!formData.sobreNome.trim()) newErrors.sobreNome = 'Sobrenome é obrigatório.';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
    if (!formData.sexo) newErrors.sexo = 'Sexo é obrigatório.';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória.';
    if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirmação de senha é obrigatória.';
    if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'As senhas não coincidem.';
    if (!formData.endereco.cep || formData.endereco.cep.replace(/\D/g, '').length !== 8)
      newErrors.cep = 'CEP deve conter 8 dígitos.';
    if (!formData.endereco.rua.trim()) newErrors.rua = 'Rua é obrigatória.';
    if (!formData.endereco.numero.trim()) newErrors.numero = 'Número é obrigatório.';
    if (!formData.endereco.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório.';
    if (!formData.endereco.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória.';
    if (!formData.endereco.estado.trim()) newErrors.estado = 'Estado é obrigatório.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const { confirmarSenha, ...dataToSubmit } = formData;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/registerFull`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const erro = await response.json();
        const mensagemErro = erro.error || erro.mensagem || erro.message || "Erro ao cadastrar usuário.";
        setErrors({ email: mensagemErro });
        return;
      }

      await response.json();
      setModalAberto(true);

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-center justify-center transition-colors duration-700 p-4">
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-sky-500 text-white rounded-xl p-6 shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Cadastro realizado!</h2>
            <p className="mb-6">
              Bem-vindo(a), <strong>{formData.nome} {formData.sobreNome}</strong>! Você será redirecionado à página de login para entrar no sistema <strong>FanCollectorsMedia</strong>.
            </p>
            <button
              onClick={() => {
                setModalAberto(false);
                navigate("/login");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-900 bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-700">
        <div className="text-center mb-8 flex items-center justify-center gap-3">
          <img
            src={cadastrarIcon}
            alt="Ícone Cadastro"
            className="w-8 h-8 drop-shadow-md"
          />focus
          <h1 className="text-2xl sm:text-3xl font-semibold drop-shadow-sm">
            Cadastrar Fan Colecionador de Mídia
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Campos do formulário - dados pessoais exceto Avatar e Senhas */}
          {[
            { label: 'Nome', name: 'nome' },
            { label: 'Sobrenome', name: 'sobreNome' },
            { label: 'Data de Nascimento', name: 'dataNascimento', type: 'date' },
            { label: 'Sexo', name: 'sexo' },
            { label: 'Telefone', name: 'telefone' },
            { label: 'Email', name: 'email' },
          ].map(({ label, name, type = 'text' }) => (
            <div key={name} className="col-span-1">
              {errors[name] && <p className="text-red-500 text-sm mb-1">{errors[name]}</p>}
              <input
                type={type}
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                placeholder={label}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Avatar URL */}
          <div className="col-span-2">
            {errors.avatarUrl && <p className="text-red-500 text-sm mb-1">{errors.avatarUrl}</p>}
            <input
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="Avatar URL"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Senha e Confirmar Senha - coluna única, inputs um abaixo do outro */}
          <div className="col-span-2 flex flex-col gap-4 items-center">
            <div className="w-1/2">
              {errors.senha && <p className="text-red-500 text-sm mb-1">{errors.senha}</p>}
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Senha"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {forcaSenha && (
                <p
                  className={`text-sm mt-1 ${
                    forcaSenha === 'fraca'
                      ? 'text-red-500'
                      : forcaSenha === 'media'
                      ? 'text-yellow-400'
                      : 'text-green-500'
                  }`}
                >
                  Senha {forcaSenha}
                </p>
              )}
            </div>

            <div className="w-1/2">
              {errors.confirmarSenha && (
                <p className="text-red-500 text-sm mb-1">{errors.confirmarSenha}</p>
              )}
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirmar Senha"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!senhasConferem && (
                <p className="text-sm text-red-500 mt-1">As senhas não coincidem.</p>
              )}
            </div>
          </div>
        </div>
        <hr className="border-gray-600 my-6" />
        <div>
          <div className="flex items-center gap-3 mb-4 justify-center">
            <img
              src={casaIcon}
              alt="Ícone Endereço"
              className="w-7 h-7 drop-shadow-md"
            />
            <h2 className="text-xl sm:text-2xl font-semibold drop-shadow-sm">Endereço</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'CEP', name: 'cep', maxLength: 8 },
              { label: 'Rua', name: 'rua' },
              { label: 'Número', name: 'numero' },
              { label: 'Complemento', name: 'complemento' },
              { label: 'Bairro', name: 'bairro' },
              { label: 'Cidade', name: 'cidade' },
              { label: 'Estado', name: 'estado' },
            ].map(({ label, name, maxLength }) => (
              <div key={name}>
                {errors[name] && <p className="text-red-500 text-sm mb-1">{errors[name]}</p>}
                <input
                  type="text"
                  name={name}
                  value={(formData.endereco as any)[name]}
                  onChange={handleChange}
                  placeholder={label}
                  maxLength={maxLength}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 shadow-md transition px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold w-full sm:w-auto"
          >
            <img src={cadastrarIcon} alt="Cadastrar" className="w-5 h-5" />
            Cadastrar
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 shadow-md transition px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold w-full sm:w-auto"
          >
            <img src={voltarIcon} alt="Voltar" className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
