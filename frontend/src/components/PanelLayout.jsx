import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PanelLayout() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const cerrarSesion = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="panel-layout">

            <aside className="sidebar">
                <div className="sidebar-logo">
                    <span>🚚</span>
                    <h2>Gestión de<br />Transporte</h2>
                </div>

                <p className="menu-titulo">MENÚ PRINCIPAL</p>

                <nav className="sidebar-menu">
                    <NavLink to="/dashboard" end>
                        <span>▦</span> Inicio
                    </NavLink>

                    <NavLink to="/vehiculos">
                        <span>🚛</span> Vehículos
                    </NavLink>

                    <NavLink to="/conductores">
                        <span>👥</span> Conductores
                    </NavLink>

                    <NavLink to="/viajes">
                        <span>🗺️</span> Viajes
                    </NavLink>
                    <NavLink to="/historial">
                        <span>📋</span> Historial
                    </NavLink>
                </nav>

                <button className="boton-cerrar" onClick={cerrarSesion}>
                    <span>↪</span> Cerrar sesión
                </button>
            </aside>

            <div className="panel-contenido">
                <header className="barra-superior">
                    <div>
                        <h3>Panel administrativo</h3>
                        <p>Gestión de Transporte</p>
                    </div>

                    <div className="usuario-panel">
                        <div className="avatar">
                            {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        <span>{usuario?.nombre || 'Usuario'}</span>
                    </div>
                </header>

                <main className="contenido-principal">
                    <Outlet />
                </main>
            </div>

        </div>
    );
}

export default PanelLayout;
