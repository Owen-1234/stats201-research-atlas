const q = (selector) => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cities = [
  { id: 'capital', name: 'Singapore', number: '01', lat: 1.29, lon: 103.85, title: 'How do fuel prices relate to capital costs?', href: '#capital', coordinates: '01°17′ N · 103°51′ E', offset: [-75, 51] },
  { id: 'solar', name: 'Shanghai', number: '02', lat: 31.23, lon: 121.47, title: 'Can we trust a solar report?', href: '#verify', coordinates: '31°14′ N · 121°28′ E', offset: [-86, -36] },
  { id: 'eval', name: 'Jeju Island', number: '03', lat: 33.49, lon: 126.53, title: 'What makes a market policy trustworthy?', href: '#learn', coordinates: '33°29′ N · 126°32′ E', offset: [57, -62] },
  { id: 'virel', name: 'Rio de Janeiro', number: '04', lat: -22.91, lon: -43.17, title: 'What are the resources behind an answer?', href: '#virel', coordinates: '22°55′ S · 043°10′ W', offset: [25, -32] },
];
let globe;
let activeCity = cities[0];
let globeStarting;

function selectCity(id, focus = true) {
  const city = cities.find((item) => item.id === id);
  if (!city) return;
  activeCity = city;
  q('#atlas-city').value = id;
  document.querySelectorAll('.globe-city-label').forEach((button) => { button.dataset.active = String(button.dataset.city === id); });
  q('#globe-study-title').textContent = city.title;
  q('#globe-study-link').href = city.href;
  q('#globe-coordinate').textContent = city.coordinates;
  document.querySelectorAll('.map-stop').forEach(link => {
    const active = link.dataset.paper === id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  globe?.select(id, focus);
}

function setAtlasMode(mode) {
  const flat = mode === 'flat';
  q('#flat-atlas').hidden = !flat;
  q('#globe-experience').hidden = flat;
  q('#atlas-mode-3d').setAttribute('aria-pressed', String(!flat));
  q('#atlas-mode-flat').setAttribute('aria-pressed', String(flat));
  if (!flat) startGlobe();
}

async function startGlobe() {
  if (globeStarting) return globeStarting;
  globeStarting = (async () => {
    try {
      const { createGlobe } = await import('./spatial.js?v=15');
      globe = await createGlobe({ cities, onSelect: selectCity, reducedMotion: reducedMotion.matches });
      selectCity(activeCity.id, false);
    } catch (error) {
      console.warn('The 3D atlas is unavailable; the flat atlas remains available.', error);
      q('#globe-loading').textContent = 'The 3D view is unavailable on this device. Use the flat map to explore every study.';
      q('#globe-loading').classList.add('scene-error');
      q('#atlas-mode-3d').disabled = true;
      setAtlasMode('flat');
    }
  })();
  return globeStarting;
}

q('#atlas-mode-3d').addEventListener('click', () => setAtlasMode('3d'));
q('#atlas-mode-flat').addEventListener('click', () => setAtlasMode('flat'));
q('#atlas-city').addEventListener('change', event => selectCity(event.target.value));
q('#flat-atlas').addEventListener('click', event => {
  const stop = event.target.closest('.map-stop');
  if (stop) selectCity(stop.dataset.paper, false);
});
selectCity(activeCity.id, false);

const chapters = q('#chapter-menu');
const chapterLinks = [...chapters.querySelectorAll('a[href^="#"]')];
const chapterSections = chapterLinks.map(link => q(link.hash));
chapters.addEventListener('click', event => {
  if (event.target.closest('a')) chapters.open = false;
});
document.addEventListener('pointerdown', event => {
  if (!chapters.contains(event.target)) chapters.open = false;
});
chapters.addEventListener('focusout', event => {
  if (event.relatedTarget && !chapters.contains(event.relatedTarget)) chapters.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && chapters.open) {
    chapters.open = false;
    chapters.querySelector('summary').focus();
  }
});
const progress = q('#reading-progress-fill');
let progressQueued = false;
let currentChapter = -1;
function updateProgress() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${distance > 0 ? Math.min(100, Math.max(0, scrollY / distance * 100)) : 0}%`;
  const cutoff = Math.min(220, innerHeight * 0.3);
  const index = Math.max(0, chapterSections.findLastIndex(section => section.getBoundingClientRect().top <= cutoff));
  if (currentChapter !== index) {
    chapterLinks[currentChapter]?.removeAttribute('aria-current');
    chapterLinks[index].setAttribute('aria-current', 'location');
    currentChapter = index;
  }
  progressQueued = false;
}
addEventListener('scroll', () => {
  if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
addEventListener('resize', updateProgress, { passive: true });
updateProgress();

const globeObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting)) { startGlobe(); globeObserver.disconnect(); }
}, { rootMargin: '250px' });
globeObserver.observe(q('#globe-experience'));

const spatialObserver = new IntersectionObserver(async (entries) => {
  if (!entries.some((entry) => entry.isIntersecting)) return;
  spatialObserver.disconnect();
  try {
    const { createLandscape } = await import('./spatial.js?v=15');
    createLandscape({ reducedMotion: reducedMotion.matches });
  } catch (error) {
    console.warn('The 3D evidence view is unavailable; the linked two-dimensional results remain available.', error);
    q('#spatial-loading').textContent = 'The 3D view is unavailable on this device. Explore the same recorded results in the charts below.';
    q('#spatial-loading').classList.add('scene-error');
    q('#spatial-stage').style.height = '180px';
    q('#spatial-stage').style.minHeight = '180px';
    q('#spatial-lab').querySelectorAll('button,select').forEach(control => { control.disabled = true; });
  }
}, { rootMargin: '250px' });
spatialObserver.observe(q('#spatial-lab'));

export { cities };
