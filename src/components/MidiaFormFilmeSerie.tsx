import React from "react";

export function MidiaFormFilmeSerie({ dados }: { dados: any }) {
  return (
    <form className="space-y-4">
      <div>
        <label className="block font-medium">Título Original</label>
        <input
          type="text"
          defaultValue={dados?.titulo_original || ""}
          className="border border-gray-400 rounded px-3 py-2 w-full text-black"
        />
      </div>

      <div>
        <label className="block font-medium">Ano de Lançamento</label>
        <input
          type="number"
          defaultValue={dados?.ano_lancamento || ""}
          className="border border-gray-400 rounded px-3 py-2 w-full text-black"
        />
      </div>

      <div>
        <label className="block font-medium">Diretor</label>
        <input
          type="text"
          defaultValue={dados?.artista_diretor || ""}
          className="border border-gray-400 rounded px-3 py-2 w-full text-black"
        />
      </div>

      <div>
        <label className="block font-medium">Sinopse</label>
        <textarea
          defaultValue={dados?.sinopse || ""}
          className="border border-gray-400 rounded px-3 py-2 w-full text-black"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-800 text-white px-4 py-2 rounded"
      >
        Salvar Alterações
      </button>
    </form>
  );
}
