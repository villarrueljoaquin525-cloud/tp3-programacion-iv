import express from 'express';
import passport from 'passport';

import {
    listarConductores,
    obtenerConductor,
    crearConductor,
    actualizarConductor,
    eliminarConductor
} from '../controllers/conductoresController.js';

import { validarConductor, validarId } from '../middlewares/validaciones.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const router = express.Router();

const autenticar = passport.authenticate('jwt', { session: false });

router.get('/', autenticar, listarConductores);

router.get('/:id', autenticar, validarId, validarCampos, obtenerConductor);

router.post('/', autenticar, validarConductor, validarCampos, crearConductor);

router.put('/:id', autenticar, validarId, validarConductor, validarCampos, actualizarConductor);

router.delete('/:id', autenticar, validarId, validarCampos, eliminarConductor);

export default router;
