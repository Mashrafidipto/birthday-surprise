/**
 * ===================================================================
 *  CINEMATIC BIRTHDAY SURPRISE CONFIGURATION
 *  Customize this file to personalize the entire experience for your lover!
 * ===================================================================
 */

const BIRTHDAY_CONFIG = {
  // -----------------------------------------------------------------
  // 1. RECIPIENT & SENDER DETAILS
  // -----------------------------------------------------------------
  recipientName: "Itoshi", // Change to her/his name or nickname (e.g., "Aria", "Sweetheart")
  senderName: "Tanmoy", // Your name or sign-off (e.g., "Always Yours", "Dipto")
  celebrationTitle: "Happy Birthday, My Heart",
  subtitle: "Every second with you is my favorite chapter in life.",

  // -----------------------------------------------------------------
  // 2. AUDIO SETTINGS
  // -----------------------------------------------------------------
  audio: {
    src: "./audio.mp3", // Path to your romantic background song
    volume: 0.85, // Volume between 0.0 and 1.0
    fadeInSeconds: 2.5, // Smooth audio fade-in duration
    songTitle: "Our Melody", // Displayed on the floating player
    artist: "A Melody Just For You",
  },

  // -----------------------------------------------------------------
  // 3. CINEMATIC COUNTDOWN LEADER (Plays right after tapping "Enter")
  // -----------------------------------------------------------------
  countdown: {
    durationPerCount: 1400, // Milliseconds per number (approx 1.4s)
    enableTutTutSound: true, // Crisp "tut-tut" sound ticking during countdown
    steps: [
      {
        number: "3",
        phrase: "In a world of eight billion souls...",
        sub: "Out of everyone in the universe",
      },
      {
        number: "2",
        phrase: "...my heart chose you to be its home.",
        sub: "Every heartbeat belongs to you",
      },
      {
        number: "1",
        phrase: "Take a deep breath and close your eyes...",
        sub: "Your celebration begins now",
      },
    ],
    revealHeadline: "✨ HAPPY BIRTHDAY ✨",
    revealSubline: "To the most breathtaking soul I know",
  },

  // -----------------------------------------------------------------
  // 4. CINEMATIC STORY REEL (Photos & Memories)
  // -----------------------------------------------------------------
  slides: [
    {
      image: "./images/slide1.jpeg",
      objectPosition: "54% center",
      chapter: "CHAPTER I",
      tag: "THE DAY YOU ARRIVED",
      title: "Where Magic Began",
      caption:
        "From the very moment our paths crossed, the world seemed to turn in higher definition. Everything became warmer, brighter, and infinitely more beautiful.",
    },
    {
      image: "./images/slide2.jpeg",
      objectPosition: "center 22%",
      chapter: "CHAPTER II",
      tag: "UNDER THE STARS",
      title: "Our Quiet Constellations",
      caption:
        "All the late night talks, the quiet whispers, and the way time effortlessly slips away whenever I am talking to you.",
    },
    {
      image: "./images/slide3.jpeg",
      objectPosition: "center 25%",
      chapter: "CHAPTER III",
      tag: "PURE SUNSHINE",
      title: "Your Radiant Smile",
      caption:
        "The way your eyes light up when you laugh is my absolute favorite sight in the world. It can turn even my darkest day into pure gold.",
    },
    {
      image: "./images/slide4.jpeg",
      objectPosition: "center 25%",
      chapter: "CHAPTER IV",
      tag: "SAFE HARBOR",
      title: "In Your Warm Embrace",
      caption:
        "Whenever the world outside feels too noisy or heavy, just resting near you brings a stillness and peace that words can never describe.",
    },
    {
      image: "./images/slide5.jpeg",
      objectPosition: "center 28%",
      chapter: "CHAPTER V",
      tag: "TODAY & ALWAYS",
      title: "Another Beautiful Chapter",
      caption:
        "Happy Birthday, my darling. May this year shower you with all the happiness, magic, and boundless love you so effortlessly pour into the world.",
    },
  ],

  // -----------------------------------------------------------------
  // 5. THE SECRET LOVE LETTER (With interactive Wax Seal)
  // -----------------------------------------------------------------
  letter: {
    waxSealInitial: "♥",
    salutation: "My Dearest Itoshi,",
    paragraphs: [
      "On this day, the universe gifted the earth with the most extraordinary person I will ever know. You carry a quiet magic within you—in your kindness, the warmth of your laughter, and the selfless way you love.",
      "Thank you for being my anchor, my sweetest comfort, and my greatest adventure. Loving you is the easiest, most natural thing I have ever done. Watching you grow, dream, and achieve everything your heart desires is an honor I cherish every single day.",
      "As you blow out your candles and step into this new year of your life, I make you this promise: I will celebrate you not just today, but in every small, quiet, ordinary Tuesday and golden sunset we share.",
    ],
    closing: "Forever & Always Yours,",
    signature: "Tanmoy ❤️",
  },

  // -----------------------------------------------------------------
  // 6. INTERACTIVE BIRTHDAY CAKE & WISH
  // -----------------------------------------------------------------
  cake: {
    title: "Make a Birthday Wish",
    instruction:
      "Close your eyes, hold your deepest wish in your heart, and blow out the candle 🕯️",
    blowButtonText: "Blow Out the Candle ✨",
    relightButtonText: "Relight Candle 🕯️",
    revealedMessage:
      "✨ May every quiet prayer and unspoken dream in your heart come true this year. I love you endlessly! ✨",
  },

  // -----------------------------------------------------------------
  // 7. WHY I ADORE YOU (Romantic Keepsake Cards)
  // -----------------------------------------------------------------
  reasons: [
    {
      icon: "✨",
      title: "Your Radiant Laughter",
      text: "It is the sweetest melody I know, capable of washing away every worry in a second.",
    },
    {
      icon: "🕊️",
      title: "Your Tender Heart",
      text: "The boundless empathy, kindness, and grace you show to everyone around you.",
    },
    {
      icon: "☕",
      title: "Our Quiet Moments",
      text: "How even doing absolutely nothing feels like paradise as long as you are with me.",
    },
    {
      icon: "🌙",
      title: "Your Beautiful Mind",
      text: "The way you think, dream, and see wonder in things others easily overlook.",
    },
    {
      icon: "💫",
      title: "Just Being You",
      text: "Every quirk, every soft glance, and every single piece of your beautiful soul.",
    },
  ],
};

// Export configuration globally for browser access
if (typeof window !== "undefined") {
  window.BIRTHDAY_CONFIG = BIRTHDAY_CONFIG;
}
