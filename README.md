# 🤖 DELTRON ZERO // 3030 24/7 AI RAP BOT

> **"Yo, it's 3030... I want y'all to meet Deltron Zero, and Automator!"**  
> An infinite, interactive 24/7 sci-fi AI rap broadcaster modeled on the legendary lyrical flow, multisyllabic rhyme schemes, and cyberpunk dystopian lore of **Deltron 3030** (*Del the Funky Homosapien, Dan the Automator, Kid Koala*).

Published target: **[deltron.drewratliff.com](https://deltron.drewratliff.com)**

---

## ⚡ Features

1. **24/7 Infinite Lyrical Broadcast Engine**:
   - Spits endless verses, choruses, scratches, and interludes continuously without stopping.
   - Deeply modeled after the vocabulary, cadence, and multisyllabic rhymes of *Deltron 3030* (*3030, Virus, Memory Loss, Mastermind, Time Keeps On Slipping, Positive Contact, Upgrade*).
   - Generates complex internal rhyme families (*papyrus / virus / metropolis / environment*, *gravity control / handsome ransoms*, *telepathic mind / immaculate design*).

2. **Dan the Automator Procedural Beat Synthesizer (Web Audio API)**:
   - 100% client-side zero-dependency procedural audio synthesizer.
   - Classic boom-bap hip hop swing drums (punchy kicks, crisp snares, 16th hats, open hats, percussion).
   - 808 Sub-Bass & funky synth-basslines.
   - Vintage vinyl crackle / dust generator.
   - Eerie minor sci-fi chord progressions & space arpeggio leads.
   - **5 Selectable Beat Styles**:
     - *3030 Galactic Suite* (90 BPM)
     - *Papyrus Virus Glitch* (88 BPM)
     - *Memory Loss Lo-Fi* (85 BPM)
     - *Neuromancer Funk* (94 BPM)
     - *Apollo 9 Mars Orbit* (88 BPM)

3. **Cyborg Robotic Vocal Flow & Delivery (Web Speech API)**:
   - Synchronizes speech rate and vocal cadence with track tempo (BPM).
   - 4 Voice Profiles: *Cyborg Mech*, *Deltron Intercom 3030*, *Cyber Commander*, and *Raw Mic*.
   - Word-by-word karaoke bouncing lyric teleprompter with neon glow.

4. **Kid Koala Turntable Scratch & Sound FX Board**:
   - Interactive scratch simulator pads (*Chirp Cut*, *Transform*, *Fresh Slice*).
   - Sci-fi Sound FX (*Laser Blast*, *Modem Bleep*, *808 Sub Drop*).
   - Keyboard hotkeys (`1` through `6` and `Spacebar` for play/pause).

5. **Interactive Freestyle & Cyber Battle Mode**:
   - Enter any topic, prompt, or corporate villain for Deltron Zero to instantly compose and rap a custom sci-fi verse.
   - Initiate Cyber Battle Protocol to duel enemy mechs and corporate AI overlords.

6. **Cyberpunk HUD Visualizer & Lyric Archive**:
   - Real-time Web Audio FFT frequency spectrum analyzer + oscilloscope waveform.
   - Animated 33 RPM vinyl turntable with spinning Kid Koala slipmat.
   - Telemetry status (Orbit: Mars Station 9, Frequency: 3030.88 MHz, live listener counter, stream uptime).
   - Auto-scrolling lyrics history with single-click "Copy Lyrics" and "Export Track" `.txt` downloads.

---

## 🚀 How to Run Locally

Because the project is built with clean vanilla HTML5/CSS/JavaScript and Web Audio API, you can run it with any static server:

```bash
# Option 1: Python 3
python3 -m http.server 8080

# Option 2: Node.js (npx serve)
npx -y serve .

# Option 3: Open index.html directly in modern browser
open index.html
```

Visit `http://localhost:8080` and click **CONNECT TO MAINFRAME // START BROADCAST**.

---

## 🌐 Publishing to `deltron.drewratliff.com`

### Method A: GitHub Pages (Recommended)
1. Push this repository to GitHub (e.g. `github.com/drewratliff/deltron`).
2. Go to **Settings** > **Pages** > Select `main` branch root `/`.
3. In **Custom domain**, enter `deltron.drewratliff.com` (a `CNAME` file is already included).
4. In your DNS provider (Cloudflare, Namecheap, GoDaddy, Route53, etc.) for `drewratliff.com`, add:
   - **Type**: `CNAME`
   - **Name / Host**: `deltron`
   - **Target / Value**: `<your-github-username>.github.io`

### Method B: Cloudflare Pages / Vercel / Netlify
1. Link your repo to Cloudflare Pages, Vercel, or Netlify.
2. Build command: *(leave empty)*, Output directory: `.`
3. Add custom domain `deltron.drewratliff.com` in the project settings.
4. Point the DNS CNAME record for `deltron` to the assigned platform target.

### Method C: Firebase Hosting
1. Login to Firebase:
   ```bash
   npx -y firebase-tools@latest login
   ```
2. Initialize and deploy:
   ```bash
   npx -y firebase-tools@latest deploy
   ```
3. In Firebase Console > Hosting > **Add Custom Domain** > enter `deltron.drewratliff.com` and follow DNS verification prompts.

---

## 📜 Credits & Lore

Inspired by the landmark concept album **Deltron 3030** (2000):
- **Del the Funky Homosapien** (Deltron Zero)
- **Dan the Automator** (The Automator)
- **Kid Koala** (Turntables)
