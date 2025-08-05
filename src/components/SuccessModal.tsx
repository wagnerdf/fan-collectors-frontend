import React from "react";

interface SuccessModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ show, message, onClose }: SuccessModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Sucesso!</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}
