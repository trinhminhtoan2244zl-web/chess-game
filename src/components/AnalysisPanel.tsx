/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useChessStore } from '../utils/chessStore';
import { getBestMove } from '../utils/aiEngine';
import { Sparkles, BarChart2 } from 'lucide-react';

export default function AnalysisPanel() {
  const { chess, evaluation, gameStatus, settings } = useChessStore();
  const [bestMoveText, setBestMoveText] = useState<string>('Computing...');
  const [bestMoveScore, setBestMoveScore] = useState<number>(0);

  // Re-calculate engine analysis recommendation when board FEN updates
  useEffect(() => {
    if (gameStatus !== 'active') {
      setBestMoveText('Game Over');
      return;
    }

    setBestMoveText('Analyzing...');
    const timer = setTimeout(() => {
      try {
        const result = getBestMove(chess, 'hard'); // Engine suggests moves with its 'hard' level depth
        setBestMoveText(result.move);
        setBestMoveScore(result.score / 100);
      } catch (e) {
        setBestMoveText('None');
      }
    }, 450); // Small debounce to avoid lagging during fast manual moves

    return () => clearTimeout(timer);
  }, [chess, gameStatus]);

  // Map evaluation value (clamped between -8 and +8) to percentage height for the evaluation bar
  // +8 (White winning) => 100% White
  // -8 (Black winning) => 0% White
  const score = evaluation;
  const clampedScore = Math.min(8, Math.max(-8, score));
  const whitePercent = 50 + (clampedScore / 16) * 100;
  const blackPercent = 100 - whitePercent;

  const displayScoreText = () => {
    if (gameStatus === 'checkmate') return 'Checkmate';
    if (score === 0) return '0.00';
    return (score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2));
  };

  return (
    <div className="flex flex-col bg-neutral-900/40 border border-neutral-800/60 p-4 rounded-2xl backdrop-blur-md">
      {/* Title */}
      <h4 className="text-white text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Real-time Analysis Mode
      </h4>

      {/* Grid containing analysis bar structure */}
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Horizontal Evaluation bar for visual indicators */}
        <div className="col-span-12 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-semibold mb-0.5">
            <span className="flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-indigo-400" /> Engine Evaluation
            </span>
            <span className={`font-mono text-xs font-bold px-1.5 py-0.5 bg-black/35 rounded ${
              score > 0 ? 'text-indigo-400' : score < 0 ? 'text-rose-400' : 'text-neutral-400'
            }`}>
              {displayScoreText()}
            </span>
          </div>

          {/* Bar track slider */}
          <div className="w-full h-4 bg-neutral-950 rounded-full overflow-hidden flex border border-neutral-800/80 p-[1.5px]">
            {/* White side */}
            <div
              style={{ width: `${whitePercent}%` }}
              className="h-full bg-white transition-all duration-500 ease-out rounded-l-full relative"
              title={`White layout evaluation: ${whitePercent.toFixed(1)}%`}
            >
              <span className="absolute left-2.5 top-0 text-[8px] font-bold text-neutral-950 uppercase opacity-35 mix-blend-difference pointer-events-none self-center h-full flex items-center">W</span>
            </div>
            
            {/* Black side */}
            <div
              style={{ width: `${blackPercent}%` }}
              className="h-full bg-neutral-900 transition-all duration-500 ease-out rounded-r-full relative"
              title={`Black layout evaluation: ${blackPercent.toFixed(1)}%`}
            >
              <span className="absolute right-2.5 top-0 text-[8px] font-bold text-white uppercase opacity-35 mix-blend-difference pointer-events-none self-center h-full flex items-center">B</span>
            </div>
          </div>
        </div>

        {/* Tactical Best move prediction block */}
        <div className="col-span-12 bg-black/25 rounded-xl border border-neutral-800 p-3.5 flex flex-col gap-1 text-center sm:text-left">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-semibold flex items-center justify-center sm:justify-start gap-1">
            Recommended Action
          </span>
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 mt-1">
            <span className="text-xl font-mono font-black text-indigo-400 tracking-wide">
              {bestMoveText}
            </span>
            {bestMoveText !== 'Computing...' && bestMoveText !== 'Analyzing...' && bestMoveText !== 'Game Over' && (
              <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 bg-neutral-800 border border-neutral-700/60 rounded">
                Line Evaluated: {(bestMoveScore > 0 ? '+' : '') + bestMoveScore.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
