import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api/vehiculos';

const formularioInicial = {
    marca: '',
    modelo: '',
    patente: '',
    anio: '',
    capacidad_carga: ''
};

function Vehiculos() {
    const { token } = useAuth();

    const [vehiculos, setVehiculos] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [vehiculoEditando, setVehiculoEditando] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const obtenerVehiculos = async () => {
        try {
            const respuesta = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudieron cargar los vehículos');
            }

            const lista = Array.isArray(datos)
                ? datos
                : datos.vehiculos || [];

            setVehiculos(lista);

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            obtenerVehiculos();
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
        const { marca, modelo, patente, anio, capacidad_carga } = formulario;

        if (!marca.trim() || !modelo.trim() || !patente.trim() ||
            !anio || !capacidad_carga) {
            return 'Todos los campos son obligatorios';
        }

        const anioActual = new Date().getFullYear();

        if (!Number.isInteger(Number(anio)) ||
            Number(anio) < 1900 || Number(anio) > 2155) {
            return 'Ingresá un año válido';
        }

        if (Number(anio) > anioActual) {
            return 'El año no puede ser posterior al año actual';
        }

        if (!Number.isFinite(Number(capacidad_carga)) ||
            Number(capacidad_carga) <= 0) {
            return 'La capacidad de carga debe ser mayor a cero';
        }

        return '';
    };

    const guardarVehiculo = async (e) => {
        e.preventDefault();

        setError('');
        setMensaje('');

        const errorValidacion = validarFormulario();

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        const datosVehiculo = {
            marca: formulario.marca.trim(),
            modelo: formulario.modelo.trim(),
            patente: formulario.patente.trim().toUpperCase(),
            anio: Number(formulario.anio),
            capacidad_carga: Number(formulario.capacidad_carga)
        };

        try {
            setCargando(true);

            const respuesta = await fetch(
                vehiculoEditando
                    ? `${API_URL}/${vehiculoEditando}`
                    : API_URL,
                {
                    method: vehiculoEditando ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(datosVehiculo)
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo guardar el vehículo');
            }

            setMensaje(
                vehiculoEditando
                    ? 'Vehículo actualizado correctamente'
                    : 'Vehículo registrado correctamente'
            );

            setFormulario(formularioInicial);
            setVehiculoEditando(null);

            await obtenerVehiculos();

        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    const editarVehiculo = (vehiculo) => {
        setVehiculoEditando(vehiculo.id);

        setFormulario({
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            patente: vehiculo.patente,
            anio: vehiculo.anio,
            capacidad_carga: vehiculo.capacidad_carga
        });

        setError('');
        setMensaje('');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarVehiculo = async (id) => {
        const confirmar = window.confirm(
            '¿Estás seguro de que querés eliminar este vehículo?'
        );

        if (!confirmar) return;

        setError('');
        setMensaje('');

        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo eliminar el vehículo');
            }

            setMensaje('Vehículo eliminado correctamente');
            await obtenerVehiculos();

        } catch (error) {
            setError(error.message);
        }
    };

    const cancelarEdicion = () => {
        setVehiculoEditando(null);
        setFormulario(formularioInicial);
        setError('');
    };

    return (
        <section className="pagina-crud">

            <div className="encabezado-pagina">
                <div>
                    <span className="etiqueta">ADMINISTRACIÓN</span>
                    <h1>Vehículos</h1>
                    <p>Registrá y administrá los vehículos de transporte.</p>
                </div>

                <div className="contador-registros">
                    🚛 {vehiculos.length} vehículos
                </div>
            </div>

            <div className="formulario-crud">
                <h2>
                    {vehiculoEditando ? 'Modificar vehículo' : 'Registrar vehículo'}
                </h2>

                <form onSubmit={guardarVehiculo}>
                    <div className="campos-grid">

                        <div className="campo">
                            <label>Marca</label>
                            <input
                                name="marca"
                                value={formulario.marca}
                                onChange={manejarCambio}
                                placeholder="Ej. Mercedes Benz"
                            />
                        </div>

                        <div className="campo">
                            <label>Modelo</label>
                            <input
                                name="modelo"
                                value={formulario.modelo}
                                onChange={manejarCambio}
                                placeholder="Ej. Accelo"
                            />
                        </div>

                        <div className="campo">
                            <label>Patente</label>
                            <input
                                name="patente"
                                value={formulario.patente}
                                onChange={manejarCambio}
                                placeholder="Ej. AB123CD"
                                maxLength={20}
                            />
                        </div>

                        <div className="campo">
                            <label>Año</label>
                            <input
                                type="number"
                                name="anio"
                                value={formulario.anio}
                                onChange={manejarCambio}
                                placeholder="Ej. 2022"
                            />
                        </div>

                        <div className="campo">
                            <label>Capacidad de carga (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                name="capacidad_carga"
                                value={formulario.capacidad_carga}
                                onChange={manejarCambio}
                                placeholder="Ej. 5000"
                            />
                        </div>

                    </div>

                    {error && <div className="mensaje-error">{error}</div>}
                    {mensaje && <div className="mensaje-exito">{mensaje}</div>}

                    <div className="acciones-formulario">
                        <button type="submit" className="boton-guardar" disabled={cargando}>
                            {cargando
                                ? 'Guardando...'
                                : vehiculoEditando
                                    ? 'Guardar cambios'
                                    : 'Registrar vehículo'}
                        </button>

                        {vehiculoEditando && (
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
                    <h2>Vehículos registrados</h2>
                </div>

                {vehiculos.length === 0 ? (
                    <p className="sin-registros">
                        No hay vehículos registrados.
                    </p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla-datos">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Patente</th>
                                    <th>Año</th>
                                    <th>Capacidad (kg)</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {vehiculos.map((vehiculo) => (
                                    <tr key={vehiculo.id}>
                                        <td>{vehiculo.id}</td>
                                        <td>{vehiculo.marca}</td>
                                        <td>{vehiculo.modelo}</td>
                                        <td>{vehiculo.patente}</td>
                                        <td>{vehiculo.anio}</td>
                                        <td>{vehiculo.capacidad_carga}</td>
                                        <td>
                                            <div className="acciones-tabla">
                                                <button
                                                    className="boton-editar"
                                                    onClick={() => editarVehiculo(vehiculo)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="boton-eliminar"
                                                    onClick={() => eliminarVehiculo(vehiculo.id)}
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

export default Vehiculos;
