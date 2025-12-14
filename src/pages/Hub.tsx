import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Puzzle, Hash, Trophy, LogIn } from 'lucide-react'; 

const games = [
    {
        id: 'memory',
        name: 'Memoria Mental',
        description: 'Encuentra los pares y desafía tu retención.',
        icon: <Brain size={48} />,
        color: 'from-blue-600 to-indigo-600',
        path: '/memory'
    },
    {
        id: 'puzzle',
        name: 'Puzzle Deslizante',
        description: 'Ordena las piezas en el menor tiempo posible.',
        icon: <Puzzle size={48} />,
        color: 'from-purple-600 to-fuchsia-600',
        path: '/puzzle' // (Aún por crear)
    },
    {
        id: 'tictactoe',
        name: '3 en Raya PRO',
        description: 'El clásico juego con superpoderes.',
        icon: <Hash size={48} />,
        color: 'from-orange-500 to-red-500',
        path: '/tictactoe' // (Aún por crear)
    }
];

const Hub: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Navbar Flotante Simple */}
            <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <div className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        ARCADE HUB
                    </span>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-sm font-semibold">
                        <Trophy size={16} className="text-yellow-400" /> Top Global
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all text-sm font-semibold shadow-lg shadow-indigo-500/30">
                        <LogIn size={16} /> Acceder
                    </button>
                </div>
            </nav>

            <div className="text-center mb-12 z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                    Elige tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Desafío</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Compite, gana puntos y sube en el ranking global en nuestra colección de minijuegos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full z-10">
                {games.map((game, index) => (
                    <Link to={game.path} key={game.id} className="no-underline">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="relative group h-96 rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-gray-900/50 backdrop-blur-sm"
                        >
                            {/* Fondo Gradiente */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            
                            {/* Contenido */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                <div className="mb-auto p-4 bg-white/10 w-fit rounded-2xl backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                    {game.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">{game.name}</h3>
                                <p className="text-gray-300 group-hover:text-white/90 transition-colors">
                                    {game.description}
                                </p>
                            </div>

                            {/* Efecto de Brillo Decorativo */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Hub;