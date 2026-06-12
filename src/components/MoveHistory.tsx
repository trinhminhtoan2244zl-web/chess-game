/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { useChessStore } from '../utils/chessStore';
import { MoveRecord } from '../types';
import { Copy, Check, Download } from 'lucide-react';

export default function MoveHistory() {
  const { history, importFen, chess, settings } = useChessStore();
  const [copiedPgn, setCopiedPgn] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group linear history into pairs [[move1_w, move1_b], [move2_w, move2_b], ...]
  const groupedMoves: { num: number; w?: MoveRecord; b?: MoveRecord }[] = [];
  
  for (let i = 0; i < history.length; i += 2) {
    groupedMoves.push({
      num: Math.floor(i / 2) + 1,
      w: history[i],
      b: history[i + 1],
    });
  }

  // Scroll to bottom when new moves are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length]);

  // Generate real standard PGN string
  const getPgnString = () => {
    let pgn = '';
    groupedMoves.forEach((g) => {
      pgn += `${g.num}. ${g.w?.san ?? ''} ${g.b?.san ?? ''} `;
    });
    return pgn.trim() || 'No moves recorded yet.';
  };

  const handleCopyPgn = () => {
    const pgn = getPgnString();
    navigator.clipboard.writeText(pgn).then(() => {
      setCopiedPgn(true);
      setTimeout(() => setCopiedPgn(false), 2000);
    });
  };

  const handleDownloadPgn = () => {
    const pgn = getPgnString();
    const element = document.createElement('a');
    const file = new Blob([pgn], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `chess_game_${new Date().toISOString().split('T')[0]}.pgn`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Inspect FEN state of a past move
  const handleInspectMove = (fen: string) => {
    // Import FEN temporarily
    importFen(fen);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/40 border border-neutral-800/60 rounded-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <h3 className="text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Move Log
        </h3>
        {history.length > 0 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyPgn}
              title="Copy PGN text to clipboard"
              className="p-1 px-2.5 bg-neutral-800 hover:bg-neutral-700/80 active:scale-95 text-[10px] sm:text-xs text-neutral-300 rounded border border-neutral-700 font-medium transition-all flex items-center gap-1"
            >
              {copiedPgn ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  Copy PGN
                </>
              )}
            </button>
            <button
              onClick={handleDownloadPgn}
              title="Download standard PGN file"
              className="p-1 px-2 bg-neutral-800 hover:bg-neutral-700/80 active:scale-95 text-neutral-300 rounded border border-neutral-700 transition-all flex items-center justify-center"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid Table of past moves */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 text-xs sm:text-sm font-mono scrollbar-thin scrollbar-thumb-neutral-800"
      >
        {groupedMoves.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-center py-10 scale-95 select-none">
            <div className="p-4 bg-neutral-850 rounded-full mb-3 border border-neutral-800 text-neutral-600 font-mono text-xl">♟</div>
            <p className="text-xs">Waiting for first move...</p>
            <p className="text-[10px] text-neutral-600 mt-1">Play White to start the game.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/50">
            {groupedMoves.map((g, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 py-1.5 hover:bg-neutral-800/20 text-neutral-300 transition-colors rounded-sm"
              >
                {/* Step Index number */}
                <span className="col-span-2 text-neutral-600 text-right pr-3 font-semibold select-none">
                  {g.num}.
                </span>
                
                {/* White Move */}
                <button
                  onClick={() => g.w && handleInspectMove(g.w.fenAfter)}
                  className="col-span-5 text-left px-2 font-medium hover:text-indigo-400 hover:bg-indigo-500/10 rounded cursor-pointer transition-all truncate"
                >
                  {g.w?.san}
                </button>

                {/* Black Move */}
                {g.b ? (
                  <button
                    onClick={() => g.b && handleInspectMove(g.b.fenAfter)}
                    className="col-span-5 text-left px-2 font-medium hover:text-indigo-400 hover:bg-indigo-500/10 rounded cursor-pointer transition-all truncate"
                  >
                    {g.b?.san}
                  </button>
                ) : (
                  <span className="col-span-5 text-neutral-600 px-2 italic text-[10px]">Thinking...</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="px-4 py-2 bg-neutral-900 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 select-none">
        <span>Click on any move to travel in time</span>
        <span className="font-mono text-neutral-600">{`Moves: ${history.length}`}</span>
      </div>
    </div>
  );
}
