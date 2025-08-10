import React, { useState } from "react";
import { MidiaForm } from "../components/MidiaForm"; 
import { MidiaFormFilmeSerie } from "../components/MidiaFormFilmeSerie";

export function MidiaManager() {
  const [abaAtiva, setAbaAtiva] = useState<"cadastrar" | "editar" | "excluir">("cadastrar");
  const [buscaMidia, setBuscaMidia] = useState("");
  const [midiaEncontrada, setMidiaEncontrada] = useState<any>(null);
  const [tipoMidia, setTipoMidia] = useState<string | null>(null);

  // Simulação de busca (mock)
  const handleBuscarMidia = () => {
    // Aqui depois faremos chamada ao backend
    const mock = {
      midia_tipo: "Filme/Série",
      titulo_original: "The Matrix",
      ano_lancamento: 1999,
      artista_diretor: "Lana Wachowski, Lilly Wachowski",
      sinopse: "Um hacker descobre a verdade sobre a realidade."
    };
    setMidiaEncontrada(mock);
    setTipoMidia(mock.midia_tipo);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gerenciar Mídias</h2>

      {/* Abas */}
      <div className="flex space-x-4 mb-6">
        {["cadastrar", "editar", "excluir"].map((aba) => (
          <button
            key={aba}
            className={`px-4 py-2 rounded ${
              abaAtiva === aba ? "bg-blue-800 text-white" : "bg-gray-400"
            }`}
            onClick={() => setAbaAtiva(aba as typeof abaAtiva)}
          >
            {aba.charAt(0).toUpperCase() + aba.slice(1)}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {abaAtiva === "cadastrar" && (
        <div>
          <MidiaForm />
        </div>
      )}

      {abaAtiva === "editar" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Buscar Mídia para Edição</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={buscaMidia}
              onChange={(e) => setBuscaMidia(e.target.value)}
              placeholder="Digite o nome da mídia..."
              className="border border-gray-400 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500 text-black"
            />
            <button
              onClick={handleBuscarMidia}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </div>

          {midiaEncontrada && (
            <>
              {tipoMidia === "Filme/Série" && (
                <MidiaFormFilmeSerie dados={midiaEncontrada} />
              )}
              {tipoMidia === "Jogo" && (
                <p>Formulário específico para Jogos (a implementar)</p>
              )}
              {tipoMidia === "Música" && (
                <p>Formulário específico para Música (a implementar)</p>
              )}
            </>
          )}
        </div>
      )}

      {abaAtiva === "excluir" && (
        <div>
          <p>Funcionalidade de exclusão de mídia será aqui.</p>
        </div>
      )}
    </div>
  );
}
