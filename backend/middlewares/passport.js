import 'dotenv/config';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import pool from '../db.js';

if (!process.env.JWT_SECRET) {
    throw new Error('Falta configurar JWT_SECRET en el archivo .env');
}

const opciones = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(opciones, async (payload, done) => {
        try {
            const [usuarios] = await pool.execute(
                'SELECT id, nombre, email FROM usuarios WHERE id = ?',
                [payload.id]
            );

            if (usuarios.length === 0) {
                return done(null, false);
            }

            return done(null, usuarios[0]);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;
