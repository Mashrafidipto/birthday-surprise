/**
 * ===================================================================
 *  CINEMATIC BIRTHDAY SURPRISE - APPLICATION ENGINE
 *  Handles Web Audio Sound Effects ("Tut-Tut" & Climax Chimes),
 *  Delayed Song Autoplay after Countdown, Free-Flowing Story Reel,
 *  Touch Swipes, Cake Interaction, and Optimized 60FPS Particles.
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.BIRTHDAY_CONFIG || {};

  // -----------------------------------------------------------------
  // 1. POPULATE DYNAMIC CONFIG STRINGS ACROSS THE UI
  // -----------------------------------------------------------------
  const populateText = () => {
    // Climax countdown
    const loverNameEl = document.getElementById('climax-lover-name');
    if (loverNameEl) loverNameEl.textContent = config.recipientName || "My Love";

    const climaxHeadlineEl = document.getElementById('climax-headline');
    if (climaxHeadlineEl && config.countdown?.revealHeadline) {
      climaxHeadlineEl.textContent = config.countdown.revealHeadline;
    }

    const climaxSubEl = document.getElementById('climax-sub');
    if (climaxSubEl && config.countdown?.revealSubline) {
      climaxSubEl.textContent = config.countdown.revealSubline;
    }

    // Letter
    const salutationEl = document.getElementById('letter-salutation');
    if (salutationEl) salutationEl.textContent = config.letter?.salutation || "My Dearest ITOSHI,";

    const letterBodyEl = document.getElementById('letter-paragraphs');
    if (letterBodyEl && config.letter?.paragraphs) {
      letterBodyEl.innerHTML = config.letter.paragraphs
        .map(p => `<p>${p}</p>`)
        .join('');
    }

    const letterClosingEl = document.getElementById('letter-closing');
    if (letterClosingEl) letterClosingEl.textContent = config.letter?.closing || "Forever Yours,";

    const letterSigEl = document.getElementById('letter-signature');
    if (letterSigEl) letterSigEl.textContent = config.letter?.signature || "Tanmoy ❤️";

    // Wax Seal Initial
    const sealBadgeEl = document.getElementById('wax-seal-badge');
    if (sealBadgeEl) sealBadgeEl.textContent = config.letter?.waxSealInitial || "♥";

    // Cake Wish
    const wishMsgEl = document.getElementById('wish-message');
    if (wishMsgEl) wishMsgEl.textContent = config.cake?.revealedMessage || "✨ Happy Birthday, ITOSHI! ✨";

    // Reasons Cards
    const reasonsContainer = document.getElementById('reasons-container');
    if (reasonsContainer && config.reasons) {
      reasonsContainer.innerHTML = config.reasons.map(r => `
        <div class="reason-card">
          <div class="reason-icon">${r.icon || '✨'}</div>
          <div class="reason-title">${r.title}</div>
          <div class="reason-text">${r.text}</div>
        </div>
      `).join('');
    }

    // Audio metadata
    const audioTitleEl = document.getElementById('audio-title');
    if (audioTitleEl) audioTitleEl.textContent = config.audio?.songTitle || "Our Melody";
  };

  populateText();

  // -----------------------------------------------------------------
  // 2. SYNTHESIZED SOUND EFFECTS ENGINE (Web Audio API)
  //    Provides the crisp "tut-tut" countdown sound & celebration chime
  // -----------------------------------------------------------------
  class SoundFX {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Crisp countdown "tut-tut" double pulse
    playTutTut() {
      if (config.countdown?.enableTutTutSound === false) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // First "tut" (high-tech warm tone)
      this._tone(880, now, 0.065, 0.26);
      // Second "tut" (melodic ascending pulse)
      this._tone(1174.66, now + 0.10, 0.075, 0.30);
    }

    // Warm, romantic celebration sparkle chime when countdown finishes
    playCelebrationChime() {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Romantic harmonic chords: D5, F#5, A5, D6, F#6
      const freqs = [587.33, 739.99, 880.00, 1174.66, 1479.98];
      freqs.forEach((freq, idx) => {
        this._tone(freq, now + idx * 0.07, 0.65, 0.18 / (idx * 0.4 + 1));
      });
    }

    _tone(freq, startTime, duration, maxGain = 0.25) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        // Anti-click envelope: 6ms ramp in, natural exponential decay
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      } catch (e) {
        // Fallback gracefully if audio is muted or blocked
      }
    }
  }

  const soundFX = new SoundFX();

  // -----------------------------------------------------------------
  // 3. BACKGROUND MUSIC CONTROLLER
  //    Music starts strictly AFTER countdown finishes!
  // -----------------------------------------------------------------
  const audio = new Audio(config.audio?.src || './audio.mp3');
  audio.loop = true;
  audio.preload = 'auto';

  const audioController = document.getElementById('audio-controller');
  let isAudioPlaying = false;
  let targetVolume = config.audio?.volume !== undefined ? config.audio.volume : 0.85;

  const fadeInAudio = (durationSec = 2.5) => {
    try {
      audio.currentTime = 0;
    } catch (e) {}

    audio.volume = 0;
    const playPromise = audio.play();
    const startRamp = () => {
      isAudioPlaying = true;
      if (audioController) audioController.classList.add('playing');
      let currentVol = 0;
      const stepTime = 50;
      const totalSteps = (durationSec * 1000) / stepTime;
      const volStep = targetVolume / totalSteps;

      const fadeTimer = setInterval(() => {
        currentVol = Math.min(targetVolume, currentVol + volStep);
        audio.volume = currentVol;
        if (currentVol >= targetVolume) {
          clearInterval(fadeTimer);
        }
      }, stepTime);
    };

    if (playPromise !== undefined) {
      playPromise.then(startRamp).catch(err => {
        console.warn('Audio play notice:', err);
      });
    } else {
      startRamp();
    }
  };

  const toggleAudio = (e) => {
    if (e) e.stopPropagation();
    if (isAudioPlaying) {
      audio.pause();
      isAudioPlaying = false;
      if (audioController) audioController.classList.remove('playing');
    } else {
      audio.play().then(() => {
        audio.volume = targetVolume;
        isAudioPlaying = true;
        if (audioController) audioController.classList.add('playing');
      }).catch(err => console.log('Audio resume error:', err));
    }
  };

  if (audioController) {
    audioController.addEventListener('click', toggleAudio);
  }

  // -----------------------------------------------------------------
  // 4. SCENE TRANSITION: PRELUDE -> COUNTDOWN
  // -----------------------------------------------------------------
  const scenePrelude = document.getElementById('scene-prelude');
  const sceneCountdown = document.getElementById('scene-countdown');
  const btnEnter = document.getElementById('btn-cinematic-enter');

  if (btnEnter) {
    btnEnter.addEventListener('click', () => {
      // Trigger Haptic Feedback
      if (navigator.vibrate) navigator.vibrate([25, 40]);

      // Unlock Web Audio context during user click gesture
      soundFX.init();

      // Pre-unlock HTML5 Audio on user gesture by playing silently
      // (Never call pause() here, which causes "play() interrupted by pause" DOMException)
      audio.volume = 0;
      const primeAudio = audio.play();
      if (primeAudio !== undefined) {
        primeAudio.catch(() => {});
      }

      // Preload all story slides for fluid 0ms latency transitions
      preloadSlideImages();

      // Fade out Prelude
      scenePrelude.classList.add('hidden');

      // Start Countdown
      setTimeout(() => {
        startCountdown();
      }, 400);
    });
  }

  // -----------------------------------------------------------------
  // 5. DRAMATIC CINEMATIC COUNTDOWN & SURPRISE REVEAL
  // -----------------------------------------------------------------
  const countNumberEl = document.getElementById('countdown-number');
  const countQuoteEl = document.getElementById('countdown-quote');
  const countSubEl = document.getElementById('countdown-subquote');
  const countRingEl = document.getElementById('countdown-ring-circle');
  const countdownBox = document.getElementById('countdown-box');
  const countdownClimax = document.getElementById('countdown-climax');

  const startCountdown = () => {
    const steps = config.countdown?.steps || [
      { number: "3", phrase: "In a world of billions...", sub: "Out of everyone" },
      { number: "2", phrase: "...my heart chose you.", sub: "Every heartbeat" },
      { number: "1", phrase: "Get ready for your surprise...", sub: "Here it comes" }
    ];

    let currentStepIndex = 0;
    const duration = config.countdown?.durationPerCount || 1400;

    const runStep = () => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];

        // 1. Play the "tut-tut" sound on countdown tick!
        soundFX.playTutTut();

        // 2. Update number text and handle time clock formatting
        countNumberEl.textContent = step.number;
        if (step.number && step.number.length > 4) {
          countNumberEl.classList.add('clock-format');
        } else {
          countNumberEl.classList.remove('clock-format');
        }

        // 3. Smooth quote crossfade
        countQuoteEl.style.opacity = '0';
        countSubEl.style.opacity = '0';
        setTimeout(() => {
          countQuoteEl.textContent = step.phrase;
          countSubEl.textContent = step.sub;
          countQuoteEl.style.opacity = '1';
          countSubEl.style.opacity = '1';
        }, 120);

        // 4. Reset and trigger ring stroke animation
        countRingEl.style.transition = 'none';
        countRingEl.style.strokeDashoffset = '440';
        setTimeout(() => {
          countRingEl.style.transition = `stroke-dashoffset ${duration * 0.9}ms linear`;
          countRingEl.style.strokeDashoffset = '0';
        }, 30);

        // Gentle haptic tick
        if (navigator.vibrate) navigator.vibrate(18);

        currentStepIndex++;
        setTimeout(runStep, duration);
      } else {
        // =============================================================
        // COUNTDOWN FINISHED!
        // Start the song & reveal the free-flowing surprise animation!
        // =============================================================

        // 1. Play celebratory sparkle chime
        soundFX.playCelebrationChime();

        // 2. START THE SONG NOW! (Smooth fade-in)
        fadeInAudio(config.audio?.fadeInSeconds || 2.5);

        // 3. Fluid dissolve of countdown box
        if (countdownBox) countdownBox.classList.add('fade-out');

        setTimeout(() => {
          if (countdownBox) countdownBox.style.display = 'none';
          if (countdownClimax) {
            countdownClimax.style.display = 'flex';
            requestAnimationFrame(() => {
              countdownClimax.classList.add('revealed');
            });
          }
        }, 300);

        // 4. Confetti burst explosion
        launchConfetti(90);
        if (navigator.vibrate) navigator.vibrate([40, 80, 50]);

        // 5. Seamlessly advance to Story Reel after surprise reveal
        setTimeout(() => {
          if (sceneCountdown) sceneCountdown.classList.add('hidden');
          initStoryReel();
        }, 3200);
      }
    };

    runStep();
  };

  // -----------------------------------------------------------------
  // 6. CINEMATIC STORY REEL (Mobile-First Free-Flowing Dual-Layer Reel)
  // -----------------------------------------------------------------
  const slides = config.slides || [];
  let currentSlideIndex = 0;
  let slideTimer = null;
  let slideDuration = 6000; // 6 seconds per slide
  let slideStartTime = 0;
  let slideRemainingTime = slideDuration;
  let isStoryPaused = false;

  const storyContainer = document.getElementById('story-phone-container');
  const progressContainer = document.getElementById('story-progress-container');
  const layerA = document.getElementById('slide-layer-a');
  const layerB = document.getElementById('slide-layer-b');
  let currentActiveLayer = 'a';

  const captionBox = document.getElementById('story-caption-box');
  const captionChapter = document.getElementById('caption-chapter');
  const captionTag = document.getElementById('caption-tag');
  const captionTitle = document.getElementById('caption-title');
  const captionBody = document.getElementById('caption-body');
  const touchLeft = document.getElementById('story-touch-left');
  const touchRight = document.getElementById('story-touch-right');

  // Preload all slide images into browser cache for zero-stutter transitions
  const preloadSlideImages = () => {
    slides.forEach(s => {
      if (s.image) {
        const img = new Image();
        img.src = s.image;
      }
    });
  };

  // Build progress bar segments
  const buildProgressBar = () => {
    if (!progressContainer) return;
    progressContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const seg = document.createElement('div');
      seg.className = `story-progress-segment ${idx === 0 ? 'active' : ''}`;
      seg.innerHTML = '<div class="story-progress-fill"></div>';
      progressContainer.appendChild(seg);
    });
  };

  // Render slide with silky dual-layer crossfade
  const renderSlide = (index) => {
    if (index < 0 || index >= slides.length) return;
    currentSlideIndex = index;
    const slide = slides[index];

    // 1. Smoothly glide caption content
    if (captionBox) {
      captionBox.classList.add('changing');
      setTimeout(() => {
        if (captionChapter) captionChapter.textContent = slide.chapter || `CHAPTER ${index + 1}`;
        if (captionTag) captionTag.textContent = slide.tag || '';
        if (captionTitle) captionTitle.textContent = slide.title || '';
        if (captionBody) captionBody.textContent = slide.caption || '';
        captionBox.classList.remove('changing');
      }, 180);
    }

    // 2. Dual-Layer Ken Burns Crossfade (0ms flash, buttery 60fps)
    if (index === 0 && !storyContainer.classList.contains('initialized')) {
      storyContainer.classList.add('initialized');
      if (layerA) {
        const imgA = layerA.querySelector('.slide-img');
        if (imgA) {
          imgA.src = slide.image;
          imgA.alt = slide.title || 'Memory';
          imgA.style.objectPosition = slide.objectPosition || 'center center';
        }
        layerA.classList.remove('outgoing');
        layerA.classList.add('active');
      }
      if (layerB) {
        layerB.classList.remove('active', 'outgoing');
      }
      currentActiveLayer = 'a';
    } else {
      const incomingLayer = currentActiveLayer === 'a' ? layerB : layerA;
      const outgoingLayer = currentActiveLayer === 'a' ? layerA : layerB;

      if (incomingLayer && outgoingLayer) {
        const incomingImg = incomingLayer.querySelector('.slide-img');
        if (incomingImg) {
          incomingImg.src = slide.image;
          incomingImg.alt = slide.title || 'Memory';
          incomingImg.style.objectPosition = slide.objectPosition || 'center center';
        }

        // Start incoming layer transition
        incomingLayer.classList.remove('outgoing');
        incomingLayer.classList.add('active');

        // Fade out outgoing layer
        outgoingLayer.classList.remove('active');
        outgoingLayer.classList.add('outgoing');

        currentActiveLayer = currentActiveLayer === 'a' ? 'b' : 'a';

        setTimeout(() => {
          outgoingLayer.classList.remove('outgoing');
        }, 850);
      }
    }

    // 3. Update Progress Bars
    const segments = progressContainer ? progressContainer.children : [];
    for (let i = 0; i < segments.length; i++) {
      const fill = segments[i].querySelector('.story-progress-fill');
      if (i < index) {
        segments[i].className = 'story-progress-segment passed';
        if (fill) {
          fill.style.transition = 'none';
          fill.style.width = '100%';
        }
      } else if (i === index) {
        segments[i].className = 'story-progress-segment active';
        if (fill) {
          fill.style.transition = 'none';
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.transition = `width ${slideDuration}ms linear`;
            fill.style.width = '100%';
          }, 30);
        }
      } else {
        segments[i].className = 'story-progress-segment';
        if (fill) {
          fill.style.transition = 'none';
          fill.style.width = '0%';
        }
      }
    }

    // 4. Reset slide timer
    clearTimeout(slideTimer);
    slideStartTime = Date.now();
    slideRemainingTime = slideDuration;

    slideTimer = setTimeout(() => {
      nextSlide();
    }, slideDuration);
  };

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      renderSlide(currentSlideIndex + 1);
    } else {
      // Loop or smoothly glide to love letter
      const letterSection = document.getElementById('letter-section');
      if (letterSection) {
        letterSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      renderSlide(currentSlideIndex - 1);
    } else {
      renderSlide(0);
    }
  };

  // Pause on Hold (User wants to admire photo)
  const pauseSlide = () => {
    if (isStoryPaused) return;
    isStoryPaused = true;
    if (storyContainer) storyContainer.classList.add('paused');
    clearTimeout(slideTimer);
    const elapsed = Date.now() - slideStartTime;
    slideRemainingTime = Math.max(0, slideRemainingTime - elapsed);

    // Freeze progress fill bar
    if (progressContainer && progressContainer.children[currentSlideIndex]) {
      const fill = progressContainer.children[currentSlideIndex].querySelector('.story-progress-fill');
      if (fill) {
        const computedWidth = window.getComputedStyle(fill).width;
        fill.style.transition = 'none';
        fill.style.width = computedWidth;
      }
    }
  };

  const resumeSlide = () => {
    if (!isStoryPaused) return;
    isStoryPaused = false;
    if (storyContainer) storyContainer.classList.remove('paused');
    slideStartTime = Date.now();

    if (progressContainer && progressContainer.children[currentSlideIndex]) {
      const fill = progressContainer.children[currentSlideIndex].querySelector('.story-progress-fill');
      if (fill) {
        fill.style.transition = `width ${slideRemainingTime}ms linear`;
        fill.style.width = '100%';
      }
    }

    slideTimer = setTimeout(() => {
      nextSlide();
    }, slideRemainingTime);
  };

  // Setup Tap Navigation Zones
  if (touchLeft) {
    touchLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (touchRight) {
    touchRight.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  // Setup Touch / Swipe Gestures on Mobile for Free-Flowing Story Navigation
  let holdTimeout = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  if (storyContainer) {
    storyContainer.addEventListener('mousedown', () => {
      holdTimeout = setTimeout(pauseSlide, 180);
    });
    storyContainer.addEventListener('mouseup', () => {
      clearTimeout(holdTimeout);
      resumeSlide();
    });

    storyContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        holdTimeout = setTimeout(pauseSlide, 200);
      }
    }, { passive: true });

    storyContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const diffX = e.touches[0].clientX - touchStartX;
        const diffY = e.touches[0].clientY - touchStartY;
        // If swiping horizontally, cancel hold-pause
        if (Math.abs(diffX) > 20 && Math.abs(diffX) > Math.abs(diffY)) {
          clearTimeout(holdTimeout);
        }
      }
    }, { passive: true });

    storyContainer.addEventListener('touchend', (e) => {
      clearTimeout(holdTimeout);
      if (isStoryPaused) {
        resumeSlide();
      }
      if (e.changedTouches.length === 1) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        const elapsed = Date.now() - touchStartTime;

        // Fluid swipe gesture: horizontal move > 45px within 400ms
        if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4 && elapsed < 400) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }
    });
  }

  const initStoryReel = () => {
    buildProgressBar();
    renderSlide(0);
  };

  // -----------------------------------------------------------------
  // 7. INTERACTIVE WAX SEAL ON LOVE LETTER
  // -----------------------------------------------------------------
  const waxSeal = document.getElementById('wax-seal-wrapper');
  if (waxSeal) {
    waxSeal.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate([30, 60]);
      launchConfetti(40);
      waxSeal.style.transform = 'translateX(-50%) scale(1.15) rotate(15deg)';
      setTimeout(() => {
        waxSeal.style.transform = 'translateX(-50%) scale(1)';
      }, 300);
    });
  }

  // -----------------------------------------------------------------
  // 8. INTERACTIVE CAKE & CANDLE BLOWOUT
  // -----------------------------------------------------------------
  const candleFlame = document.getElementById('candle-flame');
  const smokePuff = document.getElementById('smoke-puff');
  const btnBlowWish = document.getElementById('btn-blow-wish');
  const wishMessage = document.getElementById('wish-message');
  let isFlameLit = true;

  const toggleFlame = () => {
    if (isFlameLit) {
      isFlameLit = false;
      candleFlame.classList.add('extinguished');
      smokePuff.classList.add('active');
      wishMessage.classList.add('visible');

      if (btnBlowWish) {
        btnBlowWish.textContent = config.cake?.relightButtonText || "Relight Candle 🕯️";
      }

      launchConfetti(100);
      if (navigator.vibrate) navigator.vibrate([40, 80, 50]);
    } else {
      isFlameLit = true;
      candleFlame.classList.remove('extinguished');
      smokePuff.classList.remove('active');
      wishMessage.classList.remove('visible');

      if (btnBlowWish) {
        btnBlowWish.textContent = config.cake?.blowButtonText || "Blow Out Candle ✨";
      }
    }
  };

  if (btnBlowWish) {
    btnBlowWish.addEventListener('click', toggleFlame);
  }

  const cakeStage = document.getElementById('cake-stage');
  if (cakeStage) {
    cakeStage.addEventListener('click', toggleFlame);
  }

  // -----------------------------------------------------------------
  // 9. INTERACTIVE TAP-FOR-HEARTS SPAWNER
  // -----------------------------------------------------------------
  const heartSymbols = ['♥', '💖', '✨', '💕', '💫', '🌸'];
  window.addEventListener('click', (e) => {
    if (e.target.closest('button, .wax-seal-wrapper, .audio-controller, .story-touch-left, .story-touch-right, .cake-stage')) {
      return;
    }

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    heart.style.fontSize = `${Math.random() * 16 + 20}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1800);
  });

  // -----------------------------------------------------------------
  // 10. HIGH-PERFORMANCE 60FPS PARTICLES ENGINES (Stars, Petals, Confetti)
  // -----------------------------------------------------------------
  // Canvas A: Twinkling Stars
  const starsCanvas = document.getElementById('stars-canvas');
  if (starsCanvas) {
    const sCtx = starsCanvas.getContext('2d');
    let stars = [];

    const resizeStars = () => {
      starsCanvas.width = window.innerWidth;
      starsCanvas.height = window.innerHeight;
      stars = [];
      const numStars = Math.min(60, Math.floor(window.innerWidth / 14));
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * starsCanvas.width,
          y: Math.random() * starsCanvas.height,
          radius: Math.random() * 1.4 + 0.6,
          alpha: Math.random(),
          speed: Math.random() * 0.018 + 0.006
        });
      }
    };

    window.addEventListener('resize', resizeStars);
    resizeStars();

    const animateStars = () => {
      sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      sCtx.fillStyle = '#ffffff';
      stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
        sCtx.globalAlpha = Math.abs(s.alpha);
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        sCtx.fill();
      });
      requestAnimationFrame(animateStars);
    };
    animateStars();
  }

  // Canvas B: Rising Soft Hearts & Rose Petals (Pre-rendered for silky mobile performance)
  const petalsCanvas = document.getElementById('petals-canvas');
  if (petalsCanvas) {
    const pCtx = petalsCanvas.getContext('2d');
    let petals = [];

    // Pre-render petal shape to offscreen canvas to avoid 56 cubic bezier calculations per frame
    const petalSprite = document.createElement('canvas');
    petalSprite.width = 40;
    petalSprite.height = 40;
    const pSpriteCtx = petalSprite.getContext('2d');
    pSpriteCtx.fillStyle = '#ff758f';
    pSpriteCtx.translate(20, 20);
    pSpriteCtx.beginPath();
    const s0 = 8;
    pSpriteCtx.moveTo(0, s0);
    pSpriteCtx.bezierCurveTo(-s0 * 2, -s0, -s0, -s0 * 2.5, 0, -s0 * 0.8);
    pSpriteCtx.bezierCurveTo(s0, -s0 * 2.5, s0 * 2, -s0, 0, s0);
    pSpriteCtx.fill();

    const resizePetals = () => {
      petalsCanvas.width = window.innerWidth;
      petalsCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizePetals);
    resizePetals();

    class AmbientPetal {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * petalsCanvas.width;
        this.y = initial ? Math.random() * petalsCanvas.height : petalsCanvas.height + 20;
        this.size = Math.random() * 8 + 12;
        this.speedY = -(Math.random() * 0.8 + 0.4);
        this.speedX = Math.random() * 0.6 - 0.3;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.4;
        this.angle += this.spin;
        if (this.y < -30) this.reset();
      }
      draw() {
        pCtx.save();
        pCtx.translate(this.x, this.y);
        pCtx.rotate(this.angle);
        pCtx.globalAlpha = this.opacity;
        const half = this.size / 2;
        pCtx.drawImage(petalSprite, -half, -half, this.size, this.size);
        pCtx.restore();
      }
    }

    const petalCount = window.innerWidth < 600 ? 16 : 24;
    for (let i = 0; i < petalCount; i++) {
      petals.push(new AmbientPetal());
    }

    const animatePetals = () => {
      pCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animatePetals);
    };
    animatePetals();
  }

  // Canvas C: Confetti Burst Engine (Reverse loop, smooth air drag & gravity)
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiPieces = [];
  let confettiActive = false;

  const resizeConfetti = () => {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function launchConfetti(count = 90) {
    if (!confettiCanvas) return;
    const colors = ['#f2cb77', '#ff758f', '#ffe6a7', '#ff4d6d', '#ffffff', '#ffd166'];
    const centerX = confettiCanvas.width / 2;
    const centerY = confettiCanvas.height / 2;

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.75) * 20,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12
      });
    }

    if (!confettiActive) {
      confettiActive = true;
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!confettiCanvas) return;
    const cCtx = confettiCanvas.getContext('2d');
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.42; // gravity
      p.vx *= 0.98; // air drag
      p.rotation += p.rotSpeed;

      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rotation * Math.PI) / 180);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      cCtx.restore();

      if (p.y > confettiCanvas.height + 30) {
        confettiPieces.splice(i, 1);
      }
    }

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiActive = false;
    }
  }

  // Make launchConfetti available globally if needed
  window.launchConfetti = launchConfetti;
});
