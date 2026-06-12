/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoardTheme, BoardThemeId } from '../types';

export const CHESS_THEMES: Record<BoardThemeId, BoardTheme> = {
  wood: {
    id: 'wood',
    name: 'Classic Wood',
    lightSquare: 'bg-[#f0d9b5]',
    darkSquare: 'bg-[#b58863]',
    lightHighlight: 'after:bg-amber-400/40',
    darkHighlight: 'after:bg-amber-600/40',
    bg: 'from-amber-50 to-amber-100',
    border: 'border-amber-800',
  },
  emerald: {
    id: 'emerald',
    name: 'Chess.com Green',
    lightSquare: 'bg-[#eeeed2]',
    darkSquare: 'bg-[#769656]',
    lightHighlight: 'after:bg-yellow-200/40',
    darkHighlight: 'after:bg-yellow-400/40',
    bg: 'from-[#f5f5f0] to-[#e4e8db]',
    border: 'border-emerald-800',
  },
  slate: {
    id: 'slate',
    name: 'Noble Slate',
    lightSquare: 'bg-[#e2e8f0]',
    darkSquare: 'bg-[#64748b]',
    lightHighlight: 'after:bg-sky-200/40',
    darkHighlight: 'after:bg-sky-400/40',
    bg: 'from-slate-50 to-slate-100',
    border: 'border-slate-800',
  },
  cobalt: {
    id: 'cobalt',
    name: 'Cobalt Glass',
    lightSquare: 'bg-[#e0f2fe]',
    darkSquare: 'bg-[#0369a1]',
    lightHighlight: 'after:bg-rose-200/40',
    darkHighlight: 'after:bg-rose-400/40',
    bg: 'from-sky-50 to-sky-100',
    border: 'border-sky-800',
  },
  glass: {
    id: 'glass',
    name: 'Modern Glass',
    lightSquare: 'bg-white/45 backdrop-blur-md border border-white/20',
    darkSquare: 'bg-slate-900/60 backdrop-blur-md border border-slate-900/20',
    lightHighlight: 'after:bg-emerald-400/35',
    darkHighlight: 'after:bg-emerald-500/35',
    bg: 'from-slate-900 to-slate-950 text-white',
    border: 'border-slate-800/80',
  },
  midnight: {
    id: 'midnight',
    name: 'Synthwave Neon',
    lightSquare: 'bg-[#2a1b4e]',
    darkSquare: 'bg-[#0f0526]',
    lightHighlight: 'after:bg-fuchsia-500/30',
    darkHighlight: 'after:bg-cyan-500/30',
    bg: 'from-neutral-900 to-neutral-950 text-white',
    border: 'border-fuchsia-900',
  },
};
