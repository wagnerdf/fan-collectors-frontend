import React, { useState, useRef } from "react";

interface PixModalProps {
  open: boolean;
  onClose: () => void;
}

export function PixModal({ open, onClose }: PixModalProps) {
  const [copied, setCopied] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  if (!open) return null;

  const pixCode =
    "00020126570014br.gov.bcb.pix0128wagnerandrade_df@hotmail.com0203Pix5204000053039865802BR5925WAGNER AUGUSTO DE ANDRADE6008BRASILIA62170513FanCollectors6304A908";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* 
  const handleCopyImage = async () => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        // @ts-ignore
        await navigator.clipboard.write([
          new window.ClipboardItem({ [blob.type]: blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Erro ao copiar imagem:", err);
      }
    });
  };
  */

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-500 p-6 rounded shadow-lg max-w-xs w-full text-center">
        <h2 className="text-xl font-bold mb-4">Faça um Pix para apoiar</h2>
        <img
          ref={imgRef}
          src="/pix-doacao.jpg"
          alt="QRCode Pix"
          className="mx-auto mb-4"
        />

        {/* Botão para copiar código Pix */}
        <button
          onClick={handleCopyCode}
          className="mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
        >
          {copied ? "Código copiado!" : "Copiar código Pix"}
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 w-full"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
