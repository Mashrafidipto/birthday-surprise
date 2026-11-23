# ✨ Cinematic Birthday Surprise Website

A luxury, cinematic birthday surprise website designed specifically for lovers. Built with romantic aesthetics, dynamic audio playback, a dramatic film countdown leader, vertical photo reel with Ken Burns zoom, an interactive wax-seal love letter, and a blow-out birthday cake with celebratory confetti bursts.

Optimized mobile-first for viewing on iOS and Android smartphones, and 100% ready to host for free on **GitHub Pages**.

---

## 🎬 Features

- **🎧 Audio Autoplay Gate ("The Prelude")**: Solves mobile browser audio blocking policies gracefully with an atmospheric "Begin Our Story" teaser screen with smooth audio fade-in.
- **⏱️ Cinematic Countdown Leader**: Movie-style 3... 2... 1... sequence with glowing progress stroke, romantic quotes, and an explosive golden sparkle reveal.
- **📱 Mobile-First Story Reel**: Full-screen 9:16 vertical story format with progress bars:
  - Tap right side to advance slide.
  - Tap left side to go back.
  - Touch and hold to pause and admire the photograph.
  - Smooth Ken Burns pan & zoom transitions.
- **💌 Secret Love Letter**: Interactive digital envelope with a 3D wax seal that cracks and reveals a heart-melting love letter.
- **🎂 Interactive Cake & Candle**: Realistic flickering flame that extinguishes when tapped (or blown on), unleashing a rising smoke trail, haptic vibration, and full-screen confetti celebration!
- **💖 Floating Heart Spawner**: Tapping anywhere on the screen floats glowing hearts and stars upward.
- **🎵 Floating Audio Controller**: Spinning vinyl record with animated equalizer bars, allowing play/pause or volume adjustments at any time.

---

## 🚀 How to Host on GitHub Pages (Takes 2 Minutes)

Hosting this website is completely free with GitHub Pages:

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add cinematic birthday surprise"
   git push origin main
   ```
2. **Enable GitHub Pages**:
   - Go to your repository on GitHub (e.g. `https://github.com/YourUsername/birthday-surprise`).
   - Click on **Settings** (top right tab).
   - In the left sidebar, click on **Pages**.
   - Under **Build and deployment > Branch**:
     - Select branch: `main`
     - Select folder: `/(root)`
     - Click **Save**.
3. **Get Your Live Link**:
   - In 1 to 2 minutes, GitHub will display your live URL (e.g., `https://yourusername.github.io/birthday-surprise/`).
   - Send this link to your lover! (It includes rich WhatsApp/iMessage preview tags!).

---

## 🎨 How to Personalize & Customize

All customizable text, quotes, pictures, and names are organized in **`js/config.js`**!

### 1. Change Your Lover's Name & Signatures
Open `js/config.js` and edit:
```javascript
recipientName: "My Love",        // e.g. "Sophia", "Aria", "Sweetheart"
senderName: "Yours Forever",     // Your name or sign-off
celebrationTitle: "Happy Birthday, My Heart",
```

### 2. How to Add Your Own Photos
You have two simple ways to add your own pictures:

#### Option A: Use your own local images (Recommended)
1. Drop your photos into the `images/` folder (e.g., `images/photo1.jpg`, `images/photo2.jpg`, etc.).
2. In `js/config.js`, update the `image` path for each slide:
   ```javascript
   slides: [
     {
       image: "./images/photo1.jpg",
       chapter: "CHAPTER I",
       tag: "THE DAY WE MET",
       title: "Where Magic Began",
       caption: "Your caption here..."
     },
     {
       image: "./images/photo2.jpg",
       chapter: "CHAPTER II",
       tag: "OUR FAVORITE TRIP",
       title: "Under The Sunset",
       caption: "Your caption here..."
     }
     // add as many slides as you want!
   ]
   ```

#### Option B: Use online image URLs
Paste any direct image URL (from Imgur, Cloudinary, Unsplash, Google Photos, etc.) into the `image` property in `js/config.js`.

### 3. Change Background Music
- Replace `audio.mp3` in the main folder with your favorite romantic song (keep the file named `audio.mp3`).
- Or update `src: "./audio.mp3"` in `js/config.js` to point to any audio file.

### 4. Edit The Love Letter
In `js/config.js`, modify `paragraphs` under `letter`:
```javascript
letter: {
  salutation: "My Dearest Love,",
  paragraphs: [
    "Your custom sweet paragraph 1...",
    "Your custom sweet paragraph 2...",
    "Your custom sweet paragraph 3..."
  ],
  signature: "Your Name ❤️"
}
```

---

## 💻 Testing Locally

To preview the website locally on your computer before publishing:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your web browser. (Use Chrome Developer Tools Mobile view `Ctrl+Shift+M` / `Cmd+Option+I` to preview the mobile experience!).
