import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      const response = await api.post('/auth/recuperar-senha', { email });
      setMensagem(response.data);
    } catch (err: any) {
      const msg = err.response?.data || 'Erro ao solicitar redefinição de senha.';
      setErro(typeof msg === 'string' ? msg : msg.mensagem);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className={`bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700 transition-all duration-500 ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <h2 className="text-3xl font-bold text-center mb-6">Recuperar Senha</h2>

        {erro && <p className="text-red-500 mb-4 text-sm text-center">{erro}</p>}
        {mensagem ? (
          <div className="text-center space-y-6">
            <p className="text-green-400 text-sm">{mensagem}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Voltar para Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform focus:scale-105"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold shadow-md transition"
              >
                Enviar link de redefinição
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold shadow-md transition"
              >
                Cancelar
              </button>
            </div>

            <p className="text-sm text-gray-400 text-center mt-6">
              Lembrou sua senha?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:underline cursor-pointer font-medium"
              >
                Voltar para login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default RecuperarSenha;
