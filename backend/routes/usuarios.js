
import express from 'express';
import passport from 'passport';

// Funciones para administrar las cuentas
import {
    registrarUsuario,
    iniciarSesion
} from '../controllers/usuariosController.js';

// Validaciones de datos
import {
    validarRegistro,
    validarLogin
} from '../middlewares/validaciones.js';

import { validarCampos } from '../middlewares/validarCampos.js';

const rutasUsuarios = express.Router();

// Crear una nueva cuenta
rutasUsuarios.post(
    '/registro',
    validarRegistro,
    validarCampos,
    registrarUsuario
);

// Verificar los datos de acceso
rutasUsuarios.post(
    '/login',
    validarLogin,
    validarCampos,
    iniciarSesion
);

// Consultar información del usuario autenticado
rutasUsuarios.get(
    '/perfil',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.status(200).json({
            mensaje: 'Sesión verificada correctamente',
            datosUsuario: req.user
        });
    }
);

// Exportar las rutas
export default rutasUsuarios;
