(() => {
  const header = document.querySelector('.site-header');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 120);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.section-shell:not(.catalog), .section-head, .hull-row, .engineering-feature, .rd-process, .rd-media-wrap, .latest-card');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal-section'));
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  const crossWrap = document.querySelector('#engineering-cross-sections');
  const crossSlots = [
    {
      figure: document.querySelector('#engineering-cross-slot-01'),
      img: document.querySelector('#engineering-cross-01'),
      base: 'cross-section-01'
    },
    {
      figure: document.querySelector('#engineering-cross-slot-02'),
      img: document.querySelector('#engineering-cross-02'),
      base: 'cross-section-02'
    }
  ];

  if (crossWrap) crossWrap.hidden = false;

  function loadEngineeringImage(slot) {
    if (!slot.figure || !slot.img) return;

    // The two PNG files are now present in the repository, so expose each
    // card immediately and load the exact local file first. If a Cloudflare
    // asset deployment is briefly stale, fall back to GitHub's raw copy.
    slot.figure.hidden = false;

    const local = `assets/engineering/${slot.base}.png?v=2`;
    const raw = `https://raw.githubusercontent.com/Rc3dMarine/r3d-marine-site/main/assets/engineering/${slot.base}.png`;
    let usingFallback = false;

    slot.img.onload = () => {
      slot.figure.hidden = false;
      if (crossWrap) crossWrap.hidden = false;
    };

    slot.img.onerror = () => {
      if (usingFallback) {
        slot.figure.hidden = true;
        return;
      }
      usingFallback = true;
      slot.img.src = raw;
    };

    slot.img.src = local;
  }

  crossSlots.forEach(loadEngineeringImage);
})();
