/**
 * ===================================================================
 *  CINEMATIC BIRTHDAY SURPRISE - APPLICATION ENGINE
 *  Handles Audio Autoplay, Countdown, Story Reel, Cake, and Particles
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

    // Letter
    const salutationEl = document.getElementById('letter-salutation');
    if (salutationEl) salutationEl.textContent = config.letter?.salutation || "My Dearest Love,";

    const letterBodyEl = document.getElementById('letter-paragraphs');
    if (letterBodyEl && config.letter?.paragraphs) {
      letterBodyEl.innerHTML = config.letter.paragraphs
        .map(p => `<p>${p}</p>`)
        .join('');
    }

    const letterClosingEl = document.getElementById('letter-closing');
    if (letterClosingEl) letterClosingEl.textContent = config.letter?.closing || "Forever Yours,";

    const letterSigEl = document.getElementById('letter-signature');
    if (letterSigEl) letterSigEl.textContent = config.letter?.signature || "Your Love ❤️";

    // Wax Seal Initial
    const sealBadgeEl = document.getElementById('wax-seal-badge');
    if (sealBadgeEl) sealBadgeEl.textContent = config.letter?.waxSealInitial || "♥";

    // Cake Wish
    const wishMsgEl = document.getElementById('wish-message');
    if (wishMsgEl) wishMsgEl.textContent = config.cake?.revealedMessage || "✨ Happy Birthday, My Love! ✨";

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
  // 2. AUDIO PLAYBACK & AUTOPLAY UNLOCK CONTROLLER
  // -----------------------------------------------------------------
  const audio = new Audio(config.audio?.src || './audio.mp3');
  audio.loop = true;
  audio.preload = 'auto';

  const audioController = document.getElementById('audio-controller');
  let isAudioPlaying = false;
  let targetVolume = config.audio?.volume !== undefined ? config.audio.volume : 0.85;

  const fadeInAudio = (durationSec = 2.0) => {
    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isAudioPlaying = true;
        audioController.classList.add('playing');
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
      }).catch(err => {
        console.warn('Audio playback waiting for direct user gesture:', err);
      });
    }
  };

  const toggleAudio = (e) => {
    if (e) e.stopPropagation();
    if (isAudioPlaying) {
      audio.pause();
      isAudioPlaying = false;
      audioController.classList.remove('playing');
    } else {
      audio.play().then(() => {
        audio.volume = targetVolume;
        isAudioPlaying = true;
        audioController.classList.add('playing');
      }).catch(err => console.log('Audio resume error:', err));
    }
  };

  if (audioController) {
    audioController.addEventListener('click', toggleAudio);
  }

  // -----------------------------------------------------------------
  // 3. SCENE TRANSITION: PRELUDE -> COUNTDOWN
  // -----------------------------------------------------------------
  const scenePrelude = document.getElementById('scene-prelude');
  const sceneCountdown = document.getElementById('scene-countdown');
  const btnEnter = document.getElementById('btn-cinematic-enter');

  if (btnEnter) {
    btnEnter.addEventListener('click', () => {
      // Trigger Haptic Feedback
      if (navigator.vibrate) navigator.vibrate([25, 40]);

      // Unlock and play background music
      fadeInAudio(config.audio?.fadeInSeconds || 2.0);

      // Fade out Prelude
      scenePrelude.classList.add('hidden');

      // Start Countdown
      setTimeout(() => {
        startCountdown();
      }, 400);
    });
  }

  // -----------------------------------------------------------------
  // 4. DRAMATIC CINEMATIC COUNTDOWN LEADER
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
    const duration = config.countdown?.durationPerCount || 1600;

    const runStep = () => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        countNumberEl.textContent = step.number;
        countQuoteEl.textContent = step.phrase;
        countSubEl.textContent = step.sub;

        // Reset and trigger ring stroke animation
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
        // Climax Reveal
        countdownBox.style.display = 'none';
        countdownClimax.style.display = 'flex';

        // Confetti burst
        launchConfetti(80);
        if (navigator.vibrate) navigator.vibrate([40, 60, 40]);

        // Auto advance to story after reveal
        setTimeout(() => {
          sceneCountdown.classList.add('hidden');
          initStoryReel();
        }, 2800);
      }
    };

    runStep();
  };

  // -----------------------------------------------------------------
  // 5. CINEMATIC STORY REEL (Mobile-First Instagram/TikTok Style)
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
  const slideBgContainer = document.getElementById('slide-background');
  const captionChapter = document.getElementById('caption-chapter');
  const captionTag = document.getElementById('caption-tag');
  const captionTitle = document.getElementById('caption-title');
  const captionBody = document.getElementById('caption-body');
  const touchLeft = document.getElementById('story-touch-left');
  const touchRight = document.getElementById('story-touch-right');

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

  const renderSlide = (index, immediate = false) => {
    if (index < 0 || index >= slides.length) return;
    currentSlideIndex = index;
    const slide = slides[index];

    // Update Text Content
    if (captionChapter) captionChapter.textContent = slide.chapter || `CHAPTER ${index + 1}`;
    if (captionTag) captionTag.textContent = slide.tag || '';
    if (captionTitle) captionTitle.textContent = slide.title || '';
    if (captionBody) captionBody.textContent = slide.caption || '';

    // Update Image with smooth scale reset
    if (slideBgContainer) {
      slideBgContainer.classList.remove('active');
      slideBgContainer.innerHTML = `<img src="${slide.image}" class="slide-img" alt="${slide.title}">`;
      // Trigger Ken Burns
      setTimeout(() => {
        slideBgContainer.classList.add('active');
      }, 50);
    }

    // Update Progress Bars
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

    // Reset slide timer
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
    storyContainer.classList.add('paused');
    clearTimeout(slideTimer);
    const elapsed = Date.now() - slideStartTime;
    slideRemainingTime = Math.max(0, slideRemainingTime - elapsed);

    // Freeze progress fill bar
    const segments = progressContainer.children;
    if (segments[currentSlideIndex]) {
      const fill = segments[currentSlideIndex].querySelector('.story-progress-fill');
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
    storyContainer.classList.remove('paused');
    slideStartTime = Date.now();

    const segments = progressContainer.children;
    if (segments[currentSlideIndex]) {
      const fill = segments[currentSlideIndex].querySelector('.story-progress-fill');
      if (fill) {
        fill.style.transition = `width ${slideRemainingTime}ms linear`;
        fill.style.width = '100%';
      }
    }

    slideTimer = setTimeout(() => {
      nextSlide();
    }, slideRemainingTime);
  };

  // Setup Touch / Click Listeners
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

  // Hold gestures on story container
  let holdTimeout = null;
  if (storyContainer) {
    const onTouchStart = () => {
      holdTimeout = setTimeout(pauseSlide, 150);
    };
    const onTouchEnd = () => {
      clearTimeout(holdTimeout);
      resumeSlide();
    };

    storyContainer.addEventListener('mousedown', onTouchStart);
    storyContainer.addEventListener('mouseup', onTouchEnd);
    storyContainer.addEventListener('touchstart', onTouchStart, { passive: true });
    storyContainer.addEventListener('touchend', onTouchEnd);
  }

  const initStoryReel = () => {
    buildProgressBar();
    renderSlide(0);
  };

  // -----------------------------------------------------------------
  // 6. INTERACTIVE WAX SEAL ON LOVE LETTER
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
  // 7. INTERACTIVE CAKE & CANDLE BLOWOUT
  // -----------------------------------------------------------------
  const candleFlame = document.getElementById('candle-flame');
  const smokePuff = document.getElementById('smoke-puff');
  const btnBlowWish = document.getElementById('btn-blow-wish');
  const wishMessage = document.getElementById('wish-message');
  let isFlameLit = true;

  const toggleFlame = () => {
    if (isFlameLit) {
      // Extinguish Flame
      isFlameLit = false;
      candleFlame.classList.add('extinguished');
      smokePuff.classList.add('active');
      wishMessage.classList.add('visible');

      if (btnBlowWish) {
        btnBlowWish.textContent = config.cake?.relightButtonText || "Relight Candle 🕯️";
      }

      // Celebratory Confetti Burst
      launchConfetti(120);
      if (navigator.vibrate) navigator.vibrate([40, 80, 50]);
    } else {
      // Relight Flame
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
  // 8. INTERACTIVE TAP-FOR-HEARTS SPAWNER
  // -----------------------------------------------------------------
  const heartSymbols = ['♥', '💖', '✨', '💕', '💫', '🌸'];
  window.addEventListener('click', (e) => {
    // Only spawn if click wasn't on button or interactive elements
    if (e.target.closest('button, .wax-seal-wrapper, .audio-controller, .story-touch-left, .story-touch-right')) {
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
  // 9. ATMOSPHERIC PARTICLES ENGINES (Stars, Petals, Confetti)
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
      const numStars = Math.floor(window.innerWidth / 12);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * starsCanvas.width,
          y: Math.random() * starsCanvas.height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005
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

  // Canvas B: Rising Soft Hearts & Rose Petals
  const petalsCanvas = document.getElementById('petals-canvas');
  if (petalsCanvas) {
    const pCtx = petalsCanvas.getContext('2d');
    let petals = [];

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
        this.size = Math.random() * 7 + 6;
        this.speedY = -(Math.random() * 0.8 + 0.4);
        this.speedX = Math.random() * 0.6 - 0.3;
        this.opacity = Math.random() * 0.45 + 0.2;
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
        pCtx.fillStyle = '#ff758f';
        const s = this.size / 2;
        pCtx.beginPath();
        pCtx.moveTo(0, s);
        pCtx.bezierCurveTo(-s * 2, -s, -s, -s * 2.5, 0, -s * 0.8);
        pCtx.bezierCurveTo(s, -s * 2.5, s * 2, -s, 0, s);
        pCtx.fill();
        pCtx.restore();
      }
    }

    for (let i = 0; i < 28; i++) {
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

  // Canvas C: Confetti Burst Engine
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

  function launchConfetti(count = 100) {
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

    confettiPieces.forEach((p, idx) => {
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
        confettiPieces.splice(idx, 1);
      }
    });

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiActive = false;
    }
  }

  // Make launchConfetti available globally if needed
  window.launchConfetti = launchConfetti;
});
