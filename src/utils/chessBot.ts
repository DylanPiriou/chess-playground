import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import type { Difficulty, PieceValue } from '../types/chess';

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,   // pawn
  n: 3,   // knight
  b: 3,   // bishop
  r: 5,   // rook
  q: 9,   // queen
  k: 0    // king (not used in evaluation)
};

// Position weights for pieces (center control is better)
const POSITION_WEIGHTS = [
  [0.1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1],
  [0.1, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.1],
  [0.1, 0.3, 0.4, 0.4, 0.4, 0.4, 0.3, 0.1],
  [0.1, 0.3, 0.4, 0.5, 0.5, 0.4, 0.3, 0.1],
  [0.1, 0.3, 0.4, 0.5, 0.5, 0.4, 0.3, 0.1],
  [0.1, 0.3, 0.4, 0.4, 0.4, 0.4, 0.3, 0.1],
  [0.1, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.1],
  [0.1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1]
];

function evaluatePosition(game: Chess): number {
  let score = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (square) {
        const pieceValue = PIECE_VALUES[square.type];
        const positionValue = POSITION_WEIGHTS[i][j];
        const value = pieceValue + positionValue;
        score += square.color === 'b' ? value : -value;
      }
    }
  }

  return score;
}

function getRandomMove(moves: any[]): { from: Square; to: Square } {
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  return {
    from: randomMove.from as Square,
    to: randomMove.to as Square
  };
}

function getBestMoveMinMax(game: Chess, depth: number): { from: Square; to: Square } {
  const moves = game.moves({ verbose: true });
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    game.move(move);
    const score = -minimax(game, depth - 1, -Infinity, Infinity, false);
    game.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return {
    from: bestMove.from as Square,
    to: bestMove.to as Square
  };
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0) {
    return evaluatePosition(game);
  }

  const moves = game.moves({ verbose: true });

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of moves) {
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

export function getBestMove(game: Chess, difficulty: Difficulty): { from: Square; to: Square } {
  const moves = game.moves({ verbose: true });
  
  switch (difficulty) {
    case 'facile':
      return getRandomMove(moves);
    
    case 'moyen':
      // 50% chance of making a random move, 50% chance of making a good move
      if (Math.random() < 0.5) {
        return getRandomMove(moves);
      }
      return getBestMoveMinMax(game, 2);
    
    case 'difficile':
      // Use minimax with depth 3 for better moves
      return getBestMoveMinMax(game, 3);
    
    default:
      return getRandomMove(moves);
  }
}