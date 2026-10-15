const MEDIA = window.R3D_MEDIA || {};
const M = key => MEDIA[key];

const CATALOG = window.R3D_PROJECTS || { models: {}, order: {} };
const models = CATALOG.models || {};
const engineOrder = CATALOG.order?.engines || [];
const hullOrder = CATALOG.order?.hulls || [];
const systemOrder = CATALOG.order?.systems || [];
const latestOrder = CATALOG.order?.latest || [];

function imageSrc(image) {
  return typeof image === 'string' ? image : image?.src || '';
}

function imageFallback(image) {
  return typeof image === 'object' && image ? image.fallback || '' : '';
}

function imageTag(image, alt, loading = 'lazy') {
  const src = imageSrc(image);
  const fallback = imageFallback(image);
  return `<img src="${src}" data-fallback="${fallback}" alt="${alt}" loading="${loading}" decoding="async">`;
}

function setImageElement(element, image, alt) {
  if (!element || !image) return;
  element.dataset.fallbackUsed = '0';
  element.dataset.fallback = imageFallback(image);
  element.alt = alt;
  element.src = imageSrc(image);
}

// Every project first tries its easy-to-edit local file. If that file is not
// present yet, the image automatically falls back to the previous hosted copy.
document.addEventListener('error', event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement)) return;

  const fallback = img.dataset.fallback;
  if (fallback && img.dataset.fallbackUsed !== '1') {
    img.dataset.fallbackUsed = '1';
    img.src = fallback;
    return;
  }

  img.style.background = '#111a20';
  if (!img.alt) img.alt = 'Image unavailable';
}, true);

function projectStateClass(model) {
  return model.status === 'AVAILABLE' ? 'is-available' : 'is-development';
}

function statusLabel(model) {
  return `<span class="status ${projectStateClass(model)}">${model.status}</span>`;
}

function modelCard(id) {
  const model = models[id];
  if (!model) return '';
  return `<article class="model-card ${projectStateClass(model)}" data-model="${id}" tabindex="0" role="button" aria-label="View ${model.title}">
    ${imageTag(model.images[0], model.title)}
    <div class="card-copy">
      <div class="card-meta"><span>${model.category}</span>${statusLabel(model)}</div>
      <h3>${model.title}</h3>
      <span class="card-link">VIEW DETAILS ↗</span>
    </div>
  </article>`;
}

function hullRow(id) {
  const model = models[id];
  if (!model) return '';
  return `<article class="hull-row ${projectStateClass(model)}" data-model="${id}" tabindex="0" role="button" aria-label="View ${model.title}">
    <div class="hull-media">${imageTag(model.images[0], model.title)}</div>
    <div class="hull-copy">
      <div class="card-meta"><span>${model.category}</span>${statusLabel(model)}</div>
      <h3>${model.title}</h3>
      <p>${model.description}</p>
      <span class="card-link">VIEW GALLERY ↗</span>
    </div>
  </article>`;
}

function latestCard(id) {
  const model = models[id];
  if (!model) return '';
  return `<article class="latest-card ${projectStateClass(model)}" data-model="${id}" tabindex="0" role="button" aria-label="View ${model.title}">
    ${imageTag(model.images[0], model.title)}
    <div class="latest-meta"><span>${model.status}</span><h3>${model.title}</h3></div>
  </article>`;
}

const headerLogo = document.querySelector('#header-logo');
headerLogo.src = 'assets/brand/r3d-logo.png';
headerLogo.dataset.fallback = M('brand/r3d-logo.png') || '';

if (models['nimbus-c11']?.images?.length) {
  setImageElement(document.querySelector('#hero-image'), models['nimbus-c11'].images[0], 'Nimbus C11 scale model render');
}

document.querySelector('#engine-grid').innerHTML = engineOrder.map(modelCard).join('');
document.querySelector('#hull-list').innerHTML = hullOrder.map(hullRow).join('');
document.querySelector('#system-grid').innerHTML = systemOrder.map(modelCard).join('');
document.querySelector('#latest-grid').innerHTML = latestOrder.map(latestCard).join('');

// Engineering showcase reuses real project renders already maintained in the catalogue.
if (models['mercury-600']?.images?.length) {
  setImageElement(
    document.querySelector('#engineering-geometry-image'),
    models['mercury-600'].images[0],
    'Mercury 600 scale outboard geometry render'
  );
}
if (models['universal-trim']?.images?.length) {
  setImageElement(
    document.querySelector('#engineering-system-image'),
    models['universal-trim'].images[0],
    'Universal trim mechanical system render'
  );
}

const modal = document.querySelector('#model-modal');
const mainImage = document.querySelector('#modal-main-image');
const thumbs = document.querySelector('#modal-thumbs');
const title = document.querySelector('#modal-title');
const kicker = document.querySelector('#modal-kicker');
const desc = document.querySelector('#modal-description');
const action = document.querySelector('#modal-action');
const counter = document.querySelector('#modal-counter');
let activeModel = null;
let activeIndex = 0;
let lastFocused = null;

function renderImage() {
  const model = models[activeModel];
  if (!model) return;

  const image = model.images[activeIndex];
  mainImage.classList.add('is-switching');
  mainImage.onload = () => mainImage.classList.remove('is-switching');
  mainImage.dataset.fallbackUsed = '0';
  mainImage.dataset.fallback = imageFallback(image);
  mainImage.src = imageSrc(image);
  mainImage.alt = `${model.title} view ${activeIndex + 1}`;

  [...thumbs.children].forEach((button, i) => button.classList.toggle('active', i === activeIndex));

  if (counter) {
    counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(model.images.length).padStart(2, '0')}`;
  }

  const hideArrows = model.images.length < 2;
  document.querySelector('#prev-image').style.display = hideArrows ? 'none' : '';
  document.querySelector('#next-image').style.display = hideArrows ? 'none' : '';
}

function openModel(id) {
  const model = models[id];
  if (!model) return;

  lastFocused = document.activeElement;
  activeModel = id;
  activeIndex = 0;
  title.textContent = model.title;
  kicker.textContent = `${model.category} / ${model.status}`;
  desc.textContent = model.description;

  thumbs.innerHTML = model.images.map((image, i) => `
    <button class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="${model.title} image ${i + 1}">
      ${imageTag(image, `${model.title} thumbnail ${i + 1}`)}
    </button>
  `).join('');

  action.innerHTML = model.cults
    ? `<a class="modal-button" href="${model.cults}" target="_blank" rel="noopener">VIEW / DOWNLOAD ON CULTS3D ↗</a>`
    : `<div class="development-note">IN DEVELOPMENT — RELEASE LINK WILL BE ADDED WHEN READY.</div>`;

  renderImage();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.querySelector('#modal-close').focus({ preventScroll: true });
}

function closeModal() {
  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
}

function moveImage(direction) {
  const model = models[activeModel];
  if (!model) return;
  activeIndex = (activeIndex + direction + model.images.length) % model.images.length;
  renderImage();
}

document.addEventListener('click', event => {
  const thumb = event.target.closest('.thumb');
  if (thumb) {
    activeIndex = Number(thumb.dataset.index);
    renderImage();
    return;
  }

  const card = event.target.closest('[data-model]');
  if (card) openModel(card.dataset.model);
});

document.querySelector('#modal-close').addEventListener('click', closeModal);
document.querySelector('#prev-image').addEventListener('click', event => {
  event.stopPropagation();
  moveImage(-1);
});
document.querySelector('#next-image').addEventListener('click', event => {
  event.stopPropagation();
  moveImage(1);
});
modal.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
  if (modal.classList.contains('is-open') && event.key === 'ArrowLeft') moveImage(-1);
  if (modal.classList.contains('is-open') && event.key === 'ArrowRight') moveImage(1);

  if (modal.classList.contains('is-open') && event.key === 'Tab') {
    const focusable = [...modal.querySelectorAll('button, a[href]')].filter(el => !el.disabled && el.offsetParent !== null);
    if (focusable.length) {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  if ((event.key === 'Enter' || event.key === ' ') && event.target.dataset?.model) {
    event.preventDefault();
    openModel(event.target.dataset.model);
  }
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  const nav = document.querySelector('.nav-links');
  const open = nav.classList.toggle('open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});
