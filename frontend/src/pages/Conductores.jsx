import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api/conductores';

const formularioInicial = {
    nombre: '',
    apellido: '',
    numero_documento: '',
    numero_licencia: '',
    fecha_alta_licencia: '',
    fecha_vencimiento_licencia: ''
};

function Conductores() {
    const { token } = useAuth();

    const [conductores, setConductores] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [conductorEditando, setConductorEditando] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const obtenerConductores = async () => {
        try {
            const respuesta = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudieron cargar los conductores');
            }

            setConductores(
                Array.isArray(datos) ? datos : datos.conductores || []
            );

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            obtenerConductores();
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
            nombre,
            apellido,
            numero_documento,
            numero_licencia,
            fecha_alta_licencia,
            fecha_vencimiento_licencia
        } = formulario;

        if (
            !nombre.trim() ||
            !apellido.trim() ||
            !numero_documento.trim() ||
            !numero_licencia.trim() ||
            !fecha_alta_licencia ||
            !fecha_vencimiento_licencia
        ) {
            return 'Todos los campos son obligatorios';
        }

        if (!/^\d+$/.test(numero_documento.trim())) {
            return 'El documento debe contener solamente números';
        }

        if (fecha_vencimiento_licencia < fecha_alta_licencia) {
            return 'La fecha de vencimiento no puede ser anterior a la fecha de alta';
        }

        return '';
    };

    const guardarConductor = async (e) => {
        e.preventDefault();

        setError('');
        setMensaje('');

        const errorValidacion = validarFormulario();

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        const datosConductor = {
            nombre: formulario.nombre.trim(),
            apellido: formulario.apellido.trim(),
            numero_documento: formulario.numero_documento.trim(),
            numero_licencia: formulario.numero_licencia.trim(),
            fecha_alta_licencia: formulario.fecha_alta_licencia,
            fecha_vencimiento_licencia: formulario.fecha_vencimiento_licencia
        };

        try {
            setCargando(true);

            const respuesta = await fetch(
                conductorEditando
                    ? `${API_URL}/${conductorEditando}`
                    : API_URL,
                {
                    method: conductorEditando ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(datosConductor)
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo guardar el conductor');
            }

            setMensaje(
                conductorEditando
                    ? 'Conductor actualizado correctamente'
                    : 'Conductor registrado correctamente'
            );

            setFormulario(formularioInicial);
            setConductorEditando(null);

            await obtenerConductores();

        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    const editarConductor = (conductor) => {
        setConductorEditando(conductor.id);

        setFormulario({
            nombre: conductor.nombre || '',
            apellido: conductor.apellido || '',
            numero_documento: conductor.numero_documento || '',
            numero_licencia: conductor.numero_licencia || '',
            fecha_alta_licencia: conductor.fecha_alta_licencia?.slice(0, 10) || '',
            fecha_vencimiento_licencia: conductor.fecha_vencimiento_licencia?.slice(0, 10) || ''
        });

        setError('');
        setMensaje('');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarConductor = async (id) => {
        const confirmar = window.confirm(
            '¿Estás seguro de que querés eliminar este conductor?'
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
                throw new Error(datos.mensaje || 'No se pudo eliminar el conductor');
            }

            setMensaje('Conductor eliminado correctamente');
            await obtenerConductores();

        } catch (error) {
            setError(error.message);
        }
    };

    const cancelarEdicion = () => {
        setConductorEditando(null);
        setFormulario(formularioInicial);
        setError('');
        setMensaje('');
    };

    return (
        <section className="pagina-crud">

            <div className="encabezado-pagina">
                <div>
                    <span className="etiqueta">ADMINISTRACIÓN</span>
                    <h1>Conductores</h1>
                    <p>Registrá y administrá los conductores de la empresa.</p>
                </div>

                <div className="contador-registros">
                    👥 {conductores.length} conductores
                </div>
            </div>

            <div className="formulario-crud">
                <h2>
                    {conductorEditando ? 'Modificar conductor' : 'Registrar conductor'}
                </h2>

                <form onSubmit={guardarConductor}>
                    <div className="campos-grid">

                        <div className="campo">
                            <label>Nombre</label>
                            <input
                                name="nombre"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                placeholder="Nombre"
                            />
                        </div>

                        <div className="campo">
                            <label>Apellido</label>
                            <input
                                name="apellido"
                                value={formulario.apellido}
                                onChange={manejarCambio}
                                placeholder="Apellido"
                            />
                        </div>

                        <div className="campo">
                            <label>Número de documento</label>
                            <input
                                name="numero_documento"
                                value={formulario.numero_documento}
                                onChange={manejarCambio}
                                placeholder="Ej. 30123456"
                            />
                        </div>

                        <div className="campo">
                            <label>Número de licencia</label>
                            <input
                                name="numero_licencia"
                                value={formulario.numero_licencia}
                                onChange={manejarCambio}
                                placeholder="Ej. LIC12345"
                            />
                        </div>

                        <div className="campo">
                            <label>Fecha de alta de licencia</label>
                            <input
                                type="date"
                                name="fecha_alta_licencia"
                                value={formulario.fecha_alta_licencia}
                                onChange={manejarCambio}
                            />
                        </div>

                        <div className="campo">
                            <label>Fecha de vencimiento de licencia</label>
                            <input
                                type="date"
                                name="fecha_vencimiento_licencia"
                                value={formulario.fecha_vencimiento_licencia}
                                onChange={manejarCambio}
                            />
                        </div>

                    </div>

                    {error && (
                        <div className="mensaje-error">{error}</div>
                    )}

                    {mensaje && (
                        <div className="mensaje-exito">{mensaje}</div>
                    )}

                    <div className="acciones-formulario">
                        <button
                            type="submit"
                            className="boton-guardar"
                            disabled={cargando}
                        >
                            {cargando
                                ? 'Guardando...'
                                : conductorEditando
                                    ? 'Guardar cambios'
                                    : 'Registrar conductor'}
                        </button>

                        {conductorEditando && (
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
                    <h2>Conductores registrados</h2>
                </div>

                {conductores.length === 0 ? (
                    <p className="sin-registros">
                        No hay conductores registrados.
                    </p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla-datos">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Documento</th>
                                    <th>Licencia</th>
                                    <th>Alta licencia</th>
                                    <th>Vencimiento</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {conductores.map((conductor) => (
                                    <tr key={conductor.id}>
                                        <td>{conductor.id}</td>
                                        <td>{conductor.nombre}</td>
                                        <td>{conductor.apellido}</td>
                                        <td>{conductor.numero_documento}</td>
                                        <td>{conductor.numero_licencia}</td>
                                        <td>
                                            {conductor.fecha_alta_licencia?.slice(0, 10)}
                                        </td>
                                        <td>
                                            {conductor.fecha_vencimiento_licencia?.slice(0, 10)}
                                        </td>
                                        <td>
                                            <div className="acciones-tabla">
                                                <button
                                                    className="boton-editar"
                                                    onClick={() => editarConductor(conductor)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="boton-eliminar"
                                                    onClick={() => eliminarConductor(conductor.id)}
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

export default Conductores;
