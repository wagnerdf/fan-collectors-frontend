import React, { useState, useRef, useEffect } from "react";
import { Menu, LogOut, User, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Usuario {
  nome: string;
  email: string;
}

interface TopBarProps {
  onLogout: () => void;
  usuario: Usuario;
}

export function TopBar({ onLogout, usuario }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between bg-gray-900 px-6 py-4 shadow">
      {/* Botão de menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm"
        >
          <Menu className="h-5 w-5" />
          <span className="hidden sm:inline">Opções</span>
        </button>

        {menuOpen && (
          <div
            className="absolute left-0 mt-2 w-60 bg-white text-gray-800 rounded shadow-lg z-50"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="font-semibold">{usuario.nome}</p>
              <p className="text-xs text-gray-500">{usuario.email}</p>
            </div>
            <button
              onClick={() => {
                navigate("/perfil");
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
            >
              <User className="w-4 h-4" />
              Ver perfil
            </button>
            <button
              onClick={() => {
                navigate("/editar-cadastro");
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4" />
              Editar cadastro
            </button>
            <button
              onClick={() => {
                onLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Nome do projeto */}
      <h1 className="text-xl font-bold text-white">fanCollectorsMedia</h1>
    </div>
  );
}
