
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// CREACIÓN DE CUENTAS
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const [coincidencias] = await pool.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (coincidencias.length !== 0) {
            return res.status(400).json({
                mensaje: 'Ya existe una cuenta con ese correo electrónico'
            });
        }

        const claveSegura = await bcrypt.hash(password, 10);

        const [nuevoRegistro] = await pool.execute(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, claveSegura]
        );

        return res.status(201).json({
            mensaje: 'La cuenta fue creada correctamente',
            id: nuevoRegistro.insertId
        });

    } catch (error) {
        console.error('Problema al crear la cuenta:', error);

        return res.status(500).json({
            mensaje: 'No fue posible completar el registro'
        });
    }
};

// VALIDACIÓN DE ACCESO
export const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [coincidencias] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (coincidencias.length === 0) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const cuenta = coincidencias[0];

        const claveCorrecta = await bcrypt.compare(
            password,
            cuenta.password
        );

        if (!claveCorrecta) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const tokenAcceso = jwt.sign(
            { id: cuenta.id },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        return res.status(200).json({
            mensaje: 'Acceso concedido correctamente',
            token: tokenAcceso,
            usuario: {
                id: cuenta.id,
                nombre: cuenta.nombre,
                email: cuenta.email
            }
        });

    } catch (error) {
        console.error('Problema durante el acceso:', error);

        return res.status(500).json({
            mensaje: 'No fue posible iniciar sesión'
        });
    }
};
