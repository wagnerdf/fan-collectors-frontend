// components/ErrorModal.tsx
import React from "react";

interface ErrorModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ show, message, onClose }: ErrorModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Erro!</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}
