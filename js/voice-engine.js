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
   * Unlocks and primes Web Speech API on iOS / iPadOS Safari within direct user gesture
   */
  unlockSpeech() {
    if (!this.synth) return;
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      // Prime iOS WebKit speech synthesis channel
      const primeUtterance = new SpeechSynthesisUtterance(" ");
      primeUtterance.volume = 0.01;
      primeUtterance.rate = 1.0;
      primeUtterance.lang = "en-US";
      this.synth.speak(primeUtterance);
      console.log("[VoiceEngine] Web Speech pipeline primed and unlocked.");
    } catch (e) {
      console.warn("[VoiceEngine] Unlock note:", e);
    }
  }

  /**
   * Selects the most fitting browser/system voice for the active profile
   */
  getVoiceForProfile(profileKey) {
    if (!this.synth) return null;
    const available = (this.voices && this.voices.length > 0) ? this.voices : (this.synth.getVoices() || []);
    if (!available || available.length === 0) return null;
    this.voices = available;

    const profile = this.profiles[profileKey] || this.profiles.intercom;
    const targets = profile.preferredVoices || [];

    // 1. Exact or partial match on preferred voice names (prioritize localService voices)
    for (const target of targets) {
      const foundLocal = available.find(v => {
        if (!v || !v.name) return false;
        const nameMatch = v.name.toLowerCase().includes(target.toLowerCase());
        const langMatch = v.lang && v.lang.toLowerCase().replace("_", "-").includes(target.toLowerCase());
        return (nameMatch || langMatch) && (v.localService !== false);
      });
      if (foundLocal) return foundLocal;

      const found = available.find(v => {
        if (!v || !v.name) return false;
        const nameMatch = v.name.toLowerCase().includes(target.toLowerCase());
        const langMatch = v.lang && v.lang.toLowerCase().replace("_", "-").includes(target.toLowerCase());
        return nameMatch || langMatch;
      });
      if (found) return found;
    }

    // 2. Fallback to any local English voice
    const localEnglish = available.find(v => v.lang && v.lang.toLowerCase().startsWith("en") && v.localService !== false);
    if (localEnglish) return localEnglish;

    // 3. Fallback to any English voice
    const englishVoice = available.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));
    if (englishVoice) return englishVoice;

    // 4. Fallback to first available voice
    return available[0] || null;
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
   * Speaks a single rap line with word-boundary tracking and resilient timing fallback
   * @param {string} text - The line of lyrics
   * @param {number} bpm - Track BPM (for reference/pacing)
   * @param {Function} onWord - Callback for active word: (wordIndex, wordText)
   * @param {Function} onComplete - Callback when line finishes
   */
  speakLine(text, bpm = 90, onWord = null, onComplete = null) {
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

    const profile = this.profiles[this.currentProfile] || this.profiles.intercom;
    const finalRate = Math.max(0.6, Math.min(1.8, profile.rate * (this.userSpeedMultiplier || 1.0)));

    // Calculate rhythmic word pace for smooth highlighting on iOS/iPadOS Safari
    const wordDurationMs = Math.max(160, Math.floor((60000 / Math.max(70, bpm) * 0.45) / finalRate));
    let wordIdx = 0;
    let isFinished = false;
    let wordTimer = null;

    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      if (wordTimer) {
        clearInterval(wordTimer);
        wordTimer = null;
      }
      if (this._safetyTimer) {
        clearTimeout(this._safetyTimer);
        this._safetyTimer = null;
      }
      this.isSpeaking = false;
      this.activeUtterance = null;
      window._deltronActiveUtterance = null;
      if (onComplete) onComplete();
    };

    // Highlight initial word immediately
    if (onWord && words.length > 0) {
      onWord(0, words[0]);
      wordIdx = 1;
    }

    // High-precision rhythmic word step timer (guaranteed on all mobile & desktop browsers)
    wordTimer = setInterval(() => {
      if (isFinished || !this.isSpeaking) {
        clearInterval(wordTimer);
        return;
      }
      if (wordIdx < words.length) {
        if (onWord) onWord(wordIdx, words[wordIdx]);
        wordIdx++;
      } else {
        clearInterval(wordTimer);
      }
    }, wordDurationMs);

    if (!this.synth || this.isMuted) {
      this.isSpeaking = true;
      const totalSimDuration = words.length * wordDurationMs + 400;
      this._safetyTimer = setTimeout(finish, totalSimDuration);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.activeUtterance = utterance;
    window._deltronActiveUtterance = utterance; // Pin to window against Chrome/Safari GC

    // Explicit language code is mandatory for iOS Safari WebKit TTS routing
    utterance.lang = (this.selectedVoice && this.selectedVoice.lang) ? this.selectedVoice.lang : "en-US";
    utterance.volume = 1.0;
    utterance.pitch = profile.pitch;
    utterance.rate = finalRate;

    if (this.selectedVoice) {
      try {
        utterance.voice = this.selectedVoice;
      } catch (err) {
        console.warn("Voice assignment notice:", err);
      }
    }

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
    };

    utterance.onend = () => {
      finish();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e?.error || e);
      if (e?.error === "voice-unavailable" || e?.error === "synthesis-failed") {
        // Fallback to default system voice for subsequent lines
        this.selectedVoice = null;
      }
      finish();
    };

    // Watchdog timer ensures the line completes even if speech engine is interrupted
    const maxLineDurationMs = Math.max(2200, Math.floor(words.length * wordDurationMs + 800));
    this._safetyTimer = setTimeout(() => {
      if (!isFinished) {
        finish();
      }
    }, maxLineDurationMs);

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.isSpeaking = true;
      this.synth.speak(utterance);
    } catch (err) {
      console.warn("Speech speak call notice:", err);
      // Fallback timer will auto-complete
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
      this.activeUtterance.onend = null;
      this.activeUtterance.onerror = null;
      this.activeUtterance.onboundary = null;
      this.activeUtterance = null;
    }
    window._deltronActiveUtterance = null;
    this.isSpeaking = false;
  }
}

// Attach to window
window.DeltronVoiceEngine = DeltronVoiceEngine;
