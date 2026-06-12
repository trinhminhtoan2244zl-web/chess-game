/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.error('Web Audio API not supported in this environment', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playMove() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Warm wood block tap
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  playCapture() {
    this.playCaptureWithPiece('p'); // Fallback to pawn snaps
  }

  playCaptureWithPiece(pieceType: string) {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const lowerPiece = pieceType.toLowerCase();

    // Custom synthesis based on capturing piece type
    if (lowerPiece === 'r') {
      // 🚗 ROOK ENGINE RUMBLE / HEAVY CHARIOT MOTOR ("tiếng gầm gừ")
      const time = ctx.currentTime;
      const duration = 0.5;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const mainGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(85, time);
      osc1.frequency.linearRampToValueAtTime(55, time + duration);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(125, time);
      osc2.frequency.linearRampToValueAtTime(75, time + duration);

      // Rumble modulator (LFO)
      lfo.type = 'sawtooth';
      lfo.frequency.setValueAtTime(18, time); // 18Hz speed for rumble growl

      lfoGain.gain.setValueAtTime(25, time);
      lfoGain.gain.linearRampToValueAtTime(15, time + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, time);
      filter.frequency.exponentialRampToValueAtTime(150, time + duration);
      filter.Q.setValueAtTime(5, time);

      mainGain.gain.setValueAtTime(0.01, time);
      mainGain.gain.linearRampToValueAtTime(0.18, time + 0.08); // Snappy start
      mainGain.gain.exponentialRampToValueAtTime(0.01, time + duration);

      // Connect LFO to modulate oscillators
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      // Connect signal path
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      lfo.start(time);
      osc1.start(time);
      osc2.start(time);

      lfo.stop(time + duration + 0.05);
      osc1.stop(time + duration + 0.05);
      osc2.stop(time + duration + 0.05);

    } else if (lowerPiece === 'b') {
      // 🐘 BISHOP/TƯỢNG ELEPHANT TRUMPET / ROAR ("tiếng voi gầm")
      const time = ctx.currentTime;
      const duration = 0.7;

      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const biquad = ctx.createBiquadFilter();
      const mainGain = ctx.createGain();

      osc.type = 'sawtooth';
      // Elephant trumpet sweeps upwards initially then drops slightly in raspy burst
      osc.frequency.setValueAtTime(400, time);
      osc.frequency.exponentialRampToValueAtTime(880, time + 0.2);
      osc.frequency.exponentialRampToValueAtTime(520, time + duration);

      // Extreme 28Hz nasal vibrato for the authentic elephant growl/snort
      lfo.type = 'sawtooth';
      lfo.frequency.setValueAtTime(28, time);
      lfoGain.gain.setValueAtTime(60, time); // Modulate by +/-60Hz
      lfoGain.gain.linearRampToValueAtTime(40, time + duration);

      biquad.type = 'bandpass';
      biquad.frequency.setValueAtTime(800, time);
      biquad.frequency.exponentialRampToValueAtTime(1100, time + 0.2);
      biquad.frequency.exponentialRampToValueAtTime(650, time + duration);
      biquad.Q.setValueAtTime(3, time);

      mainGain.gain.setValueAtTime(0, time);
      mainGain.gain.linearRampToValueAtTime(0.16, time + 0.1);
      mainGain.gain.linearRampToValueAtTime(0.12, time + 0.3);
      mainGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(biquad);
      biquad.connect(mainGain);
      mainGain.connect(ctx.destination);

      lfo.start(time);
      osc.start(time);

      lfo.stop(time + duration + 0.05);
      osc.stop(time + duration + 0.05);

    } else if (lowerPiece === 'n') {
      // 🐴 KNIGHT/MÃ NEIGH / WHINNY ("tiếng ngựa hí")
      const time = ctx.currentTime;
      const duration = 0.6;

      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const mainGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, time);
      osc.frequency.exponentialRampToValueAtTime(950, time + 0.15);
      osc.frequency.exponentialRampToValueAtTime(380, time + duration);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(22, time); // rapid whinny wobble
      lfoGain.gain.setValueAtTime(35, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, time);
      filter.frequency.exponentialRampToValueAtTime(450, time + duration);
      filter.Q.setValueAtTime(1.5, time);

      mainGain.gain.setValueAtTime(0, time);
      mainGain.gain.linearRampToValueAtTime(0.15, time + 0.08);
      mainGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      lfo.start(time);
      osc.start(time);

      lfo.stop(time + duration + 0.05);
      osc.stop(time + duration + 0.05);

    } else if (lowerPiece === 'q') {
      // 👑 QUEEN POWERFUL MAGIC RESONANCE ("phép thuật uy lực")
      const time = ctx.currentTime;
      const duration = 0.65;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const mainGain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(320, time);
      osc1.frequency.exponentialRampToValueAtTime(1400, time + 0.25);
      osc1.frequency.exponentialRampToValueAtTime(440, time + duration);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(160, time);
      osc2.frequency.exponentialRampToValueAtTime(700, time + 0.25);
      osc2.frequency.exponentialRampToValueAtTime(220, time + duration);

      filter.type = 'peaking';
      filter.frequency.setValueAtTime(800, time);
      filter.frequency.exponentialRampToValueAtTime(3000, time + 0.25);
      filter.gain.setValueAtTime(15, time);

      mainGain.gain.setValueAtTime(0, time);
      mainGain.gain.linearRampToValueAtTime(0.12, time + 0.05); // immediate magical attack
      mainGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc1.start(time);
      osc2.start(time);

      osc1.stop(time + duration + 0.05);
      osc2.stop(time + duration + 0.05);

    } else if (lowerPiece === 'k') {
      // 👑 KING ROYAL CLANG / METAL SHOCKWAVE ("tiếng gập gỡ hoàng gia")
      const time = ctx.currentTime;
      const duration = 0.8;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const mainGain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(150, time);
      osc1.frequency.exponentialRampToValueAtTime(110, time + duration);

      // Low chime metal clang pairing
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(243, time); // disharmonic clash
      osc2.frequency.exponentialRampToValueAtTime(95, time + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, time);
      filter.Q.setValueAtTime(3, time);

      mainGain.gain.setValueAtTime(0.22, time);
      mainGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc1.start(time);
      osc2.start(time);

      osc1.stop(time + duration + 0.05);
      osc2.stop(time + duration + 0.05);

    } else {
      // ♟ PAWN SHARP WOODEN SNAP / STANDARD CAPTURE 
      const osc = ctx.createOscillator();
      const noiseOsc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noiseGain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.12);

      noiseOsc.type = 'sawtooth';
      noiseOsc.frequency.setValueAtTime(750, ctx.currentTime);
      noiseOsc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.06);
      noiseOsc.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.start();
      noiseOsc.start();
      osc.stop(ctx.currentTime + 0.13);
      noiseOsc.stop(ctx.currentTime + 0.07);
    }
  }

  playCheck() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Direct bright alert sounds: High-pitched double bell chime
    const playBell = (freq: number, delay: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur + 0.02);
    };

    playBell(587.33, 0, 0.15); // D5
    playBell(659.25, 0.08, 0.25); // E5
  }

  playCheckmate() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const playNote = (freq: number, delay: number, dur: number, isWinner: boolean) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(isWinner ? 0.15 : 0.1, ctx.currentTime + delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur + 0.02);
    };

    // Major / Minor victory/defeat chime
    const theme = [261.63, 329.63, 392.00, 523.25]; // C major (Winner / Neutral over)
    theme.forEach((freq, idx) => {
      playNote(freq, idx * 0.12, 0.4, true);
    });
  }

  playCheckmateDefeat() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const playNote = (freq: number, delay: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur + 0.02);
    };

    // Gloomy descending checkmate sound
    const theme = [392.00, 349.23, 311.13, 233.08]; // G, F, Eb, Bb (Minor falling)
    theme.forEach((freq, idx) => {
      playNote(freq, idx * 0.15, 0.5);
    });
  }

  playBuzzer() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }
}

export const chessAudio = new AudioSynthesizer();
