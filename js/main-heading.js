/**
 * Main-Heading Standalone GSAP 3 Animation Library
 * Works on any website without dependencies on UI-Kit classes.
 * Usage: <div class="main-heading"><h1 class="main-heading--split">Text</h1></div>
 */
(function () {
  function initMainHeadings() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    var root = document;

    // Helper to get trigger element
    function getTrigger(el) {
      return el.closest('.main-heading') || el;
    }

    // 1. split-char rise
    root.querySelectorAll('.main-heading--split, .uik-heading--split, [data-anim="split"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var text = h.textContent.trim();
      h.textContent = '';
      text.split('').forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'mh-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        h.appendChild(span);
      });
      var chars = h.querySelectorAll('.mh-char');
      gsap.fromTo(chars,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.7)',
          stagger: 0.02,
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 2. clip-path wipe
    root.querySelectorAll('.main-heading--clip, .uik-heading--clip, [data-anim="clip"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      gsap.fromTo(h,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 3. underline draw
    root.querySelectorAll('.main-heading--underline, .uik-heading--underline, [data-anim="underline"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var rule = h.querySelector('.mh-underline-rule, .uik-underline-rule');
      if (!rule) {
        rule = document.createElement('span');
        rule.className = 'mh-underline-rule';
        h.appendChild(rule);
      }
      gsap.fromTo(rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 4. shine
    root.querySelectorAll('.main-heading--shine, .uik-heading--shine, [data-anim="shine"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      ScrollTrigger.create({
        trigger: getTrigger(h),
        start: 'top 92%',
        end: 'bottom 8%',
        onEnter: function () { h.classList.add('mh-is-active'); },
        onLeave: function () { h.classList.remove('mh-is-active'); },
        onEnterBack: function () { h.classList.add('mh-is-active'); },
        onLeaveBack: function () { h.classList.remove('mh-is-active'); }
      });
    });

    // 5. word-by-word rise
    root.querySelectorAll('.main-heading--words, .uik-heading--words, [data-anim="words"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var text = h.textContent.trim();
      h.textContent = '';
      var words = text.split(/\s+/);
      words.forEach(function (w, i) {
        var span = document.createElement('span');
        span.className = 'mh-word';
        span.textContent = w + (i < words.length - 1 ? '\u00A0' : '');
        h.appendChild(span);
      });
      var wordsEls = h.querySelectorAll('.mh-word');
      gsap.fromTo(wordsEls,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 6. line mask reveal
    root.querySelectorAll('.main-heading--linemask, .uik-heading--linemask, [data-anim="linemask"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var inner = h.querySelector('.mh-linemask-inner, .uik-linemask-inner');
      if (!inner) {
        inner = document.createElement('span');
        inner.className = 'mh-linemask-inner';
        inner.innerHTML = h.innerHTML;
        h.innerHTML = '';
        h.appendChild(inner);
      }
      gsap.fromTo(inner,
        { y: '115%' },
        {
          y: '0%',
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 7. blur-in focus reveal
    root.querySelectorAll('.main-heading--blur, .uik-heading--blur, [data-anim="blur"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      gsap.fromTo(h,
        { filter: 'blur(14px)', opacity: 0 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 8. 3D rotate-in
    root.querySelectorAll('.main-heading--rotate3d, .uik-heading--rotate3d, [data-anim="rotate3d"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      gsap.fromTo(h,
        { rotateX: 70, opacity: 0 },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 9. elastic pop-in
    root.querySelectorAll('.main-heading--pop, .uik-heading--pop, [data-anim="pop"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      gsap.fromTo(h,
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'elastic.out(1, 0.6)',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 10. typewriter caret
    root.querySelectorAll('.main-heading--typewriter, .uik-heading--typewriter, [data-anim="typewriter"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var full = h.dataset.text || h.textContent.trim() || 'Types itself out on scroll';
      h.dataset.text = full;
      h.textContent = '';
      var iv = null;
      function reset() {
        if (iv) { clearInterval(iv); iv = null; }
        h.textContent = '';
      }
      function play() {
        if (iv) { clearInterval(iv); iv = null; }
        h.textContent = '';
        var idx = 0;
        iv = setInterval(function () {
          idx++;
          h.textContent = full.slice(0, idx);
          if (idx >= full.length) {
            clearInterval(iv);
            iv = null;
          }
        }, 38);
      }
      ScrollTrigger.create({
        trigger: getTrigger(h),
        start: 'top 85%',
        end: 'bottom top',
        onEnter: play,
        onEnterBack: play,
        onLeave: reset,
        onLeaveBack: reset
      });
    });

    // 11. highlight sweep
    root.querySelectorAll('.main-heading--highlight, .uik-heading--highlight, [data-anim="highlight"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var bg = h.querySelector('.mh-highlight-bg, .uik-highlight-bg');
      if (!bg) {
        bg = document.createElement('span');
        bg.className = 'mh-highlight-bg';
        h.appendChild(bg);
      }
      gsap.fromTo(bg,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 12. letter scramble / decode
    root.querySelectorAll('.main-heading--scramble, .uik-heading--scramble, [data-anim="scramble"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
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
      ScrollTrigger.create({ trigger: getTrigger(h), start: 'top 85%', end: 'bottom top', onEnter: play, onEnterBack: play });
    });

    // 13. wave bounce
    root.querySelectorAll('.main-heading--wave, .uik-heading--wave, [data-anim="wave"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var text = h.textContent.trim();
      h.textContent = '';
      text.split('').forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'mh-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        h.appendChild(span);
      });
      var chars = h.querySelectorAll('.mh-char');
      var tl = gsap.timeline({ repeat: -1, paused: true });
      tl.to(chars, { y: -14, duration: 0.4, ease: 'sine.inOut', stagger: { each: 0.05, yoyo: true, repeat: 1 } });
      ScrollTrigger.create({
        trigger: getTrigger(h),
        start: 'top 90%',
        end: 'bottom 10%',
        onEnter: function () { tl.play(); },
        onEnterBack: function () { tl.play(); },
        onLeave: function () { tl.pause(); gsap.to(chars, { y: 0, duration: 0.3 }); },
        onLeaveBack: function () { tl.pause(); gsap.to(chars, { y: 0, duration: 0.3 }); }
      });
    });

    // 14. duo lines
    root.querySelectorAll('.main-heading--duo, .uik-heading--duo, [data-anim="duo"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      h.querySelectorAll('.mh-duo-line span, .uik-duo-line span').forEach(function (span, i) {
        var fromX = i % 2 === 0 ? -110 : 110;
        gsap.fromTo(span,
          { xPercent: fromX },
          {
            xPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: getTrigger(h),
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      });
    });

    // 15. glitch flicker
    root.querySelectorAll('.main-heading--glitch, .uik-heading--glitch, [data-anim="glitch"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var text = h.dataset.text || h.textContent.trim();
      var copies = h.querySelectorAll('.mh-glitch-copy, .uik-glitch-copy');
      if (!copies.length) {
        var copyR = document.createElement('span');
        copyR.className = 'mh-glitch-copy mh-glitch-copy--r';
        copyR.textContent = text;
        var copyB = document.createElement('span');
        copyB.className = 'mh-glitch-copy mh-glitch-copy--b';
        copyB.textContent = text;
        h.appendChild(copyR);
        h.appendChild(copyB);
        copies = h.querySelectorAll('.mh-glitch-copy');
      }
      var tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, paused: true });
      tl.set(copies, { opacity: 0, x: 0 })
        .to(copies[0], { x: -4, opacity: 0.7, duration: 0.05 })
        .to(copies[1] || copies[0], { x: 4, opacity: 0.7, duration: 0.05 }, '<')
        .to(copies, { x: 0, opacity: 0, duration: 0.12 });
      ScrollTrigger.create({
        trigger: getTrigger(h), start: 'top 90%', end: 'bottom 10%',
        onEnter: function () { tl.play(0); },
        onEnterBack: function () { tl.play(0); },
        onLeave: function () { tl.pause(0); },
        onLeaveBack: function () { tl.pause(0); }
      });
    });

    // 16. heading with photo chip
    root.querySelectorAll('.main-heading--withphoto, .uik-heading--withphoto, [data-anim="withphoto"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
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
              trigger: getTrigger(h),
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    // 17. marker underline drag
    root.querySelectorAll('.main-heading--marker, .uik-heading--marker, [data-anim="marker"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var rule = h.querySelector('.mh-marker-rule, .uik-marker-rule');
      if (!rule) {
        rule = document.createElement('span');
        rule.className = 'mh-marker-rule';
        h.appendChild(rule);
      }
      gsap.fromTo(rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 18. skew-in from side
    root.querySelectorAll('.main-heading--skew, .uik-heading--skew, [data-anim="skew"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      gsap.fromTo(h,
        { skewX: -12, x: -40, opacity: 0 },
        {
          skewX: 0,
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 19. staircase word stagger
    root.querySelectorAll('.main-heading--staircase, .uik-heading--staircase, [data-anim="staircase"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var text = h.textContent.trim();
      h.textContent = '';
      var words = text.split(/\s+/);
      words.forEach(function (w, i) {
        var span = document.createElement('span');
        span.className = 'mh-stair-word';
        span.textContent = w + (i < words.length - 1 ? '\u00A0' : '');
        h.appendChild(span);
      });
      var wordsEls = h.querySelectorAll('.mh-stair-word');
      gsap.fromTo(wordsEls,
        { y: -24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 20. outline-to-fill text
    root.querySelectorAll('.main-heading--outlinetext, .uik-heading--outlinetext, [data-anim="outlinetext"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var fill = h.querySelector('.mh-outline-fill, .uik-outline-fill');
      if (fill) {
        gsap.fromTo(fill,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: getTrigger(h),
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    // 21. morph
    root.querySelectorAll('.main-heading--morph, .uik-heading--morph, [data-anim="morph"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      tl.to(h, { scale: 1.04, color: '#C8862B', duration: 1.5, ease: 'sine.inOut' });
      ScrollTrigger.create({
        trigger: getTrigger(h), start: 'top 92%', end: 'bottom 8%',
        onEnter: function () { tl.play(); },
        onEnterBack: function () { tl.play(); },
        onLeave: function () { tl.pause(); gsap.to(h, { scale: 1, color: '#111318', duration: 0.3 }); },
        onLeaveBack: function () { tl.pause(); gsap.to(h, { scale: 1, color: '#111318', duration: 0.3 }); }
      });
    });

    // 22. stamp
    root.querySelectorAll('.main-heading--stamp, .uik-heading--stamp, [data-anim="stamp"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      gsap.fromTo(h,
        { scale: 2.2, rotate: -6, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 23. cascade
    root.querySelectorAll('.main-heading--cascade, .uik-heading--cascade, [data-anim="cascade"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var text = h.textContent.trim();
      h.textContent = '';
      text.split('').forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'mh-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        h.appendChild(span);
      });
      var chars = h.querySelectorAll('.mh-char');
      gsap.fromTo(chars,
        { yPercent: -160, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'bounce.out',
          stagger: 0.025,
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 24. neon
    root.querySelectorAll('.main-heading--neon, .uik-heading--neon, [data-anim="neon"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      tl.to(h, { opacity: 1, textShadow: '0 0 18px rgba(47,143,114,0.65)', duration: 1.2, ease: 'sine.inOut' });
      ScrollTrigger.create({
        trigger: getTrigger(h), start: 'top 92%', end: 'bottom 8%',
        onEnter: function () { tl.play(); },
        onEnterBack: function () { tl.play(); },
        onLeave: function () { tl.pause(); gsap.to(h, { opacity: 0.4, textShadow: 'none', duration: 0.3 }); },
        onLeaveBack: function () { tl.pause(); gsap.to(h, { opacity: 0.4, textShadow: 'none', duration: 0.3 }); }
      });
    });

    // 25. slice reveal
    root.querySelectorAll('.main-heading--slice, .uik-heading--slice, [data-anim="slice"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;
      var slices = h.querySelectorAll('.mh-slice-row span, .uik-slice-row span');
      gsap.fromTo(slices,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.7,
          ease: 'power4.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: getTrigger(h),
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 26. text split with word rotation
    root.querySelectorAll('.main-heading--word-rotate, .uik-heading--word-rotate, [data-anim="word-rotate"]').forEach(function (h) {
      if (h._mhInit) return;
      h._mhInit = true;

      var prefix = h.querySelector('.mh-rotate-prefix, .uik-rotate-prefix');
      var suffix = h.querySelector('.mh-rotate-suffix, .uik-rotate-suffix');

      [prefix, suffix].forEach(function (part) {
        if (!part) return;
        var raw = part.textContent.trim();
        part.textContent = '';
        raw.split('').forEach(function (ch) {
          var span = document.createElement('span');
          span.className = 'mh-char';
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          part.appendChild(span);
        });
      });

      var chars = h.querySelectorAll('.mh-char, .uik-char');
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
            trigger: getTrigger(h),
            start: 'top 88%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );

      var wordsWrap = h.querySelector('.mh-rotate-words-wrap, .uik-rotate-words-wrap');
      if (!wordsWrap) return;
      var words = wordsWrap.querySelectorAll('.mh-rotate-word, .uik-rotate-word');
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
        trigger: getTrigger(h),
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

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // Auto init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMainHeadings);
  } else {
    initMainHeadings();
  }

  window.initMainHeadings = initMainHeadings;
})();
