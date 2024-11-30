import React from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';

interface ChessBoardProps {
  position: string;
  onPieceDrop: (source: Square, target: Square) => boolean;
}

export function ChessBoard({ position, onPieceDrop }: ChessBoardProps) {
  return (
    <div className="w-full max-w-[600px] aspect-square">
      <Chessboard
        position={position}
        onPieceDrop={onPieceDrop}
        boardWidth={600}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
        }}
      />
    </div>
  );
}