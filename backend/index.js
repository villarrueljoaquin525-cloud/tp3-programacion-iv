import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import cors from 'cors';

import './middlewares/passport.js';

import usuariosRoutes from './routes/usuarios.js';
import vehiculosRoutes from './routes/vehiculos.js';
import conductoresRoutes from './routes/conductores.js';
import viajesRoutes from './routes/viajes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(passport.initialize());

// RUTA PRINCIPAL
app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: 'API de Gestión de Transporte funcionando correctamente'
    });
});

// RUTAS DE LA API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/conductores', conductoresRoutes);
app.use('/api/viajes', viajesRoutes);

// MANEJO DE RUTAS INEXISTENTES
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada'
    });
});

// MANEJO GENERAL DE ERRORES
app.use((error, req, res, next) => {
    console.error('Error:', error);

    const estado = error.status || error.statusCode || 500;

    res.status(estado).json({
        mensaje: estado === 400
            ? 'Solicitud incorrecta'
            : 'Error interno del servidor'
    });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
