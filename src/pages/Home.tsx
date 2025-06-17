import { useNavigate } from 'react-router-dom';
import amigos from '../assets/amigos.png';
import loginIcon from '../assets/login.png';
import cadastrarIcon from '../assets/cadastrar.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <img
        src={amigos}
        alt="Logo"
        className="w-80 mb-6 rounded-xl shadow-lg object-contain"
      />

      <h1 className="text-4xl font-bold mb-4 text-center">
        Bem-vindo ao FanCollectorsMedia
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Conecte-se com fãs como você, compartilhe sua coleção e descubra novas mídias para amar.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg flex items-center gap-3"
        >
          <img src={loginIcon} alt="Login" className="w-7 h-7" />
          Logar
        </button>

        <button
          onClick={() => alert('Cadastro em breve...')}
          className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg flex items-center gap-3"
        >
          <img src={cadastrarIcon} alt="Cadastrar" className="w-7 h-7" />
          Cadastrar
        </button>
      </div>
    </div>
  );
}

export default Home;
