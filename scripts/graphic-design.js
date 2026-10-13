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

  /* ---------- Helpers ---------- */
  const categories = graphicDesign;
  const category = categories.find(function (c) { return c.id === document.body.dataset.category; }) || categories[0];
  document.title = category.label + ' | GB';

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

  /* ---------- Endless scrolling strip (used by the pages AND the full-screen view) ---------- */
  const marquees = [];
  let lightboxOpen = false;

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

    // one set of images (originals); copies are added by layout()
    const imgs = project.images.map(function (src, i) {
      const img = new Image();
      img.src = url(src);
      img.alt = project.title + ' – ' + (i + 1);
      img.dataset.index = i;
      img.draggable = false;
      track.appendChild(img);
      return img;
    });

    function apply() {
      track.style.transform = 'translate3d(' + (-m.pos) + 'px,0,0)';
    }
    m.apply = apply;

    function layout() {
      track.querySelectorAll('.clone').forEach(function (n) { n.remove(); });

      const first = imgs[0];
      const last = imgs[imgs.length - 1];
      const gap = parseFloat(getComputedStyle(last).marginRight) || 0;
      // width of exactly ONE full set of images (including the gap after the last one)
      const cycle = last.getBoundingClientRect().right + gap - first.getBoundingClientRect().left;
      if (!(cycle > 0)) return;

      const ratio = m.cycle ? m.pos / m.cycle : 0;   // keep the position when resizing
      m.cycle = cycle;
      m.pos = ratio * cycle;

      // extra sets so the window is never empty, however few images there are
      const extraSets = Math.ceil(gallery.clientWidth / cycle);
      for (let s = 0; s < extraSets; s++) {
        imgs.forEach(function (img) {
          const copy = img.cloneNode();
          copy.classList.add('clone');
          copy.alt = '';
          copy.setAttribute('aria-hidden', 'true');
          track.appendChild(copy);
        });
      }
      apply();
      m.ready = true;
    }

    // centre of every original image, measured from the start of the first one
    function centers() {
      const r0 = imgs[0].getBoundingClientRect();
      return imgs.map(function (img) {
        const r = img.getBoundingClientRect();
        return (r.left - r0.left) + r.width / 2;
      });
    }

    // put image number `index` in the middle of the window
    m.centerOn = function (index) {
      if (!m.ready) return;
      m.pos = wrap(centers()[index] - gallery.clientWidth / 2, m.cycle);
      apply();
    };

    // smoothly move to the next (+1) or previous (-1) image
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
    m.whenReady = Promise.all(imgs.map(function (img) {
      return new Promise(function (resolve) {
        if (img.complete) resolve();
        else {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }
      });
    })).then(function () {
      if (m.destroyed) return;
      layout();
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

    // on phones the subtitle is shown under the card instead of inside the tab
    if (project.subtitle) root.appendChild(el('p', 'project-note', project.subtitle));

    projectsBox.appendChild(root);

    const m = createMarquee(project, gallery, track);
    if (canHover) {   // pause while the mouse is over the window (not on touch screens)
      gallery.addEventListener('mouseenter', function () { m.hovered = true; });
      gallery.addEventListener('mouseleave', function () { m.hovered = false; });
    }
    gallery.addEventListener('click', function (e) {
      const img = e.target.closest('img');
      if (img) openLightbox(project, Number(img.dataset.index), m.dir);
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
  const btnClose = lb.querySelector('.lightbox-close');
  const btnPrev = lb.querySelector('.lightbox-prev');
  const btnNext = lb.querySelector('.lightbox-next');
  const btnPlay = lb.querySelector('.lightbox-play');
  const btnReverse = lb.querySelector('.lightbox-reverse');

  let lbMarquee = null;
  let lbDir = 1;
  let lbPlaying = true;

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

    lbTitle.textContent = project.title;
    lbSubtitle.textContent = project.subtitle || '';
    updateControls();

    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');

    lbStrip.classList.remove('ready');
    lbTrack.innerHTML = '';
    lbTrack.style.transform = '';
    const current = createMarquee(project, lbStrip, lbTrack, { inLightbox: true, dir: lbDir });
    lbMarquee = current;
    current.whenReady.then(function () {
      if (lbMarquee !== current) return;
      current.centerOn(index);          // the clicked image starts in the middle
      lbStrip.classList.add('ready');
    });
    lb.focus();
  }

  function closeLightbox() {
    lightboxOpen = false;
    if (lbMarquee) { lbMarquee.destroy(); lbMarquee = null; }
    lbTrack.innerHTML = '';
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
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
