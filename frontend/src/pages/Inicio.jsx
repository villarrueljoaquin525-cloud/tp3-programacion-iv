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
                    <span className="etiqueta">GESTIÓN Y ORGANIZACIÓN</span>

                    <h1>
                        Todo tu transporte,
                        en un solo lugar.
                    </h1>

                    <p>
                        Administrá vehículos, conductores y viajes
                        de manera sencilla. Controlá recorridos,
                        historiales y kilómetros desde un solo sistema.
                    </p>

                    <Link to="/login" className="boton-principal">
                        Ingresar al sistema →
                    </Link>
                </div>

                <div className="hero-imagen">
                    <div className="circulo-decorativo"></div>
                    <span className="camion">🚚</span>
                    <span className="decoracion decoracion-uno">✦</span>
                    <span className="decoracion decoracion-dos">✧</span>
                </div>
            </section>

            <section className="caracteristicas">
                <article className="tarjeta-caracteristica">
                    <span>🚛</span>
                    <h3>Vehículos</h3>
                    <p>Registrá y administrá los vehículos.</p>
                </article>

                <article className="tarjeta-caracteristica">
                    <span>👥</span>
                    <h3>Conductores</h3>
                    <p>Organizá la información de los conductores.</p>
                </article>

                <article className="tarjeta-caracteristica">
                    <span>🗺️</span>
                    <h3>Viajes</h3>
                    <p>Controlá recorridos y kilómetros realizados.</p>
                </article>
            </section>

            <footer className="footer-publico">
                Gestión de Transporte © 2026
            </footer>
        </main>
    );
}

export default Inicio;
