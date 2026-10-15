(() => {
  const grid = document.querySelector('#rd-media-grid');
  const empty = document.querySelector('#rd-media-empty');
  if (!grid) return;

  const photoSlots = Array.from({ length: 6 }, (_, i) => String(i + 1).padStart(2, '0'));
  const videoSlots = Array.from({ length: 6 }, (_, i) => String(i + 1).padStart(2, '0'));
  const videoLabels = {
    '01': 'BENCH TEST',
    '02': 'PROTOTYPE TEST',
    '03': 'PRINT VALIDATION',
    '04': 'MECHANICAL TEST',
    '05': 'WATER TEST',
    '06': 'FINAL VALIDATION'
  };
  let loaded = 0;

  function markLoaded() {
    loaded += 1;
    if (empty) empty.hidden = true;
  }

  function tryPhoto(slot) {
    const candidates = [
      `assets/rd/photo-${slot}.jpg`,
      `assets/rd/photo-${slot}.png`,
      `assets/rd/photo-${slot}.webp`
    ];
    let index = 0;
    const item = document.createElement('figure');
    item.className = 'rd-media-item rd-photo-item';
    item.hidden = true;
    item.innerHTML = `<span class="rd-media-badge">R&D / PHOTO ${slot}</span><img alt="R3D Marine research and development test ${slot}" loading="lazy" decoding="async">`;
    const img = item.querySelector('img');
    grid.appendChild(item);

    const next = () => {
      if (index >= candidates.length) {
        item.remove();
        return;
      }
      img.src = candidates[index++];
    };

    img.onload = () => {
      item.hidden = false;
      markLoaded();
    };
    img.onerror = next;
    next();
  }

  function tryVideo(slot) {
    const candidates = [
      `assets/rd/${slot}.mov`,
      `assets/rd/video-${slot}.mov`,
      `assets/rd/video-${slot}.mp4`,
      `assets/rd/video-${slot}.webm`
    ];
    let index = 0;
    let revealed = false;
    const label = videoLabels[slot] || `TEST ${slot}`;
    const item = document.createElement('figure');
    item.className = 'rd-media-item rd-video-item';
    item.hidden = true;
    item.innerHTML = `<span class="rd-media-badge">R&D / ${label}</span><video autoplay loop muted playsinline preload="metadata" aria-label="R3D Marine ${label.toLowerCase()} video"></video>`;
    const video = item.querySelector('video');
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    grid.appendChild(item);

    const next = () => {
      if (index >= candidates.length) {
        if (!revealed) item.remove();
        return;
      }
      video.src = candidates[index++];
      video.load();
    };

    const revealAndPlay = () => {
      if (!revealed) {
        revealed = true;
        item.hidden = false;
        markLoaded();
      }
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
    };

    video.addEventListener('loadedmetadata', revealAndPlay);
    video.addEventListener('canplay', revealAndPlay);
    video.addEventListener('error', () => {
      if (!revealed) next();
    });
    next();
  }

  // Videos are shown first because they communicate the testing process best.
  videoSlots.forEach(tryVideo);
  photoSlots.forEach(tryPhoto);

  window.setTimeout(() => {
    if (loaded === 0 && empty) empty.hidden = false;
  }, 1600);
})();
