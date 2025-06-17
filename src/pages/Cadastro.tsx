import { useNavigate } from 'react-router-dom';
import cadastrarIcon from '../assets/cadastrar.png';
import voltarIcon from '../assets/voltarHome.png';

function Cadastro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Cadastrar novo Fan Colecionador de Mídia
      </h1>

      <div className="bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-md mb-6">
        {/* Aqui futuramente entrarão os inputs e labels */}
        <p className="text-center text-gray-400">Formulário em construção...</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => alert('Cadastro em breve...')}
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
