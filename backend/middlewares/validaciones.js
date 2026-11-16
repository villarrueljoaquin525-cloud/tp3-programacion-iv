
import { body, param } from 'express-validator';

// VALIDACIONES PARA REGISTRO
export const validarRegistro = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe ingresar un email válido'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];

// VALIDACIONES PARA INICIO DE SESIÓN
export const validarLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe ingresar un email válido'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
];

// VALIDACIONES PARA VEHÍCULOS
export const validarVehiculo = [
    body('marca')
        .trim()
        .notEmpty()
        .withMessage('La marca es obligatoria'),

    body('modelo')
        .trim()
        .notEmpty()
        .withMessage('El modelo es obligatorio'),

    body('patente')
        .trim()
        .notEmpty()
        .withMessage('La patente es obligatoria'),

    body('anio')
        .isInt({ min: 1900, max: 2155 })
        .withMessage('El año debe ser válido'),

    body('capacidad_carga')
        .isFloat({ gt: 0 })
        .withMessage('La capacidad de carga debe ser mayor a cero')
];

// VALIDACIONES PARA CONDUCTORES
export const validarConductor = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio'),

    body('apellido')
        .trim()
        .notEmpty()
        .withMessage('El apellido es obligatorio'),

    body('numero_documento')
        .trim()
        .notEmpty()
        .withMessage('El documento es obligatorio'),

    body('numero_licencia')
        .trim()
        .notEmpty()
        .withMessage('La licencia es obligatoria'),

    body('fecha_alta_licencia')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('La fecha de alta debe tener formato YYYY-MM-DD'),

    body('fecha_vencimiento_licencia')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('La fecha de vencimiento debe tener formato YYYY-MM-DD')
        .custom((fechaVencimiento, { req }) => {
            if (fechaVencimiento <= req.body.fecha_alta_licencia) {
                throw new Error('La fecha de vencimiento debe ser posterior a la fecha de alta');
            }
            return true;
        })
];

// VALIDACIÓN DE ID
export const validarId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];

// VALIDACIONES PARA VIAJES
export const validarViaje = [
    body('vehiculo_id')
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar un vehículo válido'),

    body('conductor_id')
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar un conductor válido'),

    body('fecha_salida')
        .notEmpty()
        .withMessage('La fecha de salida es obligatoria')
        .isISO8601()
        .withMessage('La fecha de salida debe ser válida'),

    body('fecha_llegada')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('La fecha de llegada debe ser válida')
        .custom((fechaLlegada, { req }) => {
            if (new Date(fechaLlegada) < new Date(req.body.fecha_salida)) {
                throw new Error('La fecha de llegada no puede ser anterior a la fecha de salida');
            }
            return true;
        }),

    body('origen')
        .trim()
        .notEmpty()
        .withMessage('El origen es obligatorio'),

    body('destino')
        .trim()
        .notEmpty()
        .withMessage('El destino es obligatorio'),

    body('kilometros')
        .isFloat({ min: 0 })
        .withMessage('Los kilómetros deben ser un número igual o mayor a cero')
];
