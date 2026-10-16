(function () {
  'use strict';

  /* ---------- Settings ---------- */
  const PURPLE = '#5000D2';
  const TEAL = '#6DBFB3';              // gradient: teal (start) -> purple (end of the filled part)
  const CIRCLE_TRAIL = '#F5F5F5';
  const LINE_TRAIL = '#E2E2E2';
  const LINE_STROKE = 2.2;             // bar thickness (in % of the bar's width)
  const CIRCLE_STROKE = 8;             // thickness of the coloured ring (circle is 100 units wide)
  const CIRCLE_TRAIL_WIDTH = 15;       // thickness of the light grey ring
  const RING_STEP_DEG = 4;             // the ring gradient is built from little arcs of this size

  // animation (same as on the old page)
  const ANIMATION_MS = 2000;           // time the fill animation takes
  const DELAY_BETWEEN_CIRCLES = 100;   // ms between the circles
  const LINES_START_EXTRA = 500;       // ms the bars wait after the last circle started
  const DELAY_BETWEEN_LINES = 150;     // ms between the bars

  const TIP_SECONDS = 3;               // how long a tapped software name stays visible

  /* ---------- Helpers ---------- */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function toProgress(score) {         // score 1-100  ->  0-1
    const s = Math.max(0, Math.min(100, Number(score) || 0));
    return s / 100;
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function svgEl(name, attrs) {
    const node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const TEAL_RGB = hexToRgb(TEAL);
  const PURPLE_RGB = hexToRgb(PURPLE);
  function mixColor(t) {               // t = 0 -> teal, t = 1 -> purple
    t = Math.max(0, Math.min(1, t));
    const c = TEAL_RGB.map(function (v, i) { return Math.round(v + (PURPLE_RGB[i] - v) * t); });
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  }

  // The progress path is invisible until its animation starts
  // (a round-capped path of length 0 would show a little dot).
  function runAnimation(bar, progress, delay) {
    setTimeout(function () {
      bar.path.style.opacity = 1;
      bar.animate(progress, { duration: ANIMATION_MS });
    }, delay);
  }

  /* Circle: a gradient that follows the curve.
     SVG has no "conic" gradient, so the ring is built from many short coloured arcs
     (teal at the top -> purple where the filled part ends). The normal animated
     progress path is used as a MASK on them, so the animation stays the same
     and the ends are round. */
  function addGradientRing(bar, progress, id) {
    const radius = 50 - Math.max(CIRCLE_STROKE, CIRCLE_TRAIL_WIDTH) / 2;
    const capDeg = (CIRCLE_STROKE / 2) / radius * 180 / Math.PI;   // how far a round cap sticks out
    const sweep = Math.max(progress * 360, 1);
    const from = -Math.ceil(capDeg) - 1;
    const to = sweep + Math.ceil(capDeg) + 1;

    function point(deg) {
      const r = deg * Math.PI / 180;                               // 0 deg = top, clockwise
      return (50 + radius * Math.sin(r)).toFixed(2) + ' ' + (50 - radius * Math.cos(r)).toFixed(2);
    }

    const maskId = 'ring-mask-' + id;
    const mask = svgEl('mask', { id: maskId, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 100, height: 100 });
    bar.path.setAttribute('stroke', '#fff');
    bar.path.setAttribute('stroke-linecap', 'round');
    mask.appendChild(bar.path);                                    // the animated path now works as the mask
    const defs = svgEl('defs');
    defs.appendChild(mask);
    bar.svg.insertBefore(defs, bar.svg.firstChild);

    const group = svgEl('g', { mask: 'url(#' + maskId + ')' });
    for (let a = from; a < to; a += RING_STEP_DEG) {
      const a2 = Math.min(a + RING_STEP_DEG + 1, to);              // +1 deg overlap: no thin seams
      group.appendChild(svgEl('path', {
        d: 'M ' + point(a) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + point(a2),
        fill: 'none',
        stroke: mixColor(((a + a2) / 2) / sweep),
        'stroke-width': CIRCLE_STROKE
      }));
    }
    bar.svg.appendChild(group);
    bar.path.style.opacity = 0;
  }

  const softwareGrid = document.getElementById('software-grid');
  const abilityList = document.getElementById('ability-list');
  const circles = [];
  const lines = [];

  /* ---------- Software circles ---------- */
  skillsData.software.forEach(function (item, i) {
    const wrap = el('div', 'skill-item');
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-label', item.name + ' – ' + item.score + '%');

    const circle = el('div', 'circle-wrapper');
    circle.id = 'software-circle-' + i;
    const tip = el('span', 'skill-tip', item.name);

    wrap.appendChild(circle);
    wrap.appendChild(tip);
    softwareGrid.appendChild(wrap);

    if (typeof ProgressBar !== 'undefined') {
      const bar = new ProgressBar.Circle(circle, {
        color: '#fff',                   // only used as the mask, the real colours come from the gradient
        strokeWidth: CIRCLE_STROKE,
        trailWidth: CIRCLE_TRAIL_WIDTH,
        trailColor: CIRCLE_TRAIL,
        easing: 'easeInOut',
        text: {
          value: item.label,             // the text stays static and centred
          className: 'progress-text',
          style: {
            color: 'black',
            position: 'absolute',
            top: '50%',
            left: '50%',
            padding: 0,
            margin: 0,
            transform: 'translate(-50%, -50%)'
          }
        }
      });
      const progress = toProgress(item.score);
      addGradientRing(bar, progress, i);
      circles.push({ bar: bar, progress: progress });
    } else {
      circle.textContent = item.label;   // fallback if the library could not be loaded
    }
  });

  /* ---------- Ability bars ---------- */
  skillsData.abilities.forEach(function (item, i) {
    const row = el('div', 'ability-item');
    row.appendChild(el('span', 'ability-label', item.name));

    const holder = el('div', 'ability-bar');
    holder.id = 'ability-bar-' + i;
    holder.style.aspectRatio = '100 / ' + LINE_STROKE;   // keeps the round ends round at any width
    row.appendChild(holder);
    abilityList.appendChild(row);

    if (typeof ProgressBar !== 'undefined') {
      const progress = toProgress(item.score);
      const bar = new ProgressBar.Line(holder, {
        strokeWidth: LINE_STROKE,
        trailWidth: LINE_STROKE,
        easing: 'easeInOut',
        color: PURPLE,
        trailColor: LINE_TRAIL,
        svgStyle: { width: '100%', height: '100%' }
      });

      // Round ends: the line is shortened by half its thickness on both sides,
      // so the round caps end exactly at the edges of the bar.
      const r = LINE_STROKE / 2;
      const d = 'M ' + r + ',' + r + ' L ' + (100 - r) + ',' + r;
      [bar.path, bar.trail].forEach(function (p) {
        p.setAttribute('d', d);
        p.setAttribute('stroke-linecap', 'round');
      });
      const length = bar.path.getTotalLength();
      bar.path.style.strokeDasharray = length + ' ' + length;
      bar.path.style.strokeDashoffset = length;
      bar.path.style.opacity = 0;

      // gradient from teal (left) to purple (end of the filled part)
      const gradId = 'ability-gradient-' + i;
      const defs = svgEl('defs');
      const grad = svgEl('linearGradient', {
        id: gradId, gradientUnits: 'userSpaceOnUse',
        x1: r, y1: 0, x2: Math.max(r + progress * (100 - 2 * r), r + 1), y2: 0
      });
      grad.appendChild(svgEl('stop', { offset: 0, 'stop-color': TEAL }));
      grad.appendChild(svgEl('stop', { offset: 1, 'stop-color': PURPLE }));
      defs.appendChild(grad);
      bar.svg.insertBefore(defs, bar.svg.firstChild);
      bar.path.setAttribute('stroke', 'url(#' + gradId + ')');

      lines.push({ bar: bar, progress: progress });
    }
  });

  /* ---------- Start the animations when the section is on screen ---------- */
  let started = false;
  function startAnimations() {
    if (started) return;
    started = true;

    circles.forEach(function (c, i) {
      runAnimation(c.bar, c.progress, i * DELAY_BETWEEN_CIRCLES);
    });

    const linesStart = circles.length * DELAY_BETWEEN_CIRCLES + LINES_START_EXTRA;
    lines.forEach(function (l, i) {
      runAnimation(l.bar, l.progress, linesStart + i * DELAY_BETWEEN_LINES);
    });
  }

  const skillsSection = document.querySelector('.skills');
  if ('IntersectionObserver' in window && skillsSection) {
    const io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        startAnimations();
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(skillsSection);
  } else {
    startAnimations();
  }

  /* ---------- Software names: hover on desktop, tap on phones ---------- */
  let revealed = null;
  let revealTimer = null;

  function placeTip(item) {
    // keep the little label inside the screen (the circles at the edges would push it out)
    const tip = item.querySelector('.skill-tip');
    const r = item.getBoundingClientRect();
    const half = tip.offsetWidth / 2;
    const center = r.left + r.width / 2;
    const margin = 8;
    let shift = 0;
    if (center - half < margin) shift = margin - (center - half);
    else if (center + half > window.innerWidth - margin) shift = (window.innerWidth - margin) - (center + half);
    tip.style.setProperty('--tip-shift', shift + 'px');
  }

  function hideTip() {
    clearTimeout(revealTimer);
    if (revealed) revealed.classList.remove('is-revealed');
    revealed = null;
  }

  function showTip(item) {
    hideTip();                                   // the previous one disappears
    placeTip(item);
    item.classList.add('is-revealed');
    revealed = item;
    revealTimer = setTimeout(hideTip, TIP_SECONDS * 1000);   // and this one after 3 seconds
  }

  softwareGrid.querySelectorAll('.skill-item').forEach(function (item) {
    item.addEventListener('mouseenter', function () { placeTip(item); });
    item.addEventListener('focus', function () { placeTip(item); });
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      showTip(item);
    });
  });

  // tap on anything else hides it right away
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.skill-item')) hideTip();
  });
})();
