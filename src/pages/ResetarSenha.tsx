import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ResetarSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenUrl = params.get('token');
    if (tokenUrl) {
      setToken(tokenUrl);
    } else {
      setErro('Token inválido ou ausente.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    try {
      const response = await api.post('/auth/resetar-senha', {
        token,
        novaSenha,
      });
      setMensagem(response.data);
    } catch (err: any) {
      const msg = err.response?.data || 'Erro ao redefinir a senha.';
      setErro(typeof msg === 'string' ? msg : msg.mensagem);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6">Redefinir Senha</h2>

        {erro && <p className="text-red-500 mb-4 text-sm">{erro}</p>}

        {mensagem ? (
            <div className="text-center">
                <p className="text-green-400 mb-6 text-sm">{mensagem}</p>
                <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold shadow-md transition"
                >
                Voltar para Home
                </button>
            </div>
            ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="novaSenha" className="block mb-2 font-medium text-gray-300">Nova Senha</label>
              <input
                type="password"
                id="novaSenha"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform focus:scale-105"
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold shadow-md transition"
              >
                Redefinir Senha
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold shadow-md transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetarSenha;
