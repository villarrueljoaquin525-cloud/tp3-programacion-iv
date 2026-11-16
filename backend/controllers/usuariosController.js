import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// REGISTRAR USUARIO
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const [usuarios] = await pool.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarios.length > 0) {
            return res.status(400).json({
                mensaje: 'El email ya se encuentra registrado'
            });
        }

        const passwordEncriptada = await bcrypt.hash(password, 10);

        const [resultado] = await pool.execute(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordEncriptada]
        );

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// INICIAR SESIÓN
export const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [usuarios] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        const usuario = usuarios[0];

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        return res.status(200).json({
            mensaje: 'Inicio de sesion exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};
