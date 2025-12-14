import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hub from './pages/Hub';
import MemoryGame from './pages/MemoryGame';
import PuzzleGame from './pages/PuzzleGame';
import LoginPage from './pages/LoginPage';
import './App.css';

// Componente para animar las transiciones de página
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>4
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Hub />} />
                <Route path="/memory" element={<MemoryGame />} />
                
                {/* Placeholder para los futuros juegos */}
                <Route path="/puzzle" element={<PuzzleGame />} />
                <Route path="/tictactoe" element={<div className="text-center pt-20"><h1>❌ Próximamente: 3 en Raya</h1></div>} />
            </Routes>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <AnimatedRoutes />
            </div>
        </Router>
    );
};

export default App;