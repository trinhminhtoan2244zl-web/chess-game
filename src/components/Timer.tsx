/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useChessStore } from '../utils/chessStore';
import { User, Cpu, AlertTriangle } from 'lucide-react';

interface TimerProps {
  playerColor: 'w' | 'b';
}

export default function Timer({ playerColor }: TimerProps) {
  const {
    chess,
    whiteTime,
    blackTime,
    timerActive,
    settings,
    tickTimer,
  } = useChessStore();

  // Root level clock intervals to coordinate ticks
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (timerActive) {
      intervalId = setInterval(() => {
        tickTimer();
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerActive, tickTimer]);

  const timeInSeconds = playerColor === 'w' ? whiteTime : blackTime;
  const isTurn = chess.turn() === playerColor;

  // Format time as MM:SS
  const formatTime = (totalSecs: number) => {
    if (settings.timeLimit === null) return '∞';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const formattedSecs = secs < 10 ? `0${secs}` : secs;
    return `${mins}:${formattedSecs}`;
  };

  const getDifficultyLabel = () => {
    switch (settings.difficulty) {
      case 'easy':
        return 'Easy AI';
      case 'medium':
        return 'Medium AI';
      case 'hard':
        return 'Hard AI';
      case 'expert':
        return 'Expert AI';
      default:
        return 'Computer';
    }
  };

  const name = playerColor === 'w' ? 'White Player' : 
               settings.mode === 'vs-ai' ? getDifficultyLabel() : 'Black Player';

  const isLowTime = timeInSeconds > 0 && timeInSeconds <= 30;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
        isTurn
          ? 'bg-neutral-800/85 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/20'
          : 'bg-neutral-900/35 border-neutral-800/80'
      }`}
    >
      {/* Player identity metadata */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            isTurn
              ? 'bg-indigo-600/25 border-indigo-400/50 text-indigo-400 scale-105'
              : 'bg-neutral-800/60 border-neutral-700/50 text-neutral-400'
          }`}
        >
          {playerColor === 'b' && settings.mode === 'vs-ai' ? (
            <Cpu className="w-5 h-5" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        <div>
          <h4 className="text-white text-xs font-bold leading-tight tracking-wide flex items-center gap-1.5">
            {name}
            {isTurn && (
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            )}
          </h4>
          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
            {playerColor === 'w' ? 'WHITE' : 'BLACK'}
          </span>
        </div>
      </div>

      {/* Clock display */}
      <div className="flex items-center gap-2">
        {isLowTime && (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        )}
        <div
          className={`font-mono text-base sm:text-lg font-bold px-3 py-1 rounded-md transition-colors ${
            isLowTime
              ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/30'
              : isTurn
              ? 'bg-black/35 text-indigo-400'
              : 'bg-transparent text-neutral-400'
          }`}
        >
          {formatTime(timeInSeconds)}
        </div>
      </div>
    </div>
  );
}
