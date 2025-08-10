import React, { useState } from "react";
import { MidiaForm } from "../components/MidiaForm"; // ajuste o caminho se necessário

export function MidiaManager() {
  const [abaAtiva, setAbaAtiva] = useState<"cadastrar" | "editar" | "excluir">("cadastrar");
  const [buscaMidia, setBuscaMidia] = useState("");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gerenciar Mídias</h2>

      {/* Abas */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            abaAtiva === "cadastrar" ? "bg-blue-800 text-white" : "bg-gray-400"
          }`}
          onClick={() => setAbaAtiva("cadastrar")}
        >
          Cadastrar
        </button>
        <button
          className={`px-4 py-2 rounded ${
            abaAtiva === "editar" ? "bg-blue-800 text-white" : "bg-gray-400"
          }`}
          onClick={() => setAbaAtiva("editar")}
        >
          Editar
        </button>
        <button
          className={`px-4 py-2 rounded ${
            abaAtiva === "excluir" ? "bg-blue-800 text-white" : "bg-gray-400"
          }`}
          onClick={() => setAbaAtiva("excluir")}
        >
          Excluir
        </button>
      </div>

      {/* Conteúdo das abas */}
      {abaAtiva === "cadastrar" && (
        <div>
          <MidiaForm />
        </div>
      )}

      {abaAtiva === "editar" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Buscar Mídia para Edição</h3>
          <input
            type="text"
            value={buscaMidia}
            onChange={(e) => setBuscaMidia(e.target.value)}
            placeholder="Digite o nome da mídia..."
            className="border border-gray-400 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:border-blue-500 text-black"
          />
          {/* Área futura onde listaremos resultados */}
          <div className="text-gray-600 italic">
            Resultados da busca aparecerão aqui...
          </div>
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
