import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginIcon from '../assets/login.png';
import voltarIcon from '../assets/voltarHome.png';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensagem('');

    try {
      const response = await api.post('/auth/login', {
        login: email,
        senha: password,
      });

      const { token } = response.data;
      localStorage.setItem('fanCollectorsMediaToken', token);
      setMensagem('Login realizado com sucesso!');
      localStorage.setItem('fanCollectorsMediaToken', token);
      localStorage.setItem("token", response.data.token);
      navigate('/perfil');
    } catch (err: any) {
      setError(
        err.response?.data?.mensagem ||
        err.message ||
        'Erro desconhecido'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">Senha</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mensagem && <p className="text-green-400 mb-4">{mensagem}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded flex items-center justify-center gap-2 w-full"
            >
              <img src={loginIcon} alt="Login" className="w-5 h-5" />
              Entrar
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 transition px-6 py-2 rounded flex items-center justify-center gap-2 w-full"
            >
              <img src={voltarIcon} alt="Voltar" className="w-5 h-5" />
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
