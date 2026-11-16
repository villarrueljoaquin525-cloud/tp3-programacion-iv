import pool from './db.js';

async function probarConexion() {
    try {
        const [resultado] = await pool.execute('SELECT 1 AS conexion');

        console.log('Conexión a MySQL exitosa:', resultado);

    } catch (error) {
        console.error('Error de conexión:', error.message);

    } finally {
        await pool.end();
    }
}

probarConexion();
