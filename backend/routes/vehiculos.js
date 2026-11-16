import express from 'express';
import passport from 'passport';

import {
    listarVehiculos,
    obtenerVehiculo,
    crearVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
} from '../controllers/vehiculosController.js';

import { validarVehiculo, validarId } from '../middlewares/validaciones.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const router = express.Router();

const autenticar = passport.authenticate('jwt', { session: false });

router.get('/', autenticar, listarVehiculos);

router.get('/:id', autenticar, validarId, validarCampos, obtenerVehiculo);

router.post('/', autenticar, validarVehiculo, validarCampos, crearVehiculo);

router.put('/:id', autenticar, validarId, validarVehiculo, validarCampos, actualizarVehiculo);

router.delete('/:id', autenticar, validarId, validarCampos, eliminarVehiculo);

export default router;
