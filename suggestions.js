// Suggestion card data — titles, descriptions, and SVG icons
const suggestionData = [
  {
    title: 'New Team Member Onboarding',
    desc: "You have three new hires joining this month. Want a quick brief on each person's work style before day one?",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`
  },
  {
    title: 'Style Clash Highlight',
    desc: 'You and Marcus have different pacing. You decide fast, he needs time to process. Want coaching before your strategy session?',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="6.5"/><circle cx="15" cy="12" r="6.5"/></svg>`
  },
  {
    title: 'Development Opportunity',
    desc: "You've been working on executive presence. Since you have a town hall next week, let's use it as a practice moment",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  },
  {
    title: 'High-Stakes Meeting Prep',
    desc: "You're presenting to the exec team. Want to talk through your narrative and anticipate Sarah's style differences?",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`
  },
  {
    title: 'Team Composition Alert',
    desc: 'Your task force for the product launch is mostly big-picture thinkers. Who will bring the detail orientation?',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M12 8v2.5"/><path d="M8.5 15.5l2.5-3"/><path d="M15.5 15.5l-2.5-3"/></svg>`
  },
  {
    title: 'Feedback Opportunity',
    desc: "You just led that cross-functional launch meeting. Want to ask Priya and Tom for feedback while it's top of mind?",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`
  },
  {
    title: 'Goal Progress Check-In',
    desc: "You set a goal to improve cross-functional partnerships but we haven't talked about it since. Let's chat.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
  },
  {
    title: 'Promotion Preparation',
    desc: "We've been talking about your goal to move into people management. Want to get a head start on the upcoming promotion cycle and make sure you're fully ready?",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.17a2 2 0 00-.59-1.42L12 12l-4.41 4.41A2 2 0 007 17.83V22"/><path d="M7 2v4.17a2 2 0 00.59 1.42L12 12l4.41-4.41A2 2 0 0017 6.17V2"/></svg>`
  }
];

// DOM references
const section = document.getElementById('suggestionsSection');
const cardsContainer = document.getElementById('suggestionCards');
const center = document.getElementById('suggestionsCenter');
const numCards = suggestionData.length;

// Stagger settings
const STAGGER = 0.03;
const TOTAL_STAGGER = STAGGER * (numCards - 1);

// Create card DOM elements
suggestionData.forEach(card => {
  const el = document.createElement('div');
  el.className = 'suggestion-card';
  el.innerHTML = `
    <div class="suggestion-icon">${card.icon}</div>
    <div class="suggestion-text">
      <div class="suggestion-title">${card.title}</div>
      <div class="suggestion-desc">${card.desc}</div>
    </div>
  `;
  cardsContainer.appendChild(el);
});

// Add scroll hint
const hint = document.createElement('div');
hint.className = 'scroll-hint';
hint.innerHTML = '<span>Scroll</span><div class="scroll-hint-arrow"></div>';
document.querySelector('.suggestions-sticky').appendChild(hint);

const cards = cardsContainer.querySelectorAll('.suggestion-card');

// Responsive elliptical radii — use full viewport width & height
function getRadii() {
  const cardW = cards[0].offsetWidth;
  const cardH = cards[0].offsetHeight;
  const pad = 40;
  const ry = Math.min(window.innerHeight / 2 - cardH / 2 - pad, 380);
  const rx = Math.min(window.innerWidth / 2 - cardW / 2 - pad, 520);
  return { rx, ry };
}

// Easing
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t) {
  return t * t * t;
}

// Per-card animation progress with stagger
function getCardT(progress, i) {
  if (progress <= 0.5) {
    // Emerge: cards stagger outward in order
    const p = progress * 2;
    const cardStart = i * STAGGER;
    const cardP = Math.max(0, Math.min(1, (p - cardStart) / (1 - TOTAL_STAGGER)));
    return easeOutCubic(cardP);
  } else {
    // Return: cards stagger back in reverse order
    const p = (progress - 0.5) * 2;
    const cardStart = (numCards - 1 - i) * STAGGER;
    const cardP = Math.max(0, Math.min(1, (p - cardStart) / (1 - TOTAL_STAGGER)));
    return 1 - easeInCubic(cardP);
  }
}

// Main update loop
function update() {
  const rect = section.getBoundingClientRect();
  const scrollableDistance = section.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

  // Hide scroll hint after scrolling starts
  hint.classList.toggle('hidden', progress > 0.05);

  // Subtle blob scale change as cards emerge
  const maxT = Math.max(...Array.from({ length: numCards }, (_, i) => getCardT(progress, i)));
  const blobScale = 1 - maxT * 0.12;
  center.style.transform = `scale(${blobScale})`;

  // Update each card in an elliptical orbit
  const { rx, ry } = getRadii();
  const cardW = cards[0].offsetWidth;

  cards.forEach((card, i) => {
    const t = getCardT(progress, i);
    const angle = (i / numCards) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * rx * t;
    const y = Math.sin(angle) * ry * t;
    const halfW = cardW / 2;
    const halfH = card.offsetHeight / 2;
    const scale = t < 0.01 ? 0 : 0.4 + t * 0.6;

    card.style.transform = `translate(${-halfW + x}px, ${-halfH + y}px) scale(${scale})`;
    card.style.opacity = t;
  });
}

// Throttled scroll updates
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

// Recalculate on resize
window.addEventListener('resize', update);

// Initial render
update();
