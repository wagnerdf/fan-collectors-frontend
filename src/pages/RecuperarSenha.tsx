import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      await api.post('/auth/recuperar-senha', { email });
      setMensagem('Se este email existir, enviaremos instruções de recuperação.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao enviar solicitação.';
      setErro(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Recuperar Senha</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 mb-4"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {mensagem && <p className="text-green-400 text-sm mb-2">{mensagem}</p>}
          {erro && <p className="text-red-400 text-sm mb-2">{erro}</p>}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full py-3 rounded-lg font-semibold"
            >
              Enviar instruções
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 w-full py-3 rounded-lg font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenha;

