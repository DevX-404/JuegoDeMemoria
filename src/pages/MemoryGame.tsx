import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Card as CardType, CategoryKey, EmojiCategories } from '../types';
import { inicializarCartas } from '../Funcion/LogicaJuego';
import Card from '../Componentes/Card';

const API_URL = 'http://localhost:3000/api/categories';
const NUM_PARES_DEFAULT = 8;
const DEFAULT_CATEGORY: CategoryKey = 'animales';
const FALLBACK_EMOJI: EmojiCategories = {
    fallback: ["❌", "❓", "❕", "⚠️", "⛔", "🚫", "🛑", "🚨"] 
}

const MemoryGame: React.FC = () => {
    const [cards, setCards] = useState<CardType[]>([]);
    const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
    const [moves, setMoves] = useState(0);
    const [lockBoard, setLockBoard] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const [categoriesData, setCategoriesData] = useState<EmojiCategories | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('');
    const [isLoading, setIsLoading] = useState(true);

    const iniciarJuego = useCallback((categoryKey: CategoryKey, categories: EmojiCategories | null) => {
        if (!categories || !categoryKey) return;
        
        const sourceEmojis = categories[categoryKey];

        if (sourceEmojis) {
            setCards(inicializarCartas(sourceEmojis, NUM_PARES_DEFAULT));
            setMoves(0);
            setFlippedCards([]);
            setGameWon(false);
            setLockBoard(false);
        }
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            let categories: EmojiCategories = {};
            let initialCategory = '';

            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                categories = data.data;

            } catch (error) {
                console.error("Error al obtener categorías del servidor Node.js. Usando datos de respaldo.", error);
                categories = FALLBACK_EMOJI;
            } 
            
            setCategoriesData(categories);

            initialCategory = categories[DEFAULT_CATEGORY] ? DEFAULT_CATEGORY : Object.keys(categories)[0] || '';
            setSelectedCategory(initialCategory);
            setIsLoading(false);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoriesData && selectedCategory) {
            iniciarJuego(selectedCategory, categoriesData);
        }
    }, [selectedCategory, categoriesData, iniciarJuego]);


    const handleCardClick = (id: number) => {
        if (lockBoard || flippedCards.length === 2 || gameWon) return;

        const clickedCard = cards.find(card => card.id === id);
        if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

        setCards(prevCards =>
            prevCards.map(card =>
                card.id === id ? { ...card, isFlipped: true } : card
            )
        );

        const updatedCard = { ...clickedCard, isFlipped: true };
        setFlippedCards(prev => [...prev, updatedCard]);
    };

    useEffect(() => {
        if (flippedCards.length === 2) {
            setLockBoard(true);
            setMoves(prev => prev + 1);

            const [card1, card2] = flippedCards;

            if (card1.value === card2.value) {
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.id === card1.id || card.id === card2.id
                            ? { ...card, isMatched: true, isFlipped: true }
                            : card
                    )
                );
                setTimeout(() => {
                    setFlippedCards([]);
                    setLockBoard(false);
                }, 500);

            } else {
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === card1.id || card.id === card2.id
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setFlippedCards([]);
                    setLockBoard(false);
                }, 1000);
            }
        }
    }, [flippedCards]);

    useEffect(() => {
        const allMatched = cards.length > 0 && cards.every(card => card.isMatched);
        if (allMatched && !gameWon) {
            setGameWon(true);
        }
    }, [cards, moves, gameWon]);

    const resetGame = () => {
        if (categoriesData) {
            iniciarJuego(selectedCategory, categoriesData);
        }
    }
    
    const handleCategorySelect = (category: CategoryKey) => {
        if (category !== selectedCategory) {
            setSelectedCategory(category);
            setGameWon(false); 
        }
    }

    const VictoryModal: React.FC = () => (
        <div className={`modal ${gameWon ? 'visible' : 'hidden'}`}>
            <div className="modal-content">
                <h2 className="text-3xl font-bold mb-3 text-gray-800">🎉 ¡Felicidades! 🎉</h2>
                <p className="mb-4 text-gray-600">Ganaste en <span className="font-bold text-indigo-600">{moves}</span> movimientos.</p>
                <button 
                    onClick={() => {
                        setGameWon(false);
                        resetGame();
                    }} 
                    className="button-reset"
                    style={{width: '100%', marginTop: '10px'}}
                >
                    Jugar de Nuevo
                </button>
            </div>
        </div>
    );

    if (isLoading || !categoriesData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
                <p>Conectando con el servidor...</p>
            </div>
        );
    }
    
    const availableCategories = Object.keys(categoriesData) as CategoryKey[];

    return (
        <div className="App w-full max-w-4xl mx-auto px-4">
            <style>
                {`
                /* Estilos específicos para el modal en esta página */
                .modal {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.8); display: flex;
                    justify-content: center; align-items: center; z-index: 100;
                    opacity: 0; pointer-events: none; transition: opacity 0.3s;
                    backdrop-filter: blur(5px);
                }
                .modal.visible { opacity: 1; pointer-events: auto; }
                .modal-content {
                    background: white; padding: 2rem; border-radius: 20px;
                    text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    width: 90%; max-width: 400px;
                    transform: scale(0.9); transition: transform 0.3s;
                }
                .modal.visible .modal-content { transform: scale(1); }
                `}
            </style>

            {/* Botón de Volver */}
            <div className="w-full flex justify-start mb-6 mt-4">
                <Link 
                    to="/" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/10"
                >
                    <ArrowLeft size={20} /> Volver al Hub
                </Link>
            </div>

            <h1>Memoria Mental</h1>

            {/* Selector de Categoría */}
            <div className="category-selector mb-8 text-center">
                <h3 className="text-gray-400 mb-3 text-sm uppercase tracking-wider font-semibold">Categoría ({selectedCategory})</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                    {availableCategories.map((categoryKey) => {
                        const isSelected = categoryKey === selectedCategory;
                        return (
                            <button
                                key={categoryKey}
                                onClick={() => handleCategorySelect(categoryKey)}
                                className={isSelected ? 'selected' : ''}
                            >
                                {categoryKey}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="header mb-6">
                <p className="text-xl font-bold text-gray-200">Movimientos: <span className="text-indigo-400">{moves}</span></p>
                <button onClick={resetGame} className="button-reset">Reiniciar</button>
            </div>
            
            <div className="board">
                {cards.map(card => (
                    <Card key={card.id} card={card} onCardClick={handleCardClick} />
                ))}
            </div>

            <VictoryModal />
        </div>
    );
};

export default MemoryGame;