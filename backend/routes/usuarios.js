import express from 'express';
import passport from 'passport';

import {
    registrarUsuario,
    iniciarSesion
} from '../controllers/usuariosController.js';

import {
    validarRegistro,
    validarLogin
} from '../middlewares/validaciones.js';

import { validarCampos } from '../middlewares/validarCampos.js';

const router = express.Router();

// Registro
router.post(
    '/registro',
    validarRegistro,
    validarCampos,
    registrarUsuario
);

// Inicio de sesión
router.post(
    '/login',
    validarLogin,
    validarCampos,
    iniciarSesion
);

// Ruta protegida: requiere un JWT válido
router.get(
    '/perfil',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.status(200).json({
            mensaje: 'Acceso autorizado',
            usuario: req.user
        });
    }
);

export default router;
