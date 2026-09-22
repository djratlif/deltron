/**
 * DELTRON ZERO // MAIN BROADCAST CONTROLLER
 * 24/7 Sci-Fi AI Rap Bot & Cyberpunk Mainframe
 */

(function() {
  // Global Engine Instances
  let lyrEngine = null;
  let audEngine = null;
  let vocEngine = null;

  // App State
  let isBroadcasting = false;
  let currentTrack = null;
  let currentSectionIndex = 0;
  let totalVersesDropped = 0;
  let simulatedListeners = 3030 + Math.floor(Math.random() * 850);
  let liveTimerSeconds = 0;
  let liveInterval = null;
  let isGeneratingTrack = false;

  // DOM Elements References
  let startModal, startBtn, playPauseBtn, nextTrackBtn, beatSelect, voiceSelect;
  let bpmSlider, bpmValDisplay, volumeSlider, muteBtn, crtToggle;
  let geminiKeyInput, saveKeyBtn, clearKeyBtn, aiActiveInfo, aiEngineBadge;
  let headerAiBadge, trackEngineBadge;
  let trackTitleEl, sectionTitleEl, teleprompterEl, teleprompterStatusEl;
  let verseCounterEl, listenerCountEl, streamTimerEl, historyLogEl, copyLyricsBtn, downloadTrackBtn;
  let freestyleInput, freestyleBtn, battleBtn;
  let padChirp, padTransform, padFresh, padLaser, padModem, padSub;
  let canvas, ctx;

  function deltronLog(type, msg) {
    const feed = document.getElementById("realtime-log-feed");
    const dot = document.getElementById("terminal-status-dot");
    if (dot) {
      if (type === 'ai' || type === 'info') {
        dot.className = "status-dot busy";
        setTimeout(() => { if (dot) dot.className = "status-dot online"; }, 1500);
      }
    }
    if (!feed) {
      console.log(`[DeltronTelemetry:${type}] ${msg}`);
      return;
    }
    const d = new Date();
    const ts = `[${d.toTimeString().split(' ')[0]}]`;
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="log-ts">${ts}</span> <span class="log-msg">${escapeHtml(msg)}</span>`;
    feed.appendChild(entry);
    feed.scrollTop = feed.scrollHeight;
    while (feed.children.length > 60) {
      feed.removeChild(feed.firstChild);
    }
  }
  window.deltronLog = deltronLog;

  function initEngines() {
    try {
      if (!lyrEngine && window.DeltronLyricalEngine) lyrEngine = new DeltronLyricalEngine();
      if (!audEngine && window.DeltronAudioEngine) audEngine = new DeltronAudioEngine();
      if (!vocEngine && window.DeltronVoiceEngine) vocEngine = new DeltronVoiceEngine();
    } catch (e) {
      console.error("Error initializing engines:", e);
    }
  }

  function initDOM() {
    initEngines();

    startModal = document.getElementById("start-modal");
    startBtn = document.getElementById("start-broadcast-btn");
    playPauseBtn = document.getElementById("play-pause-btn");
    nextTrackBtn = document.getElementById("next-track-btn");
    beatSelect = document.getElementById("beat-style-select");
    voiceSelect = document.getElementById("voice-profile-select");
    bpmSlider = document.getElementById("bpm-slider");
    bpmValDisplay = document.getElementById("bpm-val");
    const voiceSpeedSlider = document.getElementById("voice-speed-slider");
    const voiceSpeedValDisplay = document.getElementById("voice-speed-val");
    volumeSlider = document.getElementById("volume-slider");
    const volumeValDisplay = document.getElementById("volume-val");
    muteBtn = document.getElementById("mute-btn");
    crtToggle = document.getElementById("crt-toggle");

    geminiKeyInput = document.getElementById("gemini-key-input");
    saveKeyBtn = document.getElementById("save-key-btn");
    clearKeyBtn = document.getElementById("clear-key-btn");
    aiActiveInfo = document.getElementById("ai-active-info");
    aiEngineBadge = document.getElementById("ai-engine-badge");
    headerAiBadge = document.getElementById("header-ai-badge");
    trackEngineBadge = document.getElementById("track-engine-badge");

    trackTitleEl = document.getElementById("track-title");
    sectionTitleEl = document.getElementById("section-title");
    teleprompterEl = document.getElementById("verse-teleprompter");
    teleprompterStatusEl = document.getElementById("teleprompter-status");
    verseCounterEl = document.getElementById("verse-counter");
    listenerCountEl = document.getElementById("listener-count");
    streamTimerEl = document.getElementById("stream-timer");
    historyLogEl = document.getElementById("lyrics-history-log");
    copyLyricsBtn = document.getElementById("copy-lyrics-btn");
    downloadTrackBtn = document.getElementById("download-track-btn");

    freestyleInput = document.getElementById("freestyle-input");
    freestyleBtn = document.getElementById("freestyle-btn");
    battleBtn = document.getElementById("battle-btn");

    padChirp = document.getElementById("pad-chirp");
    padTransform = document.getElementById("pad-transform");
    padFresh = document.getElementById("pad-fresh");
    padLaser = document.getElementById("pad-laser");
    padModem = document.getElementById("pad-modem");
    padSub = document.getElementById("pad-sub");

    canvas = document.getElementById("visualizer-canvas");
    if (canvas) {
      ctx = canvas.getContext("2d");
      resizeCanvas();
    }

    const testKeyBtn = document.getElementById("test-key-btn");
    const aiDiagBox = document.getElementById("ai-diagnostic-box");
    const aiDiagText = document.getElementById("ai-diagnostic-text");
    const accessCodeInput = document.getElementById("access-code-input");
    const modalAccessCode = document.getElementById("modal-access-code");
    const pingDiagBtn = document.getElementById("ping-diagnostics-btn");
    const clearDiagBtn = document.getElementById("clear-diag-btn");

    if (lyrEngine) {
      if (lyrEngine.geminiApiKey && geminiKeyInput) {
        geminiKeyInput.value = lyrEngine.geminiApiKey;
      }
      if (lyrEngine.accessCode) {
        if (accessCodeInput) accessCodeInput.value = lyrEngine.accessCode;
        if (modalAccessCode) modalAccessCode.value = lyrEngine.accessCode;
      }
    }

    // Ping Diagnostics Button
    if (pingDiagBtn) {
      pingDiagBtn.addEventListener("click", async () => {
        deltronLog("info", "📡 Pinging /api/diagnostics endpoint on Cloud Run...");
        try {
          const t0 = Date.now();
          const res = await fetch("/api/diagnostics");
          const dt = Date.now() - t0;
          if (res.ok) {
            const data = await res.json();
            deltronLog("success", `✅ Server Online (${dt}ms) | Revision: ${data.revision} | AI Key Configured: ${data.serverKeyConfigured ? 'YES' : 'NO'} (${data.keyMask}) | Priority Model: ${data.primaryModel} | Uptime: ${data.uptimeSeconds}s | Mem: ${data.memoryUsageMb}MB`);
          } else {
            deltronLog("error", `❌ Server ping error: HTTP ${res.status}`);
          }
        } catch (e) {
          deltronLog("error", `❌ Ping failed: ${e.message}`);
        }
      });
    }

    // Clear Diagnostics Log
    if (clearDiagBtn) {
      clearDiagBtn.addEventListener("click", () => {
        const feed = document.getElementById("realtime-log-feed");
        if (feed) feed.innerHTML = "";
        deltronLog("info", "Telemetry console cleared.");
      });
    }

    // Check server backend AI status on startup
    fetch("/api/status")
      .then(res => res.json())
      .then(data => {
        if (data && data.serverKeyConfigured) {
          deltronLog("success", `✅ Server Neural Core Online: Rev ${data.revision || 'cloud-run'} | Access Code '${data.defaultAccessCodeHint || '3030'}' ready.`);
          if (aiDiagText && (!currentTrack || !currentTrack.isAIGenerated)) {
            aiDiagText.innerHTML = `✅ <strong>SERVER NEURAL CORE ACTIVE:</strong> Access code '${escapeHtml(lyrEngine?.accessCode || '3030')}' ready to stream live DeltronZero AI verses.`;
          }
          if (aiDiagBox) aiDiagBox.className = "ai-diagnostic-box success";
        } else {
          deltronLog("warn", "Server status: Standalone mode or key not configured in environment.");
        }
      })
      .catch(() => {
        deltronLog("info", "Loaded in static/offline client mode.");
      });

    updateTrackIndicators(null);

    // Enhanced Real-Time TEST AGENT handler
    if (testKeyBtn) {
      testKeyBtn.addEventListener("click", async () => {
        const code = accessCodeInput ? accessCodeInput.value.trim() : (modalAccessCode ? modalAccessCode.value.trim() : "3030");
        const key = geminiKeyInput ? geminiKeyInput.value.trim() : "";
        
        if (lyrEngine) {
          lyrEngine.setAccessCode(code);
          lyrEngine.setApiKey(key);
        }

        deltronLog("info", `🧪 TEST AGENT triggered with Access Code='${code}' (Custom Key: ${key ? 'YES' : 'NO'})...`);
        if (aiDiagText) aiDiagText.innerHTML = "📡 <strong>TESTING CONNECTION:</strong> Contacting DeltronZero AI Agent with access code '" + escapeHtml(code) + "'...";
        if (aiDiagBox) aiDiagBox.className = "ai-diagnostic-box";

        const originalBtnText = testKeyBtn.innerHTML;
        testKeyBtn.disabled = true;
        const testStart = Date.now();
        const btnTimer = setInterval(() => {
          const sec = ((Date.now() - testStart) / 1000).toFixed(1);
          testKeyBtn.innerHTML = `⏳ TESTING... [${sec}s]`;
        }, 100);

        try {
          deltronLog("ai", "📡 Dispatching neural test prompt to DeltronZero AI Core...");
          const testTrack = await lyrEngine.generateTrackAsync("Quantum Spacetime Probe");
          clearInterval(btnTimer);
          testKeyBtn.disabled = false;

          if (testTrack && testTrack.isAIGenerated) {
            const sec = ((Date.now() - testStart) / 1000).toFixed(1);
            testKeyBtn.innerHTML = `✅ VERIFIED (${sec}s)`;
            setTimeout(() => { testKeyBtn.innerHTML = originalBtnText; }, 4000);

            deltronLog("success", `🧠 SUCCESS: Live AI Track Generated in ${sec}s!`);
            deltronLog("success", `📜 Title: "${testTrack.title}" | Internal Model: ${testTrack.internalModel || testTrack.modelUsed}`);
            if (testTrack.sections?.[1]?.lines?.[0]) {
              deltronLog("info", `🎙️ Sample Bar 1: "${testTrack.sections[1].lines[0]}"`);
            }

            updateTrackIndicators(testTrack);
            currentTrack = testTrack;
            currentSectionIndex = 0;
            if (isBroadcasting) {
              trackTitleEl.textContent = currentTrack.title;
              appendHistoryTrackHeader(currentTrack);
              playSection();
            }
          } else {
            throw new Error(testTrack?.fallbackReason || "Offline fallback triggered. Ensure server has API key or enter a custom key.");
          }
        } catch (err) {
          clearInterval(btnTimer);
          testKeyBtn.disabled = false;
          testKeyBtn.innerHTML = `⚠️ TEST FAILED`;
          setTimeout(() => { testKeyBtn.innerHTML = originalBtnText; }, 4000);

          deltronLog("error", `❌ Agent Error: ${err.message}`);
          if (aiDiagBox) aiDiagBox.className = "ai-diagnostic-box error";
          if (aiDiagText) {
            aiDiagText.innerHTML = `❌ <strong>AGENT ERROR:</strong> ${escapeHtml(err.message)}<br><small>Check that access code is '3030' or enter your API key.</small>`;
          }
          updateTrackIndicators(null);
        }
      });
    }

    bindEvents();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth || 600 : 600;
    canvas.height = 140;
  }
  window.addEventListener("resize", resizeCanvas);

  function updateTrackIndicators(track = null) {
    const isLiveAi = !!(track && track.isAIGenerated);
    const model = track ? (track.internalModel || track.modelUsed || "DeltronZero AI Agent") : "DeltronZero AI Agent";
    const latency = track && track.latencyMs ? `${track.latencyMs}ms` : null;

    if (isLiveAi) {
      if (headerAiBadge) {
        headerAiBadge.innerHTML = `🧠 LIVE AI AGENT <span style="font-size:0.75rem; color:#ff55bb;">(${latency || 'online'})</span>`;
        headerAiBadge.style.color = "var(--neon-magenta)";
      }
      if (trackEngineBadge) {
        trackEngineBadge.innerHTML = `🧠 LIVE AI: ${escapeHtml(model)} ${latency ? `• ${latency}` : ''}`;
        trackEngineBadge.className = "badge-engine active-llm";
      }
      if (aiEngineBadge) {
        aiEngineBadge.textContent = "🧠 LIVE AI AGENT ONLINE";
        aiEngineBadge.className = "ai-status-badge active-llm";
      }

      const spkTag = document.getElementById("tp-speaker-tag");
      if (spkTag) {
        spkTag.innerHTML = `<span class="mic-icon">🎙️</span> DELTRON ZERO [<strong style="color:var(--neon-magenta);">🧠 LIVE AI: ${escapeHtml(model)}${latency ? ` • ${latency}` : ''}</strong>]:`;
      }

      const aiDiagBox = document.getElementById("ai-diagnostic-box");
      const aiDiagText = document.getElementById("ai-diagnostic-text");
      if (aiDiagBox) aiDiagBox.className = "ai-diagnostic-box success";
      if (aiDiagText) {
        aiDiagText.innerHTML = `✅ <strong>CURRENT TRACK: 100% LIVE AI AGENT GENERATED</strong><br>` +
          `• <strong>Internal Model:</strong> <code>${escapeHtml(model)}</code><br>` +
          `• <strong>Response Latency:</strong> ${latency || '0ms'}<br>` +
          `• <strong>Track Title:</strong> <em>"${escapeHtml(track.title)}"</em><br>` +
          `• <strong>Timestamp:</strong> ${new Date().toLocaleTimeString()}`;
      }

      if (aiActiveInfo) {
        aiActiveInfo.style.display = "block";
        aiActiveInfo.innerHTML = `✅ <strong>DELTRONZERO AI AGENT ACTIVE:</strong> Generating 100% original multi-syllabic sci-fi verses (${escapeHtml(model)})!`;
      }
      if (clearKeyBtn) clearKeyBtn.style.display = "inline-flex";

    } else {
      if (headerAiBadge) {
        headerAiBadge.textContent = "⚡ OFFLINE MATRIX";
        headerAiBadge.style.color = "var(--neon-cyan)";
      }
      if (trackEngineBadge) {
        trackEngineBadge.textContent = "⚡ OFFLINE PROCEDURAL";
        trackEngineBadge.className = "badge-engine";
      }
      if (aiEngineBadge) {
        aiEngineBadge.textContent = "⚡ OFFLINE MATRIX";
        aiEngineBadge.className = "ai-status-badge";
      }

      const spkTag = document.getElementById("tp-speaker-tag");
      if (spkTag) {
        spkTag.innerHTML = `<span class="mic-icon">🎙️</span> DELTRON ZERO [<strong style="color:var(--neon-cyan);">⚡ OFFLINE PROCEDURAL MATRIX</strong>]:`;
      }

      const aiDiagBox = document.getElementById("ai-diagnostic-box");
      const aiDiagText = document.getElementById("ai-diagnostic-text");
      if (aiDiagBox) aiDiagBox.className = "ai-diagnostic-box";
      if (aiDiagText) {
        const reason = track?.fallbackReason || "Operating in Offline Procedural mode. Click 🧪 TEST AGENT to connect.";
        aiDiagText.innerHTML = `⚡ <strong>CURRENT TRACK: OFFLINE PROCEDURAL MATRIX</strong><br>` +
          `• <strong>Engine:</strong> Combinatorial 3030 Rhyme Tree<br>` +
          `• <strong>Diagnostics:</strong> <span style="color:#f59e0b;">${escapeHtml(reason)}</span><br>` +
          `• <strong>Tip:</strong> Click <strong>🧪 TEST AGENT</strong> above to verify live AI connection.`;
      }

      if (aiActiveInfo) aiActiveInfo.style.display = "none";
    }
  }

  // --- BROADCAST FLOW & QUEUE SYSTEM ---

  window.startBroadcast = function() {
    try {
      initEngines();
      isBroadcasting = true;

      const modalAccInput = document.getElementById("modal-access-code");
      if (modalAccInput && lyrEngine) {
        lyrEngine.setAccessCode(modalAccInput.value.trim());
      }

      const modal = document.getElementById("start-modal");
      if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
      }

      const ppBtn = document.getElementById("play-pause-btn");
      if (ppBtn) {
        ppBtn.innerHTML = `<span class="icon">⏸</span> PAUSE BROADCAST`;
        ppBtn.classList.add("active");
      }

      if (audEngine) {
        try {
          audEngine.start();
        } catch (e) {
          console.warn("Audio Context startup note:", e);
        }
      }

      if (!liveInterval) {
        liveInterval = setInterval(() => {
          liveTimerSeconds++;
          const mins = Math.floor(liveTimerSeconds / 60).toString().padStart(2, "0");
          const secs = (liveTimerSeconds % 60).toString().padStart(2, "0");
          const hrs = Math.floor(liveTimerSeconds / 3600).toString().padStart(2, "0");
          const stEl = document.getElementById("stream-timer");
          if (stEl) stEl.textContent = `${hrs}:${mins}:${secs}`;

          if (Math.random() < 0.3) {
            simulatedListeners += Math.floor(Math.random() * 7 - 3);
            const lcEl = document.getElementById("listener-count");
            if (lcEl) lcEl.textContent = simulatedListeners.toLocaleString();
          }
        }, 1000);
      }

      loadAndPlayTrack();
      animateVisualizer();
    } catch (err) {
      console.error("Critical error in startBroadcast:", err);
    }
  };

  function pauseBroadcast() {
    if (isBroadcasting) {
      isBroadcasting = false;
      if (audEngine) audEngine.stop();
      if (vocEngine) vocEngine.stop();
      if (playPauseBtn) {
        playPauseBtn.innerHTML = `<span class="icon">▶</span> RESUME BROADCAST`;
        playPauseBtn.classList.remove("active");
      }
      if (teleprompterStatusEl) teleprompterStatusEl.textContent = "STATUS: PAUSED";
    } else {
      isBroadcasting = true;
      if (audEngine) audEngine.start();
      if (playPauseBtn) {
        playPauseBtn.innerHTML = `<span class="icon">⏸</span> PAUSE BROADCAST`;
        playPauseBtn.classList.add("active");
      }
      if (teleprompterStatusEl) teleprompterStatusEl.textContent = "STATUS: TRANSMITTING";
      playSection();
    }
  }

  async function loadAndPlayTrack(customTheme = null, battleOpponent = null) {
    if (isGeneratingTrack) return;
    isGeneratingTrack = true;
    if (vocEngine) vocEngine.stop();

    const genStartTime = Date.now();
    const promptLabel = customTheme ? `Theme: "${customTheme}"` : (battleOpponent ? `Rival: "${battleOpponent}"` : "Orbital 3030 Transmission");
    deltronLog("ai", `⚡ Composing new track (${promptLabel})...`);

    if (teleprompterEl) {
      teleprompterEl.innerHTML = `
        <div class="composing-pulse">
          <div class="composing-spinner"></div>
          <div>⚡ SYNTHESIZING DELTRON 3030 NEURAL TRACK...</div>
          <div style="font-size:0.75rem; color:#94a3b8;" id="composing-elapsed-text">Elapsed: 0.0s • Generating multisyllabic stanza from DeltronZero AI Core</div>
        </div>
      `;
    }
    if (trackTitleEl) trackTitleEl.textContent = customTheme ? `OPERATION: ${customTheme.toUpperCase()}` : "COMPOSING NEW TRACK...";
    if (teleprompterStatusEl) teleprompterStatusEl.textContent = "STATUS: COMPOSING [0.0s]";

    const composingTimer = setInterval(() => {
      const elapsed = ((Date.now() - genStartTime) / 1000).toFixed(1);
      if (teleprompterStatusEl && isGeneratingTrack) {
        teleprompterStatusEl.textContent = `STATUS: COMPOSING [${elapsed}s]`;
      }
      const elapsedEl = document.getElementById("composing-elapsed-text");
      if (elapsedEl && isGeneratingTrack) {
        elapsedEl.textContent = `Elapsed: ${elapsed}s • DeltronZero AI Agent synthesizing rhymes...`;
      }
    }, 100);

    try {
      if (lyrEngine) {
        currentTrack = await lyrEngine.generateTrackAsync(customTheme, battleOpponent);
      }
    } catch (err) {
      console.error("Error generating track:", err);
      deltronLog("warn", `Neural compose warning: ${err.message} - falling back to offline matrix.`);
      if (lyrEngine) currentTrack = lyrEngine.generateOfflineTrack(customTheme, battleOpponent, err.message);
    } finally {
      clearInterval(composingTimer);
      isGeneratingTrack = false;
    }

    if (!currentTrack && lyrEngine) {
      currentTrack = lyrEngine.generateOfflineTrack(customTheme, battleOpponent, "Engine unavailable");
    }

    const totalGenSec = ((Date.now() - genStartTime) / 1000).toFixed(1);
    currentSectionIndex = 0;
    totalVersesDropped++;
    if (verseCounterEl) verseCounterEl.textContent = totalVersesDropped;

    if (currentTrack && trackTitleEl) {
      trackTitleEl.textContent = currentTrack.title;
      updateTrackIndicators(currentTrack);
      appendHistoryTrackHeader(currentTrack);
      deltronLog(currentTrack.isAIGenerated ? "success" : "info", `🎙️ Track Ready (${totalGenSec}s): "${currentTrack.title}" [${currentTrack.isAIGenerated ? '100% LIVE AI' : 'OFFLINE MATRIX'}]`);
    }

    playSection();
  }

  function playSection() {
    if (!isBroadcasting || !currentTrack) return;

    if (currentSectionIndex >= currentTrack.sections.length) {
      setTimeout(() => {
        if (isBroadcasting) loadAndPlayTrack();
      }, 2000);
      return;
    }

    const section = currentTrack.sections[currentSectionIndex];
    if (sectionTitleEl) sectionTitleEl.textContent = `[ ${section.type.toUpperCase()} ] ${section.title || ""}`;

    let sectionLines = [];
    if (Array.isArray(section.lines) && section.lines.length > 0) {
      sectionLines = section.lines;
    } else if (typeof section.text === "string") {
      sectionLines = section.text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    }

    // Strict 2-14 Bars Constraint: NEVER deliver a single isolated 1-line bar
    if (sectionLines.length === 1) {
      const single = sectionLines[0];
      const clauses = single.split(/[;—–]|\.\s+|,\s+(?=[A-Z])/).map(s => s.trim()).filter(s => s.length > 0);
      if (clauses.length >= 2) {
        sectionLines = clauses.slice(0, 14);
      } else {
        sectionLines = [single, "Deltron Zero transmitting on the secondary frequency"];
      }
    } else if (sectionLines.length > 14) {
      sectionLines = sectionLines.slice(0, 14);
    }

    renderStanzaInTeleprompter(sectionLines, section.type);

    if (section.type === "interlude" && audEngine) {
      audEngine.triggerScratch("transform");
      setTimeout(() => audEngine.triggerScratch("chirp"), 350);
    }

    playLinesInStanza(sectionLines, () => {
      currentSectionIndex++;
      setTimeout(() => {
        if (isBroadcasting) playSection();
      }, 800);
    });
  }

  function renderStanzaInTeleprompter(lines, sectionType) {
    if (!teleprompterEl) return;
    teleprompterEl.innerHTML = "";
    lines.forEach((lineText, idx) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "teleprompter-line";
      lineDiv.id = `tp-line-${idx}`;

      const numSpan = document.createElement("span");
      numSpan.className = "line-num";
      numSpan.textContent = `[${String(idx + 1).padStart(2, "0")}]`;

      const contentSpan = document.createElement("span");
      contentSpan.className = "line-content";

      const words = lineText.split(/\s+/).filter(w => w.length > 0);
      contentSpan.innerHTML = words.map((w, wIdx) => `<span class="word" data-windex="${wIdx}">${escapeHtml(w)}</span>`).join(" ");

      lineDiv.appendChild(numSpan);
      lineDiv.appendChild(contentSpan);
      teleprompterEl.appendChild(lineDiv);
    });

    teleprompterEl.scrollTop = 0;
  }

  function playLinesInStanza(lines, onStanzaComplete) {
    let lineIdx = 0;

    function step() {
      if (!isBroadcasting) return;
      if (lineIdx >= lines.length) {
        if (onStanzaComplete) onStanzaComplete();
        return;
      }

      const lineText = lines[lineIdx];
      const currentLineEl = document.getElementById(`tp-line-${lineIdx}`);

      document.querySelectorAll(".teleprompter-line").forEach((el, i) => {
        if (i === lineIdx) {
          el.classList.add("active");
          el.classList.remove("passed");
          // Internal-only container scrolling (NEVER jumps outer page/window)
          if (teleprompterEl && el) {
            const lineOffset = el.offsetTop - teleprompterEl.offsetTop;
            const targetScroll = Math.max(0, lineOffset - 30);
            teleprompterEl.scrollTo({ top: targetScroll, behavior: "smooth" });
          }
        } else if (i < lineIdx) {
          el.classList.remove("active");
          el.classList.add("passed");
        } else {
          el.classList.remove("active", "passed");
        }
      });

      if (teleprompterStatusEl) {
        teleprompterStatusEl.textContent = `LIVE: BAR ${String(lineIdx + 1).padStart(2, "0")}/${String(lines.length).padStart(2, "0")}`;
      }
      appendHistoryLine(lineText);

      if (lineIdx % 4 === 3 && audEngine) {
        setTimeout(() => {
          if (Math.random() < 0.6) audEngine.triggerScratch("chirp");
        }, 1200);
      }

      const onWord = (wIdx, wordText) => {
        if (!currentLineEl) return;
        const wordSpans = currentLineEl.querySelectorAll(".word");
        wordSpans.forEach((span, i) => {
          if (i === wIdx) {
            span.classList.add("active");
          } else if (i < wIdx) {
            span.classList.remove("active");
            span.classList.add("passed");
          } else {
            span.classList.remove("active", "passed");
          }
        });
      };

      const bpm = audEngine ? audEngine.bpm : 90;
      if (vocEngine) {
        vocEngine.speakLine(lineText, bpm, onWord, () => {
          lineIdx++;
          const voiceSpeed = vocEngine.userSpeedMultiplier || 1.0;
          const pauseMs = Math.max(300, Math.floor((60000 / bpm * 0.75) / voiceSpeed));
          setTimeout(step, pauseMs);
        });
      } else {
        lineIdx++;
        setTimeout(step, 2500);
      }
    }

    step();
  }

  function appendHistoryTrackHeader(track) {
    if (!historyLogEl || !track) return;
    const header = document.createElement("div");
    header.className = "history-track-header";
    const title = track.title || "TRANSMISSION 3030";
    const isAi = track.isAIGenerated;
    const model = track.internalModel || track.modelUsed || "DeltronZero AI Agent";
    const latency = track.latencyMs ? `${track.latencyMs}ms` : null;

    const tag = isAi 
      ? `<span class="badge-history-ai">🧠 LIVE AI: ${escapeHtml(model)}${latency ? ` • ${latency}` : ''}</span>`
      : `<span class="badge-history-offline">⚡ OFFLINE MATRIX</span>`;

    header.innerHTML = `🔥 <strong>${escapeHtml(title)}</strong> ${tag} <span class="time">${new Date().toLocaleTimeString()}</span>`;
    historyLogEl.appendChild(header);
    historyLogEl.scrollTop = historyLogEl.scrollHeight;
  }

  function appendHistoryLine(text) {
    if (!historyLogEl) return;
    const p = document.createElement("p");
    p.className = "history-line";
    p.textContent = text;
    historyLogEl.appendChild(p);
    historyLogEl.scrollTop = historyLogEl.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function bindEvents() {
    if (startBtn) {
      startBtn.addEventListener("click", () => window.startBroadcast());
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", () => {
        if (!audEngine || !audEngine.ctx) {
          window.startBroadcast();
        } else {
          pauseBroadcast();
        }
      });
    }

    if (nextTrackBtn) {
      nextTrackBtn.addEventListener("click", () => {
        if (!isBroadcasting) window.startBroadcast();
        if (audEngine) audEngine.triggerLaserBlast();
        loadAndPlayTrack();
      });
    }

    if (beatSelect) {
      beatSelect.addEventListener("change", (e) => {
        if (audEngine) {
          audEngine.setBeatStyle(e.target.value);
          if (bpmSlider) bpmSlider.value = audEngine.bpm;
          if (bpmValDisplay) bpmValDisplay.textContent = `${audEngine.bpm} BPM`;
          deltronLog("info", `🎛️ Beat preset switched to: ${e.target.value} (${audEngine.bpm} BPM)`);
        }
      });
    }

    if (voiceSelect) {
      voiceSelect.addEventListener("change", (e) => {
        if (vocEngine) {
          vocEngine.setProfile(e.target.value);
          if (audEngine) audEngine.triggerScratch("chirp");
          deltronLog("info", `🎙️ Deltron voice profile switched to: ${e.target.value}`);
        }
      });
    }

    if (bpmSlider) {
      bpmSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        if (audEngine) audEngine.setBpm(val);
        if (bpmValDisplay) bpmValDisplay.textContent = `${val} BPM`;
      });
    }

    const voiceSpeedSliderEl = document.getElementById("voice-speed-slider");
    const voiceSpeedValEl = document.getElementById("voice-speed-val");
    if (voiceSpeedSliderEl) {
      voiceSpeedSliderEl.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        if (vocEngine) vocEngine.setSpeedMultiplier(val);
        if (voiceSpeedValEl) voiceSpeedValEl.textContent = `${val.toFixed(2)}x`;
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        if (audEngine) audEngine.setVolume(val);
        const volumeValEl = document.getElementById("volume-val");
        if (volumeValEl) volumeValEl.textContent = `${Math.round(val * 100)}%`;
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        if (vocEngine) {
          const isMuted = !vocEngine.isMuted;
          vocEngine.setMute(isMuted);
          muteBtn.classList.toggle("active", isMuted);
          muteBtn.textContent = isMuted ? "🔇 UNMUTE DELTRON" : "🔊 MUTE VOCALS";
          deltronLog("info", isMuted ? "🔇 Vocals muted." : "🔊 Vocals unmuted.");
        }
      });
    }

    if (crtToggle) {
      crtToggle.addEventListener("change", (e) => {
        document.body.classList.toggle("crt-off", !e.target.checked);
      });
    }

    if (saveKeyBtn) {
      saveKeyBtn.addEventListener("click", () => {
        if (!lyrEngine) return;
        const key = geminiKeyInput ? geminiKeyInput.value.trim() : "";
        const codeInput = document.getElementById("access-code-input");
        const code = codeInput ? codeInput.value.trim() : "3030";
        lyrEngine.setAccessCode(code);
        lyrEngine.setApiKey(key);
        deltronLog("info", `🔑 Custom access configuration saved (Access Code: ${code}).`);
        const origText = saveKeyBtn.textContent;
        saveKeyBtn.textContent = "SAVED! 🧠";
        setTimeout(() => saveKeyBtn.textContent = origText, 1800);
        if (isBroadcasting) {
          loadAndPlayTrack();
        }
      });
    }

    if (clearKeyBtn) {
      clearKeyBtn.addEventListener("click", () => {
        if (geminiKeyInput) geminiKeyInput.value = "";
        if (lyrEngine) lyrEngine.setApiKey("");
        deltronLog("info", "Disconnected custom key. Reset to Access Code '3030'.");
        if (isBroadcasting) {
          loadAndPlayTrack();
        }
      });
    }

    if (freestyleBtn) {
      freestyleBtn.addEventListener("click", () => {
        if (!freestyleInput) return;
        const topic = freestyleInput.value.trim();
        if (!topic) return;
        if (!isBroadcasting) window.startBroadcast();
        if (audEngine) audEngine.triggerModemBleep();
        
        deltronLog("ai", `💡 Lyrical suggestion injected: "${topic}"`);
        const origText = freestyleBtn.innerHTML;
        freestyleBtn.innerHTML = "✨ INJECTED!";
        setTimeout(() => freestyleBtn.innerHTML = origText, 1500);

        if (teleprompterStatusEl) {
          teleprompterStatusEl.textContent = `STATUS: INJECTING TOPIC "${topic.toUpperCase()}"`;
        }

        loadAndPlayTrack(topic);
        freestyleInput.value = "";
      });
    }

    if (freestyleInput) {
      freestyleInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && freestyleBtn) {
          freestyleBtn.click();
        }
      });
    }

    if (battleBtn) {
      battleBtn.addEventListener("click", () => {
        const enemies = [
          "Megacorp AI Overlord 3030",
          "Cyber Police Chief Drone",
          "Synthetic Clone MC",
          "Silicon Valley Oligarch Bot",
          "Quantum Firewall Sentience"
        ];
        const pickedEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        if (!isBroadcasting) window.startBroadcast();
        if (audEngine) audEngine.triggerLaserBlast();
        
        deltronLog("ai", `⚔️ Cyber Battle Initiated against rival MC: "${pickedEnemy}"`);
        const origText = battleBtn.innerHTML;
        battleBtn.innerHTML = `⚔️ SUGGESTED: ${pickedEnemy.toUpperCase()}!`;
        setTimeout(() => battleBtn.innerHTML = origText, 2000);

        loadAndPlayTrack(null, pickedEnemy);
      });
    }

    // Sound FX Pads
    if (padChirp) padChirp.addEventListener("click", () => { if (audEngine) audEngine.triggerScratch("chirp"); deltronLog("info", "🎧 Kid Koala: Chirp Cut"); padChirp.classList.add("pressed"); setTimeout(() => padChirp.classList.remove("pressed"), 150); });
    if (padTransform) padTransform.addEventListener("click", () => { if (audEngine) audEngine.triggerScratch("transform"); deltronLog("info", "🎧 Kid Koala: Transform Cut"); padTransform.classList.add("pressed"); setTimeout(() => padTransform.classList.remove("pressed"), 150); });
    if (padFresh) padFresh.addEventListener("click", () => { if (audEngine) audEngine.triggerScratch("fresh"); deltronLog("info", "🎧 Kid Koala: Fresh Slice"); padFresh.classList.add("pressed"); setTimeout(() => padFresh.classList.remove("pressed"), 150); });
    if (padLaser) padLaser.addEventListener("click", () => { if (audEngine) audEngine.triggerLaserBlast(); deltronLog("info", "🎧 Sound FX: Laser Blast"); padLaser.classList.add("pressed"); setTimeout(() => padLaser.classList.remove("pressed"), 150); });
    if (padModem) padModem.addEventListener("click", () => { if (audEngine) audEngine.triggerModemBleep(); deltronLog("info", "🎧 Sound FX: 56k Modem Handshake"); padModem.classList.add("pressed"); setTimeout(() => padModem.classList.remove("pressed"), 150); });
    if (padSub) padSub.addEventListener("click", () => { if (audEngine) audEngine.triggerSubDrop(); deltronLog("info", "🎧 Sound FX: 808 Sub Bass Drop"); padSub.classList.add("pressed"); setTimeout(() => padSub.classList.remove("pressed"), 150); });

    window.addEventListener("keydown", (e) => {
      if (document.activeElement === freestyleInput || (geminiKeyInput && document.activeElement === geminiKeyInput)) return;
      switch (e.key.toLowerCase()) {
        case "1": if (padChirp) padChirp.click(); break;
        case "2": if (padTransform) padTransform.click(); break;
        case "3": if (padFresh) padFresh.click(); break;
        case "4": if (padLaser) padLaser.click(); break;
        case "5": if (padModem) padModem.click(); break;
        case "6": if (padSub) padSub.click(); break;
        case " ": e.preventDefault(); if (playPauseBtn) playPauseBtn.click(); break;
      }
    });

    if (copyLyricsBtn) {
      copyLyricsBtn.addEventListener("click", () => {
        if (!historyLogEl) return;
        const text = historyLogEl.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = copyLyricsBtn.textContent;
          copyLyricsBtn.textContent = "✅ COPIED TO CLIPBOARD!";
          setTimeout(() => copyLyricsBtn.textContent = orig, 2000);
        });
      });
    }

    if (downloadTrackBtn) {
      downloadTrackBtn.addEventListener("click", () => {
        if (!historyLogEl) return;
        const text = `DELTRON ZERO // 3030 BROADCAST ARCHIVE\nPUBLISHED AT: deltron.drewratliff.com\nDATE: ${new Date().toISOString()}\n\n` + historyLogEl.innerText;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `deltron-zero-3030-lyrics-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  function animateVisualizer() {
    requestAnimationFrame(animateVisualizer);
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!audEngine || !audEngine.analyser) {
      ctx.strokeStyle = "rgba(0, 255, 204, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      return;
    }

    const bufferLength = audEngine.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    audEngine.analyser.getByteFrequencyData(dataArray);

    const barWidth = (canvas.width / (bufferLength * 0.75));
    let x = 0;

    for (let i = 0; i < bufferLength * 0.75; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
      grad.addColorStop(0, "rgba(0, 240, 255, 0.85)");
      grad.addColorStop(0.6, "rgba(0, 255, 136, 0.9)");
      grad.addColorStop(1, "rgba(255, 0, 128, 1)");

      ctx.fillStyle = grad;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(x, canvas.height - barHeight - 2, barWidth - 1, 2);

      x += barWidth;
    }

    const waveArray = new Uint8Array(bufferLength);
    audEngine.analyser.getByteTimeDomainData(waveArray);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 230, 0, 0.75)";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let waveX = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = waveArray[i] / 128.0;
      const waveY = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(waveX, waveY);
      } else {
        ctx.lineTo(waveX, waveY);
      }
      waveX += sliceWidth;
    }

    ctx.stroke();
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDOM);
  } else {
    initDOM();
  }
})();
