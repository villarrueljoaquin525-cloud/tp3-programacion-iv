import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaProtegida() {
    const { autenticado } = useAuth();

    return autenticado
        ? <Outlet />
        : <Navigate to="/login" replace />;
}

export default RutaProtegida;
