export interface Card {
  name: string;
  power: number;
  speed: number;
  torque: number;
  imageUrl: string;
}

export interface Player {
  name: string;
  cards: Card[];
}
