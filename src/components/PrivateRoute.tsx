// src/routes/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("fanCollectorsMediaToken");

  if (!token) {
    console.warn("Acesso negado: usuário não autenticado.");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

