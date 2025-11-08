import React, { useState, useEffect, useCallback } from 'react';
import type { Card as CardType, CategoryKey, EmojiCategories } from './types';
import { inicializarCartas } from './Funcion/LogicaJuego';
import Card from './Componentes/Card';
import './App.css';

const API_URL = 'http://localhost:3000/api/categories';
const NUM_PARES_DEFAULT = 8;
const DEFAULT_CATEGORY: CategoryKey = 'animales';
const FALLBACK_EMOJI: EmojiCategories = {
    fallback: ["❌", "❓", "❕", "⚠️", "⛔", "🚫", "🛑", "🚨"] 
}

const App: React.FC = () => {
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
                <h2 className="text-2xl font-bold mb-3">🎉 ¡Felicidades! 🎉</h2>
                <p className="mb-4">Ganaste en <span className="font-semibold">{moves}</span> movimientos.</p>
                <button 
                    onClick={() => {
                        setGameWon(false);
                        resetGame();
                    }} 
                    className="button-reset"
                >
                    Jugar de Nuevo
                </button>
            </div>
        </div>
    );


    if (isLoading || !categoriesData) {
        return (
            <div className="App">
                <h1>Minijuego de Memoria</h1>
                <p>Cargando categorías desde el servidor Node.js...</p>
            </div>
        );
    }
    
    const availableCategories = Object.keys(categoriesData) as CategoryKey[];


    return (
        <div className="App">
            <style>
                {`
                /* Estilos básicos para el modal */
                .modal {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.7); display: flex;
                    justify-content: center; align-items: center; z-index: 100;
                    opacity: 0; pointer-events: none; transition: opacity 0.3s;
                }
                .modal.visible { opacity: 1; pointer-events: auto; }
                .modal-content {
                    background: white; padding: 2rem; border-radius: 12px;
                    text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    width: 90%; max-width: 350px;
                }
                .category-selector { margin-bottom: 20px; }
                .category-selector button {
                    padding: 8px 15px; margin-right: 10px; border: 1px solid #ccc;
                    border-radius: 20px; cursor: pointer; transition: background 0.2s;
                    text-transform: capitalize;
                }
                .category-selector button.selected {
                    background-color: #4f46e5; color: white; border-color: #4f46e5;
                }
                .header button {
                    background-color: #4f46e5; color: white; padding: 8px 15px;
                    border-radius: 8px; border: none; cursor: pointer;
                }
                `}
            </style>

            <h1>Minijuego de Memoria</h1>

            {/* Selector de Categoría */}
            <div className="category-selector">
                <h3 className="font-semibold mb-2">Selecciona Categoría ({selectedCategory}):</h3>
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

            <div className="header">
                <p>Movimientos: {moves}</p>
                <button onClick={resetGame}>Reiniciar</button>
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

export default App;