import React from "react";
import type { Card as CardType } from '../types';

interface CardAccesorios {
    card: CardType;
    onCardClick: (id: number) => void;
}

const Card: React.FC<CardAccesorios> = ({ card, onCardClick }) => {
    const cardClass = `card ${card.isFlipped || card.isMatched ? "flipped" : ""} ${card.isMatched ? "matched" : ""}`;

    const handleClick = () => {
        if (card.isMatched || card.isFlipped) {
            return;
        }
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