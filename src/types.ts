/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type BoardThemeId = 'wood' | 'emerald' | 'slate' | 'cobalt' | 'glass' | 'midnight';

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  lightSquare: string;
  darkSquare: string;
  lightHighlight: string;
  darkHighlight: string;
  bg: string;
  border: string;
}

export type PieceSetId = 'classic' | 'modern' | 'minimalist';

export type GameMode = 'vs-ai' | 'vs-local' | 'analysis';

export interface PlayerInfo {
  name: string;
  rating: number;
  avatar: string;
}

export interface MoveRecord {
  san: string;
  from: string;
  to: string;
  fenBefore: string;
  fenAfter: string;
  timeRemaining?: {
    w: number;
    b: number;
  };
}

export type GameStatus =
  | 'active'
  | 'checkmate'
  | 'stalemate'
  | 'draw-repetition'
  | 'draw-insufficient'
  | 'draw-fifty'
  | 'timeout-w'
  | 'timeout-b'
  | 'resign-w'
  | 'resign-b';

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  timeLimit: number | null; // minutes, null means untimed
  increment: number; // seconds
  theme: BoardThemeId;
  pieceSet: PieceSetId;
  soundEnabled: boolean;
  flipped: boolean;
}
