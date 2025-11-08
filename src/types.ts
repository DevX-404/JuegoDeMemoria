export interface Card {
    id: number;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface EmojiCategories {
    [key: string]: string[];
}
export type CategoryKey = string; 
