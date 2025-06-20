export default function Feed() {
  // No futuro isso virá da API
  const mockColecoes = [
    { id: 1, dono: "João", titulo: "Coleção de HQs", isAmigo: true },
    { id: 2, dono: "Você", titulo: "Coleção de Games Raros", isAmigo: false },
  ];

  return (
    <div className="flex-1 bg-gray-800 text-white p-4 space-y-4">
      {mockColecoes.map((colecao) => (
        <div
          key={colecao.id}
          className="bg-gray-900 p-4 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold">{colecao.titulo}</h3>
          <p className="text-sm text-gray-400">de {colecao.dono}</p>

          <div className="mt-2">
            {colecao.isAmigo ? (
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                Ver Detalhes
              </button>
            ) : (
              <>
                <button className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 mr-2 rounded text-sm">
                  Editar
                </button>
                <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
