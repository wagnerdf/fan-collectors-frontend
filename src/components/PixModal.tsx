import React from "react";

interface PixModalProps {
  open: boolean;
  onClose: () => void;
}

export function PixModal({ open, onClose }: PixModalProps) {
  if (!open) return null;

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">



    <div className="bg-gray-500 p-6 rounded shadow-lg max-w-xs w-full text-center">
        <h2 className="text-xl font-bold mb-4">Faça um Pix para apoiar</h2>
        <img src="/pix-doacao.jpg" alt="QRCode Pix" className="mx-auto" />
        <button
        onClick={onClose}
        className="mt-6 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
        >
        Fechar
        </button>
    </div>
    </div>
  );
}
