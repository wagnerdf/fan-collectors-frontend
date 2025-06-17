import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cadastrarIcon from '../assets/cadastrar.png';
import voltarIcon from '../assets/voltarHome.png';

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

  // Atualiza os campos conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name in formData.endereco) {
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [name]: value,
        },
      }));

      // Se o CEP for alterado e for menos de 8, limpa os demais campos
      if (name === 'cep') {
        const cleanCep = value.replace(/\D/g, '');
        if (cleanCep.length < 8) {
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
      }

    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Busca dados do CEP
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

  // Validação dos campos obrigatórios
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

  const handleSubmit = () => {
    if (!validate()) return;

    // Remove confirmarSenha antes de enviar
    const { confirmarSenha, ...dataToSubmit } = formData;

    console.log('Dados do formulário:', dataToSubmit);
    alert('Cadastro enviado (ver console).');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Cadastrar novo Fan Colecionador de Mídia
      </h1>

      <div className="bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-2xl space-y-4">
        {[
          { label: 'Nome', name: 'nome' },
          { label: 'Sobrenome', name: 'sobreNome' },
          { label: 'Data de Nascimento', name: 'dataNascimento', type: 'date' },
          { label: 'Sexo', name: 'sexo' },
          { label: 'Telefone', name: 'telefone' },
          { label: 'Email', name: 'email' },
          { label: 'Senha', name: 'senha', type: 'password' },
          { label: 'Confirmar Senha', name: 'confirmarSenha', type: 'password' },
          { label: 'Avatar URL', name: 'avatarUrl' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            {errors[name] && <p className="text-red-500 text-sm mb-1">{errors[name]}</p>}
            <input
              type={type}
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              placeholder={label}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
        ))}

        <hr className="border-gray-600 my-4" />

        <h2 className="text-xl font-semibold mb-2">Endereço</h2>
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
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <img src={cadastrarIcon} alt="Cadastrar" className="w-5 h-5" />
          Cadastrar
        </button>

        <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <img src={voltarIcon} alt="Voltar" className="w-5 h-5" />
          Voltar
        </button>
      </div>
    </div>
  );
}

export default Cadastro;
