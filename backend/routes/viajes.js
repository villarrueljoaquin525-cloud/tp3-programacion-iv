
import express from 'express';
import passport from 'passport';

import {
    listarViajes,
    obtenerViaje,
    crearViaje,
    actualizarViaje,
    eliminarViaje,
    historialPorVehiculo,
    historialPorConductor,
    kilometrosPorVehiculo,
    kilometrosPorConductor
} from '../controllers/viajesController.js';

import { validarViaje, validarId } from '../middlewares/validaciones.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const router = express.Router();

const autenticar = passport.authenticate('jwt', { session: false });

// HISTORIALES
router.get('/historial/vehiculo/:id', autenticar, validarId, validarCampos, historialPorVehiculo);
router.get('/historial/conductor/:id', autenticar, validarId, validarCampos, historialPorConductor);

// Km TOTALES
router.get('/kilometros/vehiculo/:id', autenticar, validarId, validarCampos, kilometrosPorVehiculo);
router.get('/kilometros/conductor/:id', autenticar, validarId, validarCampos, kilometrosPorConductor);

// CRUD DE VIAJES
router.get('/', autenticar, listarViajes);
router.get('/:id', autenticar, validarId, validarCampos, obtenerViaje);
router.post('/', autenticar, validarViaje, validarCampos, crearViaje);
router.put('/:id', autenticar, validarId, validarViaje, validarCampos, actualizarViaje);
router.delete('/:id', autenticar, validarId, validarCampos, eliminarViaje);

export default router;
