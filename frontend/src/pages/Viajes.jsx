import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

const formularioInicial = {
    vehiculo_id: '',
    conductor_id: '',
    fecha_salida: '',
    fecha_llegada: '',
    origen: '',
    destino: '',
    kilometros: '',
    observaciones: ''
};

function Viajes() {
    const { token } = useAuth();

    const [viajes, setViajes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [viajeEditando, setViajeEditando] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const obtenerDatos = async () => {
        try {
            const opciones = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const [respuestaViajes, respuestaVehiculos, respuestaConductores] =
                await Promise.all([
                    fetch(`${API_URL}/viajes`, opciones),
                    fetch(`${API_URL}/vehiculos`, opciones),
                    fetch(`${API_URL}/conductores`, opciones)
                ]);

            const datosViajes = await respuestaViajes.json();
            const datosVehiculos = await respuestaVehiculos.json();
            const datosConductores = await respuestaConductores.json();

            if (!respuestaViajes.ok) {
                throw new Error(datosViajes.mensaje || 'No se pudieron cargar los viajes');
            }

            if (!respuestaVehiculos.ok) {
                throw new Error(datosVehiculos.mensaje || 'No se pudieron cargar los vehículos');
            }

            if (!respuestaConductores.ok) {
                throw new Error(datosConductores.mensaje || 'No se pudieron cargar los conductores');
            }

            setViajes(Array.isArray(datosViajes)
                ? datosViajes
                : datosViajes.viajes || []);

            setVehiculos(Array.isArray(datosVehiculos)
                ? datosVehiculos
                : datosVehiculos.vehiculos || []);

            setConductores(Array.isArray(datosConductores)
                ? datosConductores
                : datosConductores.conductores || []);

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            obtenerDatos();
        }
    }, [token]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const validarFormulario = () => {
        const {
            vehiculo_id,
            conductor_id,
            fecha_salida,
            fecha_llegada,
            origen,
            destino,
            kilometros
        } = formulario;

        if (
            !vehiculo_id ||
            !conductor_id ||
            !fecha_salida ||
            !origen.trim() ||
            !destino.trim() ||
            kilometros === ''
        ) {
            return 'Completá todos los campos obligatorios';
        }

        if (fecha_llegada && fecha_llegada < fecha_salida) {
            return 'La fecha de llegada no puede ser anterior a la salida';
        }

        if (!Number.isFinite(Number(kilometros)) || Number(kilometros) < 0) {
            return 'Los kilómetros deben ser un número válido mayor o igual a cero';
        }

        return '';
    };

    const guardarViaje = async (e) => {
        e.preventDefault();

        setError('');
        setMensaje('');

        const errorValidacion = validarFormulario();

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        const datosViaje = {
            vehiculo_id: Number(formulario.vehiculo_id),
            conductor_id: Number(formulario.conductor_id),
            fecha_salida: formulario.fecha_salida,
            fecha_llegada: formulario.fecha_llegada || null,
            origen: formulario.origen.trim(),
            destino: formulario.destino.trim(),
            kilometros: Number(formulario.kilometros),
            observaciones: formulario.observaciones.trim()
        };

        try {
            setCargando(true);

            const respuesta = await fetch(
                viajeEditando
                    ? `${API_URL}/viajes/${viajeEditando}`
                    : `${API_URL}/viajes`,
                {
                    method: viajeEditando ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(datosViaje)
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo guardar el viaje');
            }

            setMensaje(
                viajeEditando
                    ? 'Viaje actualizado correctamente'
                    : 'Viaje registrado correctamente'
            );

            setFormulario(formularioInicial);
            setViajeEditando(null);

            await obtenerDatos();

        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    const editarViaje = (viaje) => {
        setViajeEditando(viaje.id);

        setFormulario({
            vehiculo_id: String(viaje.vehiculo_id),
            conductor_id: String(viaje.conductor_id),
            fecha_salida: viaje.fecha_salida?.slice(0, 16) || '',
            fecha_llegada: viaje.fecha_llegada?.slice(0, 16) || '',
            origen: viaje.origen || '',
            destino: viaje.destino || '',
            kilometros: viaje.kilometros ?? '',
            observaciones: viaje.observaciones || ''
        });

        setError('');
        setMensaje('');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarViaje = async (id) => {
        if (!window.confirm('¿Estás seguro de que querés eliminar este viaje?')) {
            return;
        }

        setError('');
        setMensaje('');

        try {
            const respuesta = await fetch(`${API_URL}/viajes/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo eliminar el viaje');
            }

            setMensaje('Viaje eliminado correctamente');
            await obtenerDatos();

        } catch (error) {
            setError(error.message);
        }
    };

    const cancelarEdicion = () => {
        setViajeEditando(null);
        setFormulario(formularioInicial);
        setError('');
        setMensaje('');
    };

    const nombreVehiculo = (id) => {
        const vehiculo = vehiculos.find((item) => item.id === id);

        return vehiculo
            ? `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.patente}`
            : `Vehículo ${id}`;
    };

    const nombreConductor = (id) => {
        const conductor = conductores.find((item) => item.id === id);

        return conductor
            ? `${conductor.nombre} ${conductor.apellido}`
            : `Conductor ${id}`;
    };

    const totalKilometros = viajes.reduce(
        (total, viaje) => total + Number(viaje.kilometros || 0),
        0
    );

    return (
        <section className="pagina-crud">

            <div className="encabezado-pagina">
                <div>
                    <span className="etiqueta">ADMINISTRACIÓN</span>
                    <h1>Viajes</h1>
                    <p>Registrá recorridos y consultá los viajes realizados.</p>
                </div>

                <div className="contador-registros">
                    🗺️ {viajes.length} viajes
                </div>
            </div>

            <div className="resumen-viajes">
                <div>
                    <span>Viajes registrados</span>
                    <strong>{viajes.length}</strong>
                </div>

                <div>
                    <span>Kilómetros recorridos</span>
                    <strong>{totalKilometros.toLocaleString('es-AR')} km</strong>
                </div>
            </div>

            <div className="formulario-crud">
                <h2>
                    {viajeEditando ? 'Modificar viaje' : 'Registrar nuevo viaje'}
                </h2>

                <form onSubmit={guardarViaje}>
                    <div className="campos-grid">

                        <div className="campo">
                            <label>Vehículo</label>
                            <select
                                name="vehiculo_id"
                                value={formulario.vehiculo_id}
                                onChange={manejarCambio}
                            >
                                <option value="">Seleccionar vehículo</option>

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
                                name="conductor_id"
                                value={formulario.conductor_id}
                                onChange={manejarCambio}
                            >
                                <option value="">Seleccionar conductor</option>

                                {conductores.map((conductor) => (
                                    <option key={conductor.id} value={conductor.id}>
                                        {conductor.nombre} {conductor.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label>Fecha y hora de salida</label>
                            <input
                                type="datetime-local"
                                name="fecha_salida"
                                value={formulario.fecha_salida}
                                onChange={manejarCambio}
                            />
                        </div>

                        <div className="campo">
                            <label>Fecha y hora de llegada</label>
                            <input
                                type="datetime-local"
                                name="fecha_llegada"
                                value={formulario.fecha_llegada}
                                onChange={manejarCambio}
                            />
                        </div>

                        <div className="campo">
                            <label>Origen</label>
                            <input
                                name="origen"
                                value={formulario.origen}
                                onChange={manejarCambio}
                                placeholder="Ej. La Rioja"
                            />
                        </div>

                        <div className="campo">
                            <label>Destino</label>
                            <input
                                name="destino"
                                value={formulario.destino}
                                onChange={manejarCambio}
                                placeholder="Ej. Córdoba"
                            />
                        </div>

                        <div className="campo">
                            <label>Kilómetros recorridos</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="kilometros"
                                value={formulario.kilometros}
                                onChange={manejarCambio}
                                placeholder="Ej. 450"
                            />
                        </div>

                        <div className="campo">
                            <label>Observaciones</label>
                            <input
                                name="observaciones"
                                value={formulario.observaciones}
                                onChange={manejarCambio}
                                placeholder="Información adicional"
                            />
                        </div>

                    </div>

                    {error && <div className="mensaje-error">{error}</div>}
                    {mensaje && <div className="mensaje-exito">{mensaje}</div>}

                    <div className="acciones-formulario">
                        <button
                            type="submit"
                            className="boton-guardar"
                            disabled={cargando}
                        >
                            {cargando
                                ? 'Guardando...'
                                : viajeEditando
                                    ? 'Guardar cambios'
                                    : 'Registrar viaje'}
                        </button>

                        {viajeEditando && (
                            <button
                                type="button"
                                className="boton-cancelar"
                                onClick={cancelarEdicion}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="tabla-contenedor">
                <div className="tabla-encabezado">
                    <h2>Historial de viajes</h2>
                </div>

                {viajes.length === 0 ? (
                    <p className="sin-registros">No hay viajes registrados.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla-datos">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Vehículo</th>
                                    <th>Conductor</th>
                                    <th>Salida</th>
                                    <th>Llegada</th>
                                    <th>Origen</th>
                                    <th>Destino</th>
                                    <th>Kilómetros</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {viajes.map((viaje) => (
                                    <tr key={viaje.id}>
                                        <td>{viaje.id}</td>
                                        <td>{nombreVehiculo(viaje.vehiculo_id)}</td>
                                        <td>{nombreConductor(viaje.conductor_id)}</td>
                                        <td>{viaje.fecha_salida?.replace('T', ' ').slice(0, 16)}</td>
                                        <td>{viaje.fecha_llegada?.replace('T', ' ').slice(0, 16) || 'Pendiente'}</td>
                                        <td>{viaje.origen}</td>
                                        <td>{viaje.destino}</td>
                                        <td>{viaje.kilometros} km</td>
                                        <td>
                                            <div className="acciones-tabla">
                                                <button
                                                    className="boton-editar"
                                                    onClick={() => editarViaje(viaje)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="boton-eliminar"
                                                    onClick={() => eliminarViaje(viaje.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </section>
    );
}

export default Viajes;
