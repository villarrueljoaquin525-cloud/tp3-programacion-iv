import pool from '../db.js';

// LISTAR TODOS LOS VIAJES
export const listarViajes = async (req, res) => {
    try {
        const [viajes] = await pool.execute(`
            SELECT v.*,
                   ve.marca,
                   ve.modelo,
                   ve.patente,
                   c.nombre AS nombre_conductor,
                   c.apellido AS apellido_conductor
            FROM viajes v
            INNER JOIN vehiculos ve ON v.vehiculo_id = ve.id
            INNER JOIN conductores c ON v.conductor_id = c.id
            ORDER BY v.fecha_salida DESC
        `);

        return res.status(200).json(viajes);
    } catch (error) {
        console.error('Error al listar viajes:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// OBTENER VIAJE POR ID
export const obtenerViaje = async (req, res) => {
    try {
        const { id } = req.params;

        const [viajes] = await pool.execute(
            'SELECT * FROM viajes WHERE id = ?',
            [id]
        );

        if (viajes.length === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado'
            });
        }

        return res.status(200).json(viajes[0]);
    } catch (error) {
        console.error('Error al obtener viaje:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// REGISTRAR VIAJE
export const crearViaje = async (req, res) => {
    try {
        const {
            vehiculo_id,
            conductor_id,
            fecha_salida,
            fecha_llegada,
            origen,
            destino,
            kilometros,
            observaciones
        } = req.body;

        const [resultado] = await pool.execute(
            `INSERT INTO viajes
            (vehiculo_id, conductor_id, fecha_salida, fecha_llegada,
             origen, destino, kilometros, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                vehiculo_id,
                conductor_id,
                fecha_salida,
                fecha_llegada || null,
                origen,
                destino,
                kilometros,
                observaciones || null
            ]
        );

        return res.status(201).json({
            mensaje: 'Viaje registrado correctamente',
            id: resultado.insertId
        });
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                mensaje: 'El vehiculo o el conductor indicado no existe'
            });
        }

        console.error('Error al registrar viaje:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// ACTUALIZAR VIAJE
export const actualizarViaje = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            vehiculo_id,
            conductor_id,
            fecha_salida,
            fecha_llegada,
            origen,
            destino,
            kilometros,
            observaciones
        } = req.body;

        const [resultado] = await pool.execute(
            `UPDATE viajes
             SET vehiculo_id = ?,
                 conductor_id = ?,
                 fecha_salida = ?,
                 fecha_llegada = ?,
                 origen = ?,
                 destino = ?,
                 kilometros = ?,
                 observaciones = ?
             WHERE id = ?`,
            [
                vehiculo_id,
                conductor_id,
                fecha_salida,
                fecha_llegada || null,
                origen,
                destino,
                kilometros,
                observaciones || null,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado'
            });
        }

        return res.status(200).json({
            mensaje: 'Viaje actualizado correctamente'
        });
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                mensaje: 'El vehículo o el conductor indicado no existe'
            });
        }

        console.error('Error al actualizar viaje:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// ELIMINAR VIAJE
export const eliminarViaje = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.execute(
            'DELETE FROM viajes WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Viaje no encontrado'
            });
        }

        return res.status(200).json({
            mensaje: 'Viaje eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar viaje:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// HISTORIAL DE VIAJES POR VEHÍCULO
export const historialPorVehiculo = async (req, res) => {
    try {
        const { id } = req.params;

        const [viajes] = await pool.execute(
            `SELECT * FROM viajes
             WHERE vehiculo_id = ?
             ORDER BY fecha_salida DESC`,
            [id]
        );

        return res.status(200).json(viajes);
    } catch (error) {
        console.error('Error en historial por vehículo:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// HISTORIAL DE VIAJES POR CONDUCTOR
export const historialPorConductor = async (req, res) => {
    try {
        const { id } = req.params;

        const [viajes] = await pool.execute(
            `SELECT * FROM viajes
             WHERE conductor_id = ?
             ORDER BY fecha_salida DESC`,
            [id]
        );

        return res.status(200).json(viajes);
    } catch (error) {
        console.error('Error en historial por conductor:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// KILÓMETROS TOTALES POR VEHÍCULO
export const kilometrosPorVehiculo = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.execute(
            `SELECT ve.id, ve.marca, ve.modelo, ve.patente,
                    COALESCE(SUM(v.kilometros), 0) AS total_kilometros
             FROM vehiculos ve
             LEFT JOIN viajes v ON ve.id = v.vehiculo_id
             WHERE ve.id = ?
             GROUP BY ve.id`,
            [id]
        );

        if (resultado.length === 0) {
            return res.status(404).json({
                mensaje: 'Vehículo no encontrado'
            });
        }

        return res.status(200).json(resultado[0]);
    } catch (error) {
        console.error('Error al calcular kilómetros del vehículo:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// KILÓMETROS TOTALES POR CONDUCTOR
export const kilometrosPorConductor = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.execute(
            `SELECT c.id, c.nombre, c.apellido,
                    COALESCE(SUM(v.kilometros), 0) AS total_kilometros
             FROM conductores c
             LEFT JOIN viajes v ON c.id = v.conductor_id
             WHERE c.id = ?
             GROUP BY c.id`,
            [id]
        );

        if (resultado.length === 0) {
            return res.status(404).json({
                mensaje: 'Conductor no encontrado'
            });
        }

        return res.status(200).json(resultado[0]);
    } catch (error) {
        console.error('Error al calcular kilómetros del conductor:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};
