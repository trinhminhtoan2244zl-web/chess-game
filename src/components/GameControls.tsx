/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useChessStore } from '../utils/chessStore';
import { CHESS_THEMES } from '../utils/chessThemes';
import { BoardThemeId, PieceSetId, Difficulty, GameMode } from '../types';
import {
  RotateCcw,
  Undo2,
  Redo2,
  Volume2,
  VolumeX,
  FileCheck2,
  Key,
  Flame,
  LayoutGrid,
  Trophy,
  Sliders,
  Sparkles,
} from 'lucide-react';

export default function GameControls() {
  const {
    chess,
    fen,
    history,
    futureHistory,
    settings,
    undoMove,
    redoMove,
    resetGame,
    flipBoard,
    toggleSound,
    updateSettings,
    importFen,
  } = useChessStore();

  const [inputFen, setInputFen] = useState('');
  const [fenError, setFenError] = useState(false);
  const [fenSuccess, setFenSuccess] = useState(false);

  const handleImportFen = (e: React.FormEvent) => {
    e.preventDefault();
    setFenError(false);
    setFenSuccess(false);

    if (!inputFen.trim()) return;

    const success = importFen(inputFen.trim());
    if (success) {
      setFenSuccess(true);
      setInputFen('');
      setTimeout(() => setFenSuccess(false), 3000);
    } else {
      setFenError(true);
      setTimeout(() => setFenError(false), 4000);
    }
  };

  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen);
    alert('Active FEN copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-5 h-full bg-neutral-900/40 p-4 border border-neutral-800/60 rounded-2xl overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-neutral-800 backdrop-blur-md">
      {/* Category 1: Active Match Actions */}
      <div className="flex flex-col gap-3">
        <h4 className="text-white text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-neutral-500" /> Match Control
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {/* Restart */}
          <button
            onClick={resetGame}
            className="flex items-center justify-center gap-2 p-2.5 bg-neutral-800 hover:bg-neutral-700/80 active:scale-95 text-white border border-neutral-700 rounded-xl font-medium text-xs sm:text-sm shadowtransition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Chess
          </button>

          {/* Board Flip */}
          <button
            onClick={flipBoard}
            className="flex items-center justify-center gap-2 p-2.5 bg-neutral-800 hover:bg-neutral-700/80 active:scale-95 text-white border border-neutral-700 rounded-xl font-medium text-xs sm:text-sm shadow transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 rotate-90" />
            Flip Chess Board
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={history.length === 0}
            onClick={undoMove}
            className="flex items-center justify-center gap-2 p-2.5 bg-neutral-800 hover:bg-neutral-700/80 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white border border-neutral-700 rounded-xl font-medium text-xs sm:text-sm transition-all"
          >
            <Undo2 className="w-4 h-4" />
            Undo Move
          </button>

          <button
            disabled={futureHistory.length === 0}
            onClick={redoMove}
            className="flex items-center justify-center gap-2 p-2.5 bg-neutral-800 hover:bg-neutral-700/80 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white border border-neutral-700 rounded-xl font-medium text-xs sm:text-sm transition-all"
          >
            <Redo2 className="w-4 h-4" />
            Redo Move
          </button>
        </div>

        {/* Sound setting */}
        <button
          onClick={toggleSound}
          className="flex items-center justify-between p-2.5 bg-neutral-800/60 hover:bg-neutral-700/60 active:scale-98 text-neutral-300 border border-neutral-800 rounded-xl font-medium text-xs transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
            Sound Effects Acoustic
          </span>
          <span className={settings.soundEnabled ? 'text-indigo-400 font-bold' : 'text-neutral-500'}>
            {settings.soundEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Category 2: Mode & Difficulty */}
      <div className="flex flex-col gap-3 border-t border-neutral-800/50 pt-4">
        <h4 className="text-white text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-neutral-500" /> Challenge Configuration
        </h4>

        {/* Game Mode */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Game Mode</label>
          <div className="grid grid-cols-3 gap-1.5 bg-black/25 p-1 rounded-xl border border-neutral-800">
            {[
              { id: 'vs-ai', label: 'AI Match' },
              { id: 'vs-local', label: 'Pass & Play' },
              { id: 'analysis', label: 'Analysis' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => updateSettings({ mode: m.id as GameMode })}
                className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  settings.mode === m.id
                    ? 'bg-indigo-600 text-white shadow-md font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Difficulty */}
        {settings.mode === 'vs-ai' && (
          <div className="flex flex-col gap-1 transition-all">
            <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">AI Thinking Level</label>
            <div className="grid grid-cols-4 gap-1   p-1 bg-black/25 rounded-md border border-neutral-805">
              {[
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Medium' },
                { id: 'hard', label: 'Hard' },
                { id: 'expert', label: 'Expert' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => updateSettings({ difficulty: d.id as Difficulty })}
                  className={`py-1 bg-neutral-900 border border-transparent text-center text-[11px] rounded transition-all cursor-pointer ${
                    settings.difficulty === d.id
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow font-semibold scale-105'
                      : 'text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Limit Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Chess Clock Settings</label>
          <div className="grid grid-cols-5 gap-1 pt-1">
            {[
              { label: 'None', val: null },
              { label: '3m', val: 3 },
              { label: '5m', val: 5 },
              { label: '10m', val: 10 },
              { label: '30m', val: 30 },
            ].map((t, idx) => (
              <button
                key={idx}
                onClick={() => updateSettings({ timeLimit: t.val })}
                className={`py-1 px-1 bg-neutral-800 hover:bg-neutral-700/80 active:bg-neutral-600/85 text-[11px] font-medium rounded border border-neutral-700 text-center transition-colors cursor-pointer ${
                  settings.timeLimit === t.val
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-neutral-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category 3: Custom Themes & Styling */}
      <div className="flex flex-col gap-3 border-t border-neutral-800/50 pt-4">
        <h4 className="text-white text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5 text-neutral-500" /> Boards & Themes
        </h4>

        {/* Custom Board Theme Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Board Color theme</label>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.keys(CHESS_THEMES).map((themeKey) => {
              const th = CHESS_THEMES[themeKey as BoardThemeId];
              return (
                <button
                  key={themeKey}
                  onClick={() => updateSettings({ theme: themeKey as BoardThemeId })}
                  className={`flex items-center gap-2 p-2 bg-neutral-800 hover:bg-neutral-700 border rounded-xl transition-all select-none cursor-pointer ${
                    settings.theme === themeKey ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-neutral-700'
                  }`}
                >
                  <div className="flex w-5 h-5 rounded border border-neutral-900 overflow-hidden">
                    <div className={`w-1/2 h-full ${th.lightSquare}`}></div>
                    <div className={`w-1/2 h-full ${th.darkSquare}`}></div>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-200">{th.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Piece Sets */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Piece Design Set</label>
          <div className="grid grid-cols-3 gap-1.5 bg-black/25 p-1 rounded-xl border border-neutral-800">
            {[
              { id: 'classic', label: 'Classic 3D' },
              { id: 'modern', label: 'Neon Cyber' },
              { id: 'minimalist', label: 'Glyphs' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => updateSettings({ pieceSet: p.id as PieceSetId })}
                className={`py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                  settings.pieceSet === p.id
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category 4: FEN Board State Exporter/Importer */}
      <div className="flex flex-col gap-3 border-t border-neutral-800/50 pt-4">
        <h4 className="text-white text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-neutral-500" /> FEN State Exporter
        </h4>

        {/* Copy current FEN */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Active Board FEN</label>
          <div className="flex items-center gap-2 bg-black/45 p-1 px-2.5 rounded-lg border border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 truncate flex-1 leading-normal">{fen}</span>
            <button
              onClick={handleCopyFen}
              className="p-1 text-indigo-400 hover:text-indigo-300 font-bold hover:bg-indigo-500/10 rounded transition-all shrink-0 cursor-pointer text-xs"
            >
              Copy FEN
            </button>
          </div>
        </div>

        {/* Import FEN state */}
        <form onSubmit={handleImportFen} className="flex flex-col gap-1.5">
          <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Import custom FEN Positions</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputFen}
              onChange={(e) => setInputFen(e.target.value)}
              placeholder="Paste custom FEN code here..."
              className="flex-1 bg-black/45 hover:bg-black/60 focus:bg-black/75 transition-all outline-none border border-neutral-800 focus:border-indigo-500/50 rounded-lg p-1.5 px-3 text-[11px] font-mono text-neutral-300 placeholder-neutral-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-lg text-xs transition-all shrink-0 cursor-pointer"
            >
              Load Custom
            </button>
          </div>

          {fenError && (
            <span className="text-[10px] text-red-400 font-medium px-1 flex items-center gap-1">
              • Invalid FEN layout format. Position neglected.
            </span>
          )}
          {fenSuccess && (
            <span className="text-[10px] text-emerald-400 font-medium px-1 flex items-center gap-1">
              ✓ Successfully loaded FEN state onto active chess board.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
