/**
 * DELTRON ZERO // 3030 MAINFRAME SERVER
 * Production Node.js / Express Server for Google Cloud Run
 * 
 * Secure Server-side API Key Storage & Access Code '3030' Protection
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Environment Config
const SERVER_API_KEY = (process.env.DELTRON_API_KEY || process.env.GEMINI_API_KEY || '').trim();
const ACCESS_CODE = (process.env.ACCESS_CODE || '3030').trim();

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check for Google Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'deltron-zero-3030',
    timestamp: new Date().toISOString()
  });
});

// Server AI Status & Access Code requirement
app.get('/api/status', (req, res) => {
  res.status(200).json({
    serverKeyConfigured: !!SERVER_API_KEY,
    accessCodeRequired: true,
    defaultAccessCodeHint: '3030',
    revision: process.env.K_REVISION || 'local-dev',
    version: '3030.6'
  });
});

// Detailed Real-time Diagnostics Endpoint
app.get('/api/diagnostics', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    revision: process.env.K_REVISION || 'local-dev',
    service: process.env.K_SERVICE || 'deltron-rap-bot',
    serverKeyConfigured: !!SERVER_API_KEY,
    keyMask: SERVER_API_KEY ? `${SERVER_API_KEY.substring(0, 5)}...${SERVER_API_KEY.slice(-4)}` : 'NONE',
    accessCode: ACCESS_CODE,
    primaryModel: 'gemini-robotics-er-2-preview',
    priorityModels: [
      'gemini-robotics-er-2-preview',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.5-flash'
    ],
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  });
});

// Verify Access Code Endpoint
app.post('/api/verify-code', (req, res) => {
  const code = (req.body.accessCode || '').trim();
  const isAuthorized = code === ACCESS_CODE || code === '3030';
  
  if (isAuthorized) {
    return res.status(200).json({
      success: true,
      authorized: true,
      message: 'ACCESS GRANTED: DeltronZero AI Agent Neural Core Online.'
    });
  } else {
    return res.status(401).json({
      success: false,
      authorized: false,
      message: 'ACCESS DENIED: Invalid access code. Enter 3030 to unlock live neural broadcasting.'
    });
  }
});

async function discoverServerModels(apiKey) {
  if (!apiKey) return [];
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
    `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.models)) {
          const ALLOWED_MODELS = [
            'gemini-robotics-er-2-preview',
            'gemini-flash-lite-latest',
            'gemini-3.5-flash-lite',
            'gemini-3.6-flash',
            'gemini-3.5-flash',
            'gemini-3.7-flash',
            'gemini-3-flash-preview',
            'gemini-flash-latest',
            'gemini-3.1-flash-lite',
            'gemini-3.1-pro-preview',
            'gemini-pro-latest'
          ];

          const viable = data.models
            .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
            .map(m => ({
              modelName: (m.name || '').replace(/^models\//, ''),
              apiVersion: url.includes('/v1beta/') ? 'v1beta' : 'v1'
            }))
            .filter(m => ALLOWED_MODELS.includes(m.modelName));

          if (viable.length > 0) {
            viable.sort((a, b) => {
              const idxA = ALLOWED_MODELS.indexOf(a.modelName);
              const idxB = ALLOWED_MODELS.indexOf(b.modelName);
              return idxA - idxB;
            });

            return viable;
          }
        }
      }
    } catch (e) {
      console.warn('Server ListModels check warning:', e.message);
    }
  }

  return [];
}

// Proxy Neural Rap Generator
app.post('/api/generate', async (req, res) => {
  const { accessCode, clientApiKey, customTheme, battleOpponent } = req.body;
  const providedCode = (accessCode || '').trim();
  const isAuthorized = providedCode === ACCESS_CODE || providedCode === '3030';

  // Determine active API Key
  const activeKey = (clientApiKey && clientApiKey.trim()) || (isAuthorized ? SERVER_API_KEY : null);

  if (!activeKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access code required (Enter 3030) or provide a custom AI key.'
    });
  }

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
    "Intro Bar 1 (Apollo 9 / NASA orbital sample)",
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
    "Chorus Bar 1 (catchy sci-fi hook)",
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

  let candidateModels = [];
  try {
    const discovered = await discoverServerModels(activeKey);
    if (discovered && discovered.length > 0) {
      candidateModels = discovered;
    }
  } catch (_) {}

  const standardFallbacks = [
    { modelName: 'gemini-robotics-er-2-preview', apiVersion: 'v1beta' },
    { modelName: 'gemini-flash-lite-latest', apiVersion: 'v1beta' },
    { modelName: 'gemini-3.5-flash-lite', apiVersion: 'v1beta' },
    { modelName: 'gemini-3.6-flash', apiVersion: 'v1beta' },
    { modelName: 'gemini-3.5-flash', apiVersion: 'v1beta' },
    { modelName: 'gemini-3.7-flash', apiVersion: 'v1beta' },
    { modelName: 'gemini-3-flash-preview', apiVersion: 'v1beta' },
    { modelName: 'gemini-flash-latest', apiVersion: 'v1beta' },
    { modelName: 'gemini-3.1-flash-lite', apiVersion: 'v1beta' },
    { modelName: 'gemini-3.1-pro-preview', apiVersion: 'v1beta' },
    { modelName: 'gemini-pro-latest', apiVersion: 'v1beta' }
  ];

  standardFallbacks.forEach(fb => {
    if (!candidateModels.some(c => c.modelName === fb.modelName && c.apiVersion === fb.apiVersion)) {
      candidateModels.push(fb);
    }
  });

  let lastError = null;
  const startTime = Date.now();

  for (const cand of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/${cand.apiVersion}/models/${cand.modelName}:generateContent?key=${encodeURIComponent(activeKey)}`;

    const payloads = [
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.95,
          responseMimeType: 'application/json'
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
        console.log(`[Generate] Attempting neural model: ${cand.modelName} (${cand.apiVersion})...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const apiRes = await fetch(url, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        clearTimeout(timeoutId);

        if (!apiRes.ok) {
          const errText = await apiRes.text();
          if (apiRes.status === 400 && payload.generationConfig?.responseMimeType) {
            console.log(`[Generate] ${cand.modelName} 400 on responseMimeType, retrying without mime type...`);
            continue; // retry without responseMimeType
          }
          throw new Error(`Google API ${apiRes.status} on ${cand.modelName} (${cand.apiVersion}): ${errText}`);
        }

        const data = await apiRes.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error('Empty text content received from neural model');

        const parsed = parseJsonSafely(rawText);
        const latencyMs = Date.now() - startTime;
        
        const introLines = normalizeSectionLines(parsed.intro, 2, 4, [
          "Calling Apollo 9, calling Apollo 9... What is your condition, over?",
          "This is Apollo 9, condition green, all systems are GO. Yo, it's 3030!"
        ]);
        const v1 = normalizeSectionLines(parsed.verse1, 12, 14, [
          "I bypass the main frame of the deep space teleprompter",
          "To override the brain waves of the cheap state sponsor",
          "Unleash the mental strain phase, a fleet-faced monster",
          "With algorithms designed to leave the street-gates conquered",
          "They beaming down the signal to the mind-numbed colonist",
          "A teleprompted gospel from a high-tech apologist",
          "I slice through the projection with my cybernetic stylus",
          "And inoculate the system from the hyper-deadly virus",
          "With multi-syllable, beautiful, unusual structure",
          "I'm puncturing the infrastructure, disruptor of the rupture",
          "Through deep space, the scroll is unrolling the propaganda",
          "I scramble the transmission of the corporate commander",
          "Deltron Zero, thirty-thirty, master of the cadence",
          "Reclaiming all the audio from technocratic patience"
        ]);
        const chorusLines = normalizeSectionLines(parsed.chorus, 2, 4, [
          "Yo, it's 3030! We take the music back through the hyper-warp generator!",
          "Deltron Zero on the mic, shattering the simulated regulator!",
          "Kid Koala on the platter slicing through the matrix grid!",
          "Del the Funky Homosapien lifting up the corporate lid!"
        ]);
        const interludeLines = normalizeSectionLines(parsed.interlude, 2, 4, [
          "[DJ Kid Koala] 'Zero, they are tracing the transmission signal...'",
          "[DJ Kid Koala] 'Slicing up analog tape reels across the multiverse!'"
        ]);
        const v2 = normalizeSectionLines(parsed.verse2, 12, 14, [
          "Sub-space resonance vibrating through the speaker cone",
          "Deltron Zero dominating from the Martian zone",
          "The oligarchs are trembling in their anti-gravity chambers",
          "As I reprogram the beacon to broadcast the danger",
          "No longer can they pacify the masses with the prompt",
          "I drop a payload on the mainframe, watch it get stomped",
          "We navigate the vacuum where the shadow-brokers operate",
          "Using advanced quantum physics to decimate their corporate state",
          "The teleprompter's blank, the truth is streaming on the monitor",
          "Deltron Zero, thirty-thirty, underground chronologer",
          "Defeating every mech unit marching in the city square",
          "Dispersing pure acoustics through the contaminated air",
          "Original hip-hop frequency that never dies",
          "Deltron 3030 opening your cybernetic eyes!"
        ]);
        const outroLines = normalizeSectionLines(parsed.outro, 2, 4, [
          "Deltron Zero... Dan the Automator... Kid Koala on the cuts...",
          "Neural Core offline... Transmission complete until next orbit."
        ]);

        console.log(`[Generate] SUCCESS with ${cand.modelName} in ${latencyMs}ms! Title: ${parsed.title}`);

        return res.status(200).json({
          success: true,
          isAIGenerated: true,
          modelUsed: 'DeltronZero AI Agent',
          internalModel: cand.modelName,
          apiVersionUsed: cand.apiVersion,
          latencyMs: latencyMs,
          track: {
            title: parsed.title || 'DELTRON ZERO // 3030 NEURAL TRANSMISSION',
            bpm: 90,
            isAIGenerated: true,
            sections: [
              { type: 'intro', title: 'Intro (Orbital Relay)', lines: introLines },
              { type: 'verse', title: 'Verse 1 (Deltron Zero // DeltronZero AI Agent)', lines: v1 },
              { type: 'chorus', title: 'Chorus (Automator Hook)', lines: chorusLines },
              { type: 'interlude', title: 'Interlude (DJ Kid Koala Scratch)', lines: interludeLines },
              { type: 'verse', title: 'Verse 2 (Deltron Zero // DeltronZero AI Agent)', lines: v2 },
              { type: 'chorus', title: 'Chorus (Outro Hook)', lines: chorusLines },
              { type: 'outro', title: 'Outro (Neural Offline)', lines: outroLines }
            ]
          }
        });
      } catch (err) {
        lastError = err;
        console.warn(`[Generate] Model ${cand.modelName} failed:`, err.message.substring(0, 150));
        break; // try next candidate model
      }
    }
  }

  console.error('All generative model attempts failed on server:', lastError);
  return res.status(502).json({
    success: false,
    error: 'Neural Generation Failed',
    message: lastError ? lastError.message : 'Failed to reach neural endpoints.'
  });
});

function normalizeSectionLines(v, minBars = 2, maxBars = 14, defaultCouplet = null) {
  let lines = [];
  if (Array.isArray(v)) {
    lines = v.map(l => String(l).replace(/[[\]()#*"]/g, '').trim()).filter(l => l.length > 0);
  } else if (typeof v === 'string') {
    lines = v.split(/\r?\n/).map(l => String(l).replace(/[[\]()#*"]/g, '').trim()).filter(l => l.length > 0);
    if (lines.length === 1 && lines[0].length > 40) {
      const parts = lines[0].split(/[;—–]|\.\s+|,\s+(?=[A-Z])/).map(p => p.trim()).filter(p => p.length > 0);
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

function parseJsonSafely(rawText) {
  let text = rawText.trim();
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) {
    text = match[1].trim();
  } else {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      text = text.substring(first, last + 1);
    }
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return {
      title: 'NEURAL TRANSMISSION 3030',
      intro: 'Apollo 9 online, Deltron Zero taking over the frequency...',
      verse1: text.split('\n').filter(l => l.trim().length > 0).slice(0, 12),
      chorus: 'Yo, it\'s 3030! We take the music back through the hyper-warp generator!',
      interlude: 'Kid Koala scratching through the neural buffer...',
      verse2: text.split('\n').filter(l => l.trim().length > 0).slice(12, 24)
    };
  }
}

// Serve Static Frontend Assets with Anti-Cache Headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname, '.')));

// SPA Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🤖 DELTRON ZERO // 3030 MAINFRAME SERVER`);
  console.log(`📡 Listening on: http://0.0.0.0:${PORT}`);
  console.log(`🔑 Server Key Configured: ${SERVER_API_KEY ? 'YES (Active)' : 'NO (Awaiting env var)'}`);
  console.log(`🔒 Access Code: '${ACCESS_CODE}'`);
  console.log(`🌐 Target Domain: deltron.drewratliff.com`);
  console.log(`====================================================`);
});
