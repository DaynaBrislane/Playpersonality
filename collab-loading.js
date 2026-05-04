const overlay = document.getElementById('loading-overlay');
const createBtn = document.getElementById('create-profile-btn');
const statusItems = Array.from(document.querySelectorAll('#loading-status li'));

let statusInterval = null;
let statusIndex = 0;

function setActiveStatus(idx) {
  statusItems.forEach((el, i) => el.classList.toggle('active', i === idx));
}

function startStatusCycle() {
  setActiveStatus(0);
  statusIndex = 0;
  if (statusInterval) clearInterval(statusInterval);
  statusInterval = setInterval(() => {
    statusIndex = (statusIndex + 1) % statusItems.length;
    setActiveStatus(statusIndex);
  }, 2200);
}

/* ---------- Logo animation ---------- */

const KEYFRAMES = {
  pink:  [{ t: 0, x: 540 }, { t: 0.5, x: 180 }, { t: 1, x: 540 }],
  teal:  [{ t: 0, x: 360 }, { t: 0.5, x: 360 }, { t: 1, x: 360 }],
  cream: [{ t: 0, x: 180 }, { t: 0.5, x: 540 }, { t: 1, x: 180 }],
};

const logoEls = {};
['pink', 'teal', 'cream'].forEach((c) => {
  logoEls[c] = {
    fill: document.getElementById(`fill-${c}`),
    clip: document.getElementById(`cl-${c}`),
    stroke: document.getElementById(`stroke-${c}`),
  };
});

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function interpolate(keyframes, t) {
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (t >= a.t && t <= b.t) {
      const local = (t - a.t) / (b.t - a.t);
      const eased = easeInOutSine(local);
      return a.x + (b.x - a.x) * eased;
    }
  }
  return keyframes[keyframes.length - 1].x;
}

function setCx(color, x) {
  logoEls[color].fill.setAttribute('cx', x);
  logoEls[color].clip.setAttribute('cx', x);
  logoEls[color].stroke.setAttribute('cx', x);
}

const CYCLE_MS = 1800;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let logoStart = null;
let logoRaf = null;

function logoFrame(now) {
  if (logoStart === null) logoStart = now;
  const t = ((now - logoStart) % CYCLE_MS) / CYCLE_MS;
  setCx('pink', interpolate(KEYFRAMES.pink, t));
  setCx('teal', interpolate(KEYFRAMES.teal, t));
  setCx('cream', interpolate(KEYFRAMES.cream, t));
  logoRaf = requestAnimationFrame(logoFrame);
}

function startLogo() {
  if (logoRaf !== null) return;
  if (reduceMotion) {
    setCx('pink', 270);
    setCx('teal', 360);
    setCx('cream', 450);
    return;
  }
  logoStart = null;
  logoRaf = requestAnimationFrame(logoFrame);
}

function stopLogo() {
  if (logoRaf !== null) {
    cancelAnimationFrame(logoRaf);
    logoRaf = null;
  }
}

/* ---------- Overlay control ---------- */

function showLoading() {
  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  startStatusCycle();
  startLogo();
}

function hideLoading() {
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
  if (statusInterval) clearInterval(statusInterval);
  stopLogo();
}

createBtn.addEventListener('click', showLoading);

const closeBtn = document.getElementById('loading-close');
closeBtn.addEventListener('click', () => {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'collab-loading:close' }, '*');
    return;
  }
  window.location.href = '/collaboration-profile-view.html';
});

window.addEventListener('message', (event) => {
  if (!event.data || typeof event.data !== 'object') return;
  if (event.data.type === 'collab-loading:show') showLoading();
  if (event.data.type === 'collab-loading:hide') hideLoading();
});

// When embedded in a parent prototype, skip the static page and play the
// loading animation immediately.
if (window.parent !== window) {
  document.querySelector('.page').style.display = 'none';
  showLoading();
}
