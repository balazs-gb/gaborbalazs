(function () {
  'use strict';

  /* ---------- Settings ---------- */
  const ROOT = '../';                         // pages are in graphic-design-pages/, images are one level up
  const BG_IMAGE = 'Images/project-bg.png';   // the card behind each project
  const SCROLL_SPEED = 80;                    // px per second when the gallery is 500px high (full-size desktop).
                                              // Bigger/smaller galleries (also the full-screen one) scale from this,
                                              // so the speed always looks the same.
  const DESIGN_HEIGHT = 500;
  const GLIDE_MS = 650;                       // duration of an arrow-button step in the full-screen view
  const VIDEO_WAIT_MS = 6000;                 // how long to wait for a video's size on a slow connection

  /* ---------- Helpers ---------- */
  const categories = graphicDesign;
  const category = categories.find(function (c) { return c.id === document.body.dataset.category; }) || categories[0];
  document.title = category.label + ' | GB';

  const VIDEO_RE = /\.(mp4|webm|ogv|mov|m4v)(\?.*)?$/i;
  function isVideo(path) { return VIDEO_RE.test(path); }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function url(path) {
    return /^(https?:)?\/\//.test(path) ? path : ROOT + path;
  }
  function wrap(value, size) {
    return ((value % size) + size) % size;
  }

  /* ---------- Category menu ---------- */
  const menu = document.getElementById('category-menu');
  categories.forEach(function (cat) {
    const wrapper = el('div', 'graphic-d-categories');
    const a = el('a', cat === category ? 'active' : '');
    a.href = cat.id + '.html';
    a.appendChild(el('span', 'label-full', cat.label));
    a.appendChild(el('span', 'label-short', cat.short || cat.label));
    wrapper.appendChild(a);
    menu.appendChild(wrapper);
  });

  /* ---------- Images and videos ---------- */
  let lightboxOpen = false;

  // A video plays only while it is really visible (inside its window and on screen).
  // Videos on the page rest while the full-screen view is open, and the other way round.
  const observedVideos = new Set();
  const visibleVideos = new Set();

  function syncVideo(v) {
    const shouldPlay = visibleVideos.has(v) && ((v.dataset.lb === '1') === lightboxOpen);
    if (shouldPlay) {
      const p = v.play();
      if (p && p.catch) p.catch(function () {});
    } else {
      v.pause();
    }
  }
  function syncAllVideos() { observedVideos.forEach(syncVideo); }

  const videoObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) visibleVideos.add(e.target); else visibleVideos.delete(e.target);
          syncVideo(e.target);
        });
      }, { threshold: 0.15 })
    : null;

  function trackVideo(v) {
    if (v.tagName !== 'VIDEO') return;
    observedVideos.add(v);
    if (videoObserver) videoObserver.observe(v); else v.autoplay = true;
  }
  function untrackVideo(v) {
    if (v.tagName !== 'VIDEO') return;
    observedVideos.delete(v);
    visibleVideos.delete(v);
    if (videoObserver) videoObserver.unobserve(v);
    v.pause();
  }

  function createMedia(src, label, index, inLightbox) {
    let node;
    if (isVideo(src)) {
      node = document.createElement('video');
      node.src = url(src) + '#t=0.001';          // shows the first frame before playing
      node.muted = true;                          // browsers only autoplay muted videos
      node.setAttribute('muted', '');             // (the attribute is copied to the clones)
      node.loop = true;
      node.setAttribute('loop', '');
      node.playsInline = true;
      node.setAttribute('playsinline', '');
      node.preload = 'metadata';                  // load only the basics until it is visible
      node.disablePictureInPicture = true;
      node.setAttribute('aria-label', label);
    } else {
      node = new Image();
      node.src = url(src);
      node.alt = label;
      node.draggable = false;
    }
    node.dataset.index = index;
    if (inLightbox) node.dataset.lb = '1';
    return node;
  }

  function waitFor(node) {   // resolves true when the file is usable, false when it is missing
    return new Promise(function (resolve) {
      if (node.tagName === 'VIDEO') {
        if (node.readyState >= 1) return resolve(true);
        node.addEventListener('loadedmetadata', function () { resolve(true); }, { once: true });
        node.addEventListener('error', function () { resolve(false); }, { once: true });
        setTimeout(function () { resolve(true); }, VIDEO_WAIT_MS);
      } else {
        if (node.complete) return resolve(node.naturalWidth > 0);
        node.addEventListener('load', function () { resolve(true); }, { once: true });
        node.addEventListener('error', function () { resolve(false); }, { once: true });
      }
    });
  }

  /* ---------- Endless scrolling strip (used by the pages AND the full-screen view) ---------- */
  const marquees = [];

  function createMarquee(project, gallery, track, opts) {
    opts = opts || {};
    const m = {
      gallery: gallery, track: track,
      dir: opts.dir || 1,            // 1 = right to left, -1 = left to right
      inLightbox: !!opts.inLightbox,
      pos: 0, cycle: 0,
      hovered: false, paused: false, visible: true, ready: false, glide: null
    };
    gallery._marquee = m;

    // one set of images/videos (originals); copies are added by layout()
    let items = project.images.map(function (src, i) {
      const node = createMedia(src, project.title + ' – ' + (i + 1), i, m.inLightbox);
      track.appendChild(node);
      trackVideo(node);
      return node;
    });

    function apply() {
      track.style.transform = 'translate3d(' + (-m.pos) + 'px,0,0)';
    }
    m.apply = apply;

    function layout() {
      track.querySelectorAll('.clone').forEach(function (n) { untrackVideo(n); n.remove(); });

      const first = items[0];
      const last = items[items.length - 1];
      const gap = parseFloat(getComputedStyle(last).marginRight) || 0;
      // width of exactly ONE full set (including the gap after the last one)
      const cycle = last.getBoundingClientRect().right + gap - first.getBoundingClientRect().left;
      if (!(cycle > 0)) return;

      const ratio = m.cycle ? m.pos / m.cycle : 0;   // keep the position when resizing
      m.cycle = cycle;
      m.pos = ratio * cycle;

      // extra sets so the window is never empty, however few items there are
      const extraSets = Math.ceil(gallery.clientWidth / cycle);
      for (let s = 0; s < extraSets; s++) {
        items.forEach(function (node) {
          const copy = node.cloneNode();
          copy.classList.add('clone');
          copy.removeAttribute('aria-label');
          copy.setAttribute('aria-hidden', 'true');
          if (copy.tagName === 'IMG') copy.alt = '';
          track.appendChild(copy);
          trackVideo(copy);
        });
      }
      apply();
      m.ready = true;
    }

    // centre of every original item, measured from the start of the first one
    function centers() {
      const r0 = items[0].getBoundingClientRect();
      return items.map(function (node) {
        const r = node.getBoundingClientRect();
        return (r.left - r0.left) + r.width / 2;
      });
    }

    // put the item with this number (as in the data file) in the middle of the window
    m.centerOn = function (index) {
      if (!m.ready) return;
      let k = items.findIndex(function (n) { return Number(n.dataset.index) === index; });
      if (k < 0) k = 0;
      m.pos = wrap(centers()[k] - gallery.clientWidth / 2, m.cycle);
      apply();
    };

    // smoothly move to the next (+1) or previous (-1) item
    m.step = function (sign) {
      if (!m.ready) return;
      const half = gallery.clientWidth / 2;
      const view = m.pos + half;
      const cs = centers();
      let target = null;
      for (let k = -2; k <= 3; k++) {
        cs.forEach(function (c) {
          const v = c + k * m.cycle;
          if (sign > 0 && v > view + 2 && (target === null || v < target)) target = v;
          if (sign < 0 && v < view - 2 && (target === null || v > target)) target = v;
        });
      }
      if (target === null) return;
      m.glide = { from: m.pos, to: target - half, start: performance.now(), dur: GLIDE_MS };
    };

    let observer = null;
    m.whenReady = Promise.all(items.map(waitFor)).then(function (results) {
      if (m.destroyed) return;

      // files that could not be loaded (wrong path / name) are skipped
      const good = [];
      items.forEach(function (node, i) {
        if (results[i]) good.push(node);
        else {
          console.warn('Could not load: ' + project.images[Number(node.dataset.index)]);
          untrackVideo(node);
          node.remove();
        }
      });
      items = good;
      if (!items.length) return;

      layout();

      // a video whose size arrived late: measure again
      items.forEach(function (node) {
        if (node.tagName === 'VIDEO' && node.readyState < 1) {
          node.addEventListener('loadedmetadata', function () { if (!m.destroyed) layout(); }, { once: true });
        }
      });

      if ('ResizeObserver' in window) {
        let lastW = gallery.clientWidth, lastH = gallery.clientHeight;
        observer = new ResizeObserver(function () {
          if (gallery.clientWidth !== lastW || gallery.clientHeight !== lastH) {
            lastW = gallery.clientWidth; lastH = gallery.clientHeight;
            layout();
          }
        });
        observer.observe(gallery);
      } else {
        window.addEventListener('resize', layout);
        m.fallbackResize = layout;
      }
    });

    m.destroy = function () {
      m.destroyed = true;
      if (observer) observer.disconnect();
      if (m.fallbackResize) window.removeEventListener('resize', m.fallbackResize);
      track.querySelectorAll('video').forEach(untrackVideo);
      const i = marquees.indexOf(m);
      if (i > -1) marquees.splice(i, 1);
    };

    marquees.push(m);
    return m;
  }

  /* ---------- Animation loop (constant speed) ---------- */
  let lastTime = performance.now();
  function frame(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    marquees.forEach(function (m) {
      // page strips rest while the full-screen view is open, and the other way round
      if (!m.ready || m.inLightbox !== lightboxOpen) return;

      if (m.glide) {                                   // arrow-button step
        const g = m.glide;
        const t = Math.min((performance.now() - g.start) / g.dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        m.pos = wrap(g.from + (g.to - g.from) * eased, m.cycle);
        if (t >= 1) m.glide = null;
        m.apply();
        return;
      }
      if (!m.visible || m.hovered || m.paused) return;

      const scale = m.gallery.clientHeight / DESIGN_HEIGHT;
      m.pos = wrap(m.pos + m.dir * SCROLL_SPEED * scale * dt, m.cycle);
      m.apply();
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Projects on the page ---------- */
  const projectsBox = document.getElementById('projects');
  const canHover = window.matchMedia('(hover: hover)').matches;

  const visibilityObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.target._marquee.visible = en.isIntersecting; });
      }, { rootMargin: '150px' })
    : null;

  function createProject(project) {
    const root = el('div', 'project');
    const bg = el('div', 'project-background');

    const title = el('p', 'project-title');
    title.appendChild(el('span', 'project-name', project.title));
    if (project.subtitle) {
      title.appendChild(el('span', 'project-subtitle', ' (' + project.subtitle + ')'));
    }
    bg.appendChild(title);

    const bgImg = el('img', 'project-bg-img');
    bgImg.src = url(BG_IMAGE);
    bgImg.alt = '';
    bg.appendChild(bgImg);

    const gallery = el('div', 'gallery-container');
    const track = el('div', 'gallery-track');
    gallery.appendChild(track);
    bg.appendChild(gallery);
    root.appendChild(bg);
    projectsBox.appendChild(root);

    const m = createMarquee(project, gallery, track);
    if (canHover) {   // pause while the mouse is over the window (not on touch screens)
      gallery.addEventListener('mouseenter', function () { m.hovered = true; });
      gallery.addEventListener('mouseleave', function () { m.hovered = false; });
    }
    gallery.addEventListener('click', function (e) {
      const media = e.target.closest('img, video');
      if (media) openLightbox(project, Number(media.dataset.index), m.dir);
    });
    if (visibilityObserver) visibilityObserver.observe(gallery);
  }

  const projects = (category.projects || []).filter(function (p) { return p.images && p.images.length; });
  if (!projects.length) {
    projectsBox.appendChild(el('p', 'empty-message', 'No projects here yet.'));
  }
  projects.forEach(createProject);

  /* ---------- Full-screen view: the same endless strip, bigger ---------- */
  const lb = document.getElementById('lightbox');
  const lbStrip = lb.querySelector('.lightbox-strip');
  const lbTrack = lb.querySelector('.lightbox-track');
  const lbTitle = lb.querySelector('.lightbox-title');
  const lbSubtitle = lb.querySelector('.lightbox-subtitle');
  const lbControls = lb.querySelector('.lightbox-controls');
  const btnClose = lb.querySelector('.lightbox-close');
  const btnPrev = lb.querySelector('.lightbox-prev');
  const btnNext = lb.querySelector('.lightbox-next');
  const btnPlay = lb.querySelector('.lightbox-play');
  const btnReverse = lb.querySelector('.lightbox-reverse');

  let lbMarquee = null;
  let lbDir = 1;
  let lbPlaying = true;

  /* sound button: only appears when the project contains videos */
  let btnSound = null;
  let soundOn = false;
  let soundTimer = null;

  function updateSound() {
    // the sound belongs to the video nearest to the middle of the screen
    const vids = Array.from(lbTrack.querySelectorAll('video'));
    const centerX = window.innerWidth / 2;
    let best = null, bestDist = Infinity;
    vids.forEach(function (v) {
      const r = v.getBoundingClientRect();
      if (r.right < 0 || r.left > window.innerWidth) return;
      const d = Math.abs((r.left + r.right) / 2 - centerX);
      if (d < bestDist) { best = v; bestDist = d; }
    });
    vids.forEach(function (v) { v.muted = !(soundOn && v === best); });
  }

  function addSoundButton() {
    btnSound = el('button', 'lightbox-btn lightbox-sound');
    btnSound.type = 'button';
    btnSound.setAttribute('aria-pressed', 'false');
    btnSound.setAttribute('aria-label', 'Sound on or off');
    btnSound.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>' +
      '<span class="btn-label">Sound</span>';
    btnSound.addEventListener('click', function () {
      soundOn = !soundOn;
      btnSound.setAttribute('aria-pressed', String(soundOn));
      updateSound();
    });
    lbControls.appendChild(btnSound);
    lbControls.classList.add('has-sound');
    soundTimer = setInterval(updateSound, 250);
  }

  function removeSoundButton() {
    clearInterval(soundTimer);
    soundOn = false;
    if (btnSound) { btnSound.remove(); btnSound = null; }
    lbControls.classList.remove('has-sound');
  }

  function updateControls() {
    btnPlay.classList.toggle('is-paused', !lbPlaying);
    btnPlay.querySelector('.btn-label').textContent = lbPlaying ? 'Pause' : 'Play';
    btnPlay.setAttribute('aria-label', lbPlaying ? 'Pause scrolling' : 'Play scrolling');
    btnReverse.setAttribute('aria-pressed', String(lbDir === -1));
  }

  function openLightbox(project, index, dir) {
    lbDir = dir || 1;
    lbPlaying = true;
    lightboxOpen = true;
    syncAllVideos();                    // videos on the page rest

    lbTitle.textContent = project.title;
    lbSubtitle.textContent = project.subtitle || '';
    updateControls();

    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');

    removeSoundButton();
    if (project.images.some(isVideo)) addSoundButton();

    lbStrip.classList.remove('ready');
    lbTrack.innerHTML = '';
    lbTrack.style.transform = '';
    const current = createMarquee(project, lbStrip, lbTrack, { inLightbox: true, dir: lbDir });
    lbMarquee = current;
    current.whenReady.then(function () {
      if (lbMarquee !== current) return;
      current.centerOn(index);          // the clicked item starts in the middle
      lbStrip.classList.add('ready');
    });
    lb.focus();
  }

  function closeLightbox() {
    lightboxOpen = false;
    removeSoundButton();
    if (lbMarquee) { lbMarquee.destroy(); lbMarquee = null; }
    lbTrack.innerHTML = '';
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    syncAllVideos();                    // videos on the page play again
  }

  const stepPrev = function () { if (lbMarquee) lbMarquee.step(-1); };
  const stepNext = function () { if (lbMarquee) lbMarquee.step(1); };
  const togglePlay = function () {
    lbPlaying = !lbPlaying;
    if (lbMarquee) lbMarquee.paused = !lbPlaying;
    updateControls();
  };
  const reverse = function () {
    lbDir = -lbDir;
    if (lbMarquee) lbMarquee.dir = lbDir;
    updateControls();
  };

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', stepPrev);
  btnNext.addEventListener('click', stepNext);
  btnPlay.addEventListener('click', togglePlay);
  btnReverse.addEventListener('click', reverse);

  // click on a video in the full-screen view: pause / play that video
  lbTrack.addEventListener('click', function (e) {
    const v = e.target.closest('video');
    if (!v) return;
    if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
  });

  lb.addEventListener('click', function (e) {   // click on the dark background closes it
    if (!e.target.closest('.lightbox-strip, .lightbox-caption, .lightbox-arrow, .lightbox-close, .lightbox-controls')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') stepPrev();
    else if (e.key === 'ArrowRight') stepNext();
    else if (e.key === ' ' && !(document.activeElement instanceof HTMLButtonElement)) {
      e.preventDefault();
      togglePlay();
    }
  });

  let touchStartX = null;
  lb.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 50) (dx > 0 ? stepPrev : stepNext)();
  }, { passive: true });
})();
