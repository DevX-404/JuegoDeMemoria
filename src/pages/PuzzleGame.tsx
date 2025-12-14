import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trophy, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- CONFIGURACIÓN ---
const GRID_SIZE = 4; // Tablero de 4x4
const CELL_COUNT = GRID_SIZE * GRID_SIZE; // 16 celdas totales

// IMAGEN DEL PUZZLE:
// Si usas imagen local: import puzzleImage from '../assets/puzzle-bg.jpg';
const puzzleImage = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3";

// --- FUNCIONES AUXILIARES ---
const getNeighbors = (index: number) => {
    const neighbors: number[] = [];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    if (row > 0) neighbors.push(index - GRID_SIZE); // Arriba
    if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE); // Abajo
    if (col > 0) neighbors.push(index - 1); // Izquierda
    if (col < GRID_SIZE - 1) neighbors.push(index + 1); // Derecha

    return neighbors;
};

const PuzzleGame: React.FC = () => {
    // --- HOOKS DENTRO DEL COMPONENTE ---
    const { user } = useAuth(); // <--- AHORA ESTÁ EN EL LUGAR CORRECTO
    
    const [tiles, setTiles] = useState<(number | null)[]>([]);
    const [isSolved, setIsSolved] = useState(false);
    const [moves, setMoves] = useState(0);
    const [isShuffling, setIsShuffling] = useState(true);

    const startNewGame = useCallback(async () => {
        setIsShuffling(true);
        setIsSolved(false);
        setMoves(0);

        // 1. Estado inicial resuelto
        const currentState: (number | null)[] = Array.from({ length: CELL_COUNT - 1 }, (_, i) => i);
        currentState.push(null);
        
        setTiles([...currentState]); 
        await new Promise(r => setTimeout(r, 1000));

        // 2. Mezclar
        let emptyIdx = CELL_COUNT - 1;
        let previousIdx = -1;
        const numberOfShuffles = 100;

        for (let i = 0; i < numberOfShuffles; i++) {
            const neighbors = getNeighbors(emptyIdx);
            const validNeighbors = neighbors.filter(n => n !== previousIdx);
            
            if (validNeighbors.length > 0) {
                const randomNeighborIdx = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
                currentState[emptyIdx] = currentState[randomNeighborIdx];
                currentState[randomNeighborIdx] = null;
                previousIdx = emptyIdx;
                emptyIdx = randomNeighborIdx;

                if (i % 5 === 0) {
                     setTiles([...currentState]);
                     await new Promise(r => setTimeout(r, 10)); 
                }
            }
        }
        setTiles([...currentState]);
        setIsShuffling(false);
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    const checkWin = async (currentTiles: (number | null)[]) => {
        const isWin = currentTiles.every((tileValue, index) => {
            if (index === CELL_COUNT - 1) return tileValue === null;
            return tileValue === index;
        });

        if (isWin) {
            setIsSolved(true);
            
            // LOGICA DE GUARDADO AUTOMÁTICO
            if (user) {
                try {
                    await fetch('http://localhost:3000/api/score', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            game: 'puzzle',
                            score: moves + 1 
                        })
                    });
                    console.log("Puntuación guardada!");
                } catch (error) {
                    console.error("Error guardando score", error);
                }
            }
        }
    };

    const handleTileClick = (index: number) => {
        if (isSolved || isShuffling) return;

        const emptyIndex = tiles.indexOf(null);
        const neighbors = getNeighbors(emptyIndex);

        if (neighbors.includes(index)) {
            const newTiles = [...tiles];
            newTiles[emptyIndex] = newTiles[index];
            newTiles[index] = null;
            setTiles(newTiles);
            setMoves(prev => prev + 1);
            checkWin(newTiles);
        }
    };

    const getBackgroundStyle = (originalIndex: number) => {
        const originalRow = Math.floor(originalIndex / GRID_SIZE);
        const originalCol = originalIndex % GRID_SIZE;
        const percentX = originalCol * (100 / (GRID_SIZE - 1));
        const percentY = originalRow * (100 / (GRID_SIZE - 1));

        return {
            backgroundImage: `url(${puzzleImage})`,
            backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`, // Arreglo de la imagen estirada
            backgroundPosition: `${percentX}% ${percentY}%`
        };
    };

    return (
        <div className="App w-full max-w-4xl mx-auto px-4 flex flex-col items-center pb-10">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 mt-4">
                <Link 
                    to="/" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/10"
                    style={{ textDecoration: 'none' }}
                >
                    <ArrowLeft size={20} /> Hub
                </Link>
                 <h1 style={{ fontSize: '2rem', margin: 0 }} className="flex items-center gap-2">
                    <ImageIcon size={28} style={{ color: '#c084fc' }} />
                    Puzzle
                </h1>
            </div>

            {/* Controles y Stats */}
            <div className="game-controls">
                <div className="stat-box">
                    <span className="stat-label">Movimientos</span>
                    <span className="stat-value">{moves}</span>
                </div>
                <button 
                    onClick={startNewGame}
                    disabled={isShuffling}
                    className="button-reset"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        opacity: isShuffling ? 0.5 : 1,
                        cursor: isShuffling ? 'not-allowed' : 'pointer'
                    }}
                >
                    <RefreshCw size={18} className={isShuffling ? 'animate-spin' : ''} /> 
                    {isShuffling ? 'Mezclando...' : 'Reiniciar'}
                </button>
            </div>

            {/* --- TABLERO DE JUEGO --- */}
            <div 
                className="puzzle-board"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                }}
            >
                 {isShuffling && (
                    <div className="loading-overlay">
                        Preparando tablero...
                    </div>
                )}

                {tiles.map((tileValue, index) => {
                    if (tileValue === null) {
                        return <div key={`empty-${index}`} className="puzzle-empty" />;
                    }
                    return (
                        <button
                            key={`tile-${tileValue}`}
                            onClick={() => handleTileClick(index)}
                            className="puzzle-tile"
                            style={getBackgroundStyle(tileValue)}
                        />
                    );
                })}
            </div>

            {/* Modal de Victoria */}
            <div className={`modal ${isSolved ? 'visible' : ''}`}>
                <div className="modal-content">
                    <div style={{ margin: '0 auto 1rem', color: '#fbbf24' }}>
                        <Trophy size={48} />
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>¡Completado!</h2>
                    <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                        Resolviste la imagen en <strong>{moves}</strong> movimientos.
                    </p>
                    <button 
                        onClick={startNewGame}
                        className="button-reset"
                        style={{ width: '100%' }}
                    >
                        Jugar Otra Imagen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PuzzleGame;