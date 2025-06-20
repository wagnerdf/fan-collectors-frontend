import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('fanCollectorsMediaToken');
  console.log('Token em PrivateRoute:', token);
  return token ? children : <Navigate to="/" />;
}

export default PrivateRoute;
