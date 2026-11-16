
import { Routes, Route, Navigate } from 'react-router-dom';

import Inicio from './pages/Inicio';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import Vehiculos from './pages/Vehiculos';
import Conductores from './pages/Conductores';
import Viajes from './pages/Viajes';
import Historial from './pages/Historial';

import RutaProtegida from './components/RutaProtegida';
import PanelLayout from './components/PanelLayout';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />

            <Route element={<RutaProtegida />}>
                <Route element={<PanelLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/vehiculos" element={<Vehiculos />} />
                    <Route path="/conductores" element={<Conductores />} />
                    <Route path="/viajes" element={<Viajes />} />
                    <Route path="/historial" element={<Historial />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
