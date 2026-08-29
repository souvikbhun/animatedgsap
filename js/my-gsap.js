// Smooth Scroll (Lenis + GSAP Integration)
if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });
  window._uikLenis = lenis;
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

(function () {
  function init() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    var root = document.querySelector('.uik-kit') || document.body;
    if (!root) return;

    /* ==========================================================================
       AWWWARDS FULLSCREEN SITE OPENING INTRO PRELOADER CONTROLLER
       ========================================================================== */
    var introOverlay = root.querySelector('[data-uik-intro-overlay]');
    var introCols = root.querySelectorAll('[data-uik-intro-col]');
    var introStage = root.querySelector('[data-uik-intro-stage]');
    var introChars = root.querySelectorAll('.uik-intro-char');
    var introCounter = root.querySelector('[data-uik-intro-counter]');
    var introBar = root.querySelector('[data-uik-intro-bar]');
    var introStatus = root.querySelector('[data-uik-intro-status]');
    var introReplayBtns = document.querySelectorAll('[data-uik-intro-replay]');
    var heroSection = root.querySelector('.uik-hero');
    var navbar = root.querySelector('[data-uik-navbar]');

    function playSiteOpeningIntro() {
      if (!introOverlay) return;

      introOverlay.classList.remove('uik-is-hidden');
      gsap.set(introOverlay, { pointerEvents: 'all', autoAlpha: 1 });
      gsap.set(introCols, { scaleY: 1, transformOrigin: 'top center' });
      gsap.set(introStage, { opacity: 1, scale: 1 });
      gsap.set(introChars, { y: 40, opacity: 0 });
      gsap.set(introCounter, { opacity: 1 });
      if (introCounter) introCounter.textContent = '00%';
      if (introBar) introBar.style.width = '0%';
      if (introStatus) introStatus.textContent = 'CALIBRATING KINETIC TELEMETRY...';

      if (navbar) gsap.set(navbar, { yPercent: -100 });
      if (heroSection) {
        gsap.set(heroSection, { scale: 1.06, filter: 'blur(8px)' });
      }

      var openTl = gsap.timeline();

      // Step 1: Characters reveal with back ease
      openTl.to(introChars, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: 'back.out(2)'
      }, 0.2);

      // Step 2: Digital counter & progress line
      var cObj = { val: 0 };
      openTl.to(cObj, {
        val: 100,
        duration: 2.0,
        ease: 'power2.inOut',
        onUpdate: function () {
          var v = Math.floor(cObj.val);
          if (introCounter) introCounter.textContent = v.toString().padStart(2, '0') + '%';
          if (introBar) introBar.style.width = v + '%';
          if (introStatus) {
            if (v < 35) introStatus.textContent = 'CALIBRATING KINETIC TELEMETRY...';
            else if (v < 70) introStatus.textContent = 'WEAVING MATHEMATICAL BEZIERS...';
            else if (v < 99) introStatus.textContent = 'ENGAGING GSAP 3 SHOCKWAVE...';
            else introStatus.textContent = 'SYSTEM ONLINE • EXPERIENCE UNLOCKED';
          }
        }
      }, 0.3);

      // Step 3: Fade stage
      openTl.to(introStage, {
        opacity: 0,
        scale: 1.12,
        duration: 0.5,
        ease: 'power3.in'
      }, '+=0.2');

      // Step 4: Vertical Curtain Columns Stagger Exit
      openTl.to(introCols, {
        scaleY: 0,
        duration: 1.1,
        ease: 'expo.inOut',
        stagger: {
          each: 0.08,
          from: 'center'
        },
        onComplete: function () {
          introOverlay.classList.add('uik-is-hidden');
          gsap.set(introOverlay, { pointerEvents: 'none', autoAlpha: 0 });
        }
      }, '-=0.2');

      // Step 5: Page Content Zoom & Navbar Drop
      if (heroSection) {
        openTl.to(heroSection, {
          scale: 1.0,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power4.out'
        }, '-=0.9');
      }

      if (navbar) {
        openTl.to(navbar, {
          yPercent: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.8');
      }
    }

    // Auto-run on page load
    playSiteOpeningIntro();

    // Replay button listener
    introReplayBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window._uikLenis) {
          window._uikLenis.scrollTo(0, { duration: 0.8 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setTimeout(playSiteOpeningIntro, 400);
      });
    });

    /* ---------------- MARQUEE: GAPLESS INFINITE LOOP ---------------- */
    root.querySelectorAll('[data-marquee]').forEach(function (track) {
      if (track._uikMarqueeInit) return;
      track._uikMarqueeInit = true;

      var isVertical = !!track.closest('.uik-marquee--vertical');
      var original = track.innerHTML;
      var parent = track.parentElement;
      if (!parent) return;

      if (isVertical) {
        var parentHeight = parent.offsetHeight || 240;
        var safetyV = 0;
        while (track.scrollHeight < parentHeight * 2.5 && safetyV < 20) {
          track.insertAdjacentHTML('beforeend', original);
          safetyV++;
        }
        track.insertAdjacentHTML('beforeend', original);

        var dirV = parseFloat(track.dataset.dir) || 1;
        var speedV = parseFloat(track.dataset.speed) || 24;
        var distanceV = track.scrollHeight / (safetyV + 2);

        gsap.fromTo(track,
          { y: dirV > 0 ? 0 : -distanceV },
          { y: dirV > 0 ? -distanceV : 0, duration: speedV, ease: 'none', repeat: -1 }
        );
        return;
      }

      var parentWidth = parent.offsetWidth || window.innerWidth;
      var safety = 0;
      while (track.scrollWidth < parentWidth * 2.5 && safety < 20) {
        track.insertAdjacentHTML('beforeend', original);
        safety++;
      }
      track.insertAdjacentHTML('beforeend', original);

      var dir = parseFloat(track.dataset.dir) || 1;
      var speed = parseFloat(track.dataset.speed) || 40;
      var distance = track.scrollWidth / (safety + 2);

      gsap.fromTo(track,
        { x: dir > 0 ? 0 : -distance },
        {
          x: dir > 0 ? -distance : 0,
          duration: speed,
          ease: 'none',
          repeat: -1
        }
      );
    });

    if (typeof ScrollTrigger === 'undefined') return;

    /* ---------------- HEADINGS ---------------- */

    // Helper: Split element text into words and individual characters with natural word wrapping
    function splitTextIntoWordsAndChars(el, charClass, wordClass) {
      charClass = charClass || 'uik-char';
      wordClass = wordClass || 'uik-word-wrap';
      var rawText = el.textContent.trim();
      el.textContent = '';
      var words = rawText.split(/\s+/);
      words.forEach(function (word, wIndex) {
        var wordSpan = document.createElement('span');
        wordSpan.className = wordClass;
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        wordSpan.style.position = 'relative';

        word.split('').forEach(function (ch) {
          var charSpan = document.createElement('span');
          charSpan.className = charClass;
          charSpan.style.display = 'inline-block';
          charSpan.style.willChange = 'transform, opacity';
          charSpan.textContent = ch;
          wordSpan.appendChild(charSpan);
        });

        el.appendChild(wordSpan);
        if (wIndex < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
    }

    // Helper: Split element text into separate words with natural spaces
    function splitTextIntoWords(el, wordClass) {
      wordClass = wordClass || 'uik-word';
      var rawText = el.textContent.trim();
      el.textContent = '';
      var words = rawText.split(/\s+/);
      words.forEach(function (word, wIndex) {
        var wordSpan = document.createElement('span');
        wordSpan.className = wordClass;
        wordSpan.style.display = 'inline-block';
        wordSpan.textContent = word;
        el.appendChild(wordSpan);
        if (wIndex < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
    }

    // 1. split-char rise
    root.querySelectorAll('.uik-heading--split, .main-heading--split, [data-anim="split"]').forEach(function (h) {
      if (h._uikSplitInit) return;
      h._uikSplitInit = true;
      splitTextIntoWordsAndChars(h, 'uik-char', 'uik-word-wrap');
      var chars = h.querySelectorAll('.uik-char, .mh-char');
      gsap.fromTo(chars,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.7)',
          stagger: 0.02,
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 2. clip-path wipe
    root.querySelectorAll('.uik-heading--clip').forEach(function (h) {
      gsap.fromTo(h,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 3. underline draw
    root.querySelectorAll('.uik-heading--underline').forEach(function (h) {
      var rule = h.querySelector('.uik-underline-rule');
      if (rule) {
        gsap.fromTo(rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: h,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    // 4. shine
    root.querySelectorAll('.uik-heading--shine').forEach(function (h) {
      ScrollTrigger.create({
        trigger: h, start: 'top 92%', end: 'bottom 8%',
        onEnter: function () { h.classList.add('uik-is-active'); },
        onLeave: function () { h.classList.remove('uik-is-active'); },
        onEnterBack: function () { h.classList.add('uik-is-active'); },
        onLeaveBack: function () { h.classList.remove('uik-is-active'); }
      });
    });

    // 5. word-by-word rise
    root.querySelectorAll('.uik-heading--words, .main-heading--words, [data-anim="words"]').forEach(function (h) {
      if (h._uikWordsInit) return;
      h._uikWordsInit = true;
      splitTextIntoWords(h, 'uik-word');
      var wordsEls = h.querySelectorAll('.uik-word, .mh-word');
      gsap.fromTo(wordsEls,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 6. line mask reveal
    root.querySelectorAll('.uik-heading--linemask').forEach(function (h) {
      var inner = h.querySelector('.uik-linemask-inner') || h;
      gsap.fromTo(inner,
        { y: '115%' },
        {
          y: '0%',
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 7. blur-in focus reveal
    root.querySelectorAll('.uik-heading--blur').forEach(function (h) {
      gsap.fromTo(h,
        { filter: 'blur(14px)', opacity: 0 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 8. 3D rotate-in
    root.querySelectorAll('.uik-heading--rotate3d').forEach(function (h) {
      gsap.fromTo(h,
        { rotateX: 70, opacity: 0 },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 9. elastic pop-in
    root.querySelectorAll('.uik-heading--pop').forEach(function (h) {
      gsap.fromTo(h,
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'elastic.out(1, 0.6)',
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 10. typewriter caret
    root.querySelectorAll('[data-anim="typewriter"]').forEach(function (h) {
      var span = h.querySelector('.uik-heading--typewriter') || h;
      var full = h.dataset.text || span.dataset.text || span.textContent.trim() || 'Types itself out on scroll';
      h.dataset.text = full;
      span.textContent = '';
      var iv = null;
      function reset() {
        if (iv) { clearInterval(iv); iv = null; }
        span.textContent = '';
      }
      function play() {
        if (iv) { clearInterval(iv); iv = null; }
        span.textContent = '';
        var idx = 0;
        iv = setInterval(function () {
          idx++;
          span.textContent = full.slice(0, idx);
          if (idx >= full.length) {
            clearInterval(iv);
            iv = null;
          }
        }, 38);
      }
      ScrollTrigger.create({
        trigger: h,
        start: 'top 85%',
        end: 'bottom top',
        onEnter: play,
        onEnterBack: play,
        onLeave: reset,
        onLeaveBack: reset
      });
    });

    // 11. highlight sweep
    root.querySelectorAll('.uik-heading--highlight').forEach(function (h) {
      var bg = h.querySelector('.uik-highlight-bg');
      if (bg) {
        gsap.fromTo(bg,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: h,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    // 12. letter scramble / decode
    root.querySelectorAll('.uik-heading--scramble').forEach(function (h) {
      var finalText = h.dataset.finalText || h.textContent.trim();
      h.dataset.finalText = finalText;
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var iv = null;
      function play() {
        if (iv) clearInterval(iv);
        var frame = 0;
        var totalFrames = 20;
        iv = setInterval(function () {
          h.textContent = finalText.split('').map(function (ch, i) {
            if (ch === ' ') return ' ';
            if (i < (frame / totalFrames) * finalText.length) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          frame++;
          if (frame > totalFrames) { h.textContent = finalText; clearInterval(iv); iv = null; }
        }, 35);
      }
      ScrollTrigger.create({ trigger: h, start: 'top 85%', end: 'bottom top', onEnter: play, onEnterBack: play });
    });

    // 13. wave bounce
    root.querySelectorAll('.uik-heading--wave, .main-heading--wave, [data-anim="wave"]').forEach(function (h) {
      if (h._uikWaveInit) return;
      h._uikWaveInit = true;
      splitTextIntoWordsAndChars(h, 'uik-char', 'uik-word-wrap');
      var chars = h.querySelectorAll('.uik-char, .mh-char');
      var tl = gsap.timeline({ repeat: -1, paused: true });
      tl.to(chars, { y: -14, duration: 0.4, ease: 'sine.inOut', stagger: { each: 0.05, yoyo: true, repeat: 1 } });
      ScrollTrigger.create({
        trigger: h, start: 'top 90%', end: 'bottom 10%',
        onEnter: function () { tl.play(); },
        onEnterBack: function () { tl.play(); },
        onLeave: function () { tl.pause(); gsap.to(chars, { y: 0, duration: 0.3 }); },
        onLeaveBack: function () { tl.pause(); gsap.to(chars, { y: 0, duration: 0.3 }); }
      });
    });

    // 14. duo lines
    root.querySelectorAll('.uik-heading--duo').forEach(function (h) {
      h.querySelectorAll('.uik-duo-line span').forEach(function (span, i) {
        var fromX = i % 2 === 0 ? -110 : 110;
        gsap.fromTo(span,
          { xPercent: fromX },
          {
            xPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: h,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      });
    });

    // 15. glitch flicker
    root.querySelectorAll('.uik-heading--glitch').forEach(function (h) {
      var copies = h.querySelectorAll('.uik-glitch-copy');
      if (!copies.length) return;
      var tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, paused: true });
      tl.set(copies, { opacity: 0, x: 0 })
        .to(copies[0], { x: -4, opacity: 0.7, duration: 0.05 })
        .to(copies[1] || copies[0], { x: 4, opacity: 0.7, duration: 0.05 }, '<')
        .to(copies, { x: 0, opacity: 0, duration: 0.12 });
      ScrollTrigger.create({
        trigger: h, start: 'top 90%', end: 'bottom 10%',
        onEnter: function () { tl.play(0); },
        onEnterBack: function () { tl.play(0); },
        onLeave: function () { tl.pause(0); },
        onLeaveBack: function () { tl.pause(0); }
      });
    });

    // 16. heading with photo chip
    root.querySelectorAll('.uik-heading--withphoto').forEach(function (h) {
      var img = h.querySelector('img');
      if (img) {
        gsap.fromTo(img,
          { scale: 0.6, rotate: -8, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: h,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    // 17. marker underline drag
    root.querySelectorAll('.uik-heading--marker').forEach(function (h) {
      var rule = h.querySelector('.uik-marker-rule');
      if (rule) {
        gsap.fromTo(rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: h,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    // 18. skew-in from the side
    root.querySelectorAll('.uik-heading--skew').forEach(function (h) {
      gsap.fromTo(h,
        { skewX: -12, x: -40, opacity: 0 },
        {
          skewX: 0,
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 19. staircase word stagger
    root.querySelectorAll('.uik-heading--staircase, .main-heading--staircase, [data-anim="staircase"]').forEach(function (h) {
      if (h._uikStairInit) return;
      h._uikStairInit = true;
      splitTextIntoWords(h, 'uik-stair-word');
      var wordsEls = h.querySelectorAll('.uik-stair-word, .mh-stair-word');
      gsap.fromTo(wordsEls,
        { y: -24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 20. outline-to-fill text
    root.querySelectorAll('.uik-heading--outlinetext').forEach(function (h) {
      var fill = h.querySelector('.uik-outline-fill');
      if (fill) {
        gsap.fromTo(fill,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: h,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    // 21. morph
    root.querySelectorAll('.uik-heading--morph').forEach(function (h) {
      var tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      tl.to(h, { scale: 1.04, color: '#C8862B', duration: 1.5, ease: 'sine.inOut' });
      ScrollTrigger.create({
        trigger: h, start: 'top 92%', end: 'bottom 8%',
        onEnter: function () { tl.play(); },
        onEnterBack: function () { tl.play(); },
        onLeave: function () { tl.pause(); gsap.to(h, { scale: 1, color: '#241C15', duration: 0.3 }); },
        onLeaveBack: function () { tl.pause(); gsap.to(h, { scale: 1, color: '#241C15', duration: 0.3 }); }
      });
    });

    // 22. stamp
    root.querySelectorAll('.uik-heading--stamp').forEach(function (h) {
      gsap.fromTo(h,
        { scale: 2.2, rotate: -6, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 23. cascade
    root.querySelectorAll('.uik-heading--cascade, .main-heading--cascade, [data-anim="cascade"]').forEach(function (h) {
      if (h._uikCascadeInit) return;
      h._uikCascadeInit = true;
      splitTextIntoWordsAndChars(h, 'uik-char', 'uik-word-wrap');
      var chars = h.querySelectorAll('.uik-char, .mh-char');
      gsap.fromTo(chars,
        { yPercent: -160, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'bounce.out',
          stagger: 0.025,
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 24. neon
    root.querySelectorAll('.uik-heading--neon').forEach(function (h) {
      var tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      tl.to(h, { opacity: 1, textShadow: '0 0 18px rgba(47,143,114,0.65)', duration: 1.2, ease: 'sine.inOut' });
      ScrollTrigger.create({
        trigger: h, start: 'top 92%', end: 'bottom 8%',
        onEnter: function () { tl.play(); },
        onEnterBack: function () { tl.play(); },
        onLeave: function () { tl.pause(); gsap.to(h, { opacity: 0.4, textShadow: 'none', duration: 0.3 }); },
        onLeaveBack: function () { tl.pause(); gsap.to(h, { opacity: 0.4, textShadow: 'none', duration: 0.3 }); }
      });
    });

    // 25. slice reveal
    root.querySelectorAll('.uik-heading--slice').forEach(function (h) {
      var slices = h.querySelectorAll('.uik-slice-row span');
      gsap.fromTo(slices,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.7,
          ease: 'power4.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 26. text split with word rotation
    root.querySelectorAll('.uik-heading--word-rotate, .main-heading--word-rotate, [data-anim="word-rotate"]').forEach(function (h) {
      if (h._uikRotateInit) return;
      h._uikRotateInit = true;

      // Split prefix and suffix into 3D rotating chars
      var prefix = h.querySelector('.uik-rotate-prefix, .mh-rotate-prefix');
      var suffix = h.querySelector('.uik-rotate-suffix, .mh-rotate-suffix');

      [prefix, suffix].forEach(function (part) {
        if (!part) return;
        splitTextIntoWordsAndChars(part, 'uik-char', 'uik-word-wrap');
      });

      var chars = h.querySelectorAll('.uik-char');
      gsap.fromTo(chars,
        { y: 35, rotateX: -80, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'back.out(1.8)',
          stagger: 0.025,
          scrollTrigger: {
            trigger: h,
            start: 'top 88%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );

      // 3D Rotating Words Cylinder
      var wordsWrap = h.querySelector('.uik-rotate-words-wrap');
      if (!wordsWrap) return;
      var words = wordsWrap.querySelectorAll('.uik-rotate-word');
      if (words.length <= 1) return;

      var currentIndex = 0;
      gsap.set(words, { opacity: 0, rotateX: -90, yPercent: 100 });
      gsap.set(words[0], { opacity: 1, rotateX: 0, yPercent: 0 });

      function rotateToNext() {
        var prevIndex = currentIndex;
        currentIndex = (currentIndex + 1) % words.length;
        var currentWord = words[prevIndex];
        var nextWord = words[currentIndex];

        var rotTl = gsap.timeline();
        rotTl.to(currentWord, {
          duration: 0.6,
          rotateX: 90,
          yPercent: -100,
          opacity: 0,
          filter: 'blur(3px)',
          ease: 'power3.inOut'
        }, 0);

        rotTl.fromTo(nextWord,
          { rotateX: -90, yPercent: 100, opacity: 0, filter: 'blur(3px)' },
          {
            duration: 0.6,
            rotateX: 0,
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power3.inOut'
          },
          0.15
        );
      }

      var rotateInterval = null;
      ScrollTrigger.create({
        trigger: h,
        start: 'top 95%',
        end: 'bottom 5%',
        onEnter: function () {
          if (!rotateInterval) rotateInterval = setInterval(rotateToNext, 2200);
        },
        onLeave: function () {
          if (rotateInterval) { clearInterval(rotateInterval); rotateInterval = null; }
        },
        onEnterBack: function () {
          if (!rotateInterval) rotateInterval = setInterval(rotateToNext, 2200);
        },
        onLeaveBack: function () {
          if (rotateInterval) { clearInterval(rotateInterval); rotateInterval = null; }
        }
      });

      wordsWrap.addEventListener('mouseenter', function () {
        rotateToNext();
      });
    });

    /* ---------------- CARDS ---------------- */

    // 1. tilt
    root.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', (px - 0.5) * 18 + 'deg');
        card.style.setProperty('--rx', (0.5 - py) * 18 + 'deg');
        card.style.setProperty('--gx', px * 100 + '%');
        card.style.setProperty('--gy', py * 100 + '%');
      }, { passive: true });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    // 2. spotlight
    root.querySelectorAll('[data-spotlight]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--x', (e.clientX - r.left) + 'px');
        card.style.setProperty('--y', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });

    // 3. magnetic badge
    root.querySelectorAll('[data-magnetic]').forEach(function (card) {
      var badge = card.querySelector('[data-magnetic-badge]');
      if (!badge) return;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        badge.style.transform = 'translate(' + (px * 22) + 'px,' + (py * 22) + 'px)';
      }, { passive: true });
      card.addEventListener('mouseleave', function () { badge.style.transform = 'translate(0,0)'; });
    });

    // 4. checklist card
    root.querySelectorAll('[data-checklist]').forEach(function (card) {
      var dots = card.querySelectorAll('.uik-check-dot');
      function play() {
        dots.forEach(function (dot, i) {
          gsap.delayedCall(i * 0.22, function () { dot.classList.add('uik-is-checked'); });
        });
      }
      function reset() {
        gsap.killTweensOf(dots);
        dots.forEach(function (dot) { dot.classList.remove('uik-is-checked'); });
      }
      ScrollTrigger.create({ trigger: card, start: 'top 85%', end: 'bottom top', onEnter: play, onEnterBack: play, onLeave: reset, onLeaveBack: reset });
    });

    /* ---------------- SCROLL SECTIONS ---------------- */

    // 1. staggered grid reveal
    var staggerSec = root.querySelector('.uik-scrollsec--stagger');
    if (staggerSec) {
      var staggerItems = staggerSec.querySelectorAll('.uik-stagger-item');
      if (staggerItems.length) {
        gsap.fromTo(staggerItems,
          { y: 46, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: staggerSec,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    }

    // 2. parallax layers
    root.querySelectorAll('[data-parallax]').forEach(function (pSec) {
      pSec.querySelectorAll('[data-depth]').forEach(function (layer) {
        var depth = parseFloat(layer.dataset.depth) || 0.3;
        gsap.to(layer, {
          yPercent: depth * 40,
          ease: 'none',
          scrollTrigger: {
            trigger: pSec,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    });

    // 3. pinned line-by-line reveal
    var pinSec = root.querySelector('.uik-pin');
    if (pinSec) {
      var pinLines = pinSec.querySelectorAll('[data-pin-line]');
      var pinRing = pinSec.querySelector('[data-pin-ring]');
      ScrollTrigger.create({
        trigger: pinSec,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.5,
        onUpdate: function (self) {
          var count = pinLines.length;
          var activeIndex = Math.min(count - 1, Math.floor(self.progress * count));
          pinLines.forEach(function (line, i) {
            line.classList.toggle('uik-is-lit', i <= activeIndex && self.progress > 0.04);
          });
          if (pinRing) {
            gsap.set(pinRing, { rotate: self.progress * 360 });
          }
        }
      });
    }

    // 4. horizontal scroll gallery
    root.querySelectorAll('[data-hscroll]').forEach(function (hscroll) {
      var track = hscroll.querySelector('[data-hscroll-track]');
      if (!track) return;
      gsap.to(track, {
        x: function () { return -(track.scrollWidth - hscroll.clientWidth); },
        ease: 'none',
        scrollTrigger: {
          trigger: hscroll,
          start: 'top top',
          end: function () { return '+=' + Math.max(track.scrollWidth - hscroll.clientWidth, 400); },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    });

    // 5. count-up stats
    root.querySelectorAll('[data-count-to]').forEach(function (el) {
      var target = parseFloat(el.dataset.countTo);
      if (isNaN(target)) target = 0;
      var obj = { val: 0 };
      function play() {
        gsap.to(obj, {
          val: target, duration: 1.4, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.val); }
        });
      }
      function reset() {
        gsap.to(obj, {
          val: 0, duration: 0.4, ease: 'power2.inOut',
          onUpdate: function () { el.textContent = Math.round(obj.val); }
        });
      }
      ScrollTrigger.create({ trigger: el, start: 'top 88%', end: 'bottom top', onEnter: play, onEnterBack: play, onLeave: reset, onLeaveBack: reset });
    });

    // 6. scroll progress rule
    var progressFill = root.querySelector('[data-progressbar-fill]');
    var progressBar = root.querySelector('[data-progressbar]');
    if (progressFill && progressBar) {
      gsap.to(progressFill, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: progressBar,
          start: 'top 90%',
          end: 'bottom 50%',
          scrub: 0.3
        }
      });
    }

    // 7. circle reveal mask
    var revealMask = root.querySelector('[data-revealmask]');
    if (revealMask) {
      gsap.fromTo(revealMask,
        { clipPath: 'circle(4% at 50% 50%)' },
        {
          clipPath: 'circle(75% at 50% 50%)',
          ease: 'none',
          scrollTrigger: { trigger: revealMask, start: 'top 85%', end: 'top 20%', scrub: 0.5 }
        }
      );
    }

    // 8. sticky swap panels
    var stickySwapSec = root.querySelector('[data-stickyswap]');
    if (stickySwapSec) {
      var swapRows = stickySwapSec.querySelectorAll('[data-swap-row]');
      var swapVisual = stickySwapSec.querySelector('[data-swap-visual]');
      swapRows.forEach(function (row, i) {
        function activate() {
          swapRows.forEach(function (r) { r.classList.remove('uik-is-lit'); });
          row.classList.add('uik-is-lit');
          if (swapVisual) {
            var titleEl = row.querySelector('.uik-stickyswap__row-title');
            if (titleEl) swapVisual.textContent = titleEl.textContent + ' Visual';
            gsap.fromTo(swapVisual, { scale: 0.95, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' });
          }
        }
        function deactivate() {
          row.classList.remove('uik-is-lit');
        }
        ScrollTrigger.create({
          trigger: row, start: 'top 60%', end: 'bottom 40%',
          onEnter: activate, onEnterBack: activate, onLeave: deactivate, onLeaveBack: deactivate
        });
      });
    }

    // 9. word-by-word scrub paragraph
    var scrubPara = root.querySelector('[data-scrub-para]');
    if (scrubPara) {
      var words = scrubPara.textContent.trim().split(/\s+/);
      scrubPara.innerHTML = words.map(function (w) { return '<span class="uik-scrub-word">' + w + '</span>'; }).join(' ');
      var scrubWords = scrubPara.querySelectorAll('.uik-scrub-word');
      ScrollTrigger.create({
        trigger: scrubPara, start: 'top 80%', end: 'bottom 40%', scrub: true,
        onUpdate: function (self) {
          var lit = Math.floor(self.progress * scrubWords.length);
          scrubWords.forEach(function (w, i) { w.classList.toggle('uik-is-lit', i <= lit); });
        }
      });
    }

    // 10. zoom-in on scroll
    var zoomSec = root.querySelector('[data-zoomsec]');
    if (zoomSec) {
      var zoomInner = zoomSec.querySelector('.uik-zoomsec__inner') || zoomSec;
      gsap.fromTo(zoomInner,
        { scale: 0.65, opacity: 0.5 },
        { scale: 1.15, opacity: 1, ease: 'none', scrollTrigger: { trigger: zoomSec, start: 'top 85%', end: 'bottom 25%', scrub: 0.5 } }
      );
    }

    // 11. vertical timeline
    root.querySelectorAll('[data-timeline-row]').forEach(function (row) {
      ScrollTrigger.create({
        trigger: row, start: 'top 60%', end: 'bottom 40%',
        onEnter: function () { row.classList.add('uik-is-lit'); },
        onEnterBack: function () { row.classList.add('uik-is-lit'); },
        onLeave: function () { row.classList.remove('uik-is-lit'); },
        onLeaveBack: function () { row.classList.remove('uik-is-lit'); }
      });
    });

    // 12. split-reveal panels
    var splitreveal = root.querySelector('[data-splitreveal]');
    if (splitreveal) {
      var splitLeft = splitreveal.querySelector('[data-split-left]');
      var splitRight = splitreveal.querySelector('[data-split-right]');
      if (splitLeft) {
        gsap.fromTo(splitLeft, { xPercent: 0 }, {
          xPercent: -100, ease: 'none',
          scrollTrigger: { trigger: splitreveal, start: 'top 75%', end: 'top 15%', scrub: 0.5 }
        });
      }
      if (splitRight) {
        gsap.fromTo(splitRight, { xPercent: 0 }, {
          xPercent: 100, ease: 'none',
          scrollTrigger: { trigger: splitreveal, start: 'top 75%', end: 'top 15%', scrub: 0.5 }
        });
      }
    }

    // 13. rotating badge
    var rotateBadge = root.querySelector('[data-rotatebadge]');
    if (rotateBadge) {
      var rotateRing = rotateBadge.querySelector('[data-rotatebadge-ring]');
      if (rotateRing) {
        gsap.to(rotateRing, {
          rotate: 360, ease: 'none',
          scrollTrigger: { trigger: rotateBadge, start: 'top 85%', end: 'bottom 15%', scrub: 0.5 }
        });
      }
    }

    // 14. pinned scale-up text
    var pinScale = root.querySelector('[data-pinscale]');
    if (pinScale) {
      var pinscaleWord = pinScale.querySelector('[data-pinscale-word]') || pinScale;
      gsap.fromTo(pinscaleWord, { scale: 0.6, opacity: 0.4 }, {
        scale: 1.4, opacity: 1, ease: 'none',
        scrollTrigger: {
          trigger: pinScale,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // 15. discrete word-by-word reveal
    var wordReveal = root.querySelector('[data-wordreveal]');
    if (wordReveal) {
      var wrWords = wordReveal.textContent.trim().split(/\s+/);
      wordReveal.innerHTML = wrWords.map(function (w) { return '<span class="uik-reveal-word">' + w + '</span>'; }).join(' ');
      var wrSpans = wordReveal.querySelectorAll('.uik-reveal-word');
      gsap.fromTo(wrSpans,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.03,
          scrollTrigger: {
            trigger: wordReveal,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // 16. 3D flip showcase card
    var flipShowcase = root.querySelector('[data-flipshowcase]');
    if (flipShowcase) {
      var flipCard = flipShowcase.querySelector('[data-flipshowcase-card]');
      if (flipCard) {
        gsap.to(flipCard, {
          rotateY: 180,
          ease: 'none',
          scrollTrigger: { trigger: flipShowcase, start: 'top 80%', end: 'bottom 20%', scrub: 0.5 }
        });
      }
    }

    // 17. Big Number counter + pop
    var bigNumSec = root.querySelector('[data-bignumber]');
    if (bigNumSec) {
      var bigNumVal = bigNumSec.querySelector('[data-bignumber-value]');
      if (bigNumVal) {
        var targetNum = parseFloat(bigNumVal.dataset.countTo) || 42;
        var numObj = { val: 0 };
        function playNum() {
          gsap.fromTo(bigNumVal, { scale: 0.7, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' });
          gsap.to(numObj, {
            val: targetNum, duration: 1.4, ease: 'power2.out',
            onUpdate: function () { bigNumVal.textContent = Math.round(numObj.val); }
          });
        }
        function resetNum() {
          numObj.val = 0;
          bigNumVal.textContent = '0';
        }
        ScrollTrigger.create({
          trigger: bigNumSec, start: 'top 85%', end: 'bottom top',
          onEnter: playNum, onEnterBack: playNum, onLeave: resetNum, onLeaveBack: resetNum
        });
      }
    }

    // 18. sticky gallery
    var stickyGallery = root.querySelector('[data-stickygallery]');
    if (stickyGallery) {
      var galleryRows = stickyGallery.querySelectorAll('[data-gallery-row]');
      galleryRows.forEach(function (row) {
        var idx = row.dataset.galleryRow;
        var img = stickyGallery.querySelector('[data-gallery-img="' + idx + '"]');
        function show() {
          row.classList.add('uik-is-lit');
          stickyGallery.querySelectorAll('[data-gallery-img]').forEach(function (i) { i.classList.remove('uik-is-shown'); });
          if (img) img.classList.add('uik-is-shown');
        }
        function hide() { row.classList.remove('uik-is-lit'); }
        ScrollTrigger.create({ trigger: row, start: 'top 60%', end: 'bottom 40%', onEnter: show, onEnterBack: show, onLeave: hide, onLeaveBack: hide });
      });
    }

    // 19. horizontal progress line
    var hprogress = root.querySelector('[data-hprogress]');
    if (hprogress) {
      var hpFill = hprogress.querySelector('[data-hprogress-fill]');
      var hpMarkers = hprogress.querySelectorAll('[data-hprogress-marker]');
      ScrollTrigger.create({
        trigger: hprogress, start: 'top 85%', end: 'bottom 55%', scrub: 0.4,
        onUpdate: function (self) {
          if (hpFill) gsap.set(hpFill, { width: (self.progress * 100) + '%' });
          var lit = Math.floor(self.progress * hpMarkers.length);
          hpMarkers.forEach(function (m, i) { m.classList.toggle('uik-is-lit', i <= lit); });
        }
      });
    }

    // 20. multi-column reveal
    root.querySelectorAll('[data-col-reveal]').forEach(function (col) {
      var dir = col.dataset.colReveal;
      var fromVars = dir === 'left' ? { x: -60, opacity: 0 } : dir === 'right' ? { x: 60, opacity: 0 } : { y: 40, opacity: 0 };
      gsap.fromTo(col, fromVars, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: col,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse'
        }
      });
    });

    // 21. scale grid
    var scaleGrid = root.querySelector('[data-scalegrid]');
    if (scaleGrid) {
      var scaleItems = scaleGrid.querySelectorAll('.uik-scalegrid__item');
      if (scaleItems.length) {
        gsap.fromTo(scaleItems,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.55,
            ease: 'back.out(1.8)',
            stagger: 0.06,
            scrollTrigger: {
              trigger: scaleGrid,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    }

    // 22. color wash
    var colorwash = root.querySelector('[data-colorwash]');
    if (colorwash) {
      gsap.fromTo(colorwash,
        { backgroundColor: '#F2ECE0' },
        {
          backgroundColor: '#E9E1D1',
          ease: 'none',
          scrollTrigger: { trigger: colorwash, start: 'top 80%', end: 'bottom 30%', scrub: 0.5 }
        }
      );
    }

    // 23. curtain
    var curtainSec = root.querySelector('[data-curtain]');
    if (curtainSec) {
      var curtainPanel = curtainSec.querySelector('[data-curtain-panel]');
      if (curtainPanel) {
        gsap.fromTo(curtainPanel,
          { xPercent: 0 },
          {
            xPercent: 100,
            ease: 'none',
            scrollTrigger: { trigger: curtainSec, start: 'top 75%', end: 'bottom 35%', scrub: 0.5 }
          }
        );
      }
    }

    // 24. float cards
    root.querySelectorAll('[data-float-card]').forEach(function (card, i) {
      var idleTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true, delay: i * 0.3 });
      idleTl.to(card, { y: '-=8', duration: 1.6 + i * 0.2, ease: 'sine.inOut' });

      gsap.fromTo(card,
        { y: 50, opacity: 0, rotate: i % 2 === 0 ? -4 : 4 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
            onEnter: () => idleTl.play(),
            onEnterBack: () => idleTl.play(),
            onLeave: () => { idleTl.pause(0); },
            onLeaveBack: () => { idleTl.pause(0); }
          }
        }
      );
    });

    // 25. SVG line draw
    var drawLineSec = root.querySelector('[data-drawline]');
    if (drawLineSec) {
      var drawPath = drawLineSec.querySelector('[data-drawline-path]');
      if (drawPath) {
        var pathLength = drawPath.getTotalLength ? drawPath.getTotalLength() : 400;
        gsap.set(drawPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.to(drawPath, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: drawLineSec, start: 'top 80%', end: 'bottom 30%', scrub: 0.5 }
        });
      }
    }

    // 26. sticky step numbers
    var stepSec = root.querySelector('[data-stepnumbers]');
    if (stepSec) {
      var stepRows = stepSec.querySelectorAll('[data-step-row]');
      var stepNum = stepSec.querySelector('[data-stepnum]');
      stepRows.forEach(function (row) {
        var val = row.dataset.stepRow;
        function activate() {
          row.classList.add('uik-is-lit');
          if (stepNum) { stepNum.textContent = ('0' + val).slice(-2); }
        }
        function deactivate() { row.classList.remove('uik-is-lit'); }
        ScrollTrigger.create({ trigger: row, start: 'top 60%', end: 'bottom 40%', onEnter: activate, onEnterBack: activate, onLeave: deactivate, onLeaveBack: deactivate });
      });
    }

    // 27. tilt gallery
    var tiltGallery = root.querySelector('[data-tiltgallery]');
    if (tiltGallery) {
      tiltGallery.querySelectorAll('[data-tilt-frame]').forEach(function (frame, i) {
        var dir = i % 2 === 0 ? -1 : 1;
        gsap.fromTo(frame,
          { rotateY: dir * 18, y: 30 },
          {
            rotateY: 0, y: 0, ease: 'none',
            scrollTrigger: { trigger: tiltGallery, start: 'top 90%', end: 'top 30%', scrub: 0.5 }
          }
        );
      });
    }

    // 28. text mask reveal
    var textMaskSec = root.querySelector('[data-textmask]');
    if (textMaskSec) {
      var textmaskWord = textMaskSec.querySelector('[data-textmask-word]') || textMaskSec;
      gsap.fromTo(textmaskWord,
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textMaskSec,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // 29. ambient particles
    var particlesSection = root.querySelector('[data-particles]');
    if (particlesSection) {
      var particles = particlesSection.querySelectorAll('[data-particle]');
      particles.forEach(function (particle, i) {
        gsap.to(particle, {
          y: (i % 2 === 0 ? -1 : 1) * (14 + i * 3),
          x: (i % 3 === 0 ? -1 : 1) * (8 + i * 2),
          duration: 3 + i * 0.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      });
      if (particles.length) {
        gsap.to(particles, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: { trigger: particlesSection, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    }

    // 30. accordion reveal
    root.querySelectorAll('[data-accordion-row]').forEach(function (row) {
      var body = row.querySelector('[data-accordion-body]');
      if (body) {
        gsap.fromTo(body,
          { maxHeight: 0, opacity: 0 },
          {
            maxHeight: 140,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    // 31. magnetic grid
    var magneticGrid = root.querySelector('[data-magneticgrid]');
    if (magneticGrid) {
      var dots = magneticGrid.querySelectorAll('[data-magnetic-dot]');
      magneticGrid.addEventListener('mousemove', function (e) {
        var r = magneticGrid.getBoundingClientRect();
        dots.forEach(function (dot) {
          var dr = dot.getBoundingClientRect();
          var dx = (e.clientX - r.left) - (dr.left - r.left + dr.width / 2);
          var dy = (e.clientY - r.top) - (dr.top - r.top + dr.height / 2);
          var dist = Math.sqrt(dx * dx + dy * dy);
          var pull = Math.max(0, 1 - dist / 140);
          gsap.to(dot, { x: dx * pull * 0.45, y: dy * pull * 0.45, duration: 0.35, ease: 'power2.out' });
        });
      }, { passive: true });
      magneticGrid.addEventListener('mouseleave', function () {
        dots.forEach(function (dot) {
          gsap.to(dot, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
        });
      });
    }

    // 32. orbit
    var orbitSec = root.querySelector('[data-orbit]');
    if (orbitSec) {
      var orbitNodes = orbitSec.querySelectorAll('[data-orbit-node]');
      orbitNodes.forEach(function (node, i) {
        var radius = i === 2 ? 90 : 130;
        var startAngle = i * (360 / orbitNodes.length);
        gsap.set(node, {
          x: radius * Math.cos(startAngle * Math.PI / 180),
          y: radius * Math.sin(startAngle * Math.PI / 180)
        });
        var proxy = { angle: startAngle };
        gsap.to(proxy, {
          angle: startAngle + 360,
          ease: 'none',
          scrollTrigger: { trigger: orbitSec, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          onUpdate: function () {
            gsap.set(node, {
              x: radius * Math.cos(proxy.angle * Math.PI / 180),
              y: radius * Math.sin(proxy.angle * Math.PI / 180)
            });
          }
        });
      });
    }

    // 33. arc text
    root.querySelectorAll('[data-arctext]').forEach(function (h) {
      var text = h.textContent.trim();
      h.textContent = '';
      var lettersArr = text.split('');
      lettersArr.forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'uik-arc-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        h.appendChild(span);
      });
      var arcChars = h.querySelectorAll('.uik-arc-char');
      var mid = arcChars.length / 2;
      gsap.fromTo(arcChars,
        { y: 40, opacity: 0, rotate: 0 },
        {
          y: 0,
          opacity: 1,
          rotate: function (i) { return (i - mid) * 2.5; },
          duration: 0.6,
          ease: 'power3.out',
          stagger: {
            each: 0.03,
            from: 'center'
          },
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 34. compare gallery
    var compareSec = root.querySelector('[data-comparegallery]');
    if (compareSec) {
      var compareBefore = compareSec.querySelector('[data-compare-before]');
      var compareHandle = compareSec.querySelector('[data-compare-handle]');
      if (compareBefore && compareHandle) {
        gsap.fromTo(compareBefore,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: { trigger: compareSec, start: 'top 85%', end: 'bottom 35%', scrub: 0.5 }
          }
        );
        gsap.fromTo(compareHandle,
          { left: '0%' },
          {
            left: '100%',
            ease: 'none',
            scrollTrigger: { trigger: compareSec, start: 'top 85%', end: 'bottom 35%', scrub: 0.5 }
          }
        );
      }
    }

    // 35. wave divider
    var waveSec = root.querySelector('[data-wavedivider]');
    if (waveSec) {
      var wavePath = waveSec.querySelector('[data-wave-path]');
      if (wavePath) {
        gsap.to(wavePath, {
          attr: { d: 'M0,45 C100,15 300,55 400,20 L400,60 L0,60 Z' },
          ease: 'none',
          scrollTrigger: { trigger: waveSec, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
        });
      }
    }

    // 36. radial burst
    var radialBurstSec = root.querySelector('[data-radialburst]');
    if (radialBurstSec) {
      var burstItems = radialBurstSec.querySelectorAll('[data-burst-item]');
      if (burstItems.length) {
        var tlBurst = gsap.timeline({
          scrollTrigger: {
            trigger: radialBurstSec,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        });
        burstItems.forEach(function (item, i) {
          var angle = i * (360 / burstItems.length) - 90;
          var dist = 105;
          var tx = dist * Math.cos(angle * Math.PI / 180);
          var ty = dist * Math.sin(angle * Math.PI / 180);
          tlBurst.fromTo(item,
            { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0, scale: 0.3 },
            { xPercent: -50, yPercent: -50, x: tx, y: ty, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
            i * 0.08
          );
        });
      }
    }

    // 37. fold panels
    var foldSec = root.querySelector('[data-foldpanels]');
    if (foldSec) {
      var foldPanels = foldSec.querySelectorAll('[data-fold-panel]');
      gsap.fromTo(foldPanels,
        { rotateX: -90, opacity: 0, transformPerspective: 800, transformOrigin: 'top center' },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: foldSec,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // 38. spotlight gallery
    var spotSec = root.querySelector('[data-spotlightgallery]');
    if (spotSec) {
      var spotlightMask = spotSec.querySelector('[data-spotlight-mask]');
      if (spotlightMask) {
        var proxySpot = { x: 15, y: 50 };
        gsap.fromTo(proxySpot,
          { x: 15 },
          {
            x: 85,
            ease: 'none',
            scrollTrigger: {
              trigger: spotSec,
              start: 'top 90%',
              end: 'bottom 40%',
              scrub: 0.5,
              onUpdate: function () {
                spotlightMask.style.setProperty('--uik-sx', proxySpot.x + '%');
                spotlightMask.style.setProperty('--uik-sy', proxySpot.y + '%');
              }
            }
          }
        );
      }
    }

    // 39. depth stack
    var depthSec = root.querySelector('[data-depthstack]');
    if (depthSec) {
      var depthLayers = depthSec.querySelectorAll('[data-depth-layer]');
      var depthOffsets = [
        { x: -90, y: 24, z: -80, r: -7, op: 0.75 },
        { x: 0, y: 0, z: 0, r: 0, op: 0.95 },
        { x: 90, y: -24, z: 80, r: 7, op: 1 }
      ];
      depthLayers.forEach(function (layer, i) {
        var target = depthOffsets[i] || { x: (i - 1) * 90, y: (i - 1) * -20, z: (i - 1) * 60, r: (i - 1) * 6, op: 1 };
        gsap.fromTo(layer,
          { x: 0, y: 0, z: 0, rotateZ: 0, opacity: 0.5, transformPerspective: 1200 },
          {
            x: target.x,
            y: target.y,
            z: target.z,
            rotateZ: target.r,
            opacity: target.op,
            ease: 'none',
            scrollTrigger: {
              trigger: depthSec,
              start: 'top 90%',
              end: 'bottom 45%',
              scrub: 0.5
            }
          }
        );
      });
    }

    /* ==========================================================================
       KIT—06 / AWWWARDS SHOWCASE JAVASCRIPT LOGIC
       ========================================================================== */

    // 1. Custom Magnetic Fluid Cursor
    var cursor = document.querySelector('[data-aww-cursor]');
    var cursorLabel = cursor ? cursor.querySelector('[data-cursor-label]') : null;
    if (cursor) {
      var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      var pos = { x: mouse.x, y: mouse.y };
      var cursorVisible = false;

      window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if (!cursorVisible) {
          cursorVisible = true;
          cursor.classList.add('uik-cursor--active');
        }
      }, { passive: true });

      gsap.ticker.add(function () {
        pos.x += (mouse.x - pos.x) * 0.2;
        pos.y += (mouse.y - pos.y) * 0.2;
        gsap.set(cursor, { x: pos.x, y: pos.y });
      });

      // Magnetic hover on buttons
      root.querySelectorAll('.uik-aww-btn, [data-cursor-text]').forEach(function (btn) {
        btn.addEventListener('mouseenter', function () {
          cursor.classList.add('uik-cursor--expand');
          var label = btn.dataset.cursorText || 'VIEW';
          if (cursorLabel) cursorLabel.textContent = label;
        });
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width / 2)) * 0.35;
          var dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
          gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
        }, { passive: true });
        btn.addEventListener('mouseleave', function () {
          cursor.classList.remove('uik-cursor--expand');
          if (cursorLabel) cursorLabel.textContent = '';
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    // 2. Pinned Overlapping Stacked Cards
    var stackSec = root.querySelector('[data-aww-stack]');
    if (stackSec) {
      var stackCards = stackSec.querySelectorAll('[data-aww-stack-card]');
      stackCards.forEach(function (card, i) {
        if (i === stackCards.length - 1) return;
        ScrollTrigger.create({
          trigger: stackCards[i + 1],
          start: 'top 150px',
          end: 'top 80px',
          scrub: true,
          onUpdate: function (self) {
            var scale = 1 - self.progress * 0.08;
            var brightness = 1 - self.progress * 0.22;
            gsap.set(card, {
              scale: scale,
              filter: 'brightness(' + brightness + ')'
            });
          }
        });
      });
    }

    // 3. Cursor-Driven Image Trail
    var trailSec = root.querySelector('[data-aww-trail]');
    if (trailSec) {
      var trailImgs = [
        'https://picsum.photos/seed/uiktrail1/300/400',
        'https://picsum.photos/seed/uiktrail2/300/400',
        'https://picsum.photos/seed/uiktrail3/300/400',
        'https://picsum.photos/seed/uiktrail4/300/400',
        'https://picsum.photos/seed/uiktrail5/300/400'
      ];
      var trailIndex = 0;
      var lastPos = { x: 0, y: 0 };
      var minDistance = 65;

      trailSec.addEventListener('mousemove', function (e) {
        var r = trailSec.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        var dist = Math.hypot(x - lastPos.x, y - lastPos.y);

        if (dist > minDistance) {
          lastPos = { x: x, y: y };
          var chip = document.createElement('div');
          chip.className = 'uik-aww-trail-chip';
          chip.innerHTML = '<img src="' + trailImgs[trailIndex % trailImgs.length] + '" alt="">';
          trailIndex++;
          trailSec.appendChild(chip);

          var rot = (Math.random() - 0.5) * 26;
          gsap.fromTo(chip,
            { left: x, top: y, scale: 0.3, rotate: rot, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'back.out(1.5)',
              onComplete: function () {
                gsap.to(chip, {
                  scale: 0.4,
                  opacity: 0,
                  y: 40,
                  duration: 0.6,
                  delay: 0.3,
                  ease: 'power2.in',
                  onComplete: function () { chip.remove(); }
                });
              }
            }
          );
        }
      }, { passive: true });
    }

    // 4. Velocity Skew Scroll
    var skewTarget = root.querySelector('[data-aww-skew-target]');
    if (skewTarget) {
      var clampSkew = gsap.utils.clamp(-16, 16);
      var proxySkew = { skew: 0 };
      ScrollTrigger.create({
        onUpdate: function (self) {
          var skew = clampSkew(self.getVelocity() / -250);
          if (Math.abs(skew) > Math.abs(proxySkew.skew)) {
            proxySkew.skew = skew;
            gsap.to(proxySkew, {
              skew: 0,
              duration: 0.7,
              ease: 'power3.out',
              overwrite: true,
              onUpdate: function () {
                gsap.set(skewTarget, { skewY: proxySkew.skew });
              }
            });
          }
        }
      });
    }

    // 5. Curved Portal Expansion
    var portalSec = root.querySelector('[data-aww-portal]');
    if (portalSec) {
      var portalMedia = portalSec.querySelector('[data-aww-portal-media]');
      if (portalMedia) {
        gsap.fromTo(portalMedia,
          { width: '45%', height: '280px', borderRadius: '200px' },
          {
            width: '100%',
            height: '460px',
            borderRadius: '24px',
            ease: 'none',
            scrollTrigger: {
              trigger: portalSec,
              start: 'top 85%',
              end: 'bottom 40%',
              scrub: 0.5
            }
          }
        );
      }
    }

    // 6. 3D Perspective Glass Card
    var glass3d = root.querySelector('[data-aww-glass3d]');
    if (glass3d) {
      var glassInner = glass3d.querySelector('.uik-aww-glass3d__inner');
      glass3d.addEventListener('mousemove', function (e) {
        var r = glass3d.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * 28;
        var ry = (px - 0.5) * 28;
        gsap.to(glassInner, {
          rotateX: rx,
          rotateY: ry,
          duration: 0.4,
          ease: 'power2.out'
        });
        glassInner.style.setProperty('--gx', px * 100 + '%');
        glassInner.style.setProperty('--gy', py * 100 + '%');
      }, { passive: true });
      glass3d.addEventListener('mouseleave', function () {
        gsap.to(glassInner, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      });
    }

    // 7. Organic Blob Morph
    var blobSec = root.querySelector('[data-aww-blob]');
    if (blobSec) {
      var blobPath = blobSec.querySelector('[data-aww-blob-path]');
      if (blobPath) {
        var blobMorphs = [
          'M200,50 C290,70 350,130 340,210 C330,290 270,350 190,340 C110,330 50,270 60,190 C70,110 110,30 200,50 Z',
          'M210,60 C300,50 360,140 330,220 C300,300 240,360 170,330 C100,300 40,240 60,160 C80,80 120,70 210,60 Z',
          'M190,40 C280,60 340,110 350,190 C360,270 290,340 210,350 C130,360 60,300 50,220 C40,140 100,20 190,40 Z'
        ];
        var bTl = gsap.timeline({ repeat: -1, yoyo: true });
        blobMorphs.forEach(function (d) {
          bTl.to(blobPath, { attr: { d: d }, duration: 2.5, ease: 'sine.inOut' });
        });
      }
    }

    // 8. Dual-Direction Parallax Streams
    var dualSec = root.querySelector('[data-aww-duallist]');
    if (dualSec) {
      var streamUp = dualSec.querySelector('[data-aww-stream-up]');
      var streamDown = dualSec.querySelector('[data-aww-stream-down]');
      if (streamUp && streamDown) {
        gsap.fromTo(streamUp,
          { y: 60 },
          {
            y: -100,
            ease: 'none',
            scrollTrigger: { trigger: dualSec, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
          }
        );
        gsap.fromTo(streamDown,
          { y: -100 },
          {
            y: 60,
            ease: 'none',
            scrollTrigger: { trigger: dualSec, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
          }
        );
      }
    }

    // 9. Interactive Magnetic Letter Repel
    var repelSec = root.querySelector('[data-aww-repel]');
    if (repelSec) {
      var repelText = repelSec.querySelector('[data-aww-repel-text]');
      if (repelText) {
        var repChars = repelText.textContent.trim().split('');
        repelText.textContent = '';
        repChars.forEach(function (ch) {
          var span = document.createElement('span');
          span.className = 'uik-aww-repel-char';
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          repelText.appendChild(span);
        });

        var spans = repelText.querySelectorAll('.uik-aww-repel-char');
        repelSec.addEventListener('mousemove', function (e) {
          spans.forEach(function (span) {
            var r = span.getBoundingClientRect();
            var cx = r.left + r.width / 2;
            var cy = r.top + r.height / 2;
            var dx = e.clientX - cx;
            var dy = e.clientY - cy;
            var dist = Math.hypot(dx, dy);
            if (dist < 120) {
              var force = (1 - dist / 120) * 35;
              var angle = Math.atan2(dy, dx);
              gsap.to(span, {
                x: -Math.cos(angle) * force,
                y: -Math.sin(angle) * force,
                rotate: (Math.random() - 0.5) * 20,
                duration: 0.3,
                ease: 'power2.out'
              });
            }
          });
        }, { passive: true });

        repelSec.addEventListener('mouseleave', function () {
          gsap.to(spans, { x: 0, y: 0, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', stagger: 0.01 });
        });
      }
    }

    // 10. Hover Floating List Preview
    var listPrevSec = root.querySelector('[data-aww-listpreview]');
    if (listPrevSec) {
      var floatPrev = listPrevSec.querySelector('[data-aww-floatpreview]');
      var floatImg = listPrevSec.querySelector('[data-aww-floatimg]');
      var listItems = listPrevSec.querySelectorAll('.uik-aww-list-item');

      var fPos = { x: 0, y: 0 };
      var fMouse = { x: 0, y: 0 };

      window.addEventListener('mousemove', function (e) {
        fMouse.x = e.clientX;
        fMouse.y = e.clientY;
      }, { passive: true });

      gsap.ticker.add(function () {
        fPos.x += (fMouse.x - fPos.x) * 0.15;
        fPos.y += (fMouse.y - fPos.y) * 0.15;
        if (floatPrev) gsap.set(floatPrev, { x: fPos.x, y: fPos.y });
      });

      listItems.forEach(function (item) {
        item.addEventListener('mouseenter', function () {
          var src = item.dataset.previewImg;
          if (src && floatImg) floatImg.src = src;
          gsap.to(floatPrev, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.6)' });
        });
        item.addEventListener('mouseleave', function () {
          gsap.to(floatPrev, { scale: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
        });
      });
    }

    // 11. Typography Stencil Window
    var stencilSec = root.querySelector('[data-aww-textstencil]');
    if (stencilSec) {
      var stencilBg = stencilSec.querySelector('[data-aww-stencil-bg]');
      if (stencilBg) {
        gsap.fromTo(stencilBg,
          { yPercent: -20, rotate: -4 },
          {
            yPercent: 20,
            rotate: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: stencilSec,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    }

    /* ==========================================================================
       KIT—07 / HYPER-MOTION STUDIO JAVASCRIPT LOGIC
       ========================================================================== */

    // 1. 3D Circular Orbiting Cylinder Carousel
    var cylSec = root.querySelector('[data-hyp-cylinder]');
    if (cylSec) {
      var cylTrack = cylSec.querySelector('[data-hyp-cylinder-track]');
      if (cylTrack) {
        var cylRot = { ry: 0 };
        gsap.to(cylRot, {
          ry: 360,
          ease: 'none',
          repeat: -1,
          duration: 18,
          onUpdate: function () {
            gsap.set(cylTrack, { rotateY: cylRot.ry });
          }
        });
        ScrollTrigger.create({
          trigger: cylSec,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: function (self) {
            cylRot.ry += self.getVelocity() * 0.02;
          }
        });
      }
    }

    // 2. Interactive Reactive Pixel Grid
    var pixSec = root.querySelector('[data-hyp-pixelgrid]');
    if (pixSec) {
      var matrix = pixSec.querySelector('[data-hyp-matrix]');
      if (matrix) {
        var totalPix = 72;
        for (var p = 0; p < totalPix; p++) {
          var pix = document.createElement('div');
          pix.className = 'uik-hyp-pixel';
          matrix.appendChild(pix);
        }
        var pixels = matrix.querySelectorAll('.uik-hyp-pixel');
        matrix.addEventListener('mousemove', function (e) {
          pixels.forEach(function (pxEl) {
            var r = pxEl.getBoundingClientRect();
            var cx = r.left + r.width / 2;
            var cy = r.top + r.height / 2;
            var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
            if (dist < 80) {
              var intense = 1 - dist / 80;
              gsap.to(pxEl, {
                scale: 1 + intense * 0.4,
                backgroundColor: intense > 0.5 ? '#C8862B' : '#2F8F72',
                duration: 0.2,
                ease: 'power2.out',
                overwrite: 'auto'
              });
            } else {
              gsap.to(pxEl, {
                scale: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                duration: 0.6,
                ease: 'power2.inOut',
                overwrite: 'auto'
              });
            }
          });
        }, { passive: true });
        matrix.addEventListener('mouseleave', function () {
          gsap.to(pixels, { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', duration: 0.6, stagger: 0.005 });
        });
      }
    }

    // 3. 3D Isometric Depth Marquee
    var isoSec = root.querySelector('[data-hyp-3dmarquee]');
    if (isoSec) {
      isoSec.querySelectorAll('[data-hyp-iso-lane]').forEach(function (lane) {
        var dir = parseFloat(lane.dataset.dir) || 1;
        var original = lane.innerHTML;
        lane.innerHTML = original + original + original;
        gsap.fromTo(lane,
          { xPercent: dir > 0 ? 0 : -33.33 },
          {
            xPercent: dir > 0 ? -33.33 : 0,
            duration: 22,
            ease: 'none',
            repeat: -1
          }
        );
      });
    }

    // 4. Multi-Slat Curtain Shutter Reveal
    var slatSec = root.querySelector('[data-hyp-curtainslats]');
    if (slatSec) {
      var slats = slatSec.querySelectorAll('[data-hyp-slat]');
      gsap.fromTo(slats,
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: slatSec,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }

    // 5. Magnetic Concentric Shockwave Button
    var shockSec = root.querySelector('[data-hyp-liquidbtn]');
    if (shockSec) {
      var shockOrb = shockSec.querySelector('[data-hyp-orb]');
      var waveRings = shockSec.querySelectorAll('.uik-hyp-wave-ring');
      if (shockOrb) {
        shockOrb.addEventListener('click', function () {
          gsap.fromTo(shockOrb, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
          waveRings.forEach(function (ring, idx) {
            gsap.fromTo(ring,
              { scale: 0.6, opacity: 0.9 },
              {
                scale: 2.4 + idx * 0.4,
                opacity: 0,
                duration: 0.9,
                delay: idx * 0.15,
                ease: 'power2.out'
              }
            );
          });
        });
      }
    }

    // 6. Harmonic Equalizer Audio Visualizer
    var eqSec = root.querySelector('[data-hyp-equalizer]');
    if (eqSec) {
      var eqBarsContainer = eqSec.querySelector('[data-hyp-eq-bars]');
      if (eqBarsContainer) {
        for (var b = 0; b < 16; b++) {
          var bar = document.createElement('div');
          bar.className = 'uik-hyp-eq-bar';
          eqBarsContainer.appendChild(bar);
        }
        var eqBars = eqBarsContainer.querySelectorAll('.uik-hyp-eq-bar');
        eqBars.forEach(function (bar, i) {
          gsap.to(bar, {
            height: function () { return 15 + Math.random() * 110; },
            duration: 0.25 + Math.random() * 0.35,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.05
          });
        });
      }
    }

    // 7. Interactive 2.5D Constellation Particle Plexus
    var plexusSec = root.querySelector('[data-hyp-constellation]');
    if (plexusSec) {
      var canvas = plexusSec.querySelector('[data-hyp-canvas]');
      if (canvas) {
        var ctx = canvas.getContext('2d');
        var pWidth, pHeight;
        function resizeCanvas() {
          pWidth = canvas.width = canvas.offsetWidth;
          pHeight = canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        var nodes = [];
        var nodeCount = 35;
        for (var n = 0; n < nodeCount; n++) {
          nodes.push({
            x: Math.random() * (pWidth || 600),
            y: Math.random() * (pHeight || 300),
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            radius: 2.5 + Math.random() * 2
          });
        }

        gsap.ticker.add(function () {
          if (!ctx || !pWidth) return;
          ctx.clearRect(0, 0, pWidth, pHeight);
          for (var i = 0; i < nodes.length; i++) {
            var nd = nodes[i];
            nd.x += nd.vx;
            nd.y += nd.vy;
            if (nd.x < 0 || nd.x > pWidth) nd.vx *= -1;
            if (nd.y < 0 || nd.y > pHeight) nd.vy *= -1;

            for (var j = i + 1; j < nodes.length; j++) {
              var nd2 = nodes[j];
              var dist = Math.hypot(nd.x - nd2.x, nd.y - nd2.y);
              if (dist < 110) {
                ctx.strokeStyle = 'rgba(200, 134, 43, ' + (1 - dist / 110) * 0.4 + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(nd.x, nd.y);
                ctx.lineTo(nd2.x, nd2.y);
                ctx.stroke();
              }
            }

            ctx.fillStyle = '#C8862B';
            ctx.beginPath();
            ctx.arc(nd.x, nd.y, nd.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    }

    // 8. Interactive 3D Multi-Layer Card Peel
    var peelSec = root.querySelector('[data-hyp-cardpeel]');
    if (peelSec) {
      var peelCard = peelSec.querySelector('.uik-hyp-peel-card');
      var peelFront = peelSec.querySelector('.uik-hyp-peel-layer--front');
      var peelMid = peelSec.querySelector('.uik-hyp-peel-layer--mid');
      if (peelCard && peelFront && peelMid) {
        peelCard.addEventListener('mousemove', function (e) {
          var r = peelCard.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(peelFront, { rotateY: -35 + px * 20, rotateX: -py * 20, duration: 0.3 });
          gsap.to(peelMid, { rotateY: -18 + px * 10, rotateX: -py * 10, duration: 0.3 });
        }, { passive: true });
        peelCard.addEventListener('mouseleave', function () {
          gsap.to([peelFront, peelMid], { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
        });
      }
    }

    // 9. Cylindrical Odometer Rolling Numbers
    var odoSec = root.querySelector('[data-hyp-odometer]');
    if (odoSec) {
      var odoWrap = odoSec.querySelector('.uik-hyp-odometer-wrap');
      var drums = odoSec.querySelectorAll('[data-drum]');
      var targetNumStr = odoWrap ? (odoWrap.dataset.targetNum || '94820') : '94820';

      function rollOdometer() {
        drums.forEach(function (drum, i) {
          var digit = parseInt(targetNumStr[i] || '0', 10);
          var ribbon = drum.querySelector('.uik-hyp-odo-ribbon');
          if (ribbon) {
            gsap.fromTo(ribbon,
              { y: 0 },
              {
                y: -(digit * 70),
                duration: 1.6 + i * 0.2,
                ease: 'power3.inOut'
              }
            );
          }
        });
      }
      function resetOdometer() {
        drums.forEach(function (drum) {
          var ribbon = drum.querySelector('.uik-hyp-odo-ribbon');
          if (ribbon) gsap.set(ribbon, { y: 0 });
        });
      }
      ScrollTrigger.create({
        trigger: odoSec,
        start: 'top 85%',
        end: 'bottom top',
        onEnter: rollOdometer,
        onEnterBack: rollOdometer,
        onLeave: resetOdometer,
        onLeaveBack: resetOdometer
      });
    }

    // 10. Floating Anti-Gravity Magnetic Pill Cluster
    var clusterSec = root.querySelector('[data-hyp-pillcluster]');
    if (clusterSec) {
      var pills = clusterSec.querySelectorAll('[data-hyp-pill]');
      pills.forEach(function (pill, i) {
        gsap.to(pill, {
          y: (i % 2 === 0 ? -1 : 1) * (6 + (i % 3) * 4),
          x: (i % 3 === 0 ? 1 : -1) * (4 + (i % 2) * 3),
          duration: 2.2 + (i % 4) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        pill.addEventListener('mousemove', function (e) {
          var r = pill.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width / 2)) * 0.45;
          var dy = (e.clientY - (r.top + r.height / 2)) * 0.45;
          gsap.to(pill, { x: dx, y: dy, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        }, { passive: true });
        pill.addEventListener('mouseleave', function () {
          gsap.to(pill, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    // 11. Sinusoidal Typography Wave Warp
    var waveFontSec = root.querySelector('[data-hyp-wavefont]');
    if (waveFontSec) {
      var waveHeading = waveFontSec.querySelector('[data-hyp-wave-text]');
      if (waveHeading) {
        var chars = waveHeading.textContent.trim().split('');
        waveHeading.textContent = '';
        chars.forEach(function (ch) {
          var span = document.createElement('span');
          span.className = 'uik-hyp-wave-char';
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          waveHeading.appendChild(span);
        });
        var waveChars = waveHeading.querySelectorAll('.uik-hyp-wave-char');
        ScrollTrigger.create({
          trigger: waveFontSec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: function (self) {
            waveChars.forEach(function (span, i) {
              var y = Math.sin(self.progress * Math.PI * 4 + i * 0.45) * 28;
              var rot = Math.cos(self.progress * Math.PI * 4 + i * 0.45) * 12;
              gsap.set(span, { y: y, rotate: rot });
            });
          }
        });
      }
    }

    /* ==========================================================================
       KIT—08 / REACTBITS SLIDER & CAROUSEL SUITE JAVASCRIPT LOGIC
       ========================================================================== */

    // 1. Skewed Velocity Carousel
    var skwSec = root.querySelector('[data-rb-skewed-carousel]');
    if (skwSec) {
      var skwTrack = skwSec.querySelector('[data-rb-skewed-track]');
      var skwViewport = skwSec.querySelector('.uik-rb-skewed-viewport');
      var btnPrev = skwSec.querySelector('[data-rb-prev="skewed"]');
      var btnNext = skwSec.querySelector('[data-rb-next="skewed"]');

      var skwPos = 0;
      var skwTarget = 0;
      var skwMax = 0;
      var skwDragging = false;
      var skwStartX = 0;
      var skwLastX = 0;

      function updateSkwBounds() {
        if (!skwTrack || !skwViewport) return;
        skwMax = Math.max(0, skwTrack.scrollWidth - skwViewport.clientWidth);
      }
      updateSkwBounds();
      window.addEventListener('resize', updateSkwBounds, { passive: true });

      if (skwViewport && skwTrack) {
        skwViewport.addEventListener('mousedown', function (e) {
          skwDragging = true;
          skwStartX = e.clientX;
          skwLastX = e.clientX;
        });
        window.addEventListener('mousemove', function (e) {
          if (!skwDragging) return;
          var dx = e.clientX - skwLastX;
          skwLastX = e.clientX;
          skwTarget = Math.max(-skwMax, Math.min(0, skwTarget + dx));
        });
        window.addEventListener('mouseup', function () {
          skwDragging = false;
        });

        if (btnNext) {
          btnNext.addEventListener('click', function () {
            skwTarget = Math.max(-skwMax, skwTarget - 340);
          });
        }
        if (btnPrev) {
          btnPrev.addEventListener('click', function () {
            skwTarget = Math.min(0, skwTarget + 340);
          });
        }

        gsap.ticker.add(function () {
          var diff = skwTarget - skwPos;
          skwPos += diff * 0.12;
          var skew = gsap.utils.clamp(-12, 12, diff * 0.08);
          gsap.set(skwTrack, { x: skwPos, skewX: -skew });
        });
      }
    }

    // 2. Circular 3D Gallery Carousel
    var circSec = root.querySelector('[data-rb-circle-gallery]');
    if (circSec) {
      var circRing = circSec.querySelector('[data-rb-circle-ring]');
      if (circRing) {
        var cRot = 0;
        var cTargetRot = 0;
        var cDragging = false;
        var cStartX = 0;
        var cAutoSpeed = 0.18;

        circRing.addEventListener('mousedown', function (e) {
          cDragging = true;
          cStartX = e.clientX;
        });
        window.addEventListener('mousemove', function (e) {
          if (!cDragging) return;
          var dx = e.clientX - cStartX;
          cStartX = e.clientX;
          cTargetRot += dx * 0.4;
        });
        window.addEventListener('mouseup', function () {
          cDragging = false;
        });

        gsap.ticker.add(function () {
          if (!cDragging) {
            cTargetRot += cAutoSpeed;
          }
          cRot += (cTargetRot - cRot) * 0.1;
          gsap.set(circRing, { rotateY: cRot });
        });
      }
    }

    // 3. Gradient Depth 3D Carousel
    var depthCarouselSec = root.querySelector('[data-rb-gradient-depth]');
    if (depthCarouselSec) {
      var dCards = depthCarouselSec.querySelectorAll('.uik-rb-depth-card');
      var dGlow = depthCarouselSec.querySelector('[data-rb-depth-glow]');
      var dPrev = depthCarouselSec.querySelector('[data-rb-prev="depth"]');
      var dNext = depthCarouselSec.querySelector('[data-rb-next="depth"]');
      var dActive = 0;

      function renderDepthCards() {
        dCards.forEach(function (card, i) {
          var offset = (i - dActive + dCards.length) % dCards.length;
          if (offset > dCards.length / 2) offset -= dCards.length;

          var z = -Math.abs(offset) * 120;
          var x = offset * 180;
          var rotY = offset * -25;
          var op = offset === 0 ? 1 : Math.max(0.2, 1 - Math.abs(offset) * 0.4);
          var blur = Math.abs(offset) * 3;

          gsap.to(card, {
            x: x,
            z: z,
            rotateY: rotY,
            opacity: op,
            filter: 'blur(' + blur + 'px)',
            duration: 0.6,
            ease: 'power3.out'
          });

          if (offset === 0 && dGlow) {
            var glowColor = card.dataset.glow || '#C8862B';
            dGlow.style.backgroundColor = glowColor;
          }
        });
      }
      renderDepthCards();

      if (dNext) {
        dNext.addEventListener('click', function () {
          dActive = (dActive + 1) % dCards.length;
          renderDepthCards();
        });
      }
      if (dPrev) {
        dPrev.addEventListener('click', function () {
          dActive = (dActive - 1 + dCards.length) % dCards.length;
          renderDepthCards();
        });
      }
    }

    // 4. Asynchronous Drift Wall Slider
    var driftSec = root.querySelector('[data-rb-drift-wall]');
    if (driftSec) {
      driftSec.querySelectorAll('[data-rb-drift-row]').forEach(function (row) {
        var original = row.innerHTML;
        row.innerHTML = original + original + original;
        var speed = parseFloat(row.dataset.speed) || 20;
        var dir = parseFloat(row.dataset.dir) || 1;

        var driftTween = gsap.fromTo(row,
          { xPercent: dir > 0 ? 0 : -33.33 },
          {
            xPercent: dir > 0 ? -33.33 : 0,
            duration: speed,
            ease: 'none',
            repeat: -1
          }
        );

        row.addEventListener('mouseenter', function () { driftTween.timeScale(0.3); });
        row.addEventListener('mouseleave', function () { driftTween.timeScale(1); });
      });
    }

    // 5. Liquid Morph Banner Slider
    var morphSec = root.querySelector('[data-rb-morph-slider]');
    if (morphSec) {
      var morphSlides = morphSec.querySelectorAll('.uik-rb-morph-slide');
      var morphBar = morphSec.querySelector('[data-rb-morph-bar]');
      var mPrev = morphSec.querySelector('[data-rb-prev="morph"]');
      var mNext = morphSec.querySelector('[data-rb-next="morph"]');
      var mIndex = 0;
      var mTimer = null;

      function showMorphSlide(idx) {
        var cur = morphSlides[mIndex];
        var next = morphSlides[idx];
        if (cur === next) return;

        mIndex = idx;
        morphSlides.forEach(function (s) { s.classList.remove('uik-is-active'); });
        next.classList.add('uik-is-active');

        var cap = next.querySelector('.uik-rb-morph-caption');
        gsap.fromTo(next,
          { clipPath: 'circle(0% at 50% 50%)', opacity: 0.8 },
          { clipPath: 'circle(100% at 50% 50%)', opacity: 1, duration: 0.9, ease: 'power3.inOut' }
        );
        if (cap) {
          gsap.fromTo(cap.children,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
          );
        }
        resetMorphTimer();
      }

      function resetMorphTimer() {
        if (mTimer) mTimer.kill();
        if (morphBar) {
          mTimer = gsap.fromTo(morphBar, { width: '0%' }, {
            width: '100%',
            duration: 4.5,
            ease: 'none',
            onComplete: function () {
              showMorphSlide((mIndex + 1) % morphSlides.length);
            }
          });
        }
      }
      resetMorphTimer();

      if (mNext) {
        mNext.addEventListener('click', function () {
          showMorphSlide((mIndex + 1) % morphSlides.length);
        });
      }
      if (mPrev) {
        mPrev.addEventListener('click', function () {
          showMorphSlide((mIndex - 1 + morphSlides.length) % morphSlides.length);
        });
      }
    }

    // 6. Elastic Draggable Ribbon Slider
    var elSec = root.querySelector('[data-rb-elastic-slider]');
    if (elSec) {
      var elViewport = elSec.querySelector('.uik-rb-elastic-viewport');
      var elTrack = elSec.querySelector('[data-rb-elastic-track]');
      if (elViewport && elTrack) {
        var elPos = 0;
        var elTarget = 0;
        var elMax = 0;
        var elDragging = false;
        var elLastX = 0;

        function updateElBounds() {
          elMax = Math.max(0, elTrack.scrollWidth - elViewport.clientWidth);
        }
        updateElBounds();
        window.addEventListener('resize', updateElBounds, { passive: true });

        elViewport.addEventListener('mousedown', function (e) {
          elDragging = true;
          elLastX = e.clientX;
        });
        window.addEventListener('mousemove', function (e) {
          if (!elDragging) return;
          var dx = e.clientX - elLastX;
          elLastX = e.clientX;
          elTarget += dx;
          if (elTarget > 0) elTarget = elTarget * 0.35;
          if (elTarget < -elMax) elTarget = -elMax + (elTarget + elMax) * 0.35;
        });
        window.addEventListener('mouseup', function () {
          if (!elDragging) return;
          elDragging = false;
          if (elTarget > 0) elTarget = 0;
          if (elTarget < -elMax) elTarget = -elMax;
        });

        gsap.ticker.add(function () {
          elPos += (elTarget - elPos) * 0.15;
          gsap.set(elTrack, { x: elPos });
        });
      }
    }

    // 7. Lenticular 3D Coverflow Slider
    var covSec = root.querySelector('[data-rb-lenticular-carousel]');
    if (covSec) {
      var covItems = covSec.querySelectorAll('.uik-rb-coverflow-item');
      var covPrev = covSec.querySelector('[data-rb-prev="lenticular"]');
      var covNext = covSec.querySelector('[data-rb-next="lenticular"]');
      var covActive = 2;

      function renderCoverflow() {
        covItems.forEach(function (item, i) {
          var diff = i - covActive;
          if (diff === 0) {
            gsap.to(item, {
              x: 0,
              z: 80,
              rotateY: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out'
            });
          } else {
            var x = diff * 110;
            var r = diff < 0 ? 45 : -45;
            gsap.to(item, {
              x: x,
              z: -60,
              rotateY: r,
              opacity: 0.65,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        });
      }
      renderCoverflow();

      covItems.forEach(function (item, idx) {
        item.addEventListener('click', function () {
          covActive = idx;
          renderCoverflow();
        });
      });

      if (covNext) {
        covNext.addEventListener('click', function () {
          covActive = Math.min(covItems.length - 1, covActive + 1);
          renderCoverflow();
        });
      }
      if (covPrev) {
        covPrev.addEventListener('click', function () {
          covActive = Math.max(0, covActive - 1);
          renderCoverflow();
        });
      }
    }

    // 8. Expanding Accordion Gallery Banner
    var accSec = root.querySelector('[data-rb-accordion-gallery]');
    if (accSec) {
      var accCols = accSec.querySelectorAll('[data-rb-col]');
      accCols.forEach(function (col) {
        col.addEventListener('mouseenter', function () {
          accCols.forEach(function (c) { c.classList.remove('uik-is-expanded'); });
          col.classList.add('uik-is-expanded');
        });
        col.addEventListener('click', function () {
          accCols.forEach(function (c) { c.classList.remove('uik-is-expanded'); });
          col.classList.add('uik-is-expanded');
        });
      });
    }

    // 9. Interactive Split Comparison Slider
    var compSec = root.querySelector('[data-rb-comparison-slider]');
    if (compSec) {
      var compBox = compSec.querySelector('[data-rb-comp-box]');
      var compBefore = compSec.querySelector('[data-rb-comp-before]');
      var compHandle = compSec.querySelector('[data-rb-comp-handle]');
      if (compBox && compBefore && compHandle) {
        var compDragging = false;
        function setCompPosition(clientX) {
          var r = compBox.getBoundingClientRect();
          var pct = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
          compBefore.style.width = pct + '%';
          compHandle.style.left = pct + '%';
        }
        compBox.addEventListener('mousedown', function (e) {
          compDragging = true;
          setCompPosition(e.clientX);
        });
        window.addEventListener('mousemove', function (e) {
          if (!compDragging) return;
          setCompPosition(e.clientX);
        });
        window.addEventListener('mouseup', function () {
          compDragging = false;
        });
      }
    }

    // 10. 3D Tumble Card Carousel
    var tumSec = root.querySelector('[data-rb-tumble-carousel]');
    if (tumSec) {
      var tumCards = tumSec.querySelectorAll('.uik-rb-tumble-card');
      var tumPrev = tumSec.querySelector('[data-rb-prev="tumble"]');
      var tumNext = tumSec.querySelector('[data-rb-next="tumble"]');
      var tumActive = 0;

      function showTumbleSlide(nextIdx) {
        var cur = tumCards[tumActive];
        var next = tumCards[nextIdx];
        if (cur === next) return;

        tumActive = nextIdx;
        gsap.to(cur, {
          rotateX: -90,
          y: -40,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: function () {
            cur.classList.remove('uik-is-active');
          }
        });

        next.classList.add('uik-is-active');
        gsap.fromTo(next,
          { rotateX: 90, y: 40, opacity: 0 },
          { rotateX: 0, y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: 'back.out(1.5)' }
        );
      }

      if (tumNext) {
        tumNext.addEventListener('click', function () {
          showTumbleSlide((tumActive + 1) % tumCards.length);
        });
      }
      if (tumPrev) {
        tumPrev.addEventListener('click', function () {
          showTumbleSlide((tumActive - 1 + tumCards.length) % tumCards.length);
        });
      }
    }

    // 11. Bounce Card Deck Slider
    var bounceSec = root.querySelector('[data-rb-bounce-deck]');
    if (bounceSec) {
      var deckBtn = bounceSec.querySelector('[data-rb-bounce-next]');
      var deckCards = Array.from(bounceSec.querySelectorAll('.uik-rb-deck-card'));

      function updateDeckLayout() {
        deckCards.forEach(function (card, i) {
          var rot = (i === 0 ? 0 : i === 1 ? 4 : i === 2 ? -4 : 2);
          var scale = 1 - i * 0.05;
          var y = i * 14;
          var z = -i * 30;
          gsap.to(card, {
            x: 0,
            y: y,
            z: z,
            rotate: rot,
            scale: scale,
            zIndex: 10 - i,
            filter: i === 0 ? 'brightness(1)' : 'brightness(' + (1 - i * 0.12) + ')',
            duration: 0.5,
            ease: 'power2.out'
          });
        });
      }
      updateDeckLayout();

      if (deckBtn) {
        deckBtn.addEventListener('click', function () {
          if (deckCards.length < 2) return;
          var topCard = deckCards.shift();
          deckCards.push(topCard);

          gsap.to(topCard, {
            x: 280,
            y: -40,
            rotate: 25,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: function () {
              updateDeckLayout();
              gsap.fromTo(topCard,
                { x: -140, y: 60, rotate: -15, opacity: 0 },
                { x: 0, y: (deckCards.length - 1) * 14, rotate: 2, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
              );
            }
          });
        });
      }
    }

    /* ==========================================================================
       KIT—09 / MODERN HERO & BANNER SLIDER SUITE JAVASCRIPT LOGIC
       ========================================================================== */

    // 1. 3D Prism Cube Roll Slider
    var cubeSec = root.querySelector('[data-mod-cube-slider]');
    if (cubeSec) {
      var cubeBox = cubeSec.querySelector('[data-mod-cube-box]');
      var cubePrev = cubeSec.querySelector('[data-mod-prev="cube"]');
      var cubeNext = cubeSec.querySelector('[data-mod-next="cube"]');
      var cubeAngle = 0;

      function rotateCube(dir) {
        cubeAngle += dir * 90;
        gsap.to(cubeBox, {
          rotateX: cubeAngle,
          duration: 0.9,
          ease: 'power3.inOut'
        });
      }

      if (cubeNext) {
        cubeNext.addEventListener('click', function () { rotateCube(1); });
      }
      if (cubePrev) {
        cubePrev.addEventListener('click', function () { rotateCube(-1); });
      }
    }

    // 2. Infinite Dual-Lane Angled Marquee Stream
    var streamSec = root.querySelector('[data-mod-marquee-stream]');
    if (streamSec) {
      streamSec.querySelectorAll('[data-mod-stream-lane]').forEach(function (lane) {
        var original = lane.innerHTML;
        lane.innerHTML = original + original + original;
        var dir = parseFloat(lane.dataset.dir) || 1;
        var streamTween = gsap.fromTo(lane,
          { xPercent: dir > 0 ? 0 : -33.33 },
          {
            xPercent: dir > 0 ? -33.33 : 0,
            duration: 25,
            ease: 'none',
            repeat: -1
          }
        );
        lane.addEventListener('mouseenter', function () { streamTween.timeScale(0.2); });
        lane.addEventListener('mouseleave', function () { streamTween.timeScale(1); });
      });
    }

    // 3. Cinematic Filmstrip Reel Slider
    var filmSec = root.querySelector('[data-mod-filmstrip]');
    if (filmSec) {
      var filmTrack = filmSec.querySelector('[data-mod-film-track]');
      var filmFrames = filmSec.querySelectorAll('.uik-mod-film-frame');
      var filmPrev = filmSec.querySelector('[data-mod-prev="film"]');
      var filmNext = filmSec.querySelector('[data-mod-next="film"]');
      var filmActive = 1;

      function updateFilmstrip() {
        filmFrames.forEach(function (frame, i) {
          frame.classList.toggle('uik-is-focused', i === filmActive);
        });
        if (filmTrack) {
          var targetOffset = -(filmActive * 490 - 100);
          gsap.to(filmTrack, { x: targetOffset, duration: 0.6, ease: 'power3.out' });
        }
      }
      updateFilmstrip();

      if (filmNext) {
        filmNext.addEventListener('click', function () {
          filmActive = Math.min(filmFrames.length - 1, filmActive + 1);
          updateFilmstrip();
        });
      }
      if (filmPrev) {
        filmPrev.addEventListener('click', function () {
          filmActive = Math.max(0, filmActive - 1);
          updateFilmstrip();
        });
      }
    }

    // 4. Interactive Multi-Layer Parallax Hero Banner
    var p規HeroSec = root.querySelector('[data-mod-parallax-hero]');
    if (p規HeroSec) {
      var heroBox = p規HeroSec.querySelector('[data-mod-hero-box]');
      var depthLayers = p規HeroSec.querySelectorAll('[data-depth]');
      if (heroBox && depthLayers.length) {
        heroBox.addEventListener('mousemove', function (e) {
          var r = heroBox.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;

          depthLayers.forEach(function (layer) {
            var d = parseFloat(layer.dataset.depth) || 0.2;
            gsap.to(layer, {
              x: px * d * 70,
              y: py * d * 70,
              duration: 0.4,
              ease: 'power2.out'
            });
          });
        }, { passive: true });

        heroBox.addEventListener('mouseleave', function () {
          depthLayers.forEach(function (layer) {
            gsap.to(layer, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
          });
        });
      }
    }

    // 5. Venetian Blind Shutter Transition Slider
    var venSec = root.querySelector('[data-mod-venetian-slider]');
    if (venSec) {
      var slatsWrap = venSec.querySelector('[data-mod-vslats]');
      var vTitle = venSec.querySelector('[data-mod-vtitle]');
      var vPrev = venSec.querySelector('[data-mod-prev="venetian"]');
      var vNext = venSec.querySelector('[data-mod-next="venetian"]');

      var vImages = [
        'https://picsum.photos/seed/uikven1/1100/550',
        'https://picsum.photos/seed/uikven2/1100/550',
        'https://picsum.photos/seed/uikven3/1100/550'
      ];
      var vTitles = ['SYNTHETIC HORIZONS', 'PARAMETRIC VECTOR', 'QUANTUM MONOLITH'];
      var vActive = 0;
      var slatCount = 8;

      if (slatsWrap) {
        slatsWrap.innerHTML = '';
        for (var s = 0; s < slatCount; s++) {
          var slat = document.createElement('div');
          slat.className = 'uik-mod-vslat';
          var pct = (s / (slatCount - 1)) * 100;
          slat.innerHTML =
            '<div class="uik-mod-vslat-face uik-mod-vslat-face--front" style="background-image:url(' + vImages[0] + '); background-position:' + pct + '% center;"></div>' +
            '<div class="uik-mod-vslat-face uik-mod-vslat-face--back" style="background-image:url(' + vImages[1] + '); background-position:' + pct + '% center;"></div>';
          slatsWrap.appendChild(slat);
        }

        var isFlipped = false;
        function transitionVenetian(nextIdx) {
          var slats = slatsWrap.querySelectorAll('.uik-mod-vslat');
          var nextImg = vImages[nextIdx];
          vActive = nextIdx;

          if (vTitle) vTitle.textContent = vTitles[vActive];

          slats.forEach(function (slat, i) {
            var frontFace = slat.querySelector('.uik-mod-vslat-face--front');
            var backFace = slat.querySelector('.uik-mod-vslat-face--back');

            if (!isFlipped) {
              backFace.style.backgroundImage = 'url(' + nextImg + ')';
            } else {
              frontFace.style.backgroundImage = 'url(' + nextImg + ')';
            }

            gsap.to(slat, {
              rotateY: isFlipped ? 0 : 180,
              duration: 0.8,
              delay: i * 0.05,
              ease: 'power3.inOut'
            });
          });
          isFlipped = !isFlipped;
        }

        if (vNext) {
          vNext.addEventListener('click', function () {
            transitionVenetian((vActive + 1) % vImages.length);
          });
        }
        if (vPrev) {
          vPrev.addEventListener('click', function () {
            transitionVenetian((vActive - 1 + vImages.length) % vImages.length);
          });
        }
      }
    }

    // 6. Curved Ribbon Arch Carousel
    var crvSec = root.querySelector('[data-mod-curved-ribbon]');
    if (crvSec) {
      var crvTrack = crvSec.querySelector('[data-mod-curved-track]');
      var crvCards = crvSec.querySelectorAll('.uik-mod-curved-card');
      if (crvTrack && crvCards.length) {
        var crvPos = 0;
        var crvTarget = 0;
        var crvDragging = false;
        var crvStartX = 0;

        crvTrack.addEventListener('mousedown', function (e) {
          crvDragging = true;
          crvStartX = e.clientX;
        });
        window.addEventListener('mousemove', function (e) {
          if (!crvDragging) return;
          var dx = e.clientX - crvStartX;
          crvStartX = e.clientX;
          crvTarget += dx * 1.2;
        });
        window.addEventListener('mouseup', function () { crvDragging = false; });

        gsap.ticker.add(function () {
          crvPos += (crvTarget - crvPos) * 0.1;
          gsap.set(crvTrack, { x: crvPos });

          crvCards.forEach(function (card) {
            var r = card.getBoundingClientRect();
            var centerDist = (r.left + r.width / 2) - (window.innerWidth / 2);
            var norm = centerDist / (window.innerWidth / 2);
            var z = -Math.abs(norm) * 160;
            var ry = norm * -22;
            gsap.set(card, { z: z, rotateY: ry });
          });
        });
      }
    }

    // 7. Gesture-Driven Card Swiper Deck
    var swipSec = root.querySelector('[data-mod-card-swiper]');
    if (swipSec) {
      var swiCards = Array.from(swipSec.querySelectorAll('.uik-mod-swiper-card'));
      var swiYes = swipSec.querySelector('[data-swipe="right"]');
      var swiNo = swipSec.querySelector('[data-swipe="left"]');

      function updateSwiperStack() {
        swiCards.forEach(function (card, i) {
          gsap.to(card, {
            x: 0,
            y: i * 12,
            scale: 1 - i * 0.05,
            zIndex: 10 - i,
            rotate: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
      }
      updateSwiperStack();

      function tossCard(dir) {
        if (swiCards.length < 2) return;
        var top = swiCards.shift();
        swiCards.push(top);

        gsap.to(top, {
          x: dir * 350,
          y: -50,
          rotate: dir * 30,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: function () {
            updateSwiperStack();
            gsap.fromTo(top,
              { x: -dir * 100, y: 50, opacity: 0, rotate: -dir * 10 },
              { x: 0, y: (swiCards.length - 1) * 12, opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.4)' }
            );
          }
        });
      }

      if (swiYes) swiYes.addEventListener('click', function () { tossCard(1); });
      if (swiNo) swiNo.addEventListener('click', function () { tossCard(-1); });
    }

    // 8. Rotary Mechanical Dial Navigator Slider
    var dialSec = root.querySelector('[data-mod-dial-slider]');
    if (dialSec) {
      var dialWheel = dialSec.querySelector('[data-mod-dial-wheel]');
      var dialNodes = dialSec.querySelectorAll('.uik-mod-dial-node');
      var dialImg = dialSec.querySelector('[data-mod-dial-img]');
      var dialTitle = dialSec.querySelector('[data-mod-dial-title]');

      var dialData = [
        { title: 'Quantum Core Architecture', img: 'https://picsum.photos/seed/uikdial1/400/280' },
        { title: 'Harmonic Signal Mesh', img: 'https://picsum.photos/seed/uikdial2/400/280' },
        { title: 'Spatial Matrix Engine', img: 'https://picsum.photos/seed/uikdial3/400/280' },
        { title: 'Synaptic Fluid Nodes', img: 'https://picsum.photos/seed/uikdial4/400/280' }
      ];

      dialNodes.forEach(function (node, i) {
        var angle = i * (360 / dialNodes.length);
        var rad = 65;
        var nx = rad * Math.cos(angle * Math.PI / 180);
        var ny = rad * Math.sin(angle * Math.PI / 180);
        gsap.set(node, { x: nx, y: ny });

        node.addEventListener('click', function () {
          dialNodes.forEach(function (n) { n.classList.remove('uik-is-active'); });
          node.classList.add('uik-is-active');

          if (dialWheel) {
            gsap.to(dialWheel, { rotate: -angle, duration: 0.6, ease: 'back.out(1.5)' });
          }
          if (dialImg) dialImg.src = dialData[i].img;
          if (dialTitle) dialTitle.textContent = dialData[i].title;
        });
      });
    }

    // 9. Display Typography Mask Slide Showcase
    var textMaskSecMod = root.querySelector('[data-mod-text-backdrop]');
    if (textMaskSecMod) {
      var tmBg = textMaskSecMod.querySelector('[data-mod-textmask-bg]');
      var tmWord = textMaskSecMod.querySelector('[data-mod-textmask-word]');
      var tmNum = textMaskSecMod.querySelector('[data-mod-textmask-num]');
      var tmPrev = textMaskSecMod.querySelector('[data-mod-prev="textmask"]');
      var tmNext = textMaskSecMod.querySelector('[data-mod-next="textmask"]');

      var tmSlides = [
        { word: 'CREATIVE', img: 'https://picsum.photos/seed/uiktm1/1200/600', num: '01 / 04' },
        { word: 'KINETIC', img: 'https://picsum.photos/seed/uiktm2/1200/600', num: '02 / 04' },
        { word: 'DYNAMIC', img: 'https://picsum.photos/seed/uiktm3/1200/600', num: '03 / 04' },
        { word: 'ORGANIC', img: 'https://picsum.photos/seed/uiktm4/1200/600', num: '04 / 04' }
      ];
      var tmIndex = 0;

      function renderTextMaskSlide(idx) {
        tmIndex = idx;
        var s = tmSlides[tmIndex];
        if (tmBg) tmBg.style.backgroundImage = 'url(' + s.img + ')';
        if (tmWord) {
          gsap.fromTo(tmWord,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' }
          );
          tmWord.textContent = s.word;
        }
        if (tmNum) tmNum.textContent = s.num;
      }
      renderTextMaskSlide(0);

      if (tmNext) {
        tmNext.addEventListener('click', function () {
          renderTextMaskSlide((tmIndex + 1) % tmSlides.length);
        });
      }
      if (tmPrev) {
        tmPrev.addEventListener('click', function () {
          renderTextMaskSlide((tmIndex - 1 + tmSlides.length) % tmSlides.length);
        });
      }
    }

    // 10. Layered Iridescent Glass Carousel
    var gSec = root.querySelector('[data-mod-glass-carousel]');
    if (gSec) {
      var gTrack = gSec.querySelector('[data-mod-glass-track]');
      var gCards = gSec.querySelectorAll('.uik-mod-glass-card');
      if (gTrack) {
        var gPos = 0;
        var gTarget = 0;
        var gDragging = false;
        var gStartX = 0;

        gTrack.addEventListener('mousedown', function (e) {
          gDragging = true;
          gStartX = e.clientX;
        });
        window.addEventListener('mousemove', function (e) {
          if (!gDragging) return;
          var dx = e.clientX - gStartX;
          gStartX = e.clientX;
          gTarget = Math.max(-500, Math.min(0, gTarget + dx));
        });
        window.addEventListener('mouseup', function () { gDragging = false; });

        gsap.ticker.add(function () {
          gPos += (gTarget - gPos) * 0.12;
          gsap.set(gTrack, { x: gPos });
        });
      }
    }

    // 11. Waveform Harmonic Banner Slider
    var waveSecMod = root.querySelector('[data-mod-wave-slider]');
    if (waveSecMod) {
      var waveCanvas = waveSecMod.querySelector('[data-mod-wave-canvas]');
      var waveImg = waveSecMod.querySelector('[data-mod-wave-img]');
      var waveTitle = waveSecMod.querySelector('[data-mod-wave-title]');
      var wavePrev = waveSecMod.querySelector('[data-mod-prev="wave"]');
      var waveNext = waveSecMod.querySelector('[data-mod-next="wave"]');

      var waveSlides = [
        { title: 'SONIC RESONANCE', img: 'https://picsum.photos/seed/uikwvsl1/1100/480' },
        { title: 'FREQUENCY MODULATION', img: 'https://picsum.photos/seed/uikwvsl2/1100/480' },
        { title: 'HARMONIC PULSE', img: 'https://picsum.photos/seed/uikwvsl3/1100/480' }
      ];
      var waveActive = 0;

      function renderWaveSlide(idx) {
        waveActive = idx;
        var s = waveSlides[waveActive];
        if (waveImg) {
          gsap.fromTo(waveImg, { opacity: 0.4, scale: 1.04 }, { opacity: 0.5, scale: 1, duration: 0.6, ease: 'power2.out' });
          waveImg.src = s.img;
        }
        if (waveTitle) waveTitle.textContent = s.title;
      }

      if (waveNext) {
        waveNext.addEventListener('click', function () {
          renderWaveSlide((waveActive + 1) % waveSlides.length);
        });
      }
      if (wavePrev) {
        wavePrev.addEventListener('click', function () {
          renderWaveSlide((waveActive - 1 + waveSlides.length) % waveSlides.length);
        });
      }

      if (waveCanvas) {
        var wctx = waveCanvas.getContext('2d');
        var wW, wH;
        function resizeWave() {
          wW = waveCanvas.width = waveCanvas.offsetWidth;
          wH = waveCanvas.height = waveCanvas.offsetHeight;
        }
        resizeWave();
        window.addEventListener('resize', resizeWave, { passive: true });

        var phase = 0;
        gsap.ticker.add(function () {
          if (!wctx || !wW) return;
          wctx.clearRect(0, 0, wW, wH);
          phase += 0.04;

          wctx.strokeStyle = '#C8862B';
          wctx.lineWidth = 2.5;
          wctx.beginPath();
          for (var x = 0; x < wW; x += 5) {
            var y = (wH / 2) + Math.sin(x * 0.015 + phase) * 35 * Math.sin(x * 0.005 + phase * 0.5);
            if (x === 0) wctx.moveTo(x, y);
            else wctx.lineTo(x, y);
          }
          wctx.stroke();

          wctx.strokeStyle = '#2F8F72';
          wctx.lineWidth = 1.5;
          wctx.beginPath();
          for (var x2 = 0; x2 < wW; x2 += 5) {
            var y2 = (wH / 2) + Math.sin(x2 * 0.02 - phase) * 20;
            if (x2 === 0) wctx.moveTo(x2, y2);
            else wctx.lineTo(x2, y2);
          }
          wctx.stroke();
        });
      }
    }

    /* ==========================================================================
       KIT—10 / AWWWARDS KINETIC PRELOADERS & LOADERS SUITE (12+ LOADERS)
       ========================================================================== */
    var loadersSection = root.querySelector('#kit-loaders');
    if (loadersSection) {

      // 1. Counter Ticker & Shutter Split
      var ldr1Card = loadersSection.querySelector('[data-ldr-card="counter-split"]');
      if (ldr1Card) {
        var numEl = ldr1Card.querySelector('[data-ldr-counter-num]');
        var topS = ldr1Card.querySelector('[data-ldr-shutter-top]');
        var botS = ldr1Card.querySelector('[data-ldr-shutter-bottom]');
        var btn1 = ldr1Card.querySelector('[data-ldr-replay="counter-split"]');

        function playLdr1() {
          gsap.killTweensOf([topS, botS, numEl]);
          gsap.set([topS, botS], { yPercent: 0 });
          gsap.set(numEl, { opacity: 1, scale: 1 });
          var obj = { val: 0 };
          gsap.to(obj, {
            val: 100,
            duration: 1.8,
            ease: 'power2.inOut',
            onUpdate: function () {
              if (numEl) numEl.textContent = Math.floor(obj.val).toString().padStart(2, '0') + '%';
            },
            onComplete: function () {
              gsap.to(numEl, { scale: 1.2, opacity: 0, duration: 0.3 });
              gsap.to(topS, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' });
              gsap.to(botS, { yPercent: 100, duration: 0.7, ease: 'power4.inOut' });
            }
          });
        }

        if (btn1) btn1.addEventListener('click', playLdr1);
        ScrollTrigger.create({ trigger: ldr1Card, start: 'top 80%', onEnter: playLdr1 });
      }

      // 2. Morphing Geometric SVG Monogram
      var ldr2Card = loadersSection.querySelector('[data-ldr-card="svg-morph"]');
      if (ldr2Card) {
        var poly = ldr2Card.querySelector('[data-ldr-morph-poly]');
        var btn2 = ldr2Card.querySelector('[data-ldr-replay="svg-morph"]');
        var shapes = [
          '50,15 85,50 50,85 15,50',       // Diamond
          '20,20 80,20 80,80 20,80',       // Square
          '50,12 88,80 12,80 50,12',       // Triangle
          '50,10 90,38 74,85 26,85 10,38'  // Pentagon
        ];
        var sIdx = 0;
        var morphTl = gsap.timeline({ repeat: -1 });
        shapes.forEach(function (pts, i) {
          morphTl.to(poly, {
            attr: { points: pts },
            duration: 0.9,
            ease: 'power3.inOut'
          }, '+=' + 0.3);
        });
        gsap.to(ldr2Card.querySelector('.uik-ldr-svg-wrap'), {
          rotate: 360,
          duration: 10,
          repeat: -1,
          ease: 'none'
        });
        if (btn2) {
          btn2.addEventListener('click', function () {
            morphTl.restart();
          });
        }
      }

      // 3. Cinematic Film Grain Curtain Unveil
      var ldr3Card = loadersSection.querySelector('[data-ldr-card="curtain-unveil"]');
      if (ldr3Card) {
        var slats = ldr3Card.querySelectorAll('.uik-ldr-curtain-slat');
        var btn3 = ldr3Card.querySelector('[data-ldr-replay="curtain-unveil"]');
        function playLdr3() {
          gsap.set(slats, { scaleY: 1 });
          gsap.to(slats, {
            scaleY: 0,
            duration: 0.8,
            ease: 'power4.inOut',
            stagger: { each: 0.07, from: 'start' }
          });
        }
        if (btn3) btn3.addEventListener('click', playLdr3);
        ScrollTrigger.create({ trigger: ldr3Card, start: 'top 80%', onEnter: playLdr3 });
      }

      // 4. Multilingual Typography Cascade Drum
      var ldr4Card = loadersSection.querySelector('[data-ldr-card="type-cascade"]');
      if (ldr4Card) {
        var reel = ldr4Card.querySelector('[data-ldr-word-reel]');
        var btn4 = ldr4Card.querySelector('[data-ldr-replay="type-cascade"]');
        function playLdr4() {
          if (!reel) return;
          gsap.set(reel, { y: 0 });
          gsap.to(reel, {
            y: -220,
            duration: 2.2,
            ease: 'power3.inOut'
          });
        }
        if (btn4) btn4.addEventListener('click', playLdr4);
        ScrollTrigger.create({ trigger: ldr4Card, start: 'top 80%', onEnter: playLdr4 });
      }

      // 5. Liquid Fluid Metaball Droplet Fusion
      var ldr5Card = loadersSection.querySelector('[data-ldr-card="fluid-blob"]');
      if (ldr5Card) {
        var d1 = ldr5Card.querySelector('[data-ldr-dot="1"]');
        var d2 = ldr5Card.querySelector('[data-ldr-dot="2"]');
        var d3 = ldr5Card.querySelector('[data-ldr-dot="3"]');
        var btn5 = ldr5Card.querySelector('[data-ldr-replay="fluid-blob"]');

        var blobTl = gsap.timeline({ repeat: -1, yoyo: true });
        blobTl
          .to(d1, { x: 38, y: -20, duration: 1.2, ease: 'sine.inOut' }, 0)
          .to(d2, { x: -38, y: -20, duration: 1.2, ease: 'sine.inOut' }, 0)
          .to(d3, { x: 0, y: 36, duration: 1.2, ease: 'sine.inOut' }, 0);

        if (btn5) {
          btn5.addEventListener('click', function () {
            blobTl.restart();
          });
        }
      }

      // 6. 3D Orbital Gyroscope Rings
      var ldr6Card = loadersSection.querySelector('[data-ldr-card="gyroscope"]');
      if (ldr6Card) {
        var r1 = ldr6Card.querySelector('[data-ldr-gyro-r1]');
        var r2 = ldr6Card.querySelector('[data-ldr-gyro-r2]');
        var r3 = ldr6Card.querySelector('[data-ldr-gyro-r3]');
        var btn6 = ldr6Card.querySelector('[data-ldr-replay="gyroscope"]');
        gsap.to(r1, { rotateX: 360, duration: 2.4, repeat: -1, ease: 'none' });
        gsap.to(r2, { rotateY: 360, duration: 3.2, repeat: -1, ease: 'none' });
        gsap.to(r3, { rotateZ: 360, duration: 4.0, repeat: -1, ease: 'none' });
        if (btn6) {
          btn6.addEventListener('click', function () {
            gsap.fromTo([r1, r2, r3], { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2)' });
          });
        }
      }

      // 7. Sci-Fi Laser Grid Scanner
      var ldr7Card = loadersSection.querySelector('[data-ldr-card="laser-scan"]');
      if (ldr7Card) {
        var laserBar = ldr7Card.querySelector('[data-ldr-laser-bar]');
        var laserPct = ldr7Card.querySelector('[data-ldr-laser-pct]');
        var btn7 = ldr7Card.querySelector('[data-ldr-replay="laser-scan"]');

        function playLdr7() {
          gsap.killTweensOf(laserBar);
          gsap.fromTo(laserBar,
            { top: '5%' },
            { top: '95%', duration: 1.4, repeat: 2, yoyo: true, ease: 'sine.inOut' }
          );
          var lObj = { val: 0 };
          gsap.to(lObj, {
            val: 100,
            duration: 2.8,
            ease: 'power2.inOut',
            onUpdate: function () {
              if (laserPct) laserPct.textContent = Math.floor(lObj.val).toString().padStart(2, '0') + '%';
            }
          });
        }
        if (btn7) btn7.addEventListener('click', playLdr7);
        ScrollTrigger.create({ trigger: ldr7Card, start: 'top 80%', onEnter: playLdr7 });
      }

      // 8. Knockout Stencil Zoom Punch
      var ldr8Card = loadersSection.querySelector('[data-ldr-card="stencil-window"]');
      if (ldr8Card) {
        var mask = ldr8Card.querySelector('[data-ldr-stencil-mask]');
        var sText = ldr8Card.querySelector('[data-ldr-stencil-text]');
        var btn8 = ldr8Card.querySelector('[data-ldr-replay="stencil-window"]');

        function playLdr8() {
          gsap.set(mask, { opacity: 1 });
          gsap.set(sText, { scale: 1 });
          gsap.to(sText, {
            scale: 30,
            duration: 1.5,
            ease: 'power4.inOut',
            onComplete: function () {
              gsap.to(mask, { opacity: 0, duration: 0.3 });
            }
          });
        }
        if (btn8) btn8.addEventListener('click', playLdr8);
        ScrollTrigger.create({ trigger: ldr8Card, start: 'top 80%', onEnter: playLdr8 });
      }

      // 9. Precision Circular Dash Wheel
      var ldr9Card = loadersSection.querySelector('[data-ldr-card="circular-dash"]');
      if (ldr9Card) {
        var wheelBar = ldr9Card.querySelector('[data-ldr-wheel-bar]');
        var wheelReadout = ldr9Card.querySelector('[data-ldr-wheel-readout]');
        var btn9 = ldr9Card.querySelector('[data-ldr-replay="circular-dash"]');

        function playLdr9() {
          gsap.killTweensOf(wheelBar);
          gsap.set(wheelBar, { strokeDashoffset: 314 });
          var wObj = { val: 0 };
          gsap.to(wObj, {
            val: 100,
            duration: 2.2,
            ease: 'power3.inOut',
            onUpdate: function () {
              var offset = 314 - (314 * (wObj.val / 100));
              if (wheelBar) wheelBar.style.strokeDashoffset = offset;
              if (wheelReadout) wheelReadout.textContent = Math.floor(wObj.val) + '%';
            }
          });
        }
        if (btn9) btn9.addEventListener('click', playLdr9);
        ScrollTrigger.create({ trigger: ldr9Card, start: 'top 80%', onEnter: playLdr9 });
      }

      // 10. Quantum Constellation Particle Weaver
      var ldr10Card = loadersSection.querySelector('[data-ldr-card="quantum-weaver"]');
      if (ldr10Card) {
        var cWeaver = ldr10Card.querySelector('[data-ldr-canvas-weaver]');
        if (cWeaver) {
          var ctxW = cWeaver.getContext('2d');
          var cW = cWeaver.width = cWeaver.offsetWidth || 280;
          var cH = cWeaver.height = cWeaver.offsetHeight || 220;

          var nodes = [];
          var numNodes = 14;
          for (var ni = 0; ni < numNodes; ni++) {
            nodes.push({
              angle: (ni / numNodes) * Math.PI * 2,
              radius: 40 + (ni % 3) * 15,
              speed: 0.015 + (ni % 2) * 0.01,
              yOffset: (Math.random() - 0.5) * 30
            });
          }

          function renderWeaver() {
            if (!ctxW) return;
            ctxW.clearRect(0, 0, cW, cH);
            var cx = cW / 2;
            var cy = cH / 2;

            var points = nodes.map(function (n) {
              n.angle += n.speed;
              var px = cx + Math.cos(n.angle) * n.radius;
              var py = cy + Math.sin(n.angle) * (n.radius * 0.4) + n.yOffset;
              return { x: px, y: py };
            });

            // Draw connecting lattice lines
            ctxW.strokeStyle = 'rgba(200, 134, 43, 0.25)';
            ctxW.lineWidth = 1;
            for (var a = 0; a < points.length; a++) {
              for (var b = a + 1; b < points.length; b++) {
                var dist = Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);
                if (dist < 70) {
                  ctxW.beginPath();
                  ctxW.moveTo(points[a].x, points[a].y);
                  ctxW.lineTo(points[b].x, points[b].y);
                  ctxW.stroke();
                }
              }
            }

            // Draw glowing vertex nodes
            points.forEach(function (pt, idx) {
              ctxW.fillStyle = idx % 2 === 0 ? '#C8862B' : '#2F8F72';
              ctxW.beginPath();
              ctxW.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
              ctxW.fill();
            });

            requestAnimationFrame(renderWeaver);
          }
          renderWeaver();

          var btn10 = ldr10Card.querySelector('[data-ldr-replay="quantum-weaver"]');
          if (btn10) {
            btn10.addEventListener('click', function () {
              nodes.forEach(function (n) {
                n.speed = 0.08;
              });
              gsap.to(nodes, {
                speed: 0.015,
                duration: 1.5,
                ease: 'power3.out'
              });
            });
          }
        }
      }

      // 11. Venetian Horizontal Shutter
      var ldr11Card = loadersSection.querySelector('[data-ldr-card="venetian-shutter"]');
      if (ldr11Card) {
        var vSlats = ldr11Card.querySelectorAll('.uik-ldr-venetian-slat');
        var btn11 = ldr11Card.querySelector('[data-ldr-replay="venetian-shutter"]');

        function playLdr11() {
          gsap.set(vSlats, { scaleX: 1 });
          gsap.to(vSlats, {
            scaleX: 0,
            duration: 0.75,
            ease: 'power4.out',
            stagger: { each: 0.05, from: 'random' }
          });
        }
        if (btn11) btn11.addEventListener('click', playLdr11);
        ScrollTrigger.create({ trigger: ldr11Card, start: 'top 80%', onEnter: playLdr11 });
      }

      // 12. Golden Horizon Specular Eclipse
      var ldr12Card = loadersSection.querySelector('[data-ldr-card="specular-eclipse"]');
      if (ldr12Card) {
        var disk = ldr12Card.querySelector('[data-ldr-eclipse-disk]');
        var eTitle = ldr12Card.querySelector('[data-ldr-eclipse-title]');
        var btn12 = ldr12Card.querySelector('[data-ldr-replay="specular-eclipse"]');

        function playLdr12() {
          gsap.set(disk, { x: -60, scale: 0.85 });
          gsap.set(eTitle, { opacity: 0, scale: 0.8 });
          var eTl = gsap.timeline();
          eTl
            .to(disk, { x: 0, scale: 1, duration: 1.4, ease: 'power2.inOut' })
            .to(eTitle, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4');
        }
        if (btn12) btn12.addEventListener('click', playLdr12);
        ScrollTrigger.create({ trigger: ldr12Card, start: 'top 80%', onEnter: playLdr12 });
      }

      // 13. 3D Holographic Prismatic Cube
      var ldr13Card = loadersSection.querySelector('[data-ldr-card="holo-cube"]');
      if (ldr13Card) {
        var cubeBox = ldr13Card.querySelector('[data-ldr-cube-box]');
        var btn13 = ldr13Card.querySelector('[data-ldr-replay="holo-cube"]');
        var cubeTween = gsap.to(cubeBox, {
          rotateX: 335,
          rotateY: 405,
          rotateZ: 360,
          duration: 7,
          repeat: -1,
          ease: 'none'
        });
        if (btn13) {
          btn13.addEventListener('click', function () {
            gsap.fromTo(cubeBox,
              { scale: 0.4, rotateX: 0, rotateY: 0 },
              { scale: 1, rotateX: 335, rotateY: 405, duration: 1.4, ease: 'back.out(2)' }
            );
          });
        }
      }

      // 14. Liquid Wave Fluid Level Tank
      var ldr14Card = loadersSection.querySelector('[data-ldr-card="wave-tank"]');
      if (ldr14Card) {
        var tankLayer = ldr14Card.querySelector('[data-ldr-tank-layer]');
        var tankPct = ldr14Card.querySelector('[data-ldr-tank-pct]');
        var tankCanvas = ldr14Card.querySelector('[data-ldr-tank-canvas]');
        var btn14 = ldr14Card.querySelector('[data-ldr-replay="wave-tank"]');

        if (tankCanvas) {
          var tCtx = tankCanvas.getContext('2d');
          tankCanvas.width = 120;
          tankCanvas.height = 20;
          var tPhase = 0;
          function drawWave() {
            if (!tCtx) return;
            tCtx.clearRect(0, 0, 120, 20);
            tCtx.fillStyle = '#2F8F72';
            tCtx.beginPath();
            tCtx.moveTo(0, 10);
            for (var tx = 0; tx <= 120; tx += 4) {
              var ty = 10 + Math.sin(tx * 0.08 + tPhase) * 5;
              tCtx.lineTo(tx, ty);
            }
            tCtx.lineTo(120, 20);
            tCtx.lineTo(0, 20);
            tCtx.closePath();
            tCtx.fill();
            tPhase += 0.06;
            requestAnimationFrame(drawWave);
          }
          drawWave();
        }

        function playLdr14() {
          if (!tankLayer) return;
          gsap.set(tankLayer, { height: '0%' });
          var wObj = { val: 0 };
          gsap.to(wObj, {
            val: 100,
            duration: 2.4,
            ease: 'power2.inOut',
            onUpdate: function () {
              tankLayer.style.height = wObj.val + '%';
              if (tankPct) tankPct.textContent = Math.floor(wObj.val) + '%';
            }
          });
        }
        if (btn14) btn14.addEventListener('click', playLdr14);
        ScrollTrigger.create({ trigger: ldr14Card, start: 'top 80%', onEnter: playLdr14 });
      }

      // 15. Neon Radar Target Sonar Sweep
      var ldr15Card = loadersSection.querySelector('[data-ldr-card="sonar-sweep"]');
      if (ldr15Card) {
        var rSweep = ldr15Card.querySelector('[data-ldr-radar-sweep]');
        var rBlip = ldr15Card.querySelector('[data-ldr-radar-blip]');
        var btn15 = ldr15Card.querySelector('[data-ldr-replay="sonar-sweep"]');

        gsap.to(rSweep, { rotate: 360, duration: 2.2, repeat: -1, ease: 'none' });
        gsap.to(rBlip, { scale: 1.8, opacity: 0.2, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });

        if (btn15) {
          btn15.addEventListener('click', function () {
            gsap.fromTo(rBlip, { scale: 3, opacity: 1 }, { scale: 1, opacity: 0.2, duration: 0.6 });
          });
        }
      }

      // 16. Chromatic Split Text Glitch
      var ldr16Card = loadersSection.querySelector('[data-ldr-card="chroma-glitch"]');
      if (ldr16Card) {
        var gText = ldr16Card.querySelector('[data-ldr-glitch-text]');
        var btn16 = ldr16Card.querySelector('[data-ldr-replay="chroma-glitch"]');

        function playLdr16() {
          if (!gText) return;
          var chars = '!@#$%^&*()_+{}|:<>?~';
          var orig = 'NEXUS//01';
          var count = 0;
          var gInterval = setInterval(function () {
            gText.textContent = orig.split('').map(function (c, i) {
              if (count > i * 2) return c;
              return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            count++;
            if (count > 24) {
              clearInterval(gInterval);
              gText.textContent = orig;
              gsap.fromTo(gText, { filter: 'drop-shadow(0 0 12px #2F8F72)' }, { filter: 'none', duration: 0.6 });
            }
          }, 50);
        }
        if (btn16) btn16.addEventListener('click', playLdr16);
        ScrollTrigger.create({ trigger: ldr16Card, start: 'top 80%', onEnter: playLdr16 });
      }

      // 17. DNA Double Helix Rotor
      var ldr17Card = loadersSection.querySelector('[data-ldr-card="dna-helix"]');
      if (ldr17Card) {
        var rungs = ldr17Card.querySelectorAll('.uik-ldr-dna-rung');
        var btn17 = ldr17Card.querySelector('[data-ldr-replay="dna-helix"]');
        rungs.forEach(function (rg, i) {
          gsap.to(rg, {
            scaleY: 0.2,
            opacity: 0.3,
            duration: 1.0,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.12
          });
        });
        if (btn17) {
          btn17.addEventListener('click', function () {
            gsap.from(rungs, { scale: 0, duration: 0.8, stagger: 0.05, ease: 'back.out(2)' });
          });
        }
      }

      // 18. Matrix Binary Rain
      var ldr18Card = loadersSection.querySelector('[data-ldr-card="binary-rain"]');
      if (ldr18Card) {
        var mCanvas = ldr18Card.querySelector('[data-ldr-matrix-canvas]');
        var btn18 = ldr18Card.querySelector('[data-ldr-replay="binary-rain"]');
        if (mCanvas) {
          var mCtx = mCanvas.getContext('2d');
          var mW = mCanvas.width = mCanvas.offsetWidth || 280;
          var mH = mCanvas.height = mCanvas.offsetHeight || 220;
          var mCols = Math.floor(mW / 14);
          var mDrops = [];
          for (var mi = 0; mi < mCols; mi++) mDrops[mi] = 1;

          function renderMatrix() {
            if (!mCtx) return;
            mCtx.fillStyle = 'rgba(6, 7, 10, 0.12)';
            mCtx.fillRect(0, 0, mW, mH);
            mCtx.fillStyle = '#5ED9B4';
            mCtx.font = '11px monospace';

            for (var i = 0; i < mDrops.length; i++) {
              var text = Math.random() > 0.5 ? '1' : '0';
              mCtx.fillText(text, i * 14, mDrops[i] * 14);
              if (mDrops[i] * 14 > mH && Math.random() > 0.975) {
                mDrops[i] = 0;
              }
              mDrops[i]++;
            }
            requestAnimationFrame(renderMatrix);
          }
          renderMatrix();
        }
      }

      // 19. Pixelated Mosaic Grid
      var ldr19Card = loadersSection.querySelector('[data-ldr-card="pixel-mosaic"]');
      if (ldr19Card) {
        var mGrid = ldr19Card.querySelector('[data-ldr-mosaic-grid]');
        var btn19 = ldr19Card.querySelector('[data-ldr-replay="pixel-mosaic"]');
        if (mGrid && mGrid.children.length === 0) {
          for (var p = 0; p < 36; p++) {
            var tile = document.createElement('div');
            tile.className = 'uik-ldr-mosaic-tile';
            mGrid.appendChild(tile);
          }
        }

        function playLdr19() {
          if (!mGrid) return;
          var tiles = mGrid.querySelectorAll('.uik-ldr-mosaic-tile');
          gsap.set(tiles, { rotateY: 0, scale: 1, backgroundColor: 'rgba(200, 134, 43, 0.15)' });
          gsap.to(tiles, {
            rotateY: 180,
            backgroundColor: 'rgba(47, 143, 114, 0.6)',
            duration: 0.8,
            ease: 'power3.inOut',
            stagger: {
              grid: [6, 6],
              from: 'center',
              amount: 0.9
            }
          });
        }
        if (btn19) btn19.addEventListener('click', playLdr19);
        ScrollTrigger.create({ trigger: ldr19Card, start: 'top 80%', onEnter: playLdr19 });
      }

      // 20. Sonic Audio Spectrum Equalizer
      var ldr20Card = loadersSection.querySelector('[data-ldr-card="audio-eq"]');
      if (ldr20Card) {
        var eqBars = ldr20Card.querySelectorAll('.uik-ldr-eq-bar');
        var btn20 = ldr20Card.querySelector('[data-ldr-replay="audio-eq"]');
        eqBars.forEach(function (bar, i) {
          gsap.to(bar, {
            height: 20 + Math.random() * 50,
            duration: 0.35 + (i % 4) * 0.1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
        if (btn20) {
          btn20.addEventListener('click', function () {
            gsap.from(eqBars, { height: 5, duration: 0.6, stagger: 0.04, ease: 'elastic.out(1, 0.4)' });
          });
        }
      }

      // 21. Infinity Mobius Ribbon Trail
      var ldr21Card = loadersSection.querySelector('[data-ldr-card="mobius-ribbon"]');
      if (ldr21Card) {
        var mobiusActive = ldr21Card.querySelector('[data-ldr-mobius-active]');
        var btn21 = ldr21Card.querySelector('[data-ldr-replay="mobius-ribbon"]');
        var mobiusTween = gsap.to(mobiusActive, {
          strokeDashoffset: -280,
          duration: 2.2,
          repeat: -1,
          ease: 'none'
        });
        if (btn21) {
          btn21.addEventListener('click', function () {
            mobiusTween.restart();
          });
        }
      }

      // 22. Iris Shutter Camera Aperture
      var ldr22Card = loadersSection.querySelector('[data-ldr-card="iris-aperture"]');
      if (ldr22Card) {
        var blades = ldr22Card.querySelectorAll('.uik-ldr-aperture-blade');
        var btn22 = ldr22Card.querySelector('[data-ldr-replay="iris-aperture"]');

        function playLdr22() {
          var apTl = gsap.timeline();
          apTl
            .to(blades, { scale: 0.3, rotate: '+=45deg', duration: 1.0, ease: 'power3.inOut' })
            .to(blades, { scale: 1, rotate: '+=45deg', duration: 0.8, ease: 'back.out(2)' });
        }
        if (btn22) btn22.addEventListener('click', playLdr22);
        ScrollTrigger.create({ trigger: ldr22Card, start: 'top 80%', onEnter: playLdr22 });
      }

      // 23. Warp Speed Hyperdrive Starfield
      var ldr23Card = loadersSection.querySelector('[data-ldr-card="warp-hyperdrive"]');
      if (ldr23Card) {
        var wCanvas = ldr23Card.querySelector('[data-ldr-warp-canvas]');
        var btn23 = ldr23Card.querySelector('[data-ldr-replay="warp-hyperdrive"]');
        if (wCanvas) {
          var wCtx = wCanvas.getContext('2d');
          var wCW = wCanvas.width = wCanvas.offsetWidth || 280;
          var wCH = wCanvas.height = wCanvas.offsetHeight || 220;
          var stars = [];
          for (var s = 0; s < 50; s++) {
            stars.push({
              x: (Math.random() - 0.5) * wCW,
              y: (Math.random() - 0.5) * wCH,
              z: Math.random() * wCW
            });
          }

          function renderWarp() {
            if (!wCtx) return;
            wCtx.fillStyle = 'rgba(6, 7, 10, 0.2)';
            wCtx.fillRect(0, 0, wCW, wCH);
            var cx = wCW / 2;
            var cy = wCH / 2;

            stars.forEach(function (star) {
              star.z -= 4;
              if (star.z <= 0) star.z = wCW;
              var k = 120 / star.z;
              var px = star.x * k + cx;
              var py = star.y * k + cy;

              if (px >= 0 && px <= wCW && py >= 0 && py <= wCH) {
                var size = (1 - star.z / wCW) * 3;
                wCtx.fillStyle = '#FFFFFF';
                wCtx.fillRect(px, py, size, size);
              }
            });
            requestAnimationFrame(renderWarp);
          }
          renderWarp();
        }
      }

      // 24. Sacred Geometry Flower of Life
      var ldr24Card = loadersSection.querySelector('[data-ldr-card="sacred-geometry"]');
      if (ldr24Card) {
        var sRings = ldr24Card.querySelectorAll('.uik-ldr-sacred-ring');
        var btn24 = ldr24Card.querySelector('[data-ldr-replay="sacred-geometry"]');

        gsap.to(sRings, {
          rotate: 360,
          scale: 1.15,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.2
        });

        if (btn24) {
          btn24.addEventListener('click', function () {
            gsap.from(sRings, { scale: 0, duration: 1.2, stagger: 0.15, ease: 'back.out(2)' });
          });
        }
      }

    }

    /* ==========================================================================
       STICKY MOTION NAVBAR CONTROLLER & SCROLLSPY
       ========================================================================== */
    var navbar = root.querySelector('[data-uik-navbar]');
    var navLinks = root.querySelectorAll('.uik-nav-item[data-nav-target], [data-nav-target="top"]');

    // Smooth Scroll on Nav Item Click
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetSelector = link.getAttribute('data-nav-target');
        if (targetSelector === 'top') {
          if (window._uikLenis) {
            window._uikLenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }

        var targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          if (window._uikLenis) {
            window._uikLenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
          } else {
            var topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
          }
        }
      });
    });

    // ScrollSpy: highlight active navbar link based on scroll position
    var itemLinks = root.querySelectorAll('.uik-nav-item[data-nav-target]');
    itemLinks.forEach(function (link) {
      var targetSelector = link.getAttribute('data-nav-target');
      if (targetSelector && targetSelector.startsWith('#')) {
        var targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          ScrollTrigger.create({
            trigger: targetEl,
            start: 'top 45%',
            end: 'bottom 45%',
            onEnter: function () {
              itemLinks.forEach(function (l) { l.classList.remove('uik-is-active'); });
              link.classList.add('uik-is-active');
            },
            onEnterBack: function () {
              itemLinks.forEach(function (l) { l.classList.remove('uik-is-active'); });
              link.classList.add('uik-is-active');
            }
          });
        }
      }
    });

    // Navbar Scrolled Shadow State
    if (navbar) {
      ScrollTrigger.create({
        start: 'top -40',
        onUpdate: function (self) {
          if (self.scroll() > 30) {
            navbar.classList.add('uik-nav--scrolled');
          } else {
            navbar.classList.remove('uik-nav--scrolled');
          }
        }
      });
    }

    /* ==========================================================================
       MEGAMENU CONTROLLER
       ========================================================================== */
    var megaToggle = root.querySelector('[data-uik-megatoggle]');
    var megaPanel = root.querySelector('[data-uik-megapanel]');

    function closeMegaMenu() {
      if (megaPanel && megaPanel.classList.contains('uik-is-open')) {
        megaPanel.classList.remove('uik-is-open');
        if (megaToggle) megaToggle.setAttribute('aria-expanded', 'false');
      }
    }

    function openMegaMenu() {
      if (megaPanel) {
        megaPanel.classList.add('uik-is-open');
        if (megaToggle) megaToggle.setAttribute('aria-expanded', 'true');
      }
    }

    if (megaToggle && megaPanel) {
      megaToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = megaPanel.classList.contains('uik-is-open');
        if (isOpen) {
          closeMegaMenu();
        } else {
          openMegaMenu();
        }
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (!megaPanel.contains(e.target) && !megaToggle.contains(e.target)) {
          closeMegaMenu();
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeMegaMenu();
        }
      });

      // Clicking any navigation link inside megamenu smooth scrolls & closes panel
      megaPanel.querySelectorAll('[data-nav-target]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          var targetSelector = link.getAttribute('data-nav-target');
          if (targetSelector && targetSelector.startsWith('#')) {
            e.preventDefault();
            closeMegaMenu();
            var targetEl = document.querySelector(targetSelector);
            if (targetEl) {
              if (window._uikLenis) {
                window._uikLenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
              } else {
                var topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
                window.scrollTo({ top: topPos, behavior: 'smooth' });
              }
            }
          } else if (targetSelector === 'top') {
            e.preventDefault();
            closeMegaMenu();
            if (window._uikLenis) {
              window._uikLenis.scrollTo(0, { duration: 1.2 });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        });
      });
    }

    /* ==========================================================================
       UNIVERSAL THEME CONTROLLER (Sync across all pages)
       ========================================================================== */
    var themeToggles = document.querySelectorAll('[data-uik-theme-toggle]');
    var savedTheme = localStorage.getItem('uik_theme') || localStorage.getItem('ip_theme') || 'dark';

    function applyGlobalTheme(isLight) {
      document.body.classList.toggle('is-light', isLight);
      document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
      themeToggles.forEach(function (btn) {
        var icon = btn.querySelector('.uik-theme-icon') || btn.querySelector('.mh-theme-icon');
        var label = btn.querySelector('.uik-theme-label') || btn.querySelector('.mh-theme-text');
        if (isLight) {
          if (icon) icon.textContent = '🌙';
          if (label) label.textContent = 'Dark';
        } else {
          if (icon) icon.textContent = '☀️';
          if (label) label.textContent = 'Light';
        }
      });
      localStorage.setItem('uik_theme', isLight ? 'light' : 'dark');
      localStorage.setItem('ip_theme', isLight ? 'light' : 'dark');
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }

    if (savedTheme === 'light') {
      applyGlobalTheme(true);
    } else {
      applyGlobalTheme(false);
    }

    themeToggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isLight = !document.body.classList.contains('is-light');
        applyGlobalTheme(isLight);
      });
    });

    /* ==========================================================================
       UNIVERSAL STANDALONE CODE INSPECTOR & COPY MODAL SYSTEM
       ========================================================================== */
    var codeModal = document.querySelector('#uikCodeModal');
    if (codeModal) {
      var modalTitle = codeModal.querySelector('#uikCodeTitle');
      var modalBadge = codeModal.querySelector('#uikCodeBadge');
      var modalContent = codeModal.querySelector('#uikCodeContent');
      var copyBtn = codeModal.querySelector('#uikCodeCopyBtn');
      var copyText = copyBtn ? copyBtn.querySelector('.uik-copy-text') : null;
      var closeBtns = codeModal.querySelectorAll('[data-code-close]');
      var tabs = codeModal.querySelectorAll('.uik-code-tab');

      var currentCodeData = {
        title: 'Component Animation',
        badge: 'STANDALONE SPEC',
        html: '',
        css: '',
        js: '',
        full: ''
      };
      var activeTab = 'full';

      function updateModalDisplay() {
        if (modalTitle) modalTitle.textContent = currentCodeData.title;
        if (modalBadge) modalBadge.textContent = currentCodeData.badge;
        if (modalContent) {
          modalContent.textContent = currentCodeData[activeTab] || currentCodeData.full || '';
        }
      }

      function openModalWithData(data) {
        currentCodeData = data;
        // Build Full HTML if not provided
        if (!currentCodeData.full) {
          currentCodeData.full = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + (data.title || 'Component Demo') + '</title>\n  <style>\n' + (data.css || '    /* Component CSS */\n') + '\n  </style>\n</head>\n<body>\n\n  ' + (data.html || '  <!-- Component HTML -->\n') + '\n\n  <!-- GSAP Core & Plugins -->\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>\n  <script>\n' + (data.js || '    // GSAP Animation\n') + '\n  <\/script>\n</body>\n</html>';
        }
        updateModalDisplay();
        codeModal.classList.add('is-open');
        codeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      function closeModal() {
        codeModal.classList.remove('is-open');
        codeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      // Close button handlers
      closeBtns.forEach(function (btn) {
        btn.addEventListener('click', closeModal);
      });

      // Escape key handler
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && codeModal.classList.contains('is-open')) {
          closeModal();
        }
      });

      // Tab switching
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('is-active'); });
          tab.classList.add('is-active');
          activeTab = tab.getAttribute('data-tab') || 'full';
          updateModalDisplay();
        });
      });

      // Copy code handler
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          var textToCopy = currentCodeData[activeTab] || currentCodeData.full || '';
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(showCopiedState);
          } else {
            var tempTA = document.createElement('textarea');
            tempTA.value = textToCopy;
            document.body.appendChild(tempTA);
            tempTA.select();
            document.execCommand('copy');
            document.body.removeChild(tempTA);
            showCopiedState();
          }
        });
      }

      function showCopiedState() {
        if (!copyBtn) return;
        copyBtn.classList.add('is-copied');
        if (copyText) copyText.textContent = '✓ Copied to Clipboard!';
        setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          if (copyText) copyText.textContent = 'Copy Code';
        }, 2000);
      }

      // COMPREHENSIVE STANDALONE ANIMATION CODE REGISTRY
      var CODE_REGISTRY = {
        // --- 1. HEADINGS ---
        'split': {
          title: 'Split-Character Stagger Heading',
          badge: 'KIT—01 / TYPOGRAPHY',
          html: '<h2 class="uik-heading uik-heading--split" data-anim="split">Design in motion</h2>',
          css: '.uik-heading--split {\n  font-family: "Fraunces", serif;\n  font-size: clamp(32px, 5vw, 64px);\n  font-weight: 600;\n  color: #241C15;\n  line-height: 1.15;\n  width: 100%;\n  overflow-wrap: break-word;\n}\n.uik-word-wrap {\n  display: inline-block;\n  white-space: nowrap;\n}\n.uik-char {\n  display: inline-block;\n  will-change: transform, opacity;\n}',
          js: '// Split into words & chars with natural wrapping\nconst heading = document.querySelector(".uik-heading--split");\nconst words = heading.textContent.trim().split(/\\s+/);\nheading.innerHTML = words.map(w => `<span class="uik-word-wrap">${w.split("").map(c => `<span class="uik-char">${c}</span>`).join("")}</span>`).join(" ");\n\ngsap.from(heading.querySelectorAll(".uik-char"), {\n  scrollTrigger: {\n    trigger: heading,\n    start: "top 80%"\n  },\n  y: 80,\n  opacity: 0,\n  duration: 0.85,\n  stagger: 0.02,\n  ease: "back.out(1.7)"\n});'
        },
        'clip': {
          title: 'Clip-Path Wipe Reveal Heading',
          badge: 'KIT—01 / TYPOGRAPHY',
          html: '<h2 class="uik-heading uik-heading--clip" data-anim="clip">Every pixel intentional</h2>',
          css: '.uik-heading--clip {\n  font-family: "Fraunces", serif;\n  font-size: clamp(36px, 6vw, 72px);\n  color: #241C15;\n  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);\n}',
          js: 'gsap.to(".uik-heading--clip", {\n  scrollTrigger: {\n    trigger: ".uik-heading--clip",\n    start: "top 80%"\n  },\n  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",\n  duration: 1.2,\n  ease: "power3.inOut"\n});'
        },
        'typewriter': {
          title: 'Mechanical Typewriter Heading',
          badge: 'KIT—01 / TYPOGRAPHY',
          html: '<h2 class="uik-heading" data-anim="typewriter" data-text="Types itself out on scroll"><span class="uik-heading--typewriter">Types itself out on scroll</span></h2>',
          css: '.uik-heading--typewriter {\n  font-family: "JetBrains Mono", monospace;\n  font-size: clamp(28px, 4vw, 54px);\n  border-right: 3px solid #C8862B;\n  white-space: nowrap;\n  overflow: hidden;\n}',
          js: 'const tw = document.querySelector("[data-anim=\'typewriter\']");\nconst finalStr = tw.getAttribute("data-text") || "Types itself out on scroll";\nconst span = tw.querySelector("span");\nspan.textContent = "";\n\nScrollTrigger.create({\n  trigger: tw,\n  start: "top 80%",\n  onEnter: () => {\n    let i = 0;\n    const interval = setInterval(() => {\n      span.textContent = finalStr.slice(0, i);\n      i++;\n      if (i > finalStr.length) clearInterval(interval);\n    }, 45);\n  }\n});'
        },
        'glitch': {
          title: 'Cyberpunk RGB Glitch Heading',
          badge: 'KIT—01 / TYPOGRAPHY',
          html: '<h2 class="uik-heading uik-heading--glitch" data-anim="glitch" data-text="Signal breaks up">\n  Signal breaks up\n  <span class="uik-glitch-copy uik-glitch-copy--r">Signal breaks up</span>\n  <span class="uik-glitch-copy uik-glitch-copy--b">Signal breaks up</span>\n</h2>',
          css: '.uik-heading--glitch {\n  font-family: "Fraunces", serif;\n  font-size: clamp(36px, 6vw, 72px);\n  position: relative;\n  color: #241C15;\n}\n.uik-glitch-copy {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n}\n.uik-glitch-copy--r { color: #FF0055; transform: translate(-3px, 2px); }\n.uik-glitch-copy--b { color: #00E5FF; transform: translate(3px, -2px); }',
          js: 'const el = document.querySelector(".uik-heading--glitch");\nconst r = el.querySelector(".uik-glitch-copy--r");\nconst b = el.querySelector(".uik-glitch-copy--b");\n\nScrollTrigger.create({\n  trigger: el,\n  start: "top 80%",\n  onEnter: () => {\n    const tl = gsap.timeline();\n    tl.to([r, b], { opacity: 0.8, duration: 0.08, repeat: 5, yoyo: true })\n      .to([r, b], { opacity: 0, duration: 0.1 });\n  }\n});'
        },
        'scramble': {
          title: 'Matrix Character Decoder Heading',
          badge: 'KIT—01 / TYPOGRAPHY',
          html: '<h2 class="uik-heading uik-heading--scramble" data-anim="scramble" data-final-text="DECODED ON SCROLL">XJ4K—SCRMBL_TXT</h2>',
          css: '.uik-heading--scramble {\n  font-family: "JetBrains Mono", monospace;\n  font-size: clamp(28px, 4vw, 56px);\n  color: #2F8F72;\n}',
          js: 'const el = document.querySelector(".uik-heading--scramble");\nconst target = el.getAttribute("data-final-text") || "DECODED ON SCROLL";\nconst chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";\n\nScrollTrigger.create({\n  trigger: el,\n  start: "top 80%",\n  onEnter: () => {\n    let count = 0;\n    const timer = setInterval(() => {\n      el.textContent = target.split("").map((c, i) => {\n        if (count > i * 2) return c;\n        return chars[Math.floor(Math.random() * chars.length)];\n      }).join("");\n      count++;\n      if (count > target.length * 2 + 5) {\n        clearInterval(timer);\n        el.textContent = target;\n      }\n    }, 40);\n  }\n});'
        },
        'word-rotate': {
          title: 'Text Split with 3D Word Rotation',
          badge: 'KIT—01 / TYPOGRAPHY',
          html: '<h2 class="uik-heading uik-heading--word-rotate" data-anim="word-rotate">\n  <span class="uik-rotate-prefix">Design in</span>\n  <span class="uik-rotate-words-wrap">\n    <span class="uik-rotate-word is-active">Motion</span>\n    <span class="uik-rotate-word">Perspective</span>\n    <span class="uik-rotate-word">Dimensions</span>\n    <span class="uik-rotate-word">Creativity</span>\n  </span>\n  <span class="uik-rotate-suffix">every frame</span>\n</h2>',
          css: '.uik-heading--word-rotate {\n  display: inline-flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28em;\n  perspective: 1000px;\n}\n.uik-char {\n  display: inline-block;\n  will-change: transform, opacity;\n}\n.uik-rotate-words-wrap {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 1.25em;\n  min-width: 4.8em;\n  padding: 0.1em 0.38em;\n  border-radius: 12px;\n  background: rgba(200, 134, 43, 0.12);\n  border: 1px solid rgba(200, 134, 43, 0.35);\n  perspective: 800px;\n  transform-style: preserve-3d;\n  overflow: hidden;\n}\n.uik-rotate-word {\n  position: absolute;\n  left: 0; right: 0; top: 0; bottom: 0;\n  display: flex; align-items: center; justify-content: center;\n  color: #C8862B; font-weight: 700;\n  opacity: 0;\n  transform: rotateX(-90deg) translateY(100%);\n  transform-origin: center center -30px;\n}\n.uik-rotate-word.is-active {\n  opacity: 1;\n  transform: rotateX(0deg) translateY(0%);\n}',
          js: '// Character Split + 3D Cylinder Rotation\nconst heading = document.querySelector(".uik-heading--word-rotate");\nconst chars = heading.querySelectorAll(".uik-char");\ngsap.from(chars, {\n  scrollTrigger: { trigger: heading, start: "top 85%" },\n  y: 35, rotateX: -80, opacity: 0, duration: 0.75, stagger: 0.025, ease: "back.out(1.8)"\n});\n\nconst words = heading.querySelectorAll(".uik-rotate-word");\nlet cur = 0;\nsetInterval(() => {\n  const prev = cur;\n  cur = (cur + 1) % words.length;\n  gsap.to(words[prev], { rotateX: 90, yPercent: -100, opacity: 0, filter: "blur(3px)", duration: 0.6, ease: "power3.inOut" });\n  gsap.fromTo(words[cur], { rotateX: -90, yPercent: 100, opacity: 0, filter: "blur(3px)" }, { rotateX: 0, yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.inOut" });\n}, 2200);'
        },

        // --- 2. CARDS ---
        'tilt': {
          title: '3D Cursor Tilt & Specular Radial Glow',
          badge: 'KIT—02 / CARDS',
          html: '<div class="uik-card uik-card--tilt" data-tilt>\n  <div class="uik-card__glow"></div>\n  <div class="uik-card__tag">Tilt + Glow</div>\n  <div class="uik-card__title">Depth on hover</div>\n  <div class="uik-card__text">Cursor position drives a live 3D rotation and a soft radial glow.</div>\n</div>',
          css: '.uik-card--tilt {\n  width: 320px;\n  background: #FFFFFF;\n  border: 1px solid rgba(36, 28, 21, 0.14);\n  border-radius: 20px;\n  padding: 32px;\n  position: relative;\n  overflow: hidden;\n  transform-style: preserve-3d;\n  box-shadow: 0 20px 50px rgba(36, 28, 21, 0.08);\n}\n.uik-card__glow {\n  position: absolute;\n  width: 250px;\n  height: 250px;\n  border-radius: 50%;\n  background: radial-gradient(circle, rgba(200, 134, 43, 0.25) 0%, transparent 70%);\n  pointer-events: none;\n  transform: translate(-50%, -50%);\n  opacity: 0;\n  transition: opacity 0.3s;\n}',
          js: 'const card = document.querySelector("[data-tilt]");\nconst glow = card.querySelector(".uik-card__glow");\n\ncard.addEventListener("mousemove", (e) => {\n  const rect = card.getBoundingClientRect();\n  const x = e.clientX - rect.left;\n  const y = e.clientY - rect.top;\n  const xPct = (x / rect.width) - 0.5;\n  const yPct = (y / rect.top) - 0.5;\n\n  gsap.to(card, { rotateY: xPct * 20, rotateX: -yPct * 20, duration: 0.3, ease: "power2.out" });\n  gsap.to(glow, { x: x, y: y, opacity: 1, duration: 0.2 });\n});\n\ncard.addEventListener("mouseleave", () => {\n  gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });\n  gsap.to(glow, { opacity: 0, duration: 0.4 });\n});'
        },
        'flip': {
          title: '3D Two-Sided Flip Card',
          badge: 'KIT—02 / CARDS',
          html: '<div class="uik-card uik-card--flip">\n  <div class="uik-flip-inner">\n    <div class="uik-flip-face uik-flip-face--front">\n      <h3>Front Face</h3>\n      <p>Hover to flip 180 degrees.</p>\n    </div>\n    <div class="uik-flip-face uik-flip-face--back">\n      <h3>Back Face</h3>\n      <p>Revealed supporting detail.</p>\n    </div>\n  </div>\n</div>',
          css: '.uik-card--flip { width: 320px; height: 220px; perspective: 1000px; }\n.uik-flip-inner { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }\n.uik-card--flip:hover .uik-flip-inner { transform: rotateY(180deg); }\n.uik-flip-face { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 20px; padding: 28px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.1); }\n.uik-flip-face--back { background: #11141C; color: #FFFFFF; transform: rotateY(180deg); }',
          js: '// Pure 3D CSS Card Flip (zero JS dependencies for core flip)'
        },

        // --- 3. MARQUEE ---
        'marquee': {
          title: 'Gapless Infinite Marquee Loop',
          badge: 'KIT—03 / MARQUEES',
          html: '<div class="uik-marquee">\n  <div class="uik-marquee__track" data-marquee data-speed="45" data-dir="-1">\n    <div class="uik-marquee__item">REUSABLE</div>\n    <div class="uik-marquee__item">FRAMEWORK AGNOSTIC</div>\n    <div class="uik-marquee__item">PARENT SCOPED CSS</div>\n  </div>\n</div>',
          css: '.uik-marquee { overflow: hidden; white-space: nowrap; width: 100%; background: #11141C; color: #FFFFFF; padding: 18px 0; }\n.uik-marquee__track { display: inline-flex; gap: 40px; will-change: transform; }\n.uik-marquee__item { font-family: "Fraunces", serif; font-size: 28px; font-weight: 600; }',
          js: 'const track = document.querySelector("[data-marquee]");\nconst orig = track.innerHTML;\ntrack.insertAdjacentHTML("beforeend", orig);\ntrack.insertAdjacentHTML("beforeend", orig);\n\nconst totalWidth = track.scrollWidth / 3;\ngsap.to(track, {\n  x: -totalWidth,\n  duration: 20,\n  repeat: -1,\n  ease: "none"\n});'
        },

        // --- 4. SCROLL SEQUENCES ---
        'pinned-deck': {
          title: 'Pinned Kinetic Card Deck',
          badge: 'KIT—04 / SCROLL SEQUENCES',
          html: '<div class="uik-pinned-stage" data-scroll-deck>\n  <div class="uik-deck-card uik-deck-card--1"><h3>Step 01</h3></div>\n  <div class="uik-deck-card uik-deck-card--2"><h3>Step 02</h3></div>\n  <div class="uik-deck-card uik-deck-card--3"><h3>Step 03</h3></div>\n</div>',
          css: '.uik-pinned-stage { position: relative; height: 100vh; display: flex; align-items: center; justify-content: center; }\n.uik-deck-card { position: absolute; width: 440px; height: 300px; border-radius: 24px; padding: 32px; background: #FFFFFF; box-shadow: 0 30px 60px rgba(0,0,0,0.12); }',
          js: 'const cards = gsap.utils.toArray(".uik-deck-card");\nScrollTrigger.create({\n  trigger: ".uik-pinned-stage",\n  start: "top top",\n  end: "+=200%",\n  pin: true,\n  scrub: 1,\n  animation: gsap.timeline()\n    .from(cards[1], { yPercent: 120, rotate: 6, scale: 0.9 })\n    .from(cards[2], { yPercent: 120, rotate: -6, scale: 0.9 })\n});'
        },

        // --- 5. AWWWARDS SUITE ---
        'magnetic-cursor': {
          title: 'Fluid Magnetic Cursor Follower',
          badge: 'KIT—07 / AWWWARDS SUITE',
          html: '<div class="uik-custom-cursor" data-aww-cursor>\n  <span class="uik-cursor-label" data-cursor-label></span>\n</div>\n<button class="uik-mag-btn" data-mag-btn>Hover Magnetically</button>',
          css: '.uik-custom-cursor {\n  position: fixed;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 2px solid #C8862B;\n  pointer-events: none;\n  z-index: 9999;\n  transform: translate(-50%, -50%);\n  transition: width 0.3s, height 0.3s, background-color 0.3s;\n}',
          js: 'const cursor = document.querySelector("[data-aww-cursor]");\nwindow.addEventListener("mousemove", (e) => {\n  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });\n});\n\nconst magBtn = document.querySelector("[data-mag-btn]");\nmagBtn.addEventListener("mousemove", (e) => {\n  const rect = magBtn.getBoundingClientRect();\n  const x = e.clientX - (rect.left + rect.width / 2);\n  const y = e.clientY - (rect.top + rect.height / 2);\n  gsap.to(magBtn, { x: x * 0.4, y: y * 0.4, duration: 0.3 });\n});\nmagBtn.addEventListener("mouseleave", () => {\n  gsap.to(magBtn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });\n});'
        },

        // --- 6. SITE OPENING PRELOADER ---
        'site-intro': {
          title: 'Awwwards Fullscreen Site Opening Preloader',
          badge: 'INTRO PRELOADER SEQUENCE',
          html: '<div class="uik-site-intro-overlay">\n  <div class="uik-intro-columns-wrap">\n    <div class="uik-intro-column"></div>\n    <div class="uik-intro-column"></div>\n    <div class="uik-intro-column"></div>\n    <div class="uik-intro-column"></div>\n    <div class="uik-intro-column"></div>\n  </div>\n  <div class="uik-intro-stage">\n    <h1 class="uik-intro-title">AWWWARDS MOTION</h1>\n    <div class="uik-intro-counter-big">00%</div>\n    <div class="uik-intro-progress-wrap"><div class="uik-intro-progress-bar"></div></div>\n  </div>\n</div>',
          css: '.uik-site-intro-overlay { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; }\n.uik-intro-columns-wrap { position: absolute; inset: 0; display: flex; }\n.uik-intro-column { flex: 1; height: 100%; background: #090B0F; transform-origin: top center; }\n.uik-intro-stage { position: relative; z-index: 2; text-align: center; color: #FFFFFF; }',
          js: 'const overlay = document.querySelector(".uik-site-intro-overlay");\nconst cols = overlay.querySelectorAll(".uik-intro-column");\nconst num = overlay.querySelector(".uik-intro-counter-big");\nconst bar = overlay.querySelector(".uik-intro-progress-bar");\n\nconst tl = gsap.timeline();\nconst obj = { val: 0 };\ntl.to(obj, {\n  val: 100,\n  duration: 2.0,\n  ease: "power2.inOut",\n  onUpdate: () => {\n    num.textContent = Math.floor(obj.val).toString().padStart(2, "0") + "%";\n    bar.style.width = obj.val + "%";\n  }\n})\n.to(".uik-intro-stage", { opacity: 0, scale: 1.1, duration: 0.4 })\n.to(cols, { scaleY: 0, duration: 1.0, ease: "expo.inOut", stagger: { each: 0.08, from: "center" } })\n.set(overlay, { autoAlpha: 0, pointerEvents: "none" });'
        }
      };

      // Standalone Code Extractor & Generator
      function getComponentCode(element) {
        // 1. Check if Loader Card (All 24 Loaders)
        var loaderCard = element.closest('.uik-loader-card');
        if (loaderCard) {
          var ldrType = loaderCard.getAttribute('data-ldr-card') || 'loader';
          var ldrTitle = loaderCard.querySelector('.uik-loader-title') ? loaderCard.querySelector('.uik-loader-title').textContent : 'Kinetic Loader';
          var viewportEl = loaderCard.querySelector('.uik-loader-viewport');
          var ldrHtml = viewportEl ? viewportEl.innerHTML.trim() : loaderCard.innerHTML.trim();
          
          return {
            title: ldrTitle,
            badge: 'AWWWARDS KINETIC LOADER SPEC',
            html: '<!-- ' + ldrTitle + ' -->\n<div class="loader-container">\n  ' + ldrHtml + '\n</div>',
            css: '/* Scoped Loader Styles */\n.loader-container {\n  width: 320px;\n  height: 240px;\n  background: #06070A;\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  overflow: hidden;\n  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);\n}',
            js: '// GSAP Animation for ' + ldrTitle + '\n// Ensure GSAP 3 is loaded\ngsap.timeline({ repeat: -1 });'
          };
        }

        // 2. Check if Animated Heading
        var headingEl = element.closest('.uik-heading');
        if (headingEl) {
          var animType = headingEl.getAttribute('data-anim') || 'split';
          if (CODE_REGISTRY[animType]) return CODE_REGISTRY[animType];
          var headingText = headingEl.textContent.trim();
          return {
            title: 'Animated Heading • ' + animType.toUpperCase(),
            badge: 'KIT—01 / TYPOGRAPHY',
            html: '<h2 class="uik-heading uik-heading--' + animType + '" data-anim="' + animType + '">\n  ' + headingText + '\n</h2>',
            css: '.uik-heading--' + animType + ' {\n  font-family: "Fraunces", serif;\n  font-size: clamp(36px, 6vw, 72px);\n  color: #241C15;\n}',
            js: 'gsap.from(".uik-heading--' + animType + '", {\n  scrollTrigger: {\n    trigger: ".uik-heading--' + animType + '",\n    start: "top 80%"\n  },\n  y: 40,\n  opacity: 0,\n  duration: 1.0,\n  ease: "power3.out"\n});'
          };
        }

        // 3. Check if Card Component
        var cardEl = element.closest('.uik-card');
        if (cardEl) {
          var cardTitle = cardEl.querySelector('.uik-card__title') ? cardEl.querySelector('.uik-card__title').textContent : 'Interactive Card';
          var cardTag = cardEl.querySelector('.uik-card__tag') ? cardEl.querySelector('.uik-card__tag').textContent : 'Card';
          if (cardEl.classList.contains('uik-card--tilt')) return CODE_REGISTRY['tilt'];
          if (cardEl.classList.contains('uik-card--flip')) return CODE_REGISTRY['flip'];
          
          return {
            title: cardTitle + ' (' + cardTag + ')',
            badge: 'KIT—02 / INTERACTIVE CARD',
            html: cardEl.outerHTML,
            css: '.uik-card {\n  background: #FFFFFF;\n  border: 1px solid rgba(0,0,0,0.1);\n  border-radius: 16px;\n  padding: 24px;\n  position: relative;\n  box-shadow: 0 20px 40px rgba(0,0,0,0.08);\n}',
            js: '// GSAP Animation for Card Component\ngsap.from(".uik-card", {\n  scrollTrigger: {\n    trigger: ".uik-card",\n    start: "top 80%"\n  },\n  y: 40,\n  opacity: 0,\n  duration: 0.8,\n  ease: "power3.out"\n});'
          };
        }

        // 4. Check if Slider or Specimen
        var sliderEl = element.closest('[data-mod-slider], .uik-mod-card, [data-uik-inspect], .uik-pinned-card, .uik-aww-hero-box, .uik-marquee');
        if (sliderEl) {
          if (sliderEl.classList.contains('uik-marquee') || sliderEl.hasAttribute('data-marquee')) return CODE_REGISTRY['marquee'];
          if (sliderEl.classList.contains('uik-pinned-card')) return CODE_REGISTRY['pinned-deck'];
          var sTitle = sliderEl.querySelector('h2, h3, h4') ? sliderEl.querySelector('h2, h3, h4').textContent : 'Kinetic Specimen';
          return {
            title: sTitle + ' (Component)',
            badge: 'KINETIC MOTION SPECIMEN',
            html: sliderEl.outerHTML,
            css: '/* Scoped Component Styles */\n' + (sliderEl.className ? '.' + sliderEl.className.split(' ').join('.') + ' { position: relative; }' : ''),
            js: '// GSAP Animation Initialization\ngsap.from("' + (sliderEl.className ? '.' + sliderEl.className.split(' ')[0] : 'div') + '", {\n  scrollTrigger: {\n    trigger: "' + (sliderEl.className ? '.' + sliderEl.className.split(' ')[0] : 'div') + '",\n    start: "top 75%"\n  },\n  y: 40,\n  opacity: 0,\n  duration: 1.0,\n  ease: "power3.out"\n});'
          };
        }

        // Default fallback: Site Intro Preloader
        return CODE_REGISTRY['site-intro'];
      }

      // Attach Click Inspector to all interactive specimen elements
      document.addEventListener('click', function (e) {
        // If clicking inside the code modal or on interactive controls (replay, slider prev/next, links), skip
        if (e.target.closest('#uikCodeModal') ||
            e.target.closest('button[data-ldr-replay]') ||
            e.target.closest('button[data-mod-prev]') ||
            e.target.closest('button[data-mod-next]') ||
            e.target.closest('.uik-navbar') ||
            e.target.closest('.uik-megamenu-panel')) {
          return;
        }

        // Check if user clicked a code trigger button OR an inspectable component
        var triggerBtn = e.target.closest('.uik-code-trigger-btn, [data-code-trigger]');
        var targetElement = triggerBtn ? triggerBtn.closest('.uik-loader-card, .uik-card, .uik-heading, [data-uik-inspect], .uik-mod-card, .uik-marquee') : (e.target.closest('.uik-loader-header, .uik-heading, .uik-card, [data-uik-inspect], .uik-mod-card'));

        if (targetElement) {
          var codeData = getComponentCode(targetElement);
          if (codeData) {
            e.preventDefault();
            openModalWithData(codeData);
          }
        }
      });

      // Add a small [ < > Code ] trigger button in all loader headers & cards for instant discovery
      root.querySelectorAll('.uik-loader-header').forEach(function (header) {
        if (!header.querySelector('.uik-code-trigger-btn')) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'uik-code-trigger-btn';
          btn.innerHTML = '<span>&lt; / &gt;</span> Code';
          btn.title = 'View & Copy Standalone Code';
          header.insertBefore(btn, header.children[1] || null);
        }
      });

      // Mark headings, cards, sliders with inspectable pointer
      root.querySelectorAll('.uik-heading, .uik-card, .uik-mod-card, .uik-marquee').forEach(function (el) {
        el.setAttribute('data-uik-inspect', 'true');
        el.title = 'Click to View & Copy Standalone Code';
      });

    }

    // Refresh triggers once all DOM is settled
    ScrollTrigger.refresh();

    // Auto-refresh when web fonts & external assets finish layout
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ScrollTrigger.refresh();
      });
    }
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();