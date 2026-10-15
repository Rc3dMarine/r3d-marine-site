(() => {
  const grid = document.querySelector('#rd-media-grid');
  const empty = document.querySelector('#rd-media-empty');
  if (!grid) return;

  const photoSlots = Array.from({ length: 6 }, (_, i) => String(i + 1).padStart(2, '0'));
  const videoSlots = Array.from({ length: 4 }, (_, i) => String(i + 1).padStart(2, '0'));
  let loaded = 0;

  function markLoaded() {
    loaded += 1;
    if (empty) empty.hidden = true;
  }

  function tryPhoto(slot) {
    const extensions = ['jpg', 'png', 'webp'];
    let index = 0;
    const item = document.createElement('figure');
    item.className = 'rd-media-item';
    item.hidden = true;
    item.innerHTML = `<span class="rd-media-badge">R&D / PHOTO ${slot}</span><img alt="R3D Marine research and development test ${slot}" loading="lazy" decoding="async">`;
    const img = item.querySelector('img');
    grid.appendChild(item);

    const next = () => {
      if (index >= extensions.length) {
        item.remove();
        return;
      }
      img.src = `assets/rd/photo-${slot}.${extensions[index++]}`;
    };

    img.onload = () => {
      item.hidden = false;
      markLoaded();
    };
    img.onerror = next;
    next();
  }

  function tryVideo(slot) {
    const extensions = ['mp4', 'webm'];
    let index = 0;
    const item = document.createElement('figure');
    item.className = 'rd-media-item';
    item.hidden = true;
    item.innerHTML = `<span class="rd-media-badge">R&D / VIDEO ${slot}</span><video controls muted playsinline preload="metadata" aria-label="R3D Marine research and development test video ${slot}"></video>`;
    const video = item.querySelector('video');
    grid.appendChild(item);

    const next = () => {
      if (index >= extensions.length) {
        item.remove();
        return;
      }
      video.src = `assets/rd/video-${slot}.${extensions[index++]}`;
      video.load();
    };

    video.addEventListener('loadedmetadata', () => {
      item.hidden = false;
      markLoaded();
    }, { once: true });
    video.addEventListener('error', next);
    next();
  }

  photoSlots.forEach(tryPhoto);
  videoSlots.forEach(tryVideo);

  window.setTimeout(() => {
    if (loaded === 0 && empty) empty.hidden = false;
  }, 1200);
})();
