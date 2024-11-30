import React, { useState, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { GameStatus } from './components/GameStatus';
import { DifficultySelector } from './components/DifficultySelector';
import { getBestMove } from './utils/chessBot';
import type { GameState, Difficulty } from './types/chess';

function App() {
  const [game, setGame] = useState(new Chess());
  const [difficulty, setDifficulty] = useState<Difficulty>('moyen');
  const [gameState, setGameState] = useState<GameState>({
    fen: game.fen(),
    lastMove: null,
    isGameOver: false,
    status: "C'est votre tour (Blancs)",
    turn: 'w'
  });

  const updateGameState = useCallback((newGame: Chess) => {
    const isGameOver = newGame.isGameOver();
    let status = "C'est votre tour (Blancs)";

    if (isGameOver) {
      if (newGame.isCheckmate()) status = "Échec et mat !";
      else if (newGame.isDraw()) status = "Partie nulle !";
      else status = "Fin de partie !";
    } else if (newGame.turn() === 'b') {
      status = "L'ordinateur réfléchit...";
    }

    setGameState({
      fen: newGame.fen(),
      lastMove: newGame.history({ verbose: true }).slice(-1)[0]?.san || null,
      isGameOver,
      status,
      turn: newGame.turn()
    });
  }, []);

  const makeMove = useCallback((from: Square, to: Square): boolean => {
    try {
      const newGame = new Chess(game.fen());
      const move = newGame.move({ from, to, promotion: 'q' });

      if (move === null) return false;

      setGame(newGame);
      updateGameState(newGame);

      // Bot's turn
      if (!newGame.isGameOver()) {
        setTimeout(() => {
          const botGame = new Chess(newGame.fen());
          const botMove = getBestMove(botGame, difficulty);
          
          botGame.move({ from: botMove.from, to: botMove.to, promotion: 'q' });
          setGame(botGame);
          updateGameState(botGame);
        }, 300);
      }

      return true;
    } catch {
      return false;
    }
  }, [game, updateGameState, difficulty]);

  const handleRestart = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    updateGameState(newGame);
  }, [updateGameState]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Échecs vs Bot</h1>
      <DifficultySelector
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
      />
      <ChessBoard
        position={gameState.fen}
        onPieceDrop={makeMove}
      />
      <GameStatus
        status={gameState.status}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default App;