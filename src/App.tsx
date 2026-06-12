/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Chessboard from './components/Chessboard';
import Timer from './components/Timer';
import MoveHistory from './components/MoveHistory';
import GameControls from './components/GameControls';
import AnalysisPanel from './components/AnalysisPanel';
import CapturedPieces from './components/CapturedPieces';
import { useChessStore } from './utils/chessStore';
import {
  Trophy,
  Sun,
  Moon,
  HelpCircle,
  GitBranch,
  Crown,
  Cpu,
  User,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  const {
    gameStatus,
    chess,
    history,
    resetGame,
    settings,
  } = useChessStore();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Auto-toggles timer activation when any move is played
  const timerActive = useChessStore((state) => state.timerActive);
  const startTimer = useChessStore((state) => state.updateSettings);

  const handleStartGameWithClock = () => {
    // Triggers timer activation
    // If untimed, does not matter, otherwise starts counting down on turn
    if (history.length === 0) {
      // White starts turn
      useChessStore.setState({ timerActive: settings.timeLimit !== null });
    }
  };

  // Get current visual mood colors
  const moodBg = isDarkMode
    ? 'bg-gradient-to-br from-neutral-950 via-zinc-900 to-stone-950 text-white'
    : 'bg-gradient-to-br from-slate-50 via-slate-100 to-[#eceff1] text-neutral-905';

  const cardBg = isDarkMode
    ? 'bg-neutral-900/60 border border-neutral-800/80'
    : 'bg-white border border-slate-205/80 shadow';

  const textPrimary = isDarkMode ? 'text-white' : 'text-neutral-900';
  const textSecondary = isDarkMode ? 'text-neutral-400' : 'text-neutral-600';

  // Get textual display for Game-Over Screen
  const getGameOverOverlayDetails = () => {
    switch (gameStatus) {
      case 'checkmate':
        const winningColor = chess.turn() === 'w' ? 'Black' : 'White';
        return {
          title: 'Checkmate!',
          sub: `${winningColor} pieces have claimed absolute victory.`,
          isWinner: winningColor === 'White',
        };
      case 'stalemate':
        return {
          title: 'Stalemate Draw',
          sub: 'The active player is trapped with zero legal moves. Match balanced.',
          isWinner: null,
        };
      case 'draw-repetition':
        return {
          title: 'Draw by Threefold Repetition',
          sub: 'The exact position has repeatedly appeared three times.',
          isWinner: null,
        };
      case 'draw-insufficient':
        return {
          title: 'Draw by Lack of Material',
          sub: 'Neither player has sufficient force remaining to deliver mate.',
          isWinner: null,
        };
      case 'draw-fifty':
        return {
          title: 'Draw (Fifty-Move Rule)',
          sub: 'Fifty moves occurred without pawn advancement or block capture.',
          isWinner: null,
        };
      case 'timeout-w':
        return {
          title: 'Black wins on Time!',
          sub: 'White player exhausted their allotted clock budget.',
          isWinner: false,
        };
      case 'timeout-b':
        return {
          title: 'White wins on Time!',
          sub: 'Black player exhausted their allotted clock budget.',
          isWinner: true,
        };
      case 'resign-w':
        return {
          title: 'Black wins by Resignation',
          sub: 'White elected to lay down their blades.',
          isWinner: false,
        };
      case 'resign-b':
        return {
          title: 'White wins by Resignation',
          sub: 'Black elected to lay down their blades.',
          isWinner: true,
        };
      default:
        return null;
    }
  };

  const overlayDetails = getGameOverOverlayDetails();

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-all duration-300 ${moodBg}`}>
      
      {/* HEADER SECTION */}
      <header className={`px-4 sm:px-6 py-3.5 border-b sticky top-0 z-30 backdrop-blur-md ${
        isDarkMode ? 'border-neutral-800/80 bg-neutral-950/80' : 'border-slate-200/80 bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white scale-102 hover:rotate-6 transition-all">
              <Trophy className="w-5 h-5 sm:w-5.5 sm:h-5.5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight flex items-center gap-1.5 leading-none">
                Chess Grandmaster
                <span className="px-1.5 py-0.2 text-[8px] font-mono border border-indigo-500/35 bg-indigo-500/10 text-indigo-400 font-bold rounded uppercase">STADIUM</span>
              </h1>
              <p className="text-[10px] text-neutral-500 font-semibold leading-none mt-0.5">REACT • VITE • TS • ENGINE</p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowToPlay(!showHowToPlay)}
              className={`p-2 rounded-xl transition-all border shrink-0 ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800' 
                  : 'bg-white border-slate-200 text-neutral-600 hover:bg-slate-50'
              }`}
              title="How to play rules"
            >
              <HelpCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-all border shrink-0 ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-amber-400 hover:bg-neutral-800' 
                  : 'bg-white border-slate-200 text-violet-500 hover:bg-slate-50'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* DETAILED HELP GUIDE / RULES OVERLAY */}
      {showHowToPlay && (
        <div className="bg-indigo-600 text-white py-3.5 px-4 text-center text-xs relative animate-fade-in border-b border-indigo-500 shadow-md">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-start gap-2.5">
              <span className="text-xl leading-none">💡</span>
              <div>
                <strong className="block font-bold mb-0.5">Pro Chess Combat Tips</strong>
                <span className="opacity-90 leading-relaxed block">
                  Click on any piece to look up its precise legal destinations (light dots). Drag-and-drop pieces or choose target grids using clicks. Engage the Engine, analyze best move vectors, or practice locally (Pass & Play) with clocks!
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="p-1 px-3 bg-white/20 hover:bg-white/35 text-white text-[11px] font-bold rounded-lg transition-all shrink-0 uppercase tracking-widest scale-98"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* CORE CONTENT LAYOUT */}
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto w-full grid grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: THE COMBAT CHESSBOARD ZONE (9 cols on lg, 12 on mobile) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          
          {/* Top Info Bar (Black Side Captured Pieces + Black State Clock) */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                {settings.mode === 'vs-ai' ? <Cpu className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />} Black Challenger
              </span>
              <CapturedPieces color="b" />
            </div>
            
            {/* Start match countdown flag if untimed clock */}
            {!timerActive && settings.timeLimit !== null && history.length === 0 && (
              <button
                onClick={handleStartGameWithClock}
                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 scale-95 hover:scale-98 active:scale-90 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 rounded-full transition-all"
              >
                <Play className="w-3 h-3 fill-white" /> Activate Chess Clock
              </button>
            )}
          </div>

          {/* Black Player Timer */}
          {settings.timeLimit !== null && <Timer playerColor="b" />}

          {/* INTERACTIVE CHESS BOARD GRID CONTAINER */}
          <div className="relative">
            <Chessboard />
          </div>

          {/* White Player Timer */}
          {settings.timeLimit !== null && <Timer playerColor="w" />}

          {/* Bottom Info Bar (White Player Captured Pieces) */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> White Player
              </span>
              <CapturedPieces color="w" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR METRICS, LOGS & SETTINGS PANELS (4 cols on lg, 12 on mobile) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Engine Real-time Analysis Section */}
          <AnalysisPanel />

          {/* PGN Move Notation History Log */}
          <div className="h-[220px] sm:h-[300px]">
            <MoveHistory />
          </div>

          {/* Settings Modals & Challenge Configurations Panel */}
          <GameControls />
        </div>
      </main>

      {/* GAME OVER DIALOG POPUP / OVERLAY */}
      {overlayDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className={`p-6 sm:p-9 rounded-3xl max-w-sm w-full text-center border shadow-2xl relative overflow-hidden transition-all duration-300 ${
            isDarkMode 
              ? 'bg-neutral-900 border-neutral-700/80 shadow-indigo-500/5' 
              : 'bg-white border-slate-200'
          }`}>
            
            {/* Visual Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-5 scale-102">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <h2 className={`text-xl sm:text-2xl font-black tracking-wide mb-2 ${textPrimary}`}>
              {overlayDetails.title}
            </h2>
            
            <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${textSecondary}`}>
              {overlayDetails.sub}
            </p>

            {/* Quick stats summarizing overall progress */}
            <div className="bg-black/25 rounded-2xl border border-neutral-800/40 p-4 mb-6 flex justify-around text-center select-none font-mono text-xs text-neutral-400">
              <div>
                <span className="block font-bold text-white text-base">{history.length}</span>
                <span>Plies Played</span>
              </div>
              <div className="border-l border-neutral-800 w-px h-8 self-center" />
              <div>
                <span className="block font-bold text-white text-base">
                  {settings.timeLimit ? `${settings.timeLimit}m` : 'Untimed'}
                </span>
                <span>Match Format</span>
              </div>
            </div>

            {/* Rematch trigger button */}
            <button
              onClick={resetGame}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm tracking-widest uppercase shadow-lg shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Initiate Rematch
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL FOOTER */}
      <footer className={`py-6 mt-auto text-center border-t text-xs select-none ${
        isDarkMode ? 'border-neutral-900 text-neutral-600' : 'border-slate-250 text-neutral-500'
      }`}>
        <p className="font-semibold uppercase tracking-widest text-[9px]">
          Chess Grandmaster Platform • Designed in React & TypeScript
        </p>
      </footer>
    </div>
  );
}
