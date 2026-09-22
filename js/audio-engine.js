/**
 * DELTRON ZERO // WEB AUDIO SYNTHESIZER & BEAT ENGINE
 * Procedural Boom-Bap & Sci-Fi Hip-Hop Synthesizer
 * Emulates the legendary production of Dan the Automator & Kid Koala (Deltron 3030)
 */

class DeltronAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.bpm = 90;
    this.currentStyle = "anthem3030";
    this.volume = 0.8;
    this.analyser = null;
    this.vinylGain = null;

    // Timing & Sequencer state
    this.step = 0;
    this.nextNoteTime = 0;
    this.scheduleAheadTime = 0.1;
    this.lookahead = 25.0; // ms
    this.timerID = null;

    // Sound FX & Scratching state
    this.isScratching = false;

    // Beat styles preset configurations
    this.beatStyles = {
      anthem3030: {
        name: "3030 Galactic Suite",
        bpm: 90,
        bassRoot: 36, // C2
        scale: [0, 3, 5, 7, 10], // Minor Pentatonic
        drumPattern: {
          kick:  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
          snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          openHat:[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
          perc:  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0]
        },
        bassPattern: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
        chordFreqs: [
          [130.81, 155.56, 196.00, 233.08], // C minor 7
          [116.54, 146.83, 174.61, 207.65], // Bb major 7
          [103.83, 130.81, 155.56, 185.00], // Ab major 7
          [123.47, 155.56, 185.00, 220.00]  // B diminished / G7
        ]
      },
      papyrusVirus: {
        name: "Papyrus Virus (Cyber Glitch)",
        bpm: 88,
        bassRoot: 33, // A1
        scale: [0, 1, 5, 7, 8], // Phrygian dark
        drumPattern: {
          kick:  [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
          snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
          hihat: [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
          openHat:[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          perc:  [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0]
        },
        bassPattern: [1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
        chordFreqs: [
          [110.00, 130.81, 164.81, 220.00], // A minor
          [116.54, 146.83, 174.61, 233.08], // Bb major
          [98.00, 123.47, 146.83, 196.00],  // G minor
          [103.83, 130.81, 155.56, 207.65]  // Ab major
        ]
      },
      memoryLoss: {
        name: "Memory Loss (Lo-Fi Cosmic)",
        bpm: 85,
        bassRoot: 38, // D2
        scale: [0, 2, 3, 5, 7, 9, 10], // Dorian
        drumPattern: {
          kick:  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          openHat:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          perc:  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]
        },
        bassPattern: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        chordFreqs: [
          [146.83, 174.61, 220.00, 261.63], // Dm7
          [130.81, 164.81, 196.00, 246.94], // Cmaj7
          [116.54, 146.83, 174.61, 220.00], // Bbmaj7
          [130.81, 164.81, 196.00, 246.94]  // C7
        ]
      },
      neuromancerFunk: {
        name: "Neuromancer Funk (Neo-Tokyo)",
        bpm: 94,
        bassRoot: 40, // E2
        scale: [0, 2, 3, 5, 7, 9, 10], // E Funk Minor
        drumPattern: {
          kick:  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
          snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
          hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          openHat:[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
          perc:  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]
        },
        bassPattern: [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0],
        chordFreqs: [
          [164.81, 196.00, 246.94, 293.66], // Em7
          [174.61, 220.00, 261.63, 329.63], // Fmaj7
          [146.83, 185.00, 220.00, 261.63], // D7
          [164.81, 196.00, 246.94, 329.63]  // Em9
        ]
      },
      apollo9Orbit: {
        name: "Apollo 9 Mars Orbit",
        bpm: 88,
        bassRoot: 34, // Bb1
        scale: [0, 3, 5, 6, 7, 10], // Blues/Space Scale
        drumPattern: {
          kick:  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
          snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          openHat:[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
          perc:  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
        },
        bassPattern: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
        chordFreqs: [
          [116.54, 146.83, 174.61, 220.00], // Bb7
          [130.81, 155.56, 196.00, 246.94], // Cm9
          [103.83, 130.81, 155.56, 207.65], // Ab7
          [116.54, 146.83, 174.61, 233.08]  // Bbsus4
        ]
      }
    };
  }

  /**
   * Initializes the AudioContext upon user interaction
   */
  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Master Limiter / Compressor for that punchy Automator sound
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

    // Audio Visualizer Analyser
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.85;

    // Routing
    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Setup Continuous Vinyl Crackle Generator
    this.setupVinylCrackle();
  }

  setupVinylCrackle() {
    // Generate pink noise buffer with random crackle pops
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      let pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;

      // Occasional needle pop / vinyl dust click
      if (Math.random() < 0.0003) {
        pink += (Math.random() * 2 - 1) * 3.5;
      }
      data[i] = pink * 0.04;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);

    noiseSource.start();
  }

  /**
   * Start 24/7 Beat Playback
   */
  start() {
    this.init();
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.bpm = this.beatStyles[this.currentStyle].bpm;

    this.scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  setBeatStyle(styleKey) {
    if (this.beatStyles[styleKey]) {
      this.currentStyle = styleKey;
      this.bpm = this.beatStyles[styleKey].bpm;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  setBpm(bpmVal) {
    this.bpm = Math.max(70, Math.min(115, bpmVal));
  }

  scheduler() {
    if (!this.isPlaying) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.step, this.nextNoteTime);
      this.advanceStep();
    }

    this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
  }

  advanceStep() {
    const secondsPerBeat = 60.0 / this.bpm;
    // 16th note timing with subtle hip-hop swing on odd steps
    const swingFactor = (this.step % 2 === 1) ? 0.025 : 0;
    this.nextNoteTime += 0.25 * secondsPerBeat + swingFactor;
    this.step = (this.step + 1) % 16;
  }

  scheduleStep(stepIndex, time) {
    const preset = this.beatStyles[this.currentStyle];
    const drums = preset.drumPattern;

    // Trigger Drums
    if (drums.kick[stepIndex]) {
      this.playKick(time);
    }
    if (drums.snare[stepIndex]) {
      this.playSnare(time);
    }
    if (drums.hihat[stepIndex]) {
      const isAccent = (stepIndex % 4 === 2);
      this.playHiHat(time, isAccent);
    }
    if (drums.openHat[stepIndex]) {
      this.playOpenHat(time);
    }
    if (drums.perc[stepIndex]) {
      this.playPerc(time);
    }

    // Trigger Bassline
    if (preset.bassPattern[stepIndex]) {
      const bar = Math.floor(this.step / 4);
      const noteOffset = preset.scale[(stepIndex + bar) % preset.scale.length];
      const freq = 440 * Math.pow(2, (preset.bassRoot + noteOffset - 69) / 12);
      this.playBass(time, freq, 0.22);
    }

    // Trigger Atmospheric Chords (on bar starts: step 0, 8)
    if (stepIndex === 0 || stepIndex === 8) {
      const chordIndex = Math.floor(this.step / 4) % preset.chordFreqs.length;
      const freqs = preset.chordFreqs[chordIndex];
      this.playSciFiChord(time, freqs, 1.8);
    }

    // Space Arpeggio synth on steps 2, 6, 10, 14
    if (stepIndex % 4 === 2) {
      const chordIndex = Math.floor(this.step / 4) % preset.chordFreqs.length;
      const arpFreq = preset.chordFreqs[chordIndex][stepIndex % 4] * 2;
      this.playSpaceArp(time, arpFreq);
    }
  }

  // --- SOUND SYNTHESIS METHODS ---

  playKick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(1.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.35);

    // Punch transient click
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(300, time);
    click.frequency.exponentialRampToValueAtTime(80, time + 0.02);
    clickGain.gain.setValueAtTime(0.5, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
    click.connect(clickGain);
    clickGain.connect(this.masterGain);
    click.start(time);
    click.stop(time + 0.02);
  }

  playSnare(time) {
    // Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);
    oscGain.gain.setValueAtTime(0.7, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.12);

    // Noise snap burst
    const node = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    node.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    node.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    node.start(time);
    node.stop(time + 0.2);
  }

  playHiHat(time, isAccent = false) {
    const node = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.06, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    node.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(7500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isAccent ? 0.35 : 0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    node.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    node.start(time);
    node.stop(time + 0.05);
  }

  playOpenHat(time) {
    const node = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.25, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    node.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(6000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.32, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    node.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    node.start(time);
    node.stop(time + 0.22);
  }

  playPerc(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(540, time);
    osc.frequency.exponentialRampToValueAtTime(120, time + 0.08);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.08);
  }

  playBass(time, freq, duration) {
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(260, time);
    filter.frequency.exponentialRampToValueAtTime(100, time + duration);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    // Sub-oscillator for fat low end
    const subOsc = this.ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(freq / 2, time);
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.85, time);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + duration);
    subOsc.stop(time + duration);
  }

  playSciFiChord(time, freqs, duration) {
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(f, time);
      // Detune for lush vintage vibe
      osc.detune.setValueAtTime((idx - 1.5) * 6, time);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, time);
      filter.frequency.exponentialRampToValueAtTime(300, time + duration);

      gain.gain.setValueAtTime(0.08, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  playSpaceArp(time, freq) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  // --- INTERACTIVE SCRATCH & SOUND FX BOARD ---

  /**
   * Kid Koala style turntable scratch FX
   */
  triggerScratch(type = "chirp") {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    filter.type = "bandpass";
    filter.Q.setValueAtTime(4.0, now);

    if (type === "chirp") {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(1400, now + 0.08);
      osc.frequency.linearRampToValueAtTime(250, now + 0.16);

      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(2200, now + 0.08);
      filter.frequency.linearRampToValueAtTime(500, now + 0.16);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.linearRampToValueAtTime(0.8, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "transform") {
      // Rapid rhythmic transform scratch
      for (let i = 0; i < 4; i++) {
        const subTime = now + i * 0.06;
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = "sawtooth";
        subOsc.frequency.setValueAtTime(500 + i * 150, subTime);
        subOsc.frequency.linearRampToValueAtTime(200, subTime + 0.04);
        subGain.gain.setValueAtTime(0.5, subTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, subTime + 0.05);

        subOsc.connect(subGain);
        subGain.connect(this.masterGain);
        subOsc.start(subTime);
        subOsc.stop(subTime + 0.05);
      }
    } else {
      // Classic "Fresh" / vinyl sweep
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);

      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(2500, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.38);
    }
  }

  triggerLaserBlast() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.28);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  triggerModemBleep() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [1200, 2400, 1800, 980, 2100];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.05;
      osc.type = "square";
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.045);
    });
  }

  triggerSubDrop() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 1.2);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.2);
  }
}

// Attach to window
window.DeltronAudioEngine = DeltronAudioEngine;
