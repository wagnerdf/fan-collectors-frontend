import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginIcon from '../assets/login.png';
import voltarIcon from '../assets/voltarHome.png';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState(() => sessionStorage.getItem('loginEmail') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const navigate = useNavigate();
  const { login, token } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("expired") === "true") {
      setSessionExpired(true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('loginEmail', email);
  }, [email]);

  useEffect(() => {
    const savedError = sessionStorage.getItem('loginError');
    if (savedError) {
      setError(savedError);
      sessionStorage.removeItem('loginError');
    }
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/perfil");
    }
  }, [token, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTitle(true), 200);
    return () => clearTimeout(timer);
  }, []);

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

      if (!token) {
        setError('Token inválido recebido do servidor.');
        return;
      }

      login(token);
      sessionStorage.removeItem('loginEmail');
      setMensagem('Login realizado com sucesso!');
      navigate('/perfil');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Erro desconhecido';
      setError(msg);
      sessionStorage.setItem('loginError', msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-center justify-center transition-colors duration-700">
      <div className="bg-gray-900 bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div
          className={`flex flex-col items-center gap-3 mb-8 opacity-0 transform transition-all duration-700 ease-in-out ${
            showTitle ? 'opacity-100 translate-y-0' : 'translate-y-2'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-blue-400 drop-shadow-md"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
            <circle cx="12" cy="16" r="1" />
            <line x1="12" y1="17" x2="12" y2="19" />
          </svg>
          <h2 className="text-4xl font-bold drop-shadow-sm">Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform focus:scale-105"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium text-gray-300">Senha</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform focus:scale-105"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-2 text-right">
            <span
              onClick={() => navigate('/recuperar-senha')}
              className="text-sm text-blue-400 hover:underline cursor-pointer"
            >
              Recuperar senha
            </span>
          </div>

          {sessionExpired && (
            <p className="text-yellow-400 mb-4 text-sm">
              Sua sessão expirou. Faça login novamente.
            </p>
          )}

          {mensagem && <p className="text-green-400 mb-4 text-sm">{mensagem}</p>}
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 shadow-md transition px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full font-semibold"
            >
              <img src={loginIcon} alt="Login" className="w-5 h-5" />
              Entrar
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 shadow-md transition px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full font-semibold"
            >
              <img src={voltarIcon} alt="Voltar" className="w-5 h-5" />
              Voltar
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Ainda não tem uma conta?{' '}
            <span
              onClick={() => navigate('/cadastro')}
              className="text-blue-400 hover:underline cursor-pointer font-medium"
            >
              Cadastre-se
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login;
