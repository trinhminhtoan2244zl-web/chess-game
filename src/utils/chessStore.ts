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
  futureHistory: MoveRecord[]; // moves that were undone and can be replayed (redo / time travel)
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
  jumpToPly: (ply: number) => void;
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
  tickTimer: (elapsedSeconds?: number) => void;
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

/** Starting clock value in seconds for the given time control (minutes). */
function initialSeconds(timeLimit: number | null): number {
  return timeLimit ? timeLimit * 60 : 600;
}

/** Increment is only granted from each side's second move onwards (the clock starts after White's first move). */
function incrementFor(settings: GameSettings, pliesPlayedBeforeMove: number): number {
  return settings.timeLimit !== null && pliesPlayedBeforeMove >= 2 ? settings.increment : 0;
}

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

/**
 * Classifies the current position.
 * NOTE: chess.js `isDraw()` also returns true for stalemate, so stalemate (and the other
 * specific draw types) must be tested before falling back to the fifty-move rule.
 */
function getPositionStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isInsufficientMaterial()) return 'draw-insufficient';
  if (chess.isThreefoldRepetition()) return 'draw-repetition';
  if (chess.isDraw()) return 'draw-fifty';
  return 'active';
}

export const useChessStore = create<ChessState>((set, get) => {
  const initialChess = new Chess();

  // Every scheduled/running AI computation carries the id that was current when it started.
  // Bumping the id (undo, reset, FEN import, mode change, timeout...) cancels pending AI work.
  let aiRequestId = 0;
  const cancelAi = () => {
    aiRequestId++;
  };

  const scheduleAiMove = () => {
    const id = ++aiRequestId;
    setTimeout(() => {
      if (id === aiRequestId) get().makeAiMove();
    }, 150);
  };

  const shouldAiMove = (chess: Chess, status: GameStatus): boolean => {
    const { settings, futureHistory } = get();
    return (
      settings.mode === 'vs-ai' &&
      chess.turn() === 'b' &&
      status === 'active' &&
      futureHistory.length === 0 // do not move while the player is reviewing earlier positions
    );
  };

  const syncStateFromChess = (chess: Chess, playSound = true) => {
    const status = getPositionStatus(chess);

    if (playSound && get().settings.soundEnabled) {
      if (status === 'checkmate') {
        // Play success tone if user won, else play defeat tone
        if (get().settings.mode === 'vs-ai' && chess.turn() === 'w') {
          chessAudio.playCheckmateDefeat(); // Computer won
        } else {
          chessAudio.playCheckmate(); // User won (or local game)
        }
      } else if (status !== 'active') {
        chessAudio.playCheckmate();
      } else if (chess.inCheck()) {
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
    whiteTime: initialSeconds(DEFAULT_SETTINGS.timeLimit),
    blackTime: initialSeconds(DEFAULT_SETTINGS.timeLimit),
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

      // In AI matches the human always plays White; Black's moves only come from the engine.
      if (settings.mode === 'vs-ai' && chess.turn() === 'b') return false;

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

        const mover = chess.turn();
        const fenBefore = chess.fen();
        const resMove = chess.move(moveParams);
        if (!resMove) return false;

        const fenAfter = chess.fen();

        // Clock values AFTER this move (increment goes to the side that just moved)
        const increment = incrementFor(settings, history.length);
        const updatedWhiteTime = mover === 'w' ? whiteTime + increment : whiteTime;
        const updatedBlackTime = mover === 'b' ? blackTime + increment : blackTime;

        // Save move record
        const record: MoveRecord = {
          san: resMove.san,
          from,
          to,
          fenBefore,
          fenAfter,
          timeRemaining: {
            w: updatedWhiteTime,
            b: updatedBlackTime,
          },
        };

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
        if (shouldAiMove(chess, synced.gameStatus)) {
          scheduleAiMove();
        }

        return true;
      } catch (err) {
        console.error('Failed to execute move', err);
        if (settings.soundEnabled) chessAudio.playBuzzer();
        return false;
      }
    },

    makeAiMove: () => {
      const { chess, gameStatus, settings, futureHistory } = get();
      if (gameStatus !== 'active' || chess.turn() !== 'b' || settings.mode !== 'vs-ai') return;
      if (futureHistory.length > 0) return;

      const requestId = aiRequestId;

      // Set AI thinking animation
      set({ isAiThinking: true });

      // Artificial mini-delay to simulate thinking (creates a much superior UX!)
      const thinkingDelay = Math.min(2200, Math.max(700, 1500 - (100 * Math.random())));

      setTimeout(() => {
        // Cancelled (undo / reset / import / timeout): whoever cancelled already reset isAiThinking.
        if (requestId !== aiRequestId) return;

        // Always read fresh state: the clock kept running while the engine was "thinking".
        const state = get();
        const currentChess = state.chess;
        if (currentChess.turn() !== 'b' || state.gameStatus !== 'active') {
          set({ isAiThinking: false });
          return;
        }

        try {
          // Gather complete PGN history in SAN form to guide the opening book
          const historySan = state.history.map((h) => h.san);
          const aiResult = getBestMove(currentChess, state.settings.difficulty, historySan);

          const fenBefore = currentChess.fen();
          const resMove = currentChess.move(aiResult.move);

          if (resMove) {
            const fenAfter = currentChess.fen();

            const updatedBlackTime = state.blackTime + incrementFor(state.settings, state.history.length);
            const record: MoveRecord = {
              san: resMove.san,
              from: resMove.from,
              to: resMove.to,
              fenBefore,
              fenAfter,
              timeRemaining: {
                w: state.whiteTime,
                b: updatedBlackTime,
              },
            };

            const synced = syncStateFromChess(currentChess);

            set({
              ...synced,
              isAiThinking: false,
              history: [...state.history, record],
              futureHistory: [],
              lastMove: { from: resMove.from, to: resMove.to },
              blackTime: updatedBlackTime,
              timerActive: synced.gameStatus === 'active' && state.settings.timeLimit !== null,
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
      const { history, settings } = get();
      if (history.length === 0) return;

      let target = history.length - 1;

      // In AI matches undo until it is the human's (White's) turn again, so both the
      // engine's reply and the human's move are taken back (and a pending AI move is cancelled).
      if (settings.mode === 'vs-ai') {
        const turnAfterPly = (ply: number): string =>
          (ply === 0 ? history[0].fenBefore : history[ply - 1].fenAfter).split(' ')[1];
        while (target > 0 && turnAfterPly(target) !== 'w') target--;
      }

      get().jumpToPly(target);
    },

    redoMove: () => {
      const { history, futureHistory, settings } = get();
      if (futureHistory.length === 0) return;

      let target = history.length + 1;

      // In AI matches redo both the human's move and the engine's answer
      if (settings.mode === 'vs-ai' && futureHistory.length >= 2) {
        const turnAfterFirst = futureHistory[0].fenAfter.split(' ')[1];
        if (turnAfterFirst === 'b') target++;
      }

      get().jumpToPly(target);
    },

    /**
     * Non-destructive time travel: moves the board to the position after `ply` half-moves.
     * Moves after that point are kept in `futureHistory` so they can be replayed
     * (undo / redo buttons, or clicking a move in the move log).
     */
    jumpToPly: (ply) => {
      const { chess, history, futureHistory, settings } = get();
      const all = [...history, ...futureHistory];
      const target = Math.max(0, Math.min(all.length, Math.floor(ply)));
      if (target === history.length) return;

      cancelAi();

      let applied = history.length;
      while (applied > target) {
        chess.undo();
        applied--;
      }
      while (applied < target) {
        chess.move(all[applied].san);
        applied++;
      }

      const newHistory = all.slice(0, target);
      const newFuture = all.slice(target);
      const lastRecord = newHistory[newHistory.length - 1] || null;
      const base = initialSeconds(settings.timeLimit);
      const synced = syncStateFromChess(chess, false);

      if (settings.soundEnabled) {
        chessAudio.playMove();
      }

      set({
        ...synced,
        isAiThinking: false,
        history: newHistory,
        futureHistory: newFuture,
        lastMove: lastRecord ? { from: lastRecord.from, to: lastRecord.to } : null,
        whiteTime: lastRecord?.timeRemaining?.w ?? base,
        blackTime: lastRecord?.timeRemaining?.b ?? base,
        // The clock is paused while looking at earlier positions and resumes at the live position
        timerActive:
          synced.gameStatus === 'active' &&
          settings.timeLimit !== null &&
          newHistory.length > 0 &&
          newFuture.length === 0,
      });

      if (shouldAiMove(chess, synced.gameStatus)) {
        scheduleAiMove();
      }
    },

    resetGame: () => {
      const { settings } = get();
      const freshChess = new Chess();
      const prepSeconds = initialSeconds(settings.timeLimit);

      cancelAi();
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
          const prepSeconds = initialSeconds(updates.timeLimit);
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

    // Switching mode keeps the current position; the engine takes over if it is Black's turn.
    setMode: (mode) => {
      cancelAi();
      set((state) => ({
        settings: { ...state.settings, mode },
        isAiThinking: false,
        selectedSquare: null,
        legalMoves: [],
      }));

      const { chess, gameStatus } = get();
      if (shouldAiMove(chess, gameStatus)) {
        scheduleAiMove();
      }
    },

    setDifficulty: (difficulty) => {
      get().updateSettings({ difficulty });
    },

    // A new time control means a fresh game with fresh clocks
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
        cancelAi();
        const prepSeconds = initialSeconds(settings.timeLimit);
        const synced = syncStateFromChess(testChess, false);

        set({
          chess: testChess,
          ...synced,
          isAiThinking: false,
          history: [], // Reset transaction history for FEN imports
          futureHistory: [],
          lastMove: null,
          whiteTime: prepSeconds,
          blackTime: prepSeconds,
          timerActive: false,
          bestLine: [],
        });

        if (settings.soundEnabled) chessAudio.playCheck();

        // The imported position may have Black to move: let the engine play it in AI matches
        if (shouldAiMove(testChess, synced.gameStatus)) {
          scheduleAiMove();
        }
        return true;
      } catch (e) {
        console.error('Invalid FEN imported', e);
        if (settings.soundEnabled) chessAudio.playBuzzer();
        return false;
      }
    },

    // `elapsedSeconds` is the real time since the previous tick, so the clock stays accurate
    // even if the browser throttles timers in a background tab.
    tickTimer: (elapsedSeconds = 1) => {
      const { timerActive, gameStatus, chess, whiteTime, blackTime, settings } = get();
      if (!timerActive || gameStatus !== 'active' || settings.timeLimit === null) return;

      const activeTurn = chess.turn();
      const nextTime = Math.max(0, (activeTurn === 'w' ? whiteTime : blackTime) - elapsedSeconds);

      if (activeTurn === 'w') {
        set({ whiteTime: nextTime });
      } else {
        set({ blackTime: nextTime });
      }

      if (nextTime === 0) {
        cancelAi();
        set({
          gameStatus: activeTurn === 'w' ? 'timeout-w' : 'timeout-b',
          timerActive: false,
          isAiThinking: false,
        });
        if (settings.soundEnabled) {
          if (activeTurn === 'w') chessAudio.playCheckmateDefeat();
          else chessAudio.playCheckmate();
        }
      }
    },
  };
});
