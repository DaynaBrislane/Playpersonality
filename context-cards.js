// Card data: labels and SVG icons, ordered clockwise from top
const cardData = [
  {
    label: 'Development<br>Plans',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  },
  {
    label: 'Engagement<br>Results',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`
  },
  {
    label: 'HRIS<br>Info',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`
  },
  {
    label: 'Workday<br>Integrations',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
  },
  {
    label: 'Calendar<br>Patterns',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`
  },
  {
    label: 'Personality<br>Profiles',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.66V19a2 2 0 012-2h6a2 2 0 012 2v1.66"/></svg>`
  },
  {
    label: 'Company<br>Strategy',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`
  },
  {
    label: 'Team<br>Membership',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 00-16 0"/></svg>`
  },
  {
    label: 'Talent<br>Moments',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l-1.9 5.8a2 2 0 01-1.3 1.3L3 12l5.8 1.9a2 2 0 011.3 1.3L12 21l1.9-5.8a2 2 0 011.3-1.3L21 12l-5.8-1.9a2 2 0 01-1.3-1.3L12 3z"/></svg>`
  },
  {
    label: 'Performance<br>Reviews',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`
  },
];

// DOM references
const section = document.getElementById('contextSection');
const cardsContainer = document.getElementById('contextCards');
const center = document.getElementById('contextCenter');
const numCards = cardData.length;

// Stagger settings
const STAGGER = 0.025;
const TOTAL_STAGGER = STAGGER * (numCards - 1);

// Create card elements
cardData.forEach((card) => {
  const el = document.createElement('div');
  el.className = 'context-card';
  el.innerHTML = `
    <div class="card-icon">${card.icon}</div>
    <div class="card-label">${card.label}</div>
  `;
  cardsContainer.appendChild(el);
});

// Add scroll hint
const hint = document.createElement('div');
hint.className = 'scroll-hint';
hint.innerHTML = `<span>Scroll</span><div class="scroll-hint-arrow"></div>`;
document.querySelector('.context-sticky').appendChild(hint);

const cards = cardsContainer.querySelectorAll('.context-card');

// Responsive radius
function getRadius() {
  const cardHalf = 65; // half of 130px card
  const pad = 24;
  const maxV = window.innerHeight / 2 - cardHalf - pad;
  const maxH = window.innerWidth / 2 - cardHalf - pad;
  return Math.min(maxV, maxH, 380);
}

// Easing functions
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t) {
  return t * t * t;
}

// Get individual card animation progress with stagger
function getCardT(progress, i) {
  if (progress <= 0.5) {
    // Emerge phase: cards stagger outward in order
    const p = progress * 2; // normalize to 0-1
    const cardStart = i * STAGGER;
    const cardP = Math.max(0, Math.min(1, (p - cardStart) / (1 - TOTAL_STAGGER)));
    return easeOutCubic(cardP);
  } else {
    // Return phase: cards stagger back in reverse order
    const p = (progress - 0.5) * 2; // normalize to 0-1
    const cardStart = (numCards - 1 - i) * STAGGER;
    const cardP = Math.max(0, Math.min(1, (p - cardStart) / (1 - TOTAL_STAGGER)));
    return 1 - easeInCubic(cardP);
  }
}

// Main animation loop
function update() {
  const rect = section.getBoundingClientRect();
  const scrollableDistance = section.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
  const radius = getRadius();

  // Hide scroll hint after scrolling starts
  hint.classList.toggle('hidden', progress > 0.05);

  // Subtle blob scale change as cards emerge
  const maxT = Math.max(...Array.from({ length: numCards }, (_, i) => getCardT(progress, i)));
  const blobScale = 1 - maxT * 0.12;
  center.style.transform = `scale(${blobScale})`;

  // Update each card
  cards.forEach((card, i) => {
    const t = getCardT(progress, i);
    const angle = (i / numCards) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius * t;
    const y = Math.sin(angle) * radius * t;
    const scale = t < 0.01 ? 0 : 0.4 + t * 0.6;

    card.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    card.style.opacity = t;
  });
}

// Throttle scroll updates with rAF
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
    ticking = true;
  }
});

// Handle resize
window.addEventListener('resize', update);

// Initial render
update();
