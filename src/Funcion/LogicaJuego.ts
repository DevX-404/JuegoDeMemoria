import type { Card } from '../types';

export const inicializarCartas = (emojis: string[], numPares: number = 8): Card[] => {

    const selecionarEmojis = emojis.slice(0, numPares);

    const valorCartas = [...selecionarEmojis, ...selecionarEmojis];
    let idContador = 0;

    const cardsIniciales: Card[] = valorCartas.map(value => ({
        id: idContador++,
        value,
        isFlipped: false,
        isMatched: false,
    }));
    
    for (let i = cardsIniciales.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsIniciales[i], cardsIniciales[j]] = [cardsIniciales[j], cardsIniciales[i]];
    }
    return cardsIniciales;
};