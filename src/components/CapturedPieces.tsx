/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Chess } from 'chess.js';
import { useChessStore } from '../utils/chessStore';

interface CapturedPiecesProps {
  color: 'w' | 'b'; // The player to show pieces FOR (e.g., 'w' means White player, who has captured Black pieces)
}

const pieceSymbols: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
};

const pieceValue: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

export default function CapturedPieces({ color }: CapturedPiecesProps) {
  const { chess } = useChessStore();

  const getCapturedState = () => {
    const initial = {
      w: { p: 8, n: 2, b: 2, r: 2, q: 1 },
      b: { p: 8, n: 2, b: 2, r: 2, q: 1 },
    };
    const active = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    };

    // Calculate active piece count
    for (const row of chess.board()) {
      for (const sq of row) {
        if (sq && sq.type !== 'k') {
          active[sq.color as 'w' | 'b'][sq.type as 'p' | 'n' | 'b' | 'r' | 'q']++;
        }
      }
    }

    const capturedW: string[] = []; // White pieces captured (held by Black)
    const capturedB: string[] = []; // Black pieces captured (held by White)

    for (const type of ['p', 'n', 'b', 'r', 'q'] as const) {
      // White pieces
      const diffW = initial.w[type] - active.w[type];
      for (let i = 0; i < diffW; i++) capturedW.push(type);

      // Black pieces
      const diffB = initial.b[type] - active.b[type];
      for (let i = 0; i < diffB; i++) capturedB.push(type);
    }

    // Sort pieces by value first
    capturedW.sort((a, b) => pieceValue[a] - pieceValue[b]);
    capturedB.sort((a, b) => pieceValue[a] - pieceValue[b]);

    // Calculate material tallies
    const scoreW = capturedB.reduce((sum, type) => sum + pieceValue[type], 0); // White captured Black's pieces
    const scoreB = capturedW.reduce((sum, type) => sum + pieceValue[type], 0); // Black captured White's pieces
    const difference = scoreW - scoreB;

    return {
      capturedW,
      capturedB,
      difference,
    };
  };

  const { capturedW, capturedB, difference } = getCapturedState();

  // If color is 'w' (White), show the pieces WHITE has captured (which are Black pieces!)
  const capturedToShow = color === 'w' ? capturedB : capturedW;
  const isWhiteBetter = difference > 0;
  const isBlackBetter = difference < 0;

  // Formatting material differential indicator
  const displayDiff = () => {
    if (color === 'w' && isWhiteBetter) return `+${difference}`;
    if (color === 'b' && isBlackBetter) return `+${Math.abs(difference)}`;
    return null;
  };

  if (capturedToShow.length === 0) return <div className="h-4" />;

  return (
    <div className="flex items-center gap-1.5 py-1 px-2 bg-neutral-850/50 rounded-lg border border-neutral-800/40 text-xs text-neutral-400 select-none max-w-max">
      <div className="flex items-center -space-x-1 overflow-hidden">
        {capturedToShow.map((type, idx) => (
          <span
            key={idx}
            className={`text-sm sm:text-base tracking-tight hover:scale-110 active:scale-95 transition-transform ${
              color === 'w' ? 'text-neutral-500' : 'text-neutral-300'
            }`}
          >
            {pieceSymbols[type]}
          </span>
        ))}
      </div>
      {displayDiff() && (
        <span className="ml-1 px-1.5 py-0.2 bg-indigo-500/10 border border-indigo-500/25 rounded font-bold text-[10px] text-indigo-400">
          {displayDiff()}
        </span>
      )}
    </div>
  );
}
