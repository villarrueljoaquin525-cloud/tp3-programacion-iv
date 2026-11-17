
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import passport from 'passport';

// Configuración de autenticación
import './middlewares/passport.js';

// Importación de módulos
import usuariosRoutes from './routes/usuarios.js';
import vehiculosRoutes from './routes/vehiculos.js';
import conductoresRoutes from './routes/conductores.js';
import viajesRoutes from './routes/viajes.js';

// Configuración del servidor
const servidor = express();
const PUERTO = process.env.PORT || 3000;

// Configuración de middlewares
servidor.use(cors({
    origin: 'http://localhost:5173'
}));

servidor.use(express.json());
servidor.use(passport.initialize());

// Ruta de bienvenida
servidor.get('/', (req, res) => {
    res.status(200).json({
        estado: 'Activo',
        mensaje: 'Sistema de administración de transporte disponible'
    });
});

// Registro de rutas
servidor.use('/api/usuarios', usuariosRoutes);
servidor.use('/api/vehiculos', vehiculosRoutes);
servidor.use('/api/conductores', conductoresRoutes);
servidor.use('/api/viajes', viajesRoutes);

// Control de rutas no existentes
servidor.use((req, res) => {
    res.status(404).json({
        error: 'No se encontró el recurso solicitado'
    });
});

// Control de errores
servidor.use((error, req, res, next) => {
    console.error('Se produjo un inconveniente:', error);

    const codigoEstado = error.status || error.statusCode || 500;

    res.status(codigoEstado).json({
        error: codigoEstado === 400
            ? 'Los datos enviados no son válidos'
            : 'Ocurrió un problema al procesar la solicitud'
    });
});

// Puesta en marcha del servidor
servidor.listen(PUERTO, () => {
    console.log('-----------------------------------');
    console.log(' SISTEMA DE GESTIÓN DE TRANSPORTE');
    console.log(` Servidor activo en puerto ${PUERTO}`);
    console.log(` Dirección: http://localhost:${PUERTO}`);
    console.log('-----------------------------------');
});