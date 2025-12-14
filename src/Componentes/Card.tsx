import React from "react";
import type { Card as CardType } from '../types';

interface CardAccesorios {
    card: CardType;
    onCardClick: (id: number) => void;
}

const Card: React.FC<CardAccesorios> = ({ card, onCardClick }) => {
    const isInteractable = !card.isFlipped && !card.isMatched;
    const cardClass = `card ${card.isFlipped || card.isMatched ? "flipped" : ""} ${card.isMatched ? "matched" : ""} ${isInteractable ? "hoverable" : ""}`;

    const handleClick = () => {
        if (!isInteractable) return;
        onCardClick(card.id);
    };

    return (
        <div className={cardClass} onClick={handleClick}>
            <div className="card-inner">
                <div className="card-front">?</div> 
                <div className="card-back">{card.value}</div>
            </div>
        </div>
    );
};

export default Card;