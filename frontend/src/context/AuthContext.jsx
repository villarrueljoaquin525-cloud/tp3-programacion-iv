import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const API_URL = 'http://localhost:3000/api';

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = sessionStorage.getItem('usuario');
        return guardado ? JSON.parse(guardado) : null;
    });

    const [token, setToken] = useState(() => {
        return sessionStorage.getItem('token') || null;
    });

    // INICIAR SESIÓN
    const login = async (email, password) => {
        const respuesta = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'Error al iniciar sesión');
        }

        sessionStorage.setItem('token', datos.token);
        sessionStorage.setItem('usuario', JSON.stringify(datos.usuario));

        setToken(datos.token);
        setUsuario(datos.usuario);

        return datos;
    };

    // CERRAR SESIÓN
    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');

        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                login,
                logout,
                autenticado: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
