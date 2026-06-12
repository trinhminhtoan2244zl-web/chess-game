/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Chess, Square } from 'chess.js';
import { GameSettings, GameStatus, MoveRecord, BoardThemeId, PieceSetId, Difficulty, GameMode } from '../types';
import { chessAudio } from './audio';
import { getBestMove, evaluateBoard } from './aiEngine';

interface ChessState {
  chess: Chess;
  fen: string;
  gameStatus: GameStatus;
  isAiThinking: boolean;
  selectedSquare: string | null;
  legalMoves: string[]; // target squares e.g. ['e3', 'e4']
  history: MoveRecord[];
  futureHistory: MoveRecord[]; // for undo/redo
  lastMove: { from: string; to: string } | null;
  checkSquare: string | null;
  whiteTime: number; // in seconds
  blackTime: number; // in seconds
  timerActive: boolean;
  evaluation: number; // positive = white advantage, negative = black advantage
  bestLine: string[]; // engine prediction

  // Settings
  settings: GameSettings;

  // Actions
  selectSquare: (square: string | null) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  makeAiMove: () => void;
  undoMove: () => void;
  redoMove: () => void;
  resetGame: () => void;
  updateSettings: (updates: Partial<GameSettings>) => void;
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTimeLimit: (minutes: number | null) => void;
  setTheme: (theme: BoardThemeId) => void;
  setPieceSet: (pieceSet: PieceSetId) => void;
  toggleSound: () => void;
  flipBoard: () => void;
  importFen: (fen: string) => boolean;
  tickTimer: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'vs-ai',
  difficulty: 'medium',
  timeLimit: 10, // 10 minutes default
  increment: 5, // 5 seconds default
  theme: 'emerald',
  pieceSet: 'classic',
  soundEnabled: true,
  flipped: false,
};

function getKingSquare(chess: Chess, color: 'w' | 'b'): string | null {
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = board[r][c];
      if (square && square.type === 'k' && square.color === color) {
        // convert row/col to coordinate
        const file = String.fromCharCode(97 + c);
        const rank = 8 - r;
        return `${file}${rank}`;
      }
    }
  }
  return null;
}

export const useChessStore = create<ChessState>((set, get) => {
  const initialChess = new Chess();

  const syncStateFromChess = (chess: Chess, isAiMove = false) => {
    const isGameOver = chess.isGameOver();
    let status: GameStatus = 'active';

    if (isGameOver) {
      if (chess.isCheckmate()) {
        status = 'checkmate';
        // Play success tone if user won, else play defeat tone
        if (get().settings.soundEnabled) {
          const losingTurn = chess.turn();
          if (get().settings.mode === 'vs-ai') {
            if (losingTurn === 'b') {
              chessAudio.playCheckmate(); // User won!
            } else {
              chessAudio.playCheckmateDefeat(); // Computer won
            }
          } else {
            chessAudio.playCheckmate();
          }
        }
      } else if (chess.isDraw()) {
        if (chess.isInsufficientMaterial()) {
          status = 'draw-insufficient';
        } else if (chess.isThreefoldRepetition()) {
          status = 'draw-repetition';
        } else {
          status = 'draw-fifty';
        }
        if (get().settings.soundEnabled) {
          chessAudio.playCheckmate();
        }
      } else if (chess.isStalemate()) {
        status = 'stalemate';
        if (get().settings.soundEnabled) {
          chessAudio.playCheckmate();
        }
      }
    } else {
      // Game still active. Play corresponding move sound.
      if (get().settings.soundEnabled) {
        if (chess.inCheck()) {
          chessAudio.playCheck();
        } else {
          // Check if last move was a capture
          const historyVerbose = chess.history({ verbose: true });
          const lastMoveVerbose = historyVerbose[historyVerbose.length - 1];
          if (lastMoveVerbose && lastMoveVerbose.captured) {
            chessAudio.playCaptureWithPiece(lastMoveVerbose.piece);
          } else {
            chessAudio.playMove();
          }
        }
      }
    }

    const checkSquare = chess.inCheck() ? getKingSquare(chess, chess.turn()) : null;

    // Calculate dynamic evaluation score
    const score = evaluateBoard(chess);

    return {
      fen: chess.fen(),
      gameStatus: status,
      checkSquare,
      evaluation: score / 100, // In piece points
      selectedSquare: null,
      legalMoves: [],
    };
  };

  return {
    chess: initialChess,
    fen: initialChess.fen(),
    gameStatus: 'active',
    isAiThinking: false,
    selectedSquare: null,
    legalMoves: [],
    history: [],
    futureHistory: [],
    lastMove: null,
    checkSquare: null,
    whiteTime: 600, // 10 minutes in seconds
    blackTime: 600,
    timerActive: false,
    evaluation: 0,
    bestLine: [],

    settings: DEFAULT_SETTINGS,

    selectSquare: (square) => {
      const { chess, gameStatus, isAiThinking, settings } = get();
      if (gameStatus !== 'active' || isAiThinking) return;

      // Ensure user plays their color when player turn matches
      const isPlayerTurn = (settings.mode === 'vs-local' || settings.mode === 'analysis') || 
                           (settings.mode === 'vs-ai' && chess.turn() === 'w');

      if (!isPlayerTurn) return;

      if (square === null) {
        set({ selectedSquare: null, legalMoves: [] });
        return;
      }

      const piece = chess.get(square as Square);
      
      if (piece && piece.color === chess.turn()) {
        // highlight legal moves for this piece
        const moves = chess.moves({ square: square as Square, verbose: true });
        const targets = moves.map((m) => m.to);
        set({
          selectedSquare: square,
          legalMoves: targets,
        });
      } else {
        // Try making move if selected square exists and click target is in legal moves
        const { selectedSquare, legalMoves } = get();
        if (selectedSquare && legalMoves.includes(square)) {
          get().makeMove(selectedSquare, square);
        } else {
          set({ selectedSquare: null, legalMoves: [] });
        }
      }
    },

    makeMove: (from, to, promotion = 'q') => {
      const { chess, gameStatus, isAiThinking, settings, history, whiteTime, blackTime } = get();
      if (gameStatus !== 'active' || isAiThinking) return false;

      // Double check if move was legal
      try {
        const moves = chess.moves({ verbose: true });
        const matchedMove = moves.find((m) => m.from === from && m.to === to);
        if (!matchedMove) {
          if (settings.soundEnabled) chessAudio.playBuzzer();
          return false;
        }

        const isPromotion = matchedMove.flags.includes('p');
        const moveParams = isPromotion ? { from, to, promotion } : { from, to };
        
        const fenBefore = chess.fen();
        const resMove = chess.move(moveParams);
        if (!resMove) return false;

        const fenAfter = chess.fen();

        // Save move record
        const record: MoveRecord = {
          san: resMove.san,
          from,
          to,
          fenBefore,
          fenAfter,
          timeRemaining: {
            w: whiteTime,
            b: blackTime,
          },
        };

        const activeTurn = chess.turn(); // Turn after move
        let updatedWhiteTime = whiteTime;
        let updatedBlackTime = blackTime;

        // Apply increment to the player who just completed their turn (opposite of activeTurn)
        if (settings.timeLimit !== null && history.length > 1) {
          if (activeTurn === 'b') {
            updatedWhiteTime += settings.increment;
          } else {
            updatedBlackTime += settings.increment;
          }
        }

        const synced = syncStateFromChess(chess);

        set({
          ...synced,
          history: [...history, record],
          futureHistory: [], // Wipe Redo stack when new move is made
          lastMove: { from, to },
          whiteTime: updatedWhiteTime,
          blackTime: updatedBlackTime,
          timerActive: synced.gameStatus === 'active' && settings.timeLimit !== null,
        });

        // Trigger AI opponent if in vs-ai mode and it is Black's turn
        if (settings.mode === 'vs-ai' && chess.turn() === 'b' && synced.gameStatus === 'active') {
          setTimeout(() => {
            get().makeAiMove();
          }, 150);
        }

        return true;
      } catch (err) {
        console.error('Failed to execute move', err);
        if (settings.soundEnabled) chessAudio.playBuzzer();
        return false;
      }
    },

    makeAiMove: () => {
      const { chess, gameStatus, settings, history, whiteTime, blackTime } = get();
      if (gameStatus !== 'active' || chess.turn() !== 'b' || settings.mode !== 'vs-ai') return;

      // Set AI thinking animation
      set({ isAiThinking: true });

      // Artificial mini-delay to simulate thinking (creates a much superior UX!)
      const thinkingDelay = Math.min(2200, Math.max(700, 1500 - (100 * Math.random())));

      setTimeout(() => {
        const { chess: currentChess } = get();
        if (currentChess.turn() !== 'b' || get().gameStatus !== 'active') {
          set({ isAiThinking: false });
          return;
        }

        try {
          // Gather complete PGN history in SAN form to guide the opening book
          const historySan = history.map((h) => h.san);
          const aiResult = getBestMove(currentChess, settings.difficulty, historySan);

          const fenBefore = currentChess.fen();
          const resMove = currentChess.move(aiResult.move);

          if (resMove) {
            const fenAfter = currentChess.fen();
            const record: MoveRecord = {
              san: resMove.san,
              from: resMove.from,
              to: resMove.to,
              fenBefore,
              fenAfter,
              timeRemaining: {
                w: whiteTime,
                b: blackTime,
              },
            };

            const updatedBlackTime = settings.timeLimit !== null ? blackTime + settings.increment : blackTime;
            const synced = syncStateFromChess(currentChess, true);

            set({
              ...synced,
              isAiThinking: false,
              history: [...get().history, record],
              lastMove: { from: resMove.from, to: resMove.to },
              blackTime: updatedBlackTime,
              timerActive: synced.gameStatus === 'active' && settings.timeLimit !== null,
            });
          } else {
            set({ isAiThinking: false });
          }
        } catch (e) {
          console.error('AI Move calculation failed', e);
          set({ isAiThinking: false });
        }
      }, thinkingDelay);
    },

    undoMove: () => {
      const { chess, history, futureHistory, settings } = get();
      if (history.length === 0) return;

      // If in vs-ai, undo TWO moves (both AI and User) to keep player's turn,
      // unless there's only 1 move (AI shouldn't have made a move yet as White).
      let movesToUndo = 1;
      if (settings.mode === 'vs-ai' && history.length >= 2) {
        movesToUndo = 2;
      }

      const tempHistory = [...history];
      const tempFuture = [...futureHistory];

      for (let i = 0; i < movesToUndo; i++) {
        if (tempHistory.length === 0) break;
        const undoneRecord = tempHistory.pop()!;
        tempFuture.unshift(undoneRecord);
        chess.undo();
      }

      const lastRecord = tempHistory[tempHistory.length - 1] || null;
      const synced = syncStateFromChess(chess);

      if (settings.soundEnabled) {
        chessAudio.playMove();
      }

      set({
        ...synced,
        history: tempHistory,
        futureHistory: tempFuture,
        lastMove: lastRecord ? { from: lastRecord.from, to: lastRecord.to } : null,
        whiteTime: lastRecord?.timeRemaining?.w ?? (settings.timeLimit ? settings.timeLimit * 60 : 600),
        blackTime: lastRecord?.timeRemaining?.b ?? (settings.timeLimit ? settings.timeLimit * 60 : 600),
        timerActive: synced.gameStatus === 'active' && settings.timeLimit !== null && tempHistory.length > 0,
      });
    },

    redoMove: () => {
      const { chess, history, futureHistory, settings, whiteTime, blackTime } = get();
      if (futureHistory.length === 0) return;

      let movesToRedo = 1;
      // In VS AI mode, redo both player's move and AI's answer
      if (settings.mode === 'vs-ai' && futureHistory.length >= 2) {
        movesToRedo = 2;
      }

      const tempHistory = [...history];
      const tempFuture = [...futureHistory];

      for (let i = 0; i < movesToRedo; i++) {
        if (tempFuture.length === 0) break;
        const toRedoRecord = tempFuture.shift()!;
        chess.move(toRedoRecord.san);
        tempHistory.push(toRedoRecord);
      }

      const lastRecord = tempHistory[tempHistory.length - 1];
      const synced = syncStateFromChess(chess);

      if (settings.soundEnabled) {
        chessAudio.playMove();
      }

      set({
        ...synced,
        history: tempHistory,
        futureHistory: tempFuture,
        lastMove: { from: lastRecord.from, to: lastRecord.to },
        whiteTime: lastRecord.timeRemaining?.w ?? whiteTime,
        blackTime: lastRecord.timeRemaining?.b ?? blackTime,
        timerActive: synced.gameStatus === 'active' && settings.timeLimit !== null,
      });
    },

    resetGame: () => {
      const { settings } = get();
      const freshChess = new Chess();
      const prepSeconds = settings.timeLimit ? settings.timeLimit * 60 : 600;

      chessAudio.playCheck(); // play start sound
      set({
        chess: freshChess,
        fen: freshChess.fen(),
        gameStatus: 'active',
        isAiThinking: false,
        selectedSquare: null,
        legalMoves: [],
        history: [],
        futureHistory: [],
        lastMove: null,
        checkSquare: null,
        whiteTime: prepSeconds,
        blackTime: prepSeconds,
        timerActive: false,
        evaluation: 0,
        bestLine: [],
      });
    },

    updateSettings: (updates) => {
      set((state) => {
        const newSettings = { ...state.settings, ...updates };
        let outputState: Partial<ChessState> = { settings: newSettings };

        // Adjust timers if time limits changed
        if (updates.timeLimit !== undefined) {
          const prepSeconds = updates.timeLimit ? updates.timeLimit * 60 : 600;
          outputState.whiteTime = prepSeconds;
          outputState.blackTime = prepSeconds;
          outputState.timerActive = false;
        }

        // Apply audio settings directly
        if (updates.soundEnabled !== undefined) {
          chessAudio.enabled = updates.soundEnabled;
        }

        return outputState;
      });
    },

    setMode: (mode) => {
      get().updateSettings({ mode });
      get().resetGame();
    },

    setDifficulty: (difficulty) => {
      get().updateSettings({ difficulty });
    },

    setTimeLimit: (minutes) => {
      get().updateSettings({ timeLimit: minutes });
      get().resetGame();
    },

    setTheme: (theme) => {
      get().updateSettings({ theme });
    },

    setPieceSet: (pieceSet) => {
      get().updateSettings({ pieceSet });
    },

    toggleSound: () => {
      const cur = get().settings.soundEnabled;
      get().updateSettings({ soundEnabled: !cur });
    },

    flipBoard: () => {
      const cur = get().settings.flipped;
      get().updateSettings({ flipped: !cur });
    },

    importFen: (fenString) => {
      const { settings } = get();
      try {
        const testChess = new Chess(fenString);
        
        // FEN is parsed successfully
        const prepSeconds = settings.timeLimit ? settings.timeLimit * 60 : 600;
        const synced = syncStateFromChess(testChess);

        set({
          chess: testChess,
          fen: testChess.fen(),
          gameStatus: synced.gameStatus,
          checkSquare: synced.checkSquare,
          evaluation: synced.evaluation,
          selectedSquare: null,
          legalMoves: [],
          history: [], // Reset transaction history for FEN imports
          futureHistory: [],
          lastMove: null,
          whiteTime: prepSeconds,
          blackTime: prepSeconds,
          timerActive: false,
        });
        
        if (settings.soundEnabled) chessAudio.playCheck();
        return true;
      } catch (e) {
        console.error('Invalid FEN imported', e);
        if (settings.soundEnabled) chessAudio.playBuzzer();
        return false;
      }
    },

    tickTimer: () => {
      const { timerActive, gameStatus, chess, whiteTime, blackTime, settings } = get();
      if (!timerActive || gameStatus !== 'active' || settings.timeLimit === null) return;

      const activeTurn = chess.turn();
      if (activeTurn === 'w') {
        const nextTime = Math.max(0, whiteTime - 1);
        set({ whiteTime: nextTime });
        if (nextTime === 0) {
          set({ gameStatus: 'timeout-w', timerActive: false });
          if (settings.soundEnabled) chessAudio.playCheckmateDefeat();
        }
      } else {
        const nextTime = Math.max(0, blackTime - 1);
        set({ blackTime: nextTime });
        if (nextTime === 0) {
          set({ gameStatus: 'timeout-b', timerActive: false });
          if (settings.soundEnabled) chessAudio.playCheckmate();
        }
      }
    },
  };
});
