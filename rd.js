(() => {
  const grid = document.querySelector('#rd-media-grid');
  const empty = document.querySelector('#rd-media-empty');
  if (!grid) return;

  const photoSlots = Array.from({ length: 6 }, (_, i) => String(i + 1).padStart(2, '0'));
  const videoSlots = Array.from({ length: 6 }, (_, i) => String(i + 1).padStart(2, '0'));
  const testLabels = {
    '01': 'MERCURY OUTBOARD / BENCH TEST',
    '02': 'MERCURY OUTBOARD / PROTOTYPE TEST',
    '03': 'PRINT VALIDATION',
    '04': 'MECHANICAL TEST',
    '05': 'RC SYSTEM TEST',
    '06': 'WATER TEST'
  };
  let loaded = 0;

  const videoObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2 && !document.hidden) {
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: [0, 0.2, 0.6] })
    : null;

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
      `assets/rd/video-${slot}.mp4`,
      `assets/rd/video-${slot}.webm`,
      `assets/rd/${slot}.mp4`,
      `assets/rd/${slot}.webm`,
      `assets/rd/${slot}.mov`,
      `assets/rd/video-${slot}.mov`
    ];

    let index = 0;
    let revealed = false;
    let candidateTimer = null;
    const item = document.createElement('figure');
    item.className = 'rd-media-item rd-video-item';
    item.hidden = true;
    const label = testLabels[slot] || `TEST ${slot}`;
    item.innerHTML = `<span class="rd-media-badge">R&D / ${label}</span><video autoplay loop muted playsinline preload="metadata" aria-label="R3D Marine ${label} video"></video>`;
    const video = item.querySelector('video');
    grid.appendChild(item);

    const clearCandidateTimer = () => {
      if (candidateTimer) window.clearTimeout(candidateTimer);
      candidateTimer = null;
    };

    const next = () => {
      clearCandidateTimer();
      if (revealed) return;
      if (index >= candidates.length) {
        item.remove();
        return;
      }
      video.removeAttribute('src');
      video.load();
      video.src = candidates[index++];
      video.load();
      candidateTimer = window.setTimeout(() => {
        if (!revealed) next();
      }, 5000);
    };

    const reveal = () => {
      if (revealed) return;
      clearCandidateTimer();
      revealed = true;
      item.hidden = false;
      markLoaded();
      if (videoObserver) videoObserver.observe(video);
      else {
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    };

    video.addEventListener('canplay', reveal, { once: true });
    video.addEventListener('loadeddata', reveal, { once: true });
    video.addEventListener('error', () => {
      if (!revealed) next();
    });
    next();
  }

  videoSlots.forEach(tryVideo);
  photoSlots.forEach(tryPhoto);

  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('.rd-video-item video').forEach(video => {
      if (document.hidden) video.pause();
    });
  });

  window.setTimeout(() => {
    if (loaded === 0 && empty) empty.hidden = false;
  }, 6500);
})();
