import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const validarFormulario = () => {
        if (!email.trim() || !password.trim()) {
            return 'Todos los campos son obligatorios';
        }

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email)) {
            return 'Ingresá un correo electrónico válido';
        }

        return '';
    };

    const manejarLogin = async (e) => {
        e.preventDefault();
        setError('');

        const errorValidacion = validarFormulario();

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        try {
            setCargando(true);

            await login(email.trim(), password);

            navigate('/dashboard');

        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="pagina-login">
            <section className="login-imagen">
                <div className="login-ilustracion">
                    <span>🚚</span>
                </div>

                <h1>Gestión de Transporte</h1>

                <p>
                    Organizá tus vehículos, conductores y viajes
                    desde un solo lugar.
                </p>
            </section>

            <section className="login-formulario">
                <div className="login-contenido">
                    <Link to="/" className="volver-inicio">
                        ← Volver al inicio
                    </Link>

                    <span className="login-etiqueta">
                        BIENVENIDO/A
                    </span>

                    <h2>Iniciar sesión</h2>

                    <p className="login-descripcion">
                        Ingresá tus datos para acceder al sistema.
                    </p>

                    <form onSubmit={manejarLogin}>
                        <div className="campo">
                            <label htmlFor="email">Correo electrónico</label>

                            <input
                                id="email"
                                type="email"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="password">Contraseña</label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Ingresá tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="mensaje-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="boton-ingresar"
                            disabled={cargando}
                        >
                            {cargando ? 'Ingresando...' : 'Ingresar al sistema'}
                        </button>
                    </form>

                    <p className="login-pie">
                        Gestión de Transporte © 2026
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Login;
