import pool from '../db.js';

// LISTAR VEHiCULOS
export const listarVehiculos = async (req, res) => {
    try {
        const [vehiculos] = await pool.execute(
            'SELECT * FROM vehiculos ORDER BY id'
        );

        return res.status(200).json(vehiculos);
    } catch (error) {
        console.error('Error al listar vehículos:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// OBTENER VEHÍCULO POR ID
export const obtenerVehiculo = async (req, res) => {
    try {
        const { id } = req.params;

        const [vehiculos] = await pool.execute(
            'SELECT * FROM vehiculos WHERE id = ?',
            [id]
        );

        if (vehiculos.length === 0) {
            return res.status(404).json({
                mensaje: 'Vehiculo no encontrado'
            });
        }

        return res.status(200).json(vehiculos[0]);
    } catch (error) {
        console.error('Error al obtener vehículo:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// CREAR VEHÍCULO
export const crearVehiculo = async (req, res) => {
    try {
        const { marca, modelo, patente, anio, capacidad_carga } = req.body;

        const [resultado] = await pool.execute(
            `INSERT INTO vehiculos
            (marca, modelo, patente, anio, capacidad_carga)
            VALUES (?, ?, ?, ?, ?)`,
            [marca, modelo, patente, anio, capacidad_carga]
        );

        return res.status(201).json({
            mensaje: 'Vehiculo creado correctamente',
            id: resultado.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                mensaje: 'La patente ya se encuentra registrada'
            });
        }

        console.error('Error al crear vehículo:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// ACTUALIZAR VEHÍCULO
export const actualizarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const { marca, modelo, patente, anio, capacidad_carga } = req.body;

        const [resultado] = await pool.execute(
            `UPDATE vehiculos
            SET marca = ?, modelo = ?, patente = ?,
                anio = ?, capacidad_carga = ?
            WHERE id = ?`,
            [marca, modelo, patente, anio, capacidad_carga, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Vehículo no encontrado'
            });
        }

        return res.status(200).json({
            mensaje: 'Vehículo actualizado correctamente'
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                mensaje: 'La patente ya se encuentra registrada'
            });
        }

        console.error('Error al actualizar vehículo:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// ELIMINAR VEHÍCULO
export const eliminarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.execute(
            'DELETE FROM vehiculos WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Vehiculo no encontrado'
            });
        }

        return res.status(200).json({
            mensaje: 'Vehiculo eliminado correctamente'
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                mensaje: 'No se puede eliminar: el vehículo tiene viajes registrados'
            });
        }

        console.error('Error al eliminar vehiculo:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};
