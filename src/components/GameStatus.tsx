import React from 'react';
import { RotateCcw } from 'lucide-react';

interface GameStatusProps {
  status: string;
  onRestart: () => void;
}

export function GameStatus({ status, onRestart }: GameStatusProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-[600px] bg-white p-4 rounded-lg shadow-md mt-4">
      <p className="text-lg font-medium text-gray-800">{status}</p>
      <button
        onClick={onRestart}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <RotateCcw size={20} />
        Nouvelle partie
      </button>
    </div>
  );
}