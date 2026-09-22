/**
 * DELTRON ZERO // CYBORG VOICE & RHYTHMIC FLOW ENGINE
 * Controls robotic speech synthesis, vocal FX profiles, and lyric teleprompter sync.
 * Completely immune to cancellation cascades and browser garbage-collection stalls.
 */

class DeltronVoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.isMuted = false;
    this.currentProfile = "intercom";
    this.userSpeedMultiplier = 1.0;
    this.isSpeaking = false;
    this.activeUtterance = null;
    this._safetyTimer = null;

    this.profiles = {
      intercom: {
        name: "Deltron Intercom 3030 (UK Relay)",
        pitch: 1.05,
        rate: 1.0,
        preferredVoices: ["Daniel", "Oliver", "George", "Google UK English Male", "Google UK English Female", "Arthur", "Gordon", "en-GB", "en_GB", "en-US", "Alex"]
      },
      cyborg: {
        name: "Cyborg Mech (Alex / US Robot)",
        pitch: 0.80,
        rate: 0.96,
        preferredVoices: ["Alex", "Fred", "Daniel", "Google US English", "en-US"]
      },
      commander: {
        name: "Cyber Commander (Deep Heavy Bass)",
        pitch: 0.52,
        rate: 0.90,
        preferredVoices: ["Ralph", "Bruce", "Fred", "Alex", "en-US"]
      },
      synthetica: {
        name: "Synthetica (Female Cyber Core)",
        pitch: 1.18,
        rate: 0.98,
        preferredVoices: ["Samantha", "Victoria", "Karen", "Zira", "Google US English", "en-US"]
      },
      zarvox: {
        name: "Zarvox (8-Bit Retro Robot)",
        pitch: 0.95,
        rate: 1.05,
        preferredVoices: ["Zarvox", "Trinoids", "Bad News", "Fred", "Alex"]
      },
      rawMic: {
        name: "Raw Microphone Flow (Natural MC)",
        pitch: 0.96,
        rate: 0.98,
        preferredVoices: ["Google US English", "Aaron", "Tom", "Alex", "en-US"]
      }
    };

    this.initVoices();
  }

  setSpeedMultiplier(val) {
    this.userSpeedMultiplier = Math.max(0.5, Math.min(2.0, parseFloat(val) || 1.0));
    console.log(`[VoiceEngine] Vocal flow speed multiplier: ${this.userSpeedMultiplier}x`);
  }

  initVoices() {
    if (!this.synth) return;

    const populate = () => {
      try {
        const available = this.synth.getVoices() || [];
        if (available && available.length > 0) {
          this.voices = available;
          this.applyProfileVoice();
        }
      } catch (err) {
        console.warn("Voice list population notice:", err);
      }
    };

    populate();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populate;
    }
  }

  /**
   * Selects the most fitting browser/system voice for the active profile
   */
  getVoiceForProfile(profileKey) {
    if (!this.voices || this.voices.length === 0) return null;
    const profile = this.profiles[profileKey] || this.profiles.intercom;
    const targets = profile.preferredVoices || [];

    // 1. Exact or partial match on preferred voice names
    for (const target of targets) {
      const found = this.voices.find(v => {
        if (!v || !v.name) return false;
        const nameMatch = v.name.toLowerCase().includes(target.toLowerCase());
        const langMatch = v.lang && v.lang.toLowerCase().replace("_", "-").includes(target.toLowerCase());
        return nameMatch || langMatch;
      });
      if (found) return found;
    }

    // 2. Fallback to any English voice
    const englishVoice = this.voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));
    if (englishVoice) return englishVoice;

    // 3. Fallback to first available voice
    return this.voices[0] || null;
  }

  applyProfileVoice() {
    this.selectedVoice = this.getVoiceForProfile(this.currentProfile);
  }

  setProfile(profileKey) {
    if (this.profiles[profileKey]) {
      this.currentProfile = profileKey;
      this.applyProfileVoice();
      console.log(`[VoiceEngine] Switched profile to: ${profileKey}, Voice:`, this.selectedVoice?.name || "default");
    }
  }

  setMute(muteState) {
    this.isMuted = muteState;
    if (this.isMuted) {
      this.stop();
    }
  }

  /**
   * Speaks a single rap line with word-boundary tracking
   * @param {string} text - The line of lyrics
   * @param {number} bpm - Track BPM (for reference/pacing)
   * @param {Function} onWord - Callback for active word: (wordIndex, wordText)
   * @param {Function} onComplete - Callback when line finishes
   */
  speakLine(text, bpm = 90, onWord = null, onComplete = null) {
    // Safely stop previous utterance without triggering its completion
    this.stop(false);

    const cleanText = text
      .replace(/^(?:\[?\d{1,2}\]?[:.)\-\s]+|bar\s*\d+[:.)\-\s]+|line\s*\d+[:.)\-\s]+)/i, "")
      .replace(/^(?:verse\s*\d*|intro|chorus|interlude|outro|bridge|hook|title|track|bars?)\s*[:=-]?\s*$/i, "")
      .replace(/[[\](){}#*"`]/g, "")
      .replace(/[,;:]+$/, "")
      .trim();

    if (!cleanText || cleanText.length < 2 || /^[\W_]+$/.test(cleanText)) {
      if (onComplete) onComplete();
      return;
    }

    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    const profile = this.profiles[this.currentProfile];

    if (!this.synth || this.isMuted) {
      this.simulateLineDelivery(words, bpm, onWord, onComplete);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.activeUtterance = utterance;
    window._deltronActiveUtterance = utterance; // Pin to window to prevent Chrome GC bug

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Independent Vocal Speed Rate
    const finalRate = profile.rate * (this.userSpeedMultiplier || 1.0);
    utterance.pitch = profile.pitch;
    utterance.rate = Math.max(0.5, Math.min(2.0, finalRate));

    let wordIdx = 0;
    let isFinished = false;

    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      if (this._safetyTimer) {
        clearTimeout(this._safetyTimer);
        this._safetyTimer = null;
      }
      this.isSpeaking = false;
      this.activeUtterance = null;
      window._deltronActiveUtterance = null;
      if (onComplete) onComplete();
    };

    utterance.onboundary = (event) => {
      if (isFinished) return;
      if (event.name === "word") {
        if (onWord && wordIdx < words.length) {
          onWord(wordIdx, words[wordIdx]);
          wordIdx++;
        }
      }
    };

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onWord && words.length > 0 && wordIdx === 0) {
        onWord(0, words[0]);
        wordIdx = 1;
      }
    };

    utterance.onend = () => {
      finish();
    };

    utterance.onerror = (e) => {
      // Ignore cancellations
      if (e.error === "canceled" || e.error === "interrupted") {
        return;
      }
      console.warn("Speech synthesis notice:", e);
      finish();
    };

    // Calculate realistic duration based on word count
    const minLineDurationMs = Math.max(2500, words.length * 400);
    this._safetyTimer = setTimeout(() => {
      if (!isFinished && this.isSpeaking) {
        console.warn("Safety timer ending line.");
        finish();
      }
    }, minLineDurationMs * 2.5);

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.isSpeaking = true;
      this.synth.speak(utterance);
    } catch (err) {
      console.error("Speech error, falling back to simulator:", err);
      finish();
    }
  }

  simulateLineDelivery(words, bpm, onWord, onComplete) {
    this.isSpeaking = true;
    const effectiveSpeed = (this.userSpeedMultiplier || 1.0);
    const wordDuration = Math.max(140, Math.floor((60000 / 90 / 2) / effectiveSpeed));
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (!this.isSpeaking) {
        clearInterval(interval);
        return;
      }
      if (currentIdx < words.length) {
        if (onWord) onWord(currentIdx, words[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        this.isSpeaking = false;
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, wordDuration);
  }

  stop(triggerCallback = false) {
    if (this._safetyTimer) {
      clearTimeout(this._safetyTimer);
      this._safetyTimer = null;
    }
    if (this.activeUtterance) {
      // Detach listeners to prevent cancellation cascade
      this.activeUtterance.onend = null;
      this.activeUtterance.onerror = null;
      this.activeUtterance.onboundary = null;
      this.activeUtterance = null;
    }
    window._deltronActiveUtterance = null;
    this.isSpeaking = false;

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }
}

// Attach to window
window.DeltronVoiceEngine = DeltronVoiceEngine;
