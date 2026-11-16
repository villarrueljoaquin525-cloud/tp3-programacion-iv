import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

function Historial() {
    const { token } = useAuth();

    const [viajes, setViajes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [filtroVehiculo, setFiltroVehiculo] = useState('');
    const [filtroConductor, setFiltroConductor] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const opciones = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [rViajes, rVehiculos, rConductores] = await Promise.all([
                    fetch(`${API_URL}/viajes`, opciones),
                    fetch(`${API_URL}/vehiculos`, opciones),
                    fetch(`${API_URL}/conductores`, opciones)
                ]);

                const [dViajes, dVehiculos, dConductores] = await Promise.all([
                    rViajes.json(),
                    rVehiculos.json(),
                    rConductores.json()
                ]);

                if (!rViajes.ok || !rVehiculos.ok || !rConductores.ok) {
                    throw new Error('No se pudo cargar la información del historial');
                }

                setViajes(Array.isArray(dViajes) ? dViajes : dViajes.viajes || []);
                setVehiculos(Array.isArray(dVehiculos) ? dVehiculos : dVehiculos.vehiculos || []);
                setConductores(Array.isArray(dConductores) ? dConductores : dConductores.conductores || []);

            } catch (error) {
                setError(error.message);
            }
        };

        if (token) obtenerDatos();
    }, [token]);

    const viajesFiltrados = viajes.filter((viaje) => {
        const coincideVehiculo = !filtroVehiculo ||
            String(viaje.vehiculo_id) === filtroVehiculo;

        const coincideConductor = !filtroConductor ||
            String(viaje.conductor_id) === filtroConductor;

        return coincideVehiculo && coincideConductor;
    });

    const totalKilometros = viajesFiltrados.reduce(
        (total, viaje) => total + Number(viaje.kilometros || 0),
        0
    );

    const limpiarFiltros = () => {
        setFiltroVehiculo('');
        setFiltroConductor('');
    };

    return (
        <section className="pagina-crud">

            <div className="encabezado-pagina">
                <div>
                    <span className="etiqueta">CONSULTAS</span>
                    <h1>Historial de viajes</h1>
                    <p>Consultá los recorridos realizados y sus kilómetros.</p>
                </div>
            </div>

            <div className="formulario-crud">
                <h2>Filtrar viajes</h2>

                <div className="campos-grid">
                    <div className="campo">
                        <label>Vehículo</label>
                        <select
                            value={filtroVehiculo}
                            onChange={(e) => setFiltroVehiculo(e.target.value)}
                        >
                            <option value="">Todos los vehículos</option>

                            {vehiculos.map((vehiculo) => (
                                <option key={vehiculo.id} value={vehiculo.id}>
                                    {vehiculo.marca} {vehiculo.modelo} - {vehiculo.patente}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo">
                        <label>Conductor</label>
                        <select
                            value={filtroConductor}
                            onChange={(e) => setFiltroConductor(e.target.value)}
                        >
                            <option value="">Todos los conductores</option>

                            {conductores.map((conductor) => (
                                <option key={conductor.id} value={conductor.id}>
                                    {conductor.nombre} {conductor.apellido}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="button"
                    className="boton-cancelar"
                    onClick={limpiarFiltros}
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="resumen-viajes">
                <div>
                    <span>Viajes encontrados</span>
                    <strong>{viajesFiltrados.length}</strong>
                </div>

                <div>
                    <span>Total de kilómetros</span>
                    <strong>{totalKilometros.toLocaleString('es-AR')} km</strong>
                </div>
            </div>

            {error && <div className="mensaje-error">{error}</div>}

            <div className="tabla-contenedor">
                <h2 className="titulo-seccion">Detalle de recorridos</h2>

                {viajesFiltrados.length === 0 ? (
                    <p className="sin-registros">
                        No se encontraron viajes para los filtros seleccionados.
                    </p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla-datos">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Vehículo</th>
                                    <th>Conductor</th>
                                    <th>Origen</th>
                                    <th>Destino</th>
                                    <th>Fecha de salida</th>
                                    <th>Kilómetros</th>
                                </tr>
                            </thead>

                            <tbody>
                                {viajesFiltrados.map((viaje) => {
                                    const vehiculo = vehiculos.find(
                                        (v) => v.id === viaje.vehiculo_id
                                    );

                                    const conductor = conductores.find(
                                        (c) => c.id === viaje.conductor_id
                                    );

                                    return (
                                        <tr key={viaje.id}>
                                            <td>{viaje.id}</td>
                                            <td>
                                                {vehiculo
                                                    ? `${vehiculo.marca} ${vehiculo.modelo}`
                                                    : `Vehículo ${viaje.vehiculo_id}`}
                                            </td>
                                            <td>
                                                {conductor
                                                    ? `${conductor.nombre} ${conductor.apellido}`
                                                    : `Conductor ${viaje.conductor_id}`}
                                            </td>
                                            <td>{viaje.origen}</td>
                                            <td>{viaje.destino}</td>
                                            <td>
                                                {viaje.fecha_salida?.replace('T', ' ').slice(0, 16)}
                                            </td>
                                            <td>{viaje.kilometros} km</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </section>
    );
}

export default Historial;
