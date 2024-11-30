import React from 'react';
import type { Difficulty } from '../types/chess';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ difficulty, onDifficultyChange }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-gray-700 font-medium">Difficulté:</span>
      <div className="flex gap-2">
        {(['facile', 'moyen', 'difficile'] as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => onDifficultyChange(level)}
            className={`px-4 py-2 rounded-md transition-colors ${
              difficulty === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}