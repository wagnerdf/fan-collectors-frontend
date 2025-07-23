import React, { useState } from "react";
import { MidiaForm } from "../components/MidiaForm"; // ajuste o caminho se necessário

export function MidiaManager() {
  const [abaAtiva, setAbaAtiva] = useState<"cadastrar" | "editar" | "excluir">("cadastrar");

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
          <p>Funcionalidade de edição de mídia será aqui.</p>
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
