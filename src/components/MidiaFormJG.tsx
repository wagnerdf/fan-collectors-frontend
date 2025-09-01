import React from "react";

type MidiaFormJogosGamesProps = {
  pesquisa: string;
  onPesquisaChange: React.Dispatch<React.SetStateAction<string>>;
};

export function MidiaFormJG({ pesquisa, onPesquisaChange }: MidiaFormJogosGamesProps) {
  return (
    <div className="flex-1">
      <label className="block mb-1 font-medium text-gray-200">Buscar título</label>
      <input
        type="text"
        value={pesquisa}
        onChange={(e) => onPesquisaChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="Digite para buscar na nova API de games..."
      />
    </div>
  );
}
