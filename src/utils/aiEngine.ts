/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chess } from 'chess.js';

// Pieces weights for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-squire tables (PST) - evaluated from White's perspective
// High values encourage pieces to occupy strong active squares
const PAWN_PST = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_PST = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_PST = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_PST = [
  [0,  0,  0,  5,  5,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
];

const QUEEN_PST = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,  0,  5,  5,  5,  5,  0, -5],
  [0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  5,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];

// King Middle Game table
const KING_MID_PST = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
];

// King End Game table (encourages king to centralize)
const KING_END_PST = [
  [-50,-40,-30,-20,-20,-30,-40,-50],
  [-30,-20,-10,  0,  0,-10,-20,-30],
  [-30,-10, 20, 30, 30, 20,-10,-30],
  [-30,-10, 30, 40, 40, 30,-10,-30],
  [-30,-10, 30, 40, 40, 30,-10,-30],
  [-30,-10, 20, 30, 30, 20,-10,-30],
  [-30,-30,  0,  0,  0,  0,-30,-30],
  [-50,-30,-30,-30,-30,-30,-30,-50]
];

// Simple opening book database
// Keys are first few moves joined by spaces. Value is the recommended next algebraic move
const OPENING_BOOK: Record<string, string[]> = {
  // Start
  '': ['e4', 'd4', 'Nf3', 'c4'],
  // 1. e4
  'e4': ['e5', 'c5', 'e6', 'c6'],
  // Ruy Lopez / Spanish Opening
  'e4 e5': ['Nf3'],
  'e4 e5 Nf3': ['Nc6'],
  'e4 e5 Nf3 Nc6': ['Bb5'],
  'e4 e5 Nf3 Nc6 Bb5': ['a6', 'Nf6'],
  'e4 e5 Nf3 Nc6 Bb5 a6': ['Ba4'],
  'e4 e5 Nf3 Nc6 Bb5 a6 Ba4': ['Nf6'],
  // Italian Game
  'e4 e5 Nf3 Nc6 Bc4': ['Bc5', 'Nf6'],
  // Queen's Gambit
  'd4': ['d5', 'Nf6'],
  'd4 d5': ['c4'],
  'd4 d5 c4': ['e6', 'c6', 'dxc4'],
  'd4 d5 c4 e6': ['Nc3'],
  'd4 d5 c4 e6 Nc3': ['Nf6'],
  // Sicilian Defense
  'e4 c5': ['Nf3', 'Nc3', 'c3'],
  'e4 c5 Nf3': ['d6', 'Nc6', 'e6'],
  'e4 c5 Nf3 d6': ['d4'],
  'e4 c5 Nf3 d6 d4 cxd4': ['Nxd4'],
  'e4 e6': ['d4'], // French defense
  'e4 e6 d4': ['d5'],
  'e4 c6': ['d4'], // Caro-Kann defense
  'e4 c6 d4': ['d5'],
};

/**
 * Checks if we are in an endgame state
 */
function isEndgame(chess: Chess): boolean {
  let heavyPieces = 0;
  for (const row of chess.board()) {
    for (const square of row) {
      if (square && square.type !== 'p' && square.type !== 'k') {
        heavyPieces++;
      }
    }
  }
  // If fewer than 4 minor/major pieces are on board, it's an endgame
  return heavyPieces <= 4;
}

/**
 * Main evaluation function.
 * Evaluates board position from White's perspective (+ means White is winning, - means Black is winning).
 */
export function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    // Current player is mated
    return chess.turn() === 'w' ? -100000 : 100000;
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
    return 0;
  }

  let totalEvaluation = 0;
  const board = chess.board();
  const endgame = isEndgame(chess);

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = board[r][c];
      if (!square) continue;

      const type = square.type;
      const color = square.color;

      // Base weight
      let value = PIECE_VALUES[type] || 0;

      // Positional bonus/penalty
      // Black is mirrored vertically
      const rEvaluated = color === 'w' ? r : 7 - r;
      const cEvaluated = color === 'w' ? c : 7 - c;

      let scorePST = 0;
      switch (type) {
        case 'p':
          scorePST = PAWN_PST[rEvaluated][cEvaluated];
          break;
        case 'n':
          scorePST = KNIGHT_PST[rEvaluated][cEvaluated];
          break;
        case 'b':
          scorePST = BISHOP_PST[rEvaluated][cEvaluated];
          break;
        case 'r':
          scorePST = ROOK_PST[rEvaluated][cEvaluated];
          break;
        case 'q':
          scorePST = QUEEN_PST[rEvaluated][cEvaluated];
          break;
        case 'k':
          scorePST = endgame ? KING_END_PST[rEvaluated][cEvaluated] : KING_MID_PST[rEvaluated][cEvaluated];
          // Give additional penality for exposing King or check
          break;
      }

      const score = value + scorePST;

      if (color === 'w') {
        totalEvaluation += score;
      } else {
        totalEvaluation -= score;
      }
    }
  }

  // Slight bonus for checks and mobility
  if (chess.inCheck()) {
    totalEvaluation += chess.turn() === 'w' ? -70 : 70; // Opponent checked us
  }

  return totalEvaluation;
}

/**
 * Order moves to optimize Alpha-Beta performance (captures first, checks first)
 */
function orderMoves(chess: Chess, moves: string[]): string[] {
  // Return sorted moves
  return moves.map(m => {
    // We parse moves using a temp copy to score them roughly
    // Captures get highest priority
    let score = 0;
    if (m.includes('x')) score += 100;
    if (m.includes('+')) score += 50;
    if (m.endsWith('=Q')) score += 80; // Promotion
    return { move: m, score };
  })
  .sort((a, b) => b.score - a.score)
  .map(item => item.move);
}

/**
 * Minimax with Alpha-Beta Pruning
 */
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): { score: number; move: string | null } {
  // Base case
  if (depth === 0 || chess.isGameOver()) {
    return { score: evaluateBoard(chess), move: null };
  }

  const movesText = chess.moves();
  if (movesText.length === 0) {
    return { score: evaluateBoard(chess), move: null };
  }

  const orderedMoves = orderMoves(chess, movesText);

  let bestMove: string | null = null;

  if (isMaximizingPlayer) {
    let maxScore = -Infinity;
    for (const move of orderedMoves) {
      chess.move(move);
      const { score } = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      if (score > maxScore) {
        maxScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        break; // beta cut-off
      }
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    for (const move of orderedMoves) {
      chess.move(move);
      const { score } = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      if (score < minScore) {
        minScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
      if (beta <= alpha) {
        break; // alpha cut-off
      }
    }
    return { score: minScore, move: bestMove };
  }
}

/**
 * Returns the opening book move if match exists
 */
export function getOpeningBookMove(chess: Chess, moveHistorySan: string[]): string | null {
  const historyStr = moveHistorySan.join(' ');
  const possibleNext = OPENING_BOOK[historyStr];
  if (possibleNext && possibleNext.length > 0) {
    // Select one randomly from the book
    const randIndex = Math.floor(Math.random() * possibleNext.length);
    const candidate = possibleNext[randIndex];
    // Double check if candidate is legal
    const legalMoves = chess.moves();
    if (legalMoves.includes(candidate)) {
      return candidate;
    }
    // Also try matching standard notation from san e.g. Bb5 might be Bb5+ or Bb5#
    const matched = legalMoves.find(m => m === candidate || m.startsWith(candidate));
    if (matched) {
      return matched;
    }
  }
  return null;
}

/**
 * Get AI recommended move according to difficulty settings
 */
export function getBestMove(
  chess: Chess,
  difficulty: 'easy' | 'medium' | 'hard' | 'expert',
  historySan: string[] = []
): { move: string; score: number } {
  const legalMoves = chess.moves();
  if (legalMoves.length === 0) {
    throw new Error('No legal moves available');
  }

  const isWhite = chess.turn() === 'w';

  // 1. Try Opening Book (Only in medium, hard or expert mode, and early moves)
  if (difficulty !== 'easy' && historySan.length < 10) {
    const bookMove = getOpeningBookMove(chess, historySan);
    if (bookMove) {
      // Evaluate what the score would be after this book move
      chess.move(bookMove);
      const score = evaluateBoard(chess);
      chess.undo();
      return { move: bookMove, score };
    }
  }

  // 2. Fallback to Search with different depths
  let depth = 1;
  switch (difficulty) {
    case 'easy':
      depth = 1;
      break;
    case 'medium':
      depth = 2;
      break;
    case 'hard':
      depth = 3;
      break;
    case 'expert':
      depth = 4;
      break;
  }

  // For "Easy" mode, we add a random element: 25% of the time, the AI chooses a random legal move
  if (difficulty === 'easy' && Math.random() < 0.25) {
    const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    chess.move(randomMove);
    const score = evaluateBoard(chess);
    chess.undo();
    return { move: randomMove, score };
  }

  // Run Alpha-Beta Minimax
  const result = minimax(chess, depth, -Infinity, Infinity, isWhite);

  const finalMove = result.move || legalMoves[Math.floor(Math.random() * legalMoves.length)];
  return { move: finalMove, score: result.score };
}
