(function () {
  'use strict';

  /* ---------- Settings ---------- */
  const COLUMNS = 3;
  const ROWS = 4;
  const ITEMS_PER_PAGE = COLUMNS * ROWS; // 12 works per page
  const ZOOM_FACTOR = 3;                 // hover magnifier strength

  /* ---------- Build the gallery from the data ---------- */
  const grid = document.getElementById('gallery-grid');
  const pagination = document.getElementById('pagination');

  const totalPages = Math.max(1, Math.ceil(visualArts.length / ITEMS_PER_PAGE));
  let page = parseInt(new URLSearchParams(window.location.search).get('page'), 10);
  if (!page || page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createItem(work) {
    const item = el('div', 'gallery-item');

    const container = el('div', 'gallery-image-container');
    const img = el('img', 'gallery-image');
    img.src = work.image;
    img.alt = work.title || 'Visual art';
    img.loading = 'lazy';
    container.appendChild(img);
    item.appendChild(container);

    item.appendChild(el('p', 'image-title', work.title || ''));
    if (work.technique) item.appendChild(el('p', '', work.technique));

    if (work.year) {
      const p = el('p');
      const i = el('i', '', work.year + (work.event ? ' (' + work.event + ')' : ''));
      p.appendChild(i);
      item.appendChild(p);
    }
    return item;
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  visualArts.slice(start, start + ITEMS_PER_PAGE).forEach(function (work) {
    grid.appendChild(createItem(work));
  });

  function renderPagination() {
    if (totalPages < 2) return; // a single page needs no numbers
    for (let n = 1; n <= totalPages; n++) {
      const wrapper = el('div', 'visualarts-page');
      const link = el('a', n === page ? 'active' : '', String(n));
      link.href = 'visual-arts.html?page=' + n;
      wrapper.appendChild(link);
      pagination.appendChild(wrapper);
    }
  }
  renderPagination();

  /* ---------- Elements (items exist only after the build above) ---------- */
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = lightbox.querySelector('.lightbox-image');
  const lbCaption = lightbox.querySelector('.lightbox-caption');
  const lbCounter = lightbox.querySelector('.lightbox-counter');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  let lastTrigger = null;

  /* ---------- Hover magnifier ---------- */
  function handleMouseMove(e) {
    const container = e.currentTarget;
    const image = container.querySelector('img');
    const rect = container.getBoundingClientRect();

    const Px = (e.clientX - rect.left) / rect.width;
    const Py = (e.clientY - rect.top) / rect.height;

    const excess = ZOOM_FACTOR - 1;
    const translateX = rect.width * (excess / 2) * (1 - 2 * Px);
    const translateY = rect.height * (excess / 2) * (1 - 2 * Py);

    image.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${ZOOM_FACTOR})`;
  }

  function handleMouseLeave(e) {
    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
  }

  /* ---------- Lightbox ---------- */
  function fillCaption(item) {
    lbCaption.innerHTML = '';
    Array.from(item.children).forEach(function (child) {
      if (!child.classList.contains('gallery-image-container')) {
        lbCaption.appendChild(child.cloneNode(true));
      }
    });
  }

  function showImage(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const thumb = item.querySelector('.gallery-image');
    const title = item.querySelector('.image-title');

    lbImage.classList.remove('loaded');
    lbImage.onload = function () { lbImage.classList.add('loaded'); };
    lbImage.src = thumb.src;
    lbImage.alt = title ? title.textContent : thumb.alt;

    fillCaption(item);
    lbCounter.textContent = (currentIndex + 1) + ' / ' + items.length;

    [currentIndex - 1, currentIndex + 1].forEach(function (i) {
      const n = items[(i + items.length) % items.length].querySelector('.gallery-image');
      new Image().src = n.src;
    });
  }

  function openLightbox(index, trigger) {
    lastTrigger = trigger || null;
    showImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    btnClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (lastTrigger) lastTrigger.focus();
  }

  const showPrev = function () { showImage(currentIndex - 1); };
  const showNext = function () { showImage(currentIndex + 1); };

  items.forEach(function (item, index) {
    const container = item.querySelector('.gallery-image-container');

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'button');
    container.addEventListener('click', function () {
      openLightbox(index, container);
    });
    container.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index, container);
      }
    });
  });

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', showPrev);
  btnNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', function (e) {
    if (!e.target.closest('.lightbox-image, .lightbox-caption, .lightbox-arrow, .lightbox-close')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showPrev();
    else if (e.key === 'ArrowRight') showNext();
  });

  let touchStartX = null;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 50) (dx > 0 ? showPrev : showNext)();
  }, { passive: true });
})();
