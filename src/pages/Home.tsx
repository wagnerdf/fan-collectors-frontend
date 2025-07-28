import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import amigos from '../assets/amigos.png';
import loginIcon from '../assets/login.png';
import cadastrarIcon from '../assets/cadastrar.png';

function Home() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-center justify-center transition-colors duration-700">
      <div className="bg-gray-900 bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 text-center">
        <div
          className={`flex flex-col items-center gap-3 mb-8 opacity-0 transform transition-all duration-700 ease-in-out ${
            showContent ? 'opacity-100 translate-y-0' : 'translate-y-2'
          }`}
        >
          <img
            src={amigos}
            alt="Logo"
            className="w-52 rounded-xl shadow-md object-contain"
          />

          <h1 className="text-4xl font-bold drop-shadow-sm mt-4">
            Bem-vindo ao FanCollectorsMedia
          </h1>

          <p className="text-gray-400 text-center max-w-md mt-2">
            Conecte-se com fãs como você, compartilhe sua coleção e descubra novas mídias para amar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (token) {
                navigate('/perfil');
              } else {
                navigate('/login');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 shadow-md transition px-6 py-3 rounded-lg flex items-center justify-center gap-3 w-full font-semibold"
          >
            <img src={loginIcon} alt="Login" className="w-6 h-6" />
            Logar
          </button>

          <button
            onClick={() => navigate('/cadastro')}
            className="bg-green-600 hover:bg-green-700 shadow-md transition px-6 py-3 rounded-lg flex items-center justify-center gap-3 w-full font-semibold"
          >
            <img src={cadastrarIcon} alt="Cadastrar" className="w-6 h-6" />
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
