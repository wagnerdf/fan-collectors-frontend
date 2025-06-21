import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('fanCollectorsMediaToken');

    if (!token) {
      toast.warn('Sessão expirada. Faça login novamente.', {
        position: 'top-center',
        autoClose: 5000,
      });

      setTimeout(() => {
        setRedirect(true);
      }, 100); // Pequeno atraso para o toast ser renderizado antes do redirecionamento
    }
  }, []);

  if (redirect) {
    return <Navigate to="/login" />;
  }

  const token = localStorage.getItem('fanCollectorsMediaToken');
  return token ? children : null; // Enquanto espera o setRedirect, retorna null (sem renderizar nada)
}

export default PrivateRoute;