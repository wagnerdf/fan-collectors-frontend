import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao fanCollectorsMedia</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Logar
        </button>
        <button
          onClick={() => alert("Cadastro em breve...")}
          className="bg-green-600 px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}

export default Home;
