/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Square } from 'chess.js';
import { useChessStore } from '../utils/chessStore';
import { CHESS_THEMES } from '../utils/chessThemes';
import { ChessPieces, MinimalistChessPieces, ModernChessPieces } from './ChessPieces';
import { motion, AnimatePresence } from 'motion/react';

export default function Chessboard() {
  const {
    chess,
    fen,
    selectedSquare,
    legalMoves,
    lastMove,
    checkSquare,
    settings,
    isAiThinking,
    selectSquare,
    makeMove,
  } = useChessStore();

  const theme = CHESS_THEMES[settings.theme] || CHESS_THEMES.emerald;

  // Local state for pawn promotion modal
  const [promotionPending, setPromotionPending] = useState<{
    from: string;
    to: string;
  } | null>(null);

  // Capture particle effects list
  const [captureEffects, setCaptureEffects] = useState<{
    id: string;
    square: string;
    capturer: string;
    captured: string;
    isWhiteCapturing: boolean;
  }[]>([]);

  useEffect(() => {
    if (!lastMove) return;

    const historyVerbose = chess.history({ verbose: true });
    if (historyVerbose.length === 0) return;
    const lastMoveVerbose = historyVerbose[historyVerbose.length - 1];

    if (lastMoveVerbose && lastMoveVerbose.captured) {
      const isWhiteCapturing = lastMoveVerbose.color === 'w';
      const id = `${Date.now()}-${Math.random()}`;
      setCaptureEffects((prev) => [
        ...prev,
        {
          id,
          square: lastMove.to,
          capturer: lastMoveVerbose.piece,
          captured: lastMoveVerbose.captured,
          isWhiteCapturing,
        },
      ]);

      const timer = setTimeout(() => {
        setCaptureEffects((prev) => prev.filter((eff) => eff.id !== id));
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [fen, lastMove]);

  // 8 direction vectors for spectacular explosion particles
  const PARTICLE_DIRECTIONS = [
    { x: -36, y: -36 },
    { x: 0, y: -48 },
    { x: 36, y: -36 },
    { x: 48, y: 0 },
    { x: 36, y: 36 },
    { x: 0, y: 48 },
    { x: -36, y: 36 },
    { x: -48, y: 0 }
  ];

  const getComicLabel = (capturer: string) => {
    switch (capturer.toLowerCase()) {
      case 'r': return { text: 'XE GẦM RÚ! 🚜', style: 'from-amber-500 via-orange-500 to-red-600 border-amber-400 text-white shadow-[0_0_12px_rgba(249,115,22,0.6)]' };
      case 'b': return { text: 'VOI GẦM SẤM! 🐘', style: 'from-cyan-500 via-sky-505 to-indigo-600 border-cyan-400 text-white shadow-[0_0_12px_rgba(34,211,238,0.6)]' };
      case 'n': return { text: 'MÃ HÍ! 🐴', style: 'from-emerald-400 via-teal-500 to-emerald-600 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.6)]' };
      case 'q': return { text: 'HẬU PHÉP THUẬT! ⚡', style: 'from-fuchsia-400 via-purple-600 to-pink-600 border-fuchsia-400 text-white shadow-[0_0_12px_rgba(217,70,239,0.6)]' };
      case 'k': return { text: 'THIÊN VƯƠNG! 👑', style: 'from-rose-500 via-red-500 to-amber-500 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)]' };
      default: return { text: 'TỐT ĐỘT KÍCH! 💥', style: 'from-yellow-400 via-amber-400 to-orange-500 border-yellow-300 text-neutral-900 shadow-[0_0_8px_rgba(234,179,8,0.5)]' };
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, squareStr: string) => {
    if (isAiThinking || chess.turn() !== 'w' && settings.mode === 'vs-ai') {
      e.preventDefault();
      return;
    }
    // Select the clicked piece
    selectSquare(squareStr);
    e.dataTransfer.setData('text/plain', squareStr);
    // Visual effect
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, squareStr: string) => {
    // If it's a valid legal move target, allow drop
    if (legalMoves.includes(squareStr)) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent, targetSquare: string) => {
    e.preventDefault();
    const sourceSquare = e.dataTransfer.getData('text/plain');
    if (!sourceSquare || sourceSquare === targetSquare) return;

    attemptMove(sourceSquare, targetSquare);
  };

  // Helper to coordinate pawn promotion checks
  const attemptMove = (from: string, to: string) => {
    const piece = chess.get(from as Square);
    if (!piece) return;

    // Check if it is a pawn promotion move
    // Pawn promotion occurs when a pawn reaches the 8th rank for White or 1st rank for Black
    const isPawn = piece.type === 'p';
    const targetRank = to[1];
    const isPromotionRank = (piece.color === 'w' && targetRank === '8') || (piece.color === 'b' && targetRank === '1');

    if (isPawn && isPromotionRank) {
      // Open promotion dialog
      setPromotionPending({ from, to });
    } else {
      makeMove(from, to);
    }
  };

  const handleSelectPromotion = (pieceCode: string) => {
    if (promotionPending) {
      makeMove(promotionPending.from, promotionPending.to, pieceCode);
      setPromotionPending(null);
    }
  };

  // Generates coordinate ranks and files accounting for board flip
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const orderedFiles = settings.flipped ? [...files].reverse() : files;
  const orderedRanks = settings.flipped ? [...ranks].reverse() : ranks;

  // Visual helper to render coordinates inside corner squares
  const getFileLabel = (file: string, rank: string) => {
    // Show alphabetical file labels only on the bottom rank
    const bottomRank = orderedRanks[7];
    if (rank === bottomRank) {
      return <span className="absolute bottom-0.5 right-1 text-[9px] font-semibold opacity-60 pointer-events-none">{file}</span>;
    }
    return null;
  };

  const getRankLabel = (file: string, rank: string) => {
    // Show rank number labels only on the left file
    const leftFile = orderedFiles[0];
    if (file === leftFile) {
      return <span className="absolute top-0.5 left-1 text-[9px] font-semibold opacity-60 pointer-events-none">{rank}</span>;
    }
    return null;
  };

  const getPieceComponent = (type: string, color: string) => {
    const code = `${color}${type}`.toLowerCase();
    if (settings.pieceSet === 'minimalist') {
      return MinimalistChessPieces[code] || null;
    }
    if (settings.pieceSet === 'modern') {
      return ModernChessPieces[code] || null;
    }
    return ChessPieces[code] || null;
  };

  return (
    <div id="chessboard-container" className="relative w-full aspect-square max-w-[540px] mx-auto select-none">
      {/* Visual Engine Evaluation Bar (rendered as left outline/glow border) */}
      <div className={`w-full h-full rounded-xl p-1.5 border-4 ${theme.border} bg-neutral-900 shadow-2xl relative overflow-hidden backdrop-blur-md`}>
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-lg overflow-hidden">
          {orderedRanks.map((rank) => {
            return orderedFiles.map((file) => {
              const squareStr = `${file}${rank}`;
              const isDark = (files.indexOf(file) + ranks.indexOf(rank)) % 2 !== 0;
              const squareBg = isDark ? theme.darkSquare : theme.lightSquare;

              const piece = chess.get(squareStr as Square);

              const isSelected = selectedSquare === squareStr;
              const isLegal = legalMoves.includes(squareStr);
              const isLastMoveSrc = lastMove?.from === squareStr;
              const isLastMoveDst = lastMove?.to === squareStr;
              const isCheckingKing = checkSquare === squareStr;

              // Generate custom highlight classes based on state
              let highlightClass = '';
              if (isLastMoveSrc || isLastMoveDst) {
                highlightClass = isDark ? theme.darkHighlight : theme.lightHighlight;
              }

              return (
                <div
                  id={`square-${squareStr}`}
                  key={squareStr}
                  onClick={() => {
                    if (promotionPending) return;
                    // Handle selection or movement
                    if (isSelected) {
                      selectSquare(null);
                    } else if (isLegal && selectedSquare) {
                      attemptMove(selectedSquare, squareStr);
                    } else {
                      selectSquare(squareStr);
                    }
                  }}
                  onDragOver={(e) => handleDragOver(e, squareStr)}
                  onDrop={(e) => handleDrop(e, squareStr)}
                  className={`relative aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 ${squareBg} ${highlightClass} ${
                    isSelected ? 'ring-2 ring-indigo-500/80 ring-inset z-10' : ''
                  } ${isCheckingKing ? 'animate-pulse ring-4 ring-rose-500 ring-inset bg-rose-500/30' : ''}`}
                >
                  {/* File and Rank Coordinate Text inside squares */}
                  {getFileLabel(file, rank)}
                  {getRankLabel(file, rank)}

                  {/* Chess piece graphic */}
                  {piece && (
                    <motion.div
                      draggable
                      onDragStart={(e) => handleDragStart(e, squareStr)}
                      className="w-[84%] h-[84%] flex items-center justify-center cursor-grab active:cursor-grabbing z-10 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
                      whileHover={{ scale: 1.15, y: -4, rotate: [0, -1.5, 1.5, 0] }}
                      whileTap={{ scale: 0.90, rotate: 2 }}
                    >
                      {React.createElement(getPieceComponent(piece.type, piece.color))}
                    </motion.div>
                  )}

                  {/* Legal move indicators: small transparent circle, or thick ring if target has piece */}
                  {isLegal && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      {piece ? (
                        // Ring highlight for capture targets
                        <div className="w-[85%] h-[85%] rounded-full border-4 border-indigo-500/50" />
                      ) : (
                        // Solid dot for empty square legal moves
                        <div className="w-[24%] h-[24%] rounded-full bg-indigo-500/40" />
                      )}
                    </div>
                  )}

                  {/* Capture visual feedback assets (particles, ripples & comic labels) */}
                  <AnimatePresence>
                    {captureEffects
                      .filter((eff) => eff.square === squareStr)
                      .map((eff) => {
                        const labelInfo = getComicLabel(eff.capturer);
                        return (
                          <div key={eff.id} className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-visible">
                            {/* 1. Exploding expanding shockwave circle */}
                            <motion.div
                              className={`absolute rounded-full border-4 ${
                                eff.isWhiteCapturing
                                  ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.7)]'
                                  : 'border-rose-500 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.7)]'
                              }`}
                              initial={{ width: '40%', height: '40%', opacity: 1, scale: 0.4 }}
                              animate={{ width: '220%', height: '220%', opacity: 0, scale: 2.2 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.65, ease: 'easeOut' }}
                            />

                            {/* 2. Spark particles burst */}
                            {PARTICLE_DIRECTIONS.map((dir, pIdx) => (
                              <motion.div
                                key={pIdx}
                                className={`absolute w-2 h-2 rounded-full ${
                                  eff.isWhiteCapturing
                                    ? 'bg-gradient-to-br from-cyan-300 to-teal-400 shadow-[0_0_6px_#22d3ee]'
                                    : 'bg-gradient-to-br from-rose-400 to-red-600 shadow-[0_0_6px_#f43f5e]'
                                }`}
                                initial={{ x: 0, y: 0, scale: 0.6, opacity: 1 }}
                                animate={{
                                  x: dir.x,
                                  y: dir.y,
                                  scale: 0,
                                  opacity: 0,
                                }}
                                transition={{
                                  duration: 0.8,
                                  ease: 'easeOut',
                                  delay: pIdx * 0.01,
                                }}
                              />
                            ))}

                            {/* 3. Splendid comic badge with Viet translation rising up */}
                            <motion.div
                              className={`absolute whitespace-nowrap bg-gradient-to-r ${labelInfo.style} border px-2 py-0.75 text-[10px] font-black uppercase tracking-wider rounded-md z-40`}
                              initial={{ y: 20, scale: 0.4, opacity: 0, rotate: -5 }}
                              animate={{
                                y: -45,
                                scale: [0.7, 1.15, 1],
                                opacity: [0, 1, 1, 0],
                                rotate: [5, -5, 2]
                              }}
                              transition={{
                                times: [0, 0.2, 0.8, 1],
                                duration: 1.2,
                                ease: 'easeOut',
                              }}
                            >
                              {labelInfo.text}
                            </motion.div>
                          </div>
                        );
                      })}
                  </AnimatePresence>
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* AI Turn Calculating Indicator */}
      {isAiThinking && (
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-40 transition-opacity animate-fade-in">
          <div className="bg-slate-900/90 border border-slate-700/50 p-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-sm font-medium tracking-wide">Computer thinking...</span>
          </div>
        </div>
      )}

      {/* Pawn Promotion Modal Overlay */}
      {promotionPending && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-700 p-5 rounded-2xl shadow-2xl max-w-xs text-center">
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">Pawn Promotion</h3>
            <p className="text-neutral-400 text-xs mb-5">Choose a piece to promote your pawn to:</p>
            <div className="grid grid-cols-4 gap-3 bg-neutral-850 p-2.5 rounded-xl border border-neutral-800">
              {['q', 'n', 'r', 'b'].map((pieceCode) => {
                const PieceIcon = getPieceComponent(pieceCode, chess.turn());
                return (
                  <button
                    key={pieceCode}
                    onClick={() => handleSelectPromotion(pieceCode)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 hover:scale-105 active:scale-95 border border-neutral-700 rounded-xl flex items-center justify-center aspect-square transition-all"
                  >
                    {PieceIcon && React.createElement(PieceIcon, { className: 'w-10 h-10' })}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
