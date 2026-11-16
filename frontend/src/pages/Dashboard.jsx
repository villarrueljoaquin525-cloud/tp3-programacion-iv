import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

function Dashboard() {
    const { token, usuario } = useAuth();

    const [estadisticas, setEstadisticas] = useState({
        vehiculos: 0,
        conductores: 0,
        viajes: 0,
        kilometros: 0
    });

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const obtenerEstadisticas = async () => {
            try {
                setCargando(true);
                setError('');

                const opciones = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [rVehiculos, rConductores, rViajes] = await Promise.all([
                    fetch(`${API_URL}/vehiculos`, opciones),
                    fetch(`${API_URL}/conductores`, opciones),
                    fetch(`${API_URL}/viajes`, opciones)
                ]);

                const [dVehiculos, dConductores, dViajes] = await Promise.all([
                    rVehiculos.json(),
                    rConductores.json(),
                    rViajes.json()
                ]);

                if (!rVehiculos.ok || !rConductores.ok || !rViajes.ok) {
                    throw new Error('No se pudieron obtener las estadísticas');
                }

                const listaVehiculos = Array.isArray(dVehiculos)
                    ? dVehiculos
                    : dVehiculos.vehiculos || [];

                const listaConductores = Array.isArray(dConductores)
                    ? dConductores
                    : dConductores.conductores || [];

                const listaViajes = Array.isArray(dViajes)
                    ? dViajes
                    : dViajes.viajes || [];

                const totalKilometros = listaViajes.reduce(
                    (total, viaje) => total + Number(viaje.kilometros || 0),
                    0
                );

                setEstadisticas({
                    vehiculos: listaVehiculos.length,
                    conductores: listaConductores.length,
                    viajes: listaViajes.length,
                    kilometros: totalKilometros
                });

            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        if (token) {
            obtenerEstadisticas();
        }
    }, [token]);

    return (
        <div className="dashboard">

            <div className="bienvenida">
                <div>
                    <span className="etiqueta">RESUMEN GENERAL</span>

                    <h1>¡Bienvenido/a, {usuario?.nombre || 'usuario'}!</h1>

                    <p>
                        Desde aquí podés administrar toda la información
                        de tu sistema de transporte.
                    </p>
                </div>

                <div className="dashboard-ilustracion">
                    🚚
                </div>
            </div>

            <h2 className="titulo-seccion">
                Resumen del sistema
            </h2>

            {error && (
                <div className="mensaje-error">
                    {error}
                </div>
            )}

            {cargando ? (
                <p className="sin-registros">
                    Cargando estadísticas...
                </p>
            ) : (
                <div className="estadisticas">

                    <article className="estadistica tarjeta-lila">
                        <span className="estadistica-icono">🚛</span>
                        <div>
                            <p>Vehículos registrados</p>
                            <h3>{estadisticas.vehiculos}</h3>
                        </div>
                    </article>

                    <article className="estadistica tarjeta-rosa">
                        <span className="estadistica-icono">👥</span>
                        <div>
                            <p>Conductores registrados</p>
                            <h3>{estadisticas.conductores}</h3>
                        </div>
                    </article>

                    <article className="estadistica tarjeta-celeste">
                        <span className="estadistica-icono">🗺️</span>
                        <div>
                            <p>Viajes registrados</p>
                            <h3>{estadisticas.viajes}</h3>
                        </div>
                    </article>

                    <article className="estadistica tarjeta-verde">
                        <span className="estadistica-icono">📊</span>
                        <div>
                            <p>Kilómetros recorridos</p>
                            <h3>
                                {estadisticas.kilometros.toLocaleString('es-AR')} km
                            </h3>
                        </div>
                    </article>

                </div>
            )}

            <section className="panel-informacion">
                <h2>Gestión de Transporte</h2>

                <p>
                    Utilizá el menú lateral para registrar vehículos,
                    gestionar conductores, cargar viajes y consultar
                    los historiales de recorridos.
                </p>
            </section>

        </div>
    );
}

export default Dashboard;
