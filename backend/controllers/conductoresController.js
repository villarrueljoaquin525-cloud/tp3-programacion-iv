import pool from '../db.js';

// LISTAR CONDUCTORES
export const listarConductores = async (req, res) => {
    try {
        const [conductores] = await pool.execute(
            'SELECT * FROM conductores ORDER BY id'
        );

        return res.status(200).json(conductores);
    } catch (error) {
        console.error('Error al listar conductores:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// OBTENER CONDUCTOR POR ID
export const obtenerConductor = async (req, res) => {
    try {
        const { id } = req.params;

        const [conductores] = await pool.execute(
            'SELECT * FROM conductores WHERE id = ?',
            [id]
        );

        if (conductores.length === 0) {
            return res.status(404).json({
                mensaje: 'Conductor no encontrado'
            });
        }

        return res.status(200).json(conductores[0]);
    } catch (error) {
        console.error('Error al obtener conductor:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// CREAR CONDUCTOR
export const crearConductor = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            numero_documento,
            numero_licencia,
            fecha_alta_licencia,
            fecha_vencimiento_licencia
        } = req.body;

        const [resultado] = await pool.execute(
            `INSERT INTO conductores
            (nombre, apellido, numero_documento, numero_licencia,
             fecha_alta_licencia, fecha_vencimiento_licencia)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                numero_documento,
                numero_licencia,
                fecha_alta_licencia,
                fecha_vencimiento_licencia
            ]
        );

        return res.status(201).json({
            mensaje: 'Conductor creado correctamente',
            id: resultado.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                mensaje: 'El documento o la licencia ya estan registrados'
            });
        }

        console.error('Error al crear conductor:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// ACTUALIZAR CONDUCTOR
export const actualizarConductor = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            apellido,
            numero_documento,
            numero_licencia,
            fecha_alta_licencia,
            fecha_vencimiento_licencia
        } = req.body;

        const [resultado] = await pool.execute(
            `UPDATE conductores
            SET nombre = ?, apellido = ?, numero_documento = ?,
                numero_licencia = ?, fecha_alta_licencia = ?,
                fecha_vencimiento_licencia = ?
            WHERE id = ?`,
            [
                nombre,
                apellido,
                numero_documento,
                numero_licencia,
                fecha_alta_licencia,
                fecha_vencimiento_licencia,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Conductor no encontrado'
            });
        }

        return res.status(200).json({
            mensaje: 'Conductor actualizado correctamente'
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                mensaje: 'El documento o la licencia ya están registrados'
            });
        }

        console.error('Error al actualizar conductor:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// ELIMINAR CONDUCTOR
export const eliminarConductor = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.execute(
            'DELETE FROM conductores WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Conductor no encontrado'
            });
        }

        return res.status(200).json({
            mensaje: 'Conductor eliminado correctamente'
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                mensaje: 'No se puede eliminar: el conductor tiene viajes registrados'
            });
        }

        console.error('Error al eliminar conductor:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};
