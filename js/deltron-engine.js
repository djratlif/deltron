/**
 * DELTRON ZERO // DUAL AI LYRICAL GENIUS ENGINE
 * Supports:
 * 1. Live DeltronZero AI Agent (Direct Neural Verse Generation)
 * 2. Deep Offline Generative Sci-Fi Rhyme & Flow Matrix
 */

class DeltronLyricalEngine {
  constructor() {
    try {
      this.geminiApiKey = localStorage.getItem("deltron_gemini_api_key") || "";
      this.accessCode = localStorage.getItem("deltron_access_code") || "3030";
    } catch (e) {
      this.geminiApiKey = "";
      this.accessCode = "3030";
    }
    this.useGemini = !!(this.geminiApiKey || this.accessCode);
    this.lastApiStatus = { active: false, model: null, error: null, tokens: 0 };
    this.serverProxyAvailable = true;

    // Rich Vocabulary & Concepts for Procedural Generation
    this.vocab = {
      actors: ["Deltron Zero", "The Automator", "Kid Koala", "Apollo 9 pilot", "Cyber insurgent", "Mech soldier", "Esper rhyme professor", "Quantum hacker", "Data archaeologist", "Sub-space rebel"],
      enemies: ["Megacorp oligarchs", "Cyber Police Division 9", "Silicon Overlords", "Synthetic clone MCs", "Automated enforcement drones", "Planetary warlords", "Corrupt database curators", "Corporate task forces"],
      technologies: ["central processing unit", "gravitational dampener", "positronic brain", "quantum neural matrix", "hyperwarp injector", "subatomic frequency", "papyrus virus code", "ion particle accelerator", "antimatter turntable", "bioform scanner", "encrypted modem signal", "cybernetic vocal tract"],
      locations: ["Neo-Tokyo", "Mars Orbital Station 9", "Jupiter Cloud Colony", "Silicon Wastelands", "Atmospheric Layer Zero", "Galactic Core Perimeter", "Sub-terrene bunker", "Hyperspace Corridor", "Deep space docking bay"],
      actions: ["decimate", "vaporize", "infiltrate", "reprogram", "hyperwarp through", "dematerialize", "overclock", "recalibrate", "illuminate", "disrupt", "shatter", "reconstruct"],
      descriptors: ["post-apocalyptic", "telepathic", "subatomic", "interplanetary", "cybernetic", "antiquated", "sacred", "orbital", "immaculate", "unbreakable", "radioactive", "multisyllabic"]
    };

    // Deep Rhyme Matrix with internal & end rhymes
    this.rhymeMatrix = [
      {
        tag: "virus-papyrus",
        rhymes: [
          "devise a virus to bring dire straits to your environment",
          "crush your corporations with a mild touch requirement",
          "trash your whole computer system and revert you to papyrus",
          "blackouts in every single metropolis inspire us",
          "the first cycles of this glitch I transmit through the modem",
          "shattering their firewalls before the corporate sentries noticed 'em",
          "immaculate design breaking the nation section by section",
          "pure verbal weaponry that bypasses inspection"
        ]
      },
      {
        tag: "matrix-sacred",
        rhymes: [
          "telepathic mind that takes his greatness from the Matrix",
          "dropping kicks and verses with a cadence that is sacred",
          "stay in effect with alien tech completely armor-plated",
          "subjugate the imitators till they're carbonated",
          "esper rhyme professor never antiquated",
          "inserting viral codes till the mainframe is decimated",
          "original minstrels our central processing unit",
          "is in tune with our hearts for this art before you knew it"
        ]
      },
      {
        tag: "astro-tactical",
        rhymes: [
          "mathematical astro grapple flow across the cosmos",
          "pterodactyl very factual crash course for the hostile",
          "cast me off at last we warp to my own neurological cubbyhole",
          "unravelling rhyme in traveling time to snatch your soul",
          "subatomic love of logic bug with heavy phonics",
          "mind control bandannas scanning tactical electronics",
          "psionically sparking brain cells till they're glowing bright",
          "recalibrating frequencies into the speed of light"
        ]
      },
      {
        tag: "automator-creator",
        rhymes: [
          "Deltron Zero and Automator dropping combinations",
          "harder slayers navigating cyber constellations",
          "praise to the creator we relate to cosmic nature",
          "hyperwarp to the lab of the galactic data curator",
          "vaporize the imitators with a laser oscillator",
          "elevate our rhythm past the orbital elevator",
          "striking at the source to reclaim the stolen sound",
          "shaking every colony from orbit to the ground"
        ]
      },
      {
        tag: "wisdom-rhythm",
        rhymes: [
          "enterprising oligarchs thinking capitalism is the wisdom",
          "and imprison all citizens empowered with the rhythm",
          "we keep the funk alive by talking through encrypted idioms",
          "transmitting coded signals past the planetary surveillance mediums",
          "codes for the cataclysm using acoustic magnetism",
          "breaking down the hologram of corporate realism",
          "we high-tech archaeologists searching for the lost truths",
          "spitting sonic stimpacks inside the audio booths"
        ]
      },
      {
        tag: "spacecraft-soldier",
        rhymes: [
          "now we just boarded on a futuristic spacecraft",
          "no mistakes black it's our music that we take back",
          "I used to be a mech soldier but I didn't respect orders",
          "had to step forward and blow past their planetary borders",
          "living in a post-apocalyptic world morbid and horrid",
          "the secrets of the golden era that the tyrants hoarded",
          "composing musical stimpacks that impact the spirit",
          "shaking up the universe whenever mortals hear it"
        ]
      },
      {
        tag: "ghost-shell",
        rhymes: [
          "Del, I'm feeling like a ghost inside an armored shell",
          "I composed this in jail playing host to an ion cell",
          "for the pure verbal, sentence equivalent to galactic murder",
          "bounced through a quantum portal while the guards were stumbling further",
          "my ears morphed to receptors catching every distant word",
          "of gravity control and corrupt families deferred",
          "blast bioforms with a laser handgun on the run",
          "hijack an imperial mech and blot out the synthetic sun"
        ]
      }
    ];

    this.intros = [
      [
        "Calling Apollo 9, calling Apollo 9... What is your condition, over?",
        "This is Apollo 9, condition green, all systems are GO. Yo, it's 3030!"
      ],
      [
        "Incoming encrypted transmission from deep space coordinates...",
        "Deltron Zero, Automator, and Kid Koala locking in the sound check!"
      ],
      [
        "Attention planetary inhabitants: The year is thirty-thirty...",
        "Megacorps control the atmosphere, but we control the sound waves!"
      ],
      [
        "Sub-space receptors online, hyperspace coordinates calibrated...",
        "Automator drop the needle on the antimatter platter, let's go!"
      ],
      [
        "Bio-scanners detect excessive synthetic mediocrity in this sector...",
        "Deploying musical stimpacks... Deltron Zero stepping to the microphone!"
      ]
    ];

    this.choruses = [
      [
        "Yo, it's 3030! I want y'all to meet Deltron Zero, and Automator!",
        "Yo, it's 3030! We take the music back through the hyper-warp generator!",
        "Yo, it's 3030! Neuromancer vibes shaking every cyber sector!",
        "Deltron Zero on the microphone terminal, breaking down the vector!"
      ],
      [
        "I want to devise a virus, to bring dire straits to your environment!",
        "Crush your corporations with a mild touch!",
        "Trash your whole computer system and revert you to papyrus!",
        "Deltron Zero taking over the frequency with the master clutch!"
      ],
      [
        "People have a memory loss, they try to get over!",
        "Looking up the sky is red, city's burning overhead!",
        "We make the best of it in this post-apocalypse!",
        "Deltron Zero spitting truth across the galactic strip!"
      ],
      [
        "No one knows the time, pass me by, pass me by...",
        "I remake my universe every time I use a verse!",
        "Mathematical astro, grapple flow, pterodactyl factual!",
        "Yo, it's 3030, Deltron Zero on the microphone terminal!"
      ]
    ];

    this.interludes = [
      [
        "[RADIO CHATTER] 'Apollo 9, we are seeing massive sonic fluctuations in Sector 7...'",
        "[KID KOALA] 'Deltron Zero has completely bypassed the planetary firewall!'"
      ],
      [
        "[AUTOMATOR] 'Automator slicing up the analog tape reels across the universe...'",
        "[SCRATCH] 'Kid Koala scratching through three dimensions of spacetime!'"
      ],
      [
        "[SYSTEM ALERT] 'WARNING: Papyrus virus spreading through mainframe...'",
        "[MAINFRAME] 'All corporate subroutines reverting to ancient stone tablets!'"
      ],
      [
        "[DELTRON SPEAK] 'Yo... they thought they could monopolize the funk in thirty-thirty.'",
        "[DELTRON SPEAK] 'But rhythm is immortal, baby. Check the cadence!'"
      ]
    ];

    this.outros = [
      [
        "Deltron Zero... Dan the Automator... Kid Koala on the cuts...",
        "Neural Core offline... Transmission complete until next orbit."
      ],
      [
        "Transmission terminating... Erasing all telemetry logs from corporate satellites...",
        "Deltron 3030 underground resistance remains undefeated!"
      ]
    ];
  }

  setAccessCode(code) {
    this.accessCode = (code || "").trim();
    try {
      localStorage.setItem("deltron_access_code", this.accessCode);
    } catch (e) {}
  }

  setApiKey(key) {
    this.geminiApiKey = key.trim();
    this.useGemini = !!(this.geminiApiKey || this.accessCode);
    try {
      localStorage.setItem("deltron_gemini_api_key", this.geminiApiKey);
    } catch (e) {}
  }

  /**
   * Discovers available models for direct client API calls if needed
   */
  async discoverAvailableModels() {
    if (!this.geminiApiKey) return [];
    
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(this.geminiApiKey)}`,
      `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(this.geminiApiKey)}`
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const ALLOWED_MODELS = [
            "gemini-robotics-er-2-preview",
            "gemini-flash-lite-latest",
            "gemini-3.5-flash-lite",
            "gemini-3.6-flash",
            "gemini-3.5-flash",
            "gemini-3.7-flash",
            "gemini-3-flash-preview",
            "gemini-flash-latest",
            "gemini-3.1-flash-lite",
            "gemini-3.1-pro-preview",
            "gemini-pro-latest"
          ];

          if (data && Array.isArray(data.models)) {
            const viable = data.models
              .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"))
              .map(m => ({
                id: (m.name || "").replace(/^models\//, ""),
                displayName: m.displayName || m.name,
                apiVersion: url.includes("/v1beta/") ? "v1beta" : "v1"
              }))
              .filter(m => ALLOWED_MODELS.includes(m.id));

            if (viable.length > 0) {
              viable.sort((a, b) => {
                const idxA = ALLOWED_MODELS.indexOf(a.id);
                const idxB = ALLOWED_MODELS.indexOf(b.id);
                return idxA - idxB;
              });

              this.discoveredModels = viable;
              return viable;
            }
          }
        }
      } catch (err) {
        console.warn("ListModels check attempt failed on:", url, err);
      }
    }

    return [];
  }

  /**
   * Generates a track using Server Proxy Endpoint (with Access Code '3030')
   * or Client-side direct generation, or Offline Generative Matrix
   */
  async generateTrackAsync(customTheme = null, battleOpponent = null) {
    let proxyError = null;
    let clientError = null;

    // 1. Try Server Proxy API first (Secure server key with access code 3030)
    try {
      const serverTrack = await this.generateViaServerProxy(customTheme, battleOpponent);
      if (serverTrack && serverTrack.isAIGenerated) {
        this.lastApiStatus = { 
          active: true, 
          model: "DeltronZero AI Agent", 
          internalModel: serverTrack.internalModel || "gemini-3.6-flash",
          latencyMs: serverTrack.latencyMs,
          error: null 
        };
        return serverTrack;
      }
    } catch (proxyErr) {
      proxyError = proxyErr.message;
      console.warn("Server proxy generation note:", proxyErr.message);
    }

    // 2. Try direct client-side generation if custom key is entered
    if (this.geminiApiKey) {
      try {
        const aiTrack = await this.generateViaGemini(customTheme, battleOpponent);
        if (aiTrack && aiTrack.isAIGenerated) {
          this.lastApiStatus = { 
            active: true, 
            model: "DeltronZero AI Agent", 
            internalModel: aiTrack.internalModel || "gemini-3.6-flash",
            latencyMs: aiTrack.latencyMs,
            error: null 
          };
          return aiTrack;
        }
      } catch (err) {
        clientError = err.message;
        console.warn("Client-side neural generation failed, falling back to offline matrix:", err);
      }
    }

    const reason = proxyError ? `Server API notice: ${proxyError}` : (clientError ? `Client API notice: ${clientError}` : "Operating in Offline Procedural mode.");
    this.lastApiStatus = { 
      active: false, 
      model: null, 
      error: reason 
    };

    // 3. Fallback to rich offline procedural matrix
    return this.generateOfflineTrack(customTheme, battleOpponent, reason);
  }

  /**
   * Calls Server Proxy Endpoint `/api/generate` with Access Code '3030'
   */
  async generateViaServerProxy(customTheme = null, battleOpponent = null) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const res = await fetch("/api/generate", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessCode: this.accessCode || "3030",
        clientApiKey: this.geminiApiKey || "",
        customTheme: customTheme || "",
        battleOpponent: battleOpponent || ""
      })
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      let parsed;
      try { parsed = JSON.parse(errText); } catch (_) {}
      throw new Error(parsed?.message || `Server Proxy returned ${res.status}`);
    }

    const data = await res.json();
    if (data && data.track) {
      return {
        ...data.track,
        latencyMs: data.latencyMs,
        isAIGenerated: true,
        modelUsed: data.modelUsed || "DeltronZero AI Agent",
        internalModel: data.internalModel || "gemini-3.6-flash"
      };
    }

    throw new Error("Invalid track data returned from server proxy");
  }

  cleanLyricLine(rawLine) {
    if (!rawLine || typeof rawLine !== "string") return null;
    let l = rawLine.trim();

    // Strip leading numbering: "1.", "1)", "[01]", "Bar 1:", "Line 1 -"
    l = l.replace(/^(?:\[?\d{1,2}\]?[:.)\-\s]+|bar\s*\d+[:.)\-\s]+|line\s*\d+[:.)\-\s]+)/i, "").trim();

    // Strip leading/trailing markdown, quotes, brackets
    l = l.replace(/^["'`\[\](){}#*]+\s*/, "").replace(/\s*["'`\[\](){}#*]+$/, "").trim();

    // Strip trailing punctuation artifacts
    l = l.replace(/[,;:]+$/, "").trim();

    // Structural section headers or JSON keys
    const isStructuralHeader = /^(?:verse\s*\d*|intro|chorus|interlude|outro|bridge|hook|title|track|bars?|stanza|audio|sample|cut|scratches?|scratch)\s*[:=-]?\s*$/i.test(l);
    const isJsonSyntax = /^[{}\[\],":;\s]+$/.test(l) || /^"?\w+"?\s*:\s*(?:\[|"[^"]*"|true|false|\d+)?\s*,?$/i.test(l);
    const isStageDirection = /^\s*\[?(?:DJ Kid Koala|Automator|Del the Funky|Apollo 9|Radio Chatter|Transmission Sample|Scratch|Beat Drops?|Instrumental)\]?[:\s]*$/i.test(l);
    const isMetaPrompt = /^(?:1-2 sentence|3-4 line|rich multisyllabic|Apollo 9|Final orbital|Frequency modulation|Deep space telemetry|Intro Bar|Bar \d+|Outro Bar|Interlude Bar|Chorus Bar)/i.test(l);
    const isPunctuationOnly = /^[\W_]+$/.test(l) && !/[a-zA-Z0-9]/.test(l);

    if (isStructuralHeader || isJsonSyntax || isStageDirection || isMetaPrompt || isPunctuationOnly) {
      return null;
    }

    return l.length >= 3 ? l : null;
  }

  cleanTitle(rawTitle, fallback = "DELTRON ZERO // 3030 NEURAL TRANSMISSION") {
    if (!rawTitle || typeof rawTitle !== "string") return fallback;
    let t = rawTitle
      .replace(/^(?:track\s*title|title|operation|track)\s*[:=-]\s*/i, "")
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/[[\]{}#*]/g, "")
      .trim();
    return t.length >= 3 ? t : fallback;
  }

  normalizeSectionLines(v, minBars = 2, maxBars = 14, defaultCouplet = null) {
    let lines = [];
    if (Array.isArray(v)) {
      lines = v.map(l => this.cleanLyricLine(l)).filter(Boolean);
    } else if (typeof v === "string") {
      lines = v.split(/\r?\n/).map(l => this.cleanLyricLine(l)).filter(Boolean);
      if (lines.length === 1 && lines[0].length > 40) {
        const parts = lines[0].split(/[;—–]|\.\s+|,\s+(?=[A-Z])/).map(l => this.cleanLyricLine(l)).filter(Boolean);
        if (parts.length >= 2) lines = parts;
      }
    }

    if (lines.length < minBars) {
      if (lines.length === 1) {
        lines.push(defaultCouplet && defaultCouplet[1] ? defaultCouplet[1] : "Deltron Zero transmitting on the secondary frequency");
      } else if (defaultCouplet && defaultCouplet.length >= minBars) {
        lines = defaultCouplet;
      } else {
        lines = [
          "Deltron Zero on the microphone terminal",
          "Dropping multisyllabic syntax to make the flow eternal"
        ];
      }
    }

    if (lines.length > maxBars) {
      lines = lines.slice(0, maxBars);
    }

    return lines;
  }

  /**
   * Calls DeltronZero AI Agent REST API with auto-discovered neural endpoints & bulletproof fallback chain
   */
  async generateViaGemini(customTheme = null, battleOpponent = null) {
    if (!this.geminiApiKey) {
      throw new Error("No DeltronZero AI Agent key configured.");
    }

    const startTime = Date.now();
    const prompt = `You are Deltron Zero, the legendary futuristic underground MC from Deltron 3030 (Del the Funky Homosapien, Dan the Automator, Kid Koala).
The year is 3030. You battle megacorps, corrupt tech oligarchs, and mech sentries with complex multisyllabic rhyme schemes, philosophical cyber-dystopia themes, and boom-bap rhythm.

IMPORTANT BAR STRUCTURE RULES:
- EVERY section MUST contain multiple bars (between 2 and 14 bars). NEVER output a single isolated 1-line bar.
- Intros: exactly 2 to 4 bars/lines.
- Verses (Verse 1 & Verse 2): exactly 12 to 14 bars (rich multisyllabic rhyming couplets).
- Chorus: exactly 4 bars.
- Interlude: exactly 2 to 4 bars.
- Outro: exactly 2 to 4 bars.

${battleOpponent ? `Challenge Scenario: Brutal lyrical cyber-battle against suggested rival MC: "${battleOpponent}". Break them down with futuristic tech vocabulary across 12-14 bars.` : ''}
${customTheme ? `Lyrical Suggestion & Theme: "${customTheme}". Seamlessly synthesize and weave this suggested concept, imagery, and theme into authentic Deltron 3030 lore and multisyllabic rhyming across 12-14 bars.` : 'Theme: A galactic 24/7 transmission from deep space orbit over Mars.'}

Return JSON with this exact schema:
{
  "title": "Track title (e.g. OPERATION: CYBER VIRUS 3030)",
  "intro": [
    "Intro Bar 1 (Apollo 9 / NASA transmission sample)",
    "Intro Bar 2 (Deep space telemetry relay)"
  ],
  "verse1": [
    "Bar 1 line (rich multisyllabic rhyme)",
    "Bar 2 line",
    "Bar 3 line",
    "Bar 4 line",
    "Bar 5 line",
    "Bar 6 line",
    "Bar 7 line",
    "Bar 8 line",
    "Bar 9 line",
    "Bar 10 line",
    "Bar 11 line",
    "Bar 12 line",
    "Bar 13 line",
    "Bar 14 line"
  ],
  "chorus": [
    "Chorus Bar 1 (catchy sci-fi chorus)",
    "Chorus Bar 2",
    "Chorus Bar 3",
    "Chorus Bar 4"
  ],
  "interlude": [
    "Interlude Bar 1 (DJ Kid Koala scratch/radio line)",
    "Interlude Bar 2 (Frequency modulation)"
  ],
  "verse2": [
    "Bar 1 line",
    "Bar 2 line",
    "Bar 3 line",
    "Bar 4 line",
    "Bar 5 line",
    "Bar 6 line",
    "Bar 7 line",
    "Bar 8 line",
    "Bar 9 line",
    "Bar 10 line",
    "Bar 11 line",
    "Bar 12 line",
    "Bar 13 line",
    "Bar 14 line"
  ],
  "outro": [
    "Outro Bar 1 (Final orbital sign-off)",
    "Outro Bar 2 (Neural Core fading to black)"
  ]
}
Return ONLY valid JSON.`;

    // 1. Discover models if not already discovered
    let candidateList = [];
    try {
      const discovered = await this.discoverAvailableModels();
      if (discovered && discovered.length > 0) {
        discovered.forEach(m => {
          candidateList.push({
            modelName: m.id,
            apiVersion: m.apiVersion || "v1beta"
          });
        });
      }
    } catch (e) {
      console.warn("Auto-discovery failed, using default candidate fallback list");
    }

    // 2. Add comprehensive standard fallback candidates
    const standardFallbacks = [
      { modelName: "gemini-robotics-er-2-preview", apiVersion: "v1beta" },
      { modelName: "gemini-flash-lite-latest", apiVersion: "v1beta" },
      { modelName: "gemini-3.5-flash-lite", apiVersion: "v1beta" },
      { modelName: "gemini-3.6-flash", apiVersion: "v1beta" },
      { modelName: "gemini-3.5-flash", apiVersion: "v1beta" },
      { modelName: "gemini-3.7-flash", apiVersion: "v1beta" },
      { modelName: "gemini-3-flash-preview", apiVersion: "v1beta" },
      { modelName: "gemini-flash-latest", apiVersion: "v1beta" },
      { modelName: "gemini-3.1-flash-lite", apiVersion: "v1beta" },
      { modelName: "gemini-3.1-pro-preview", apiVersion: "v1beta" },
      { modelName: "gemini-pro-latest", apiVersion: "v1beta" }
    ];

    standardFallbacks.forEach(fb => {
      if (!candidateList.some(c => c.modelName === fb.modelName && c.apiVersion === fb.apiVersion)) {
        candidateList.push(fb);
      }
    });

    let lastError = null;

    // 3. Iterate through candidate models until one succeeds
    for (const cand of candidateList) {
      const url = `https://generativelanguage.googleapis.com/${cand.apiVersion}/models/${cand.modelName}:generateContent?key=${encodeURIComponent(this.geminiApiKey)}`;
      
      // Try with responseMimeType first, and retry without if 400
      const payloads = [
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.95,
            responseMimeType: "application/json"
          }
        },
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.95
          }
        }
      ];

      for (const payload of payloads) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          const response = await fetch(url, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            const errBody = await response.text();
            let parsedErr;
            try { parsedErr = JSON.parse(errBody); } catch (_) {}
            const errMsg = parsedErr?.error?.message || errBody;
            
            // If error is 400 due to responseMimeType, let loop try next payload without it
            if (response.status === 400 && payload.generationConfig?.responseMimeType) {
              continue;
            }
            throw new Error(`Agent Network Error ${response.status}: ${errMsg}`);
          }

          const data = await response.json();
          let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) throw new Error(`Empty response content from agent core`);

          const parsed = this.parseJsonSafely(rawText);
          const latencyMs = Date.now() - startTime;

          const introLines = this.normalizeSectionLines(parsed.intro, 2, 4, this.getIntro());
          const v1 = this.normalizeSectionLines(parsed.verse1, 12, 14, this.generateProceduralVerse());
          const chorusLines = this.normalizeSectionLines(parsed.chorus, 2, 4, this.getChorus());
          const interludeLines = this.normalizeSectionLines(parsed.interlude, 2, 4, this.getInterlude());
          const v2 = this.normalizeSectionLines(parsed.verse2, 12, 14, this.generateProceduralVerse());
          const outroLines = this.normalizeSectionLines(parsed.outro, 2, 4, this.getOutro());

          return {
            title: parsed.title || `DELTRON ZERO // 3030 NEURAL TRANSMISSION`,
            bpm: 90,
            isAIGenerated: true,
            modelUsed: "DeltronZero AI Agent",
            apiVersionUsed: cand.apiVersion,
            latencyMs: latencyMs,
            rawJson: parsed,
            sections: [
              { type: "intro", title: "Intro (Orbital Relay)", lines: introLines },
              { type: "verse", title: `Verse 1 (Deltron Zero // DeltronZero AI Agent)`, lines: v1 },
              { type: "chorus", title: "Chorus (Automator Hook)", lines: chorusLines },
              { type: "interlude", title: "Interlude (DJ Kid Koala Scratch)", lines: interludeLines },
              { type: "verse", title: `Verse 2 (Deltron Zero // DeltronZero AI Agent)`, lines: v2 },
              { type: "chorus", title: "Chorus (Outro Hook)", lines: chorusLines },
              { type: "outro", title: "Outro (Neural Offline)", lines: outroLines }
            ]
          };
        } catch (err) {
          lastError = err;
          break; // move to next model candidate
        }
      }
    }

    throw lastError || new Error("DeltronZero AI Agent failed to generate content. Please verify your AI Agent key.");
  }

  /**
   * Safely extracts JSON even if enclosed in markdown fences, with automatic repair and regex extraction
   */
  parseJsonSafely(rawText) {
    let text = (rawText || "").trim();
    
    // 1. Strip markdown fences
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch) text = fenceMatch[1].trim();

    // 2. Locate JSON boundaries
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    let jsonCandidate = (firstBrace !== -1 && lastBrace > firstBrace) 
      ? text.substring(firstBrace, lastBrace + 1) 
      : text;

    // 3. Clean trailing commas & comments before parsing
    let sanitizedJson = jsonCandidate
      .replace(/\/\/[^\n\r]*/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/,\s*([}\]])/g, "$1");

    try {
      const parsed = JSON.parse(sanitizedJson);
      if (parsed && typeof parsed === "object") {
        return {
          title: this.cleanTitle(parsed.title),
          intro: parsed.intro,
          verse1: parsed.verse1,
          chorus: parsed.chorus,
          interlude: parsed.interlude,
          verse2: parsed.verse2,
          outro: parsed.outro
        };
      }
    } catch (e) {
      // JSON.parse failed, fallback to regex extraction
    }

    // 4. Targeted Regex Extraction
    const extractSectionArray = (key) => {
      const arrMatch = text.match(new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`, "i"));
      if (arrMatch) {
        const items = [];
        const itemRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
        let m;
        while ((m = itemRegex.exec(arrMatch[1])) !== null) {
          const cleaned = this.cleanLyricLine(m[1].replace(/\\"/g, '"'));
          if (cleaned) items.push(cleaned);
        }
        if (items.length > 0) return items;
      }

      const strMatch = text.match(new RegExp(`"${key}"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"`, "i"));
      if (strMatch) {
        const cleaned = this.cleanLyricLine(strMatch[1].replace(/\\"/g, '"'));
        if (cleaned) return [cleaned];
      }

      return [];
    };

    const titleMatch = text.match(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i) ||
                       text.match(/(?:title|track)\s*[:=-]\s*"?([^"\n\r]+)"?/i);

    const v1 = extractSectionArray("verse1");
    const v2 = extractSectionArray("verse2");
    
    if (v1.length === 0 && v2.length === 0) {
      // Split plain lines and filter strictly
      const rawLines = text.split(/\r?\n/).map(l => this.cleanLyricLine(l)).filter(Boolean);
      return {
        title: this.cleanTitle(titleMatch ? titleMatch[1] : null),
        intro: rawLines.slice(0, 2),
        verse1: rawLines.slice(2, 16),
        chorus: rawLines.slice(16, 20),
        interlude: rawLines.slice(20, 22),
        verse2: rawLines.slice(22, 36),
        outro: rawLines.slice(36, 38)
      };
    }

    return {
      title: this.cleanTitle(titleMatch ? titleMatch[1] : null),
      intro: extractSectionArray("intro"),
      verse1: v1,
      chorus: extractSectionArray("chorus"),
      interlude: extractSectionArray("interlude"),
      verse2: v2,
      outro: extractSectionArray("outro")
    };
  }

  /**
   * Offline Generative Sci-Fi Rhyme & Flow Engine (Infinite dynamic combinations)
   */
  generateOfflineTrack(customTheme = null, battleOpponent = null, fallbackReason = "Procedural Rhyme Matrix") {
    let title = `TRANSMISSION 3030-${Math.floor(1000 + Math.random() * 9000)}`;
    let verse1Lines = [];

    if (battleOpponent) {
      title = `CYBER BATTLE: DELTRON ZERO VS ${battleOpponent.toUpperCase()}`;
      verse1Lines = this.generateBattleVerse(battleOpponent);
    } else if (customTheme) {
      title = `OPERATION: ${customTheme.toUpperCase()} [3030 FREESTYLE]`;
      verse1Lines = this.generateThemedVerse(customTheme);
    } else {
      verse1Lines = this.generateProceduralVerse();
    }

    const verse2Lines = this.generateProceduralVerse();

    return {
      title: title,
      bpm: 90,
      isAIGenerated: false,
      fallbackReason: fallbackReason,
      sections: [
        { type: "intro", title: "Intro (Orbital Relay)", lines: this.getIntro() },
        { type: "verse", title: "Verse 1 (Deltron Zero // Offline Matrix)", lines: verse1Lines },
        { type: "chorus", title: "Chorus (Automator Hook)", lines: this.getChorus() },
        { type: "interlude", title: "Interlude (Radio Chatter)", lines: this.getInterlude() },
        { type: "verse", title: "Verse 2 (Deltron Zero // Offline Matrix)", lines: verse2Lines },
        { type: "chorus", title: "Chorus (Outro Hook)", lines: this.getChorus() },
        { type: "outro", title: "Outro (Transmission Complete)", lines: this.getOutro() }
      ]
    };
  }

  getIntro() {
    return this.intros[Math.floor(Math.random() * this.intros.length)];
  }

  getChorus() {
    return this.choruses[Math.floor(Math.random() * this.choruses.length)];
  }

  getInterlude() {
    return this.interludes[Math.floor(Math.random() * this.interludes.length)];
  }

  getOutro() {
    return this.outros[Math.floor(Math.random() * this.outros.length)];
  }

  /**
   * Assembles a 12-14 bar multisyllabic sci-fi verse with dynamic stanza variation
   */
  generateProceduralVerse() {
    const lines = [];
    const shuffledFamilies = [...this.rhymeMatrix].sort(() => 0.5 - Math.random());
    
    shuffledFamilies.slice(0, 3).forEach(fam => {
      const pickedLines = [...fam.rhymes].sort(() => 0.5 - Math.random()).slice(0, 4);
      pickedLines.forEach(l => {
        lines.push(l.charAt(0).toUpperCase() + l.slice(1));
      });
    });

    const actor = this.vocab.actors[Math.floor(Math.random() * this.vocab.actors.length)];
    const tech = this.vocab.technologies[Math.floor(Math.random() * this.vocab.technologies.length)];
    const loc = this.vocab.locations[Math.floor(Math.random() * this.vocab.locations.length)];
    const enemy = this.vocab.enemies[Math.floor(Math.random() * this.vocab.enemies.length)];
    const action = this.vocab.actions[Math.floor(Math.random() * this.vocab.actions.length)];
    const desc = this.vocab.descriptors[Math.floor(Math.random() * this.vocab.descriptors.length)];

    lines.push(`Now ${actor} steps in to ${action} the ${enemy}`);
    lines.push(`Overclocking the ${tech} across ${loc} with ${desc} energy!`);

    return lines.slice(0, 14);
  }

  /**
   * Generates a customized freestyle responding directly to any topic (12 bars)
   */
  generateThemedVerse(topic) {
    const t = topic.trim();
    const actor = this.vocab.actors[Math.floor(Math.random() * this.vocab.actors.length)];
    const tech = this.vocab.technologies[Math.floor(Math.random() * this.vocab.technologies.length)];
    const loc = this.vocab.locations[Math.floor(Math.random() * this.vocab.locations.length)];
    const action = this.vocab.actions[Math.floor(Math.random() * this.vocab.actions.length)];
    const desc = this.vocab.descriptors[Math.floor(Math.random() * this.vocab.descriptors.length)];

    return [
      `Deltron Zero intercepting query on ${t}!`,
      `Your primitive data streams cannot conceal the logic`,
      `I ${action} through the ${tech}, breaking corporate narcotics`,
      `Spitting ${desc} frequencies across ${loc} to calibrate the project`,
      `You think ${t} can withstand the 3030 pressure?`,
      `My central processing unit makes the algorithms fresher`,
      `Automator dropped the needle, turning static into treasure`,
      `We calculate the astro-flow beyond your mortal measure`,
      `Injecting viral syntax straight into the cyber mainframe`,
      `Dissolving all your firewalls and digital illusions in the flame`,
      `From Neo-Tokyo to Mars, we broadcast revolution in the name of the art`,
      `Deltron Zero on the mic, the ultimate solution right from the start!`
    ];
  }

  /**
   * Generates a rap battle verse targeting any opponent (12 bars)
   */
  generateBattleVerse(opponentName = "Corporate Mech-Bot 9000") {
    return [
      `Challenge acknowledged: targeting ${opponentName}!`,
      `Your microchips are obsolete, your syntax is so lame`,
      `I'm Deltron Zero, mech soldier of galactic fame`,
      `You running on outdated DOS while I control the flame!`,
      `I shoot typographical lasers straight through your chassis`,
      `Your programmed battle simulations couldn't even match me`,
      `I revert your core processor back to stone and papyrus`,
      `You got a hardware glitch, I got the master virus!`,
      `Kid Koala scratching circles round your radar sweep`,
      `Automator basslines putting all your drones to sleep`,
      `System error 404: opponent decommissioned in space`,
      `Deltron Zero reigns supreme across the human race!`
    ];
  }
}

// Attach to window
window.DeltronLyricalEngine = DeltronLyricalEngine;
