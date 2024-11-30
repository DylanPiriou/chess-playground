export interface GameState {
  fen: string;
  lastMove: string | null;
  isGameOver: boolean;
  status: string;
  turn: 'w' | 'b';
}

export type Difficulty = 'facile' | 'moyen' | 'difficile';

export interface PieceValue {
  type: string;
  value: number;
}