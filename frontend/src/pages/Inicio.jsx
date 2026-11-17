
import { Link } from 'react-router-dom';

function Inicio() {
    return (
        <main className="pagina-inicio">

            <nav className="nav-publica">
                <h2>Gestión de Transporte</h2>

                <Link to="/login" className="boton-login">
                    Iniciar sesión
                </Link>
            </nav>

            <section className="hero">
                <div className="hero-contenido">

                    <span className="etiqueta">
                        GESTIÓN Y ORGANIZACIÓN
                    </span>

                    <h1>
                        Organizá, gestioná y optimizá cada recorrido
                    </h1>

                    <p>
                        Administrá vehículos, coordiná conductores y
                        supervisá cada viaje con información centralizada
                        desde una sola plataforma.
                    </p>

                    <Link to="/login" className="boton-principal">
                        Ingresar al sistema →
                    </Link>

                </div>
            </section>

            <section className="caracteristicas">

                <article className="tarjeta-caracteristica">
                    <h3>Vehículos</h3>
                    <p>
                        Registrá y administrá tu flota de vehículos,
                        manteniendo toda la información organizada.
                    </p>
                </article>

                <article className="tarjeta-caracteristica">
                    <h3>Conductores</h3>
                    <p>
                        Gestioná los datos personales y la información
                        de licencias de cada conductor.
                    </p>
                </article>

                <article className="tarjeta-caracteristica">
                    <h3>Viajes</h3>
                    <p>
                        Registrá recorridos, consultá historiales
                        y controlá los kilómetros realizados.
                    </p>
                </article>

            </section>

            <footer className="footer-publico">
                Gestión de Transporte © 2026
            </footer>

        </main>
    );
}

export default Inicio;
