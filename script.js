const MEDIA = window.R3D_MEDIA || {};
const M = key => MEDIA[key];
const models = {
  "mercury-600": {
    title: "Mercury 600", category: "ENGINE", status: "AVAILABLE",
    description: "Functional-scale RC outboard project inspired by the Mercury 600, developed as a printable multi-part model with scale exterior geometry and RC-ready mechanical integration.",
    images: [
      M("engines/mercury-600-01.webp"),M("engines/mercury-600-02.webp"),M("engines/mercury-600-03.webp"),M("engines/mercury-600-04.webp")
    ],
    cults: "https://cults3d.com/en/3d-model/game/mercury-600-rc-outboard-lagiosg-2"
  },
  "mercury-400": {
    title: "Mercury 400", category: "ENGINE", status: "UNDER DEVELOPMENT",
    description: "Scale RC outboard model inspired by the Mercury 400, currently under development with focus on recognizable exterior proportions and printable multi-part construction for marine model projects.",
    images: [
      M("engines/mercury-400-01.webp"),M("engines/mercury-400-02.webp"),M("engines/mercury-400-03.webp"),M("engines/mercury-400-04.webp")
    ]
  },
  "mercury-300": {
    title: "Mercury 300", category: "ENGINE", status: "UNDER DEVELOPMENT",
    description: "Compact functional-scale outboard project inspired by the Mercury 300, currently under development for 3D printing with an emphasis on the external engine form and RC integration.",
    images: [
      M("engines/mercury-300-01.webp"),M("engines/mercury-300-02.webp"),M("engines/mercury-300-03.webp"),M("engines/mercury-300-04.webp")
    ]
  },
  "rafnar-1200": {
    title: "Rafnar 1200 Cross Cabin", category: "HULL", status: "AVAILABLE",
    description: "Detailed scale interpretation of the Rafnar 1200 Cross Cabin, developed as an RC-ready marine model with the distinctive hull, cabin and twin-outboard arrangement reproduced for 3D printing.",
    images: [
      M("hulls/rafnar-1200-01.webp"),M("hulls/rafnar-1200-02.webp"),M("hulls/rafnar-1200-03.webp"),M("hulls/rafnar-1200-04.webp")
    ],
    cults: "https://cults3d.com/en/3d-model/game/rafnar-1200-cross-cabin"
  },
  "nimbus-c11": {
    title: "Nimbus C11", category: "HULL", status: "AVAILABLE",
    description: "Detailed 3D scale replica of the Nimbus C11, developed for 3D printing with attention to exterior geometry, deck layout, lighting details and recognizable marine proportions.",
    images: [
      M("hulls/nimbus-c11-01.webp"),M("hulls/nimbus-c11-02.webp"),M("hulls/nimbus-c11-03.webp"),M("hulls/nimbus-c11-04.webp")
    ],
    cults: "https://cults3d.com/en/3d-model/game/nimbus-c11-model"
  },
  "axopar-45": {
    title: "Axopar 45 XC", category: "HULL", status: "AVAILABLE",
    description: "Scale 3D replica of the Axopar 45 XC, modeled around the boat's characteristic profile, enclosed cabin and triple-outboard layout for printable RC and display builds.",
    images: [
      M("hulls/axopar-45-01.webp"),M("hulls/axopar-45-02.webp"),M("hulls/axopar-45-03.webp"),M("hulls/axopar-45-04.webp")
    ],
    cults: "https://cults3d.com/en/3d-model/game/axopar-45"
  },
  "universal-trim": {
    title: "Universal Trim System", category: "RC SYSTEM", status: "UNDER DEVELOPMENT",
    description: "A compact servo-driven trim mechanism for functional scale outboards, designed around a transom-mounted bracket and pivot linkage for controlled trim movement.",
    images: [M("systems/universal-trim-01.webp")]
  }
};

const engineOrder = ["mercury-600","mercury-400","mercury-300"];
const hullOrder = ["rafnar-1200","nimbus-c11","axopar-45"];
const latestOrder = ["mercury-400","mercury-300","universal-trim"];

function statusLabel(m){ return `<span class="status">${m.status}</span>`; }
function modelCard(id){
  const m=models[id];
  return `<article class="model-card" data-model="${id}" tabindex="0" role="button" aria-label="View ${m.title}">
    <img src="${m.images[0]}" alt="${m.title}">
    <div class="card-copy"><div class="card-meta"><span>${m.category}</span>${statusLabel(m)}</div><h3>${m.title}</h3><span class="card-link">VIEW DETAILS ↗</span></div>
  </article>`;
}
function hullRow(id){
  const m=models[id];
  return `<article class="hull-row" data-model="${id}" tabindex="0" role="button" aria-label="View ${m.title}">
    <div class="hull-media"><img src="${m.images[0]}" alt="${m.title}"></div>
    <div class="hull-copy"><div class="card-meta"><span>${m.category}</span>${statusLabel(m)}</div><h3>${m.title}</h3><p>${m.description}</p><span class="card-link">VIEW GALLERY ↗</span></div>
  </article>`;
}
function latestCard(id){
  const m=models[id];
  return `<article class="latest-card" data-model="${id}" tabindex="0" role="button" aria-label="View ${m.title}"><img src="${m.images[0]}" alt="${m.title}"><h3>${m.title}</h3></article>`;
}

document.querySelector("#header-logo").src=M("brand/r3d-logo.png");
document.querySelector("#hero-image").src=M("hulls/nimbus-c11-01.webp");

document.querySelector('#engine-grid').innerHTML=engineOrder.map(modelCard).join('');
document.querySelector('#hull-list').innerHTML=hullOrder.map(hullRow).join('');
document.querySelector('#system-grid').innerHTML=modelCard('universal-trim');
document.querySelector('#latest-grid').innerHTML=latestOrder.map(latestCard).join('');

const modal=document.querySelector('#model-modal');
const mainImage=document.querySelector('#modal-main-image');
const thumbs=document.querySelector('#modal-thumbs');
const title=document.querySelector('#modal-title');
const kicker=document.querySelector('#modal-kicker');
const desc=document.querySelector('#modal-description');
const action=document.querySelector('#modal-action');
let activeModel=null, activeIndex=0;

function renderImage(){
  const m=models[activeModel];
  mainImage.src=m.images[activeIndex];
  mainImage.alt=`${m.title} view ${activeIndex+1}`;
  [...thumbs.children].forEach((b,i)=>b.classList.toggle('active',i===activeIndex));
  const hideArrows=m.images.length<2;
  document.querySelector('#prev-image').style.display=hideArrows?'none':'';
  document.querySelector('#next-image').style.display=hideArrows?'none':'';
}
function openModel(id){
  const m=models[id]; if(!m)return;
  activeModel=id; activeIndex=0;
  title.textContent=m.title;
  kicker.textContent=`${m.category} / ${m.status}`;
  desc.textContent=m.description;
  thumbs.innerHTML=m.images.map((src,i)=>`<button class="thumb ${i===0?'active':''}" data-index="${i}" aria-label="${m.title} image ${i+1}"><img src="${src}" alt=""></button>`).join('');
  action.innerHTML=m.cults?`<a class="modal-button" href="${m.cults}" target="_blank" rel="noopener">VIEW ON CULTS3D ↗</a>`:`<div class="development-note">UNDER DEVELOPMENT — RELEASE LINK WILL BE ADDED WHEN READY.</div>`;
  renderImage();
  modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
}
function closeModal(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
function moveImage(dir){const m=models[activeModel];if(!m)return;activeIndex=(activeIndex+dir+m.images.length)%m.images.length;renderImage()}

document.addEventListener('click',e=>{
  const card=e.target.closest('[data-model]'); if(card) openModel(card.dataset.model);
  const thumb=e.target.closest('.thumb'); if(thumb){activeIndex=Number(thumb.dataset.index);renderImage()}
});
document.querySelector('#modal-close').addEventListener('click',closeModal);
document.querySelector('#prev-image').addEventListener('click',e=>{e.stopPropagation();moveImage(-1)});
document.querySelector('#next-image').addEventListener('click',e=>{e.stopPropagation();moveImage(1)});
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(modal.classList.contains('is-open')&&e.key==='ArrowLeft')moveImage(-1);if(modal.classList.contains('is-open')&&e.key==='ArrowRight')moveImage(1);if((e.key==='Enter'||e.key===' ')&&e.target.dataset?.model)openModel(e.target.dataset.model)});

document.querySelector('.menu-toggle').addEventListener('click',()=>{const nav=document.querySelector('.nav-links');const open=nav.classList.toggle('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded',String(open))});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav-links').classList.remove('open')));

document.addEventListener('error',e=>{
  if(e.target instanceof HTMLImageElement){e.target.style.background='#111a20';e.target.alt='Image unavailable';}
},true);
