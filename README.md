# 🏆 Modern Chess Grandmaster Platform

A full-featured, responsive, and beautifully designed tactical Chess application implemented on **React, TypeScript, Zustand, and Tailwind CSS**. Inspired by Lichess and Chess.com, this application features full offline-capable rules, robust AI opponents, chess timers, move histories, PGN exporting, custom themes, sound synthesis, and real-time game analysis.

---

## ✨ Features Checklist

- ♟️ **Official FIDE Chess Rules**: Legal piece moves, check/checkmate detectors, stalemate, threefold repetition draw, insufficient material, and 50-move indicators.
- 🤖 **Minimax AI Engine**: Features an AI opponent driven by a multi-depth **Minimax with Alpha-Beta Pruning** engine, supported by positional **Piece-Square Tables (PST)** and an **Opening Book Database**.
- ⏱️ **Integrated Chess Clocks**: Bullet, Blitz, Rapid, and Classical custom duration timers with increments, automated turn switching, and low-time warning buzzers.
- 🎨 **Visual Board Styles**: Six custom vector board textures including Classic Wood, Chess.com Green, Cobalt glass, Noble Slate, Futuristic Glass, and Synthwave Neon.
- 🔊 **Dynamic Sound Synthesis**: Move acoustic feedback synthesized in real-time using the browser's native **Web Audio API** (wood plucks, capture clicks, check tones, and victory chimes).
- 🕒 **Move Notation & Time Travel**: Clickable move log (algebraic SAN notation) with Copy/Download PGN capabilities, allowing players to navigate back and forward through the game without losing any moves (the clock pauses while reviewing).
- 🔍 **Real-Time Analysis Mode**: Embedded evaluation bar indicating the positional advantage of White vs. Black, plus instant engine recommendations.
- ⚙️ **Premium Controls**: Drag-and-drop movement, click-to-move touch capabilities, interactive pawn promotions, board flips, board state FEN importing, and light/dark theme toggles.

---

## 📁 Architecture & File Structure

```
├── .gitignore              # Ignored files (node_modules, dist, .env)
├── README.md               # User manual and project documentation
├── index.html              # Core client HTML template
├── metadata.json           # App metadata (AI Studio)
├── vite.config.ts          # Vite + React + Tailwind configuration
├── package.json            # Task commands & npm dependency manifests
├── src/
│   ├── App.tsx             # Interactive layout & game state manager
│   ├── main.tsx            # React application entry client launcher
│   ├── index.css           # Global styled Tailwind directives & animations
│   ├── types.ts            # Core TypeScript model schemas and typings
│   ├── components/
│   │   ├── Chessboard.tsx  # Dynamic interactive grid container & promoters
│   │   ├── ChessPieces.tsx # Ultra-crisp modern SVG game pieces
│   │   ├── CapturedPieces.tsx # Captured count tallies & material indicators
│   │   ├── MoveHistory.tsx    # Clickable move logs with PGN features
│   │   ├── Timer.tsx          # Clock faces (the single tick interval lives in App.tsx)
│   │   ├── GameControls.tsx   # Settings panels & FEN importers
│   │   └── AnalysisPanel.tsx  # Advantage assessment bar & recommendations
│   └── utils/
│       ├── audio.ts        # Synthesizer of custom acoustic play waves
│       ├── aiEngine.ts     # Minimax solver & tactical scoring systems
│       ├── chessThemes.ts  # Palette presets for board squares
│       └── chessStore.ts   # Zustand-managed centralized core game state
```

---

## ⚡ Setup & Run Guidelines

Follow these straightforward commands to spin up the application in your local environment:

### Prerequisite

Make sure you have Node.js installed on your machine.

### 1. Install Dependencies
Retrieve all mandatory dependencies (including `chess.js`, `zustand`, `lucide-react`, and dev assets):
```bash
npm install
```

### 2. Boot Local Dev Server
Launch Vite's high-speed local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser to play!

No environment variables or API keys are required: everything (rules, AI engine, sounds) runs in the browser.

### 3. Type-check (optional)
```bash
npm run lint
```

### 4. Build & Package for Production
Compile code down to high-performance standalone files within `/dist` ready for hosting:
```bash
npm run build
```

---

## 🧠 Core Chess AI Engine Details

The integrated AI opponent uses:
1. **The Opening Book**: Instantly matches the game state against popular openings (e.g., Ruy Lopez, Sicilian Defense, Italian Game, Caro-Kann, Queen's Gambit) to execute theoretical moves instantly.
2. **Dynamic Search**: Run Minimax with Alpha-Beta Pruning recursively to score potential moves.
3. **Midgame vs. Endgame PSTs**: Scores pieces dynamically based on location on the board. Pawns are rewarded for centralizing/advancing, Knights are encouraged to avoid edges, and the King automatically transitions from defensive corner sheltering in the midgame to central offensive support in the late-game phase.
