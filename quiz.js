// MBTI Quiz Questions
const questions = [
  // E/I Dimension (5 questions)
  { text: "You regularly make new friends.", dimension: "EI", agree: "E" },
  { text: "You feel comfortable approaching someone you find interesting and starting a conversation.", dimension: "EI", agree: "E" },
  { text: "At social events, you rarely try to introduce yourself to new people and mostly talk to the ones you already know.", dimension: "EI", agree: "I" },
  { text: "You feel more energized after spending time with a group of people.", dimension: "EI", agree: "E" },
  { text: "You prefer to have a few close friends rather than a large circle of acquaintances.", dimension: "EI", agree: "I" },

  // S/N Dimension (5 questions)
  { text: "Complex and novel ideas excite you more than simple and straightforward ones.", dimension: "SN", agree: "N" },
  { text: "You prefer to focus on practical, concrete details rather than abstract theories.", dimension: "SN", agree: "S" },
  { text: "You often spend time exploring unrealistic yet intriguing ideas.", dimension: "SN", agree: "N" },
  { text: "You trust your experience more than your imagination.", dimension: "SN", agree: "S" },
  { text: "You are drawn to activities that let you use your creativity and originality.", dimension: "SN", agree: "N" },

  // T/F Dimension (5 questions)
  { text: "You prioritize being logical over being tactful when giving feedback.", dimension: "TF", agree: "T" },
  { text: "You usually base your choices on objective facts rather than personal feelings.", dimension: "TF", agree: "T" },
  { text: "Seeing other people cry can easily make you feel like you want to cry too.", dimension: "TF", agree: "F" },
  { text: "You think the world would be a better place if people relied more on rationality and less on their feelings.", dimension: "TF", agree: "T" },
  { text: "You are more likely to rely on your emotional gut feeling when making important decisions.", dimension: "TF", agree: "F" },

  // J/P Dimension (5 questions)
  { text: "You prefer to have a detailed plan rather than figuring things out as you go.", dimension: "JP", agree: "J" },
  { text: "You find it easy to stay relaxed and focused even when there is some pressure.", dimension: "JP", agree: "P" },
  { text: "You like to have your tasks completed well before the deadline.", dimension: "JP", agree: "J" },
  { text: "You enjoy exploring new places and experiences without a strict schedule.", dimension: "JP", agree: "P" },
  { text: "Your workspace tends to be well-organized rather than cluttered with various things.", dimension: "JP", agree: "J" },
];

// MBTI Type Descriptions
const typeDescriptions = {
  ISTJ: { nickname: "The Inspector", description: "Quiet, serious, and thorough. You earn success by being dependable and practical. You value traditions, loyalty, and a structured approach to life." },
  ISFJ: { nickname: "The Protector", description: "Warm, considerate, and devoted. You have a strong sense of responsibility and genuinely care about the people around you. You thrive on helping others feel safe and supported." },
  INFJ: { nickname: "The Advocate", description: "Insightful, principled, and compassionate. You seek meaning in everything and want to understand what motivates people. You are quietly forceful and deeply idealistic." },
  INTJ: { nickname: "The Architect", description: "Independent, strategic, and determined. You have a natural drive to turn ideas into reality. You value competence and structure, always looking for ways to improve systems." },
  ISTP: { nickname: "The Craftsperson", description: "Observant, cool-headed, and adaptable. You are a natural problem-solver who loves understanding how things work. You prefer action over long discussions." },
  ISFP: { nickname: "The Composer", description: "Gentle, sensitive, and open-minded. You live in the present and are deeply attuned to your surroundings. You express yourself through actions rather than words." },
  INFP: { nickname: "The Mediator", description: "Thoughtful, idealistic, and empathetic. You care deeply about your values and strive to live authentically. You are a quiet champion for the people and causes you believe in." },
  INTP: { nickname: "The Thinker", description: "Analytical, objective, and inventive. You love exploring ideas and finding logical explanations for everything. You value precision and are endlessly curious about how the world works." },
  ESTP: { nickname: "The Dynamo", description: "Energetic, pragmatic, and observant. You thrive in the moment and bring a sense of fun to everything. You are a natural negotiator with an eye for opportunity." },
  ESFP: { nickname: "The Performer", description: "Spontaneous, energetic, and friendly. You love life, people, and experiences. Your enthusiasm is infectious, and you have a talent for making even ordinary moments memorable." },
  ENFP: { nickname: "The Campaigner", description: "Enthusiastic, creative, and sociable. You see life as full of possibilities and can always find a reason to smile. You connect deeply with others and champion the causes you care about." },
  ENTP: { nickname: "The Debater", description: "Quick-witted, bold, and curious. You love intellectual challenges and delight in dissecting ideas. You thrive on stimulating conversations and are never afraid to question the status quo." },
  ESTJ: { nickname: "The Supervisor", description: "Organized, logical, and assertive. You bring order to your environment and have a clear set of standards. You are dedicated, responsible, and lead by example." },
  ESFJ: { nickname: "The Provider", description: "Caring, sociable, and loyal. You are attentive to the needs of others and work hard to create harmony. You are happiest when the people around you feel appreciated and connected." },
  ENFJ: { nickname: "The Protagonist", description: "Charismatic, empathetic, and inspiring. You are a natural leader who lifts others up. You are driven by a deep sense of idealism and a desire to help people reach their potential." },
  ENTJ: { nickname: "The Commander", description: "Bold, imaginative, and strong-willed. You are a natural leader who always finds a way to make things happen. You thrive on challenges and long-term strategic planning." },
};

// Constants
const QUESTIONS_PER_PAGE = 10;

// State
let currentQuestion = 0;
let currentPage = 0;
let answers = new Array(questions.length).fill(null);
let isAutoScrolling = false;
let observer = null;

// DOM Elements
const questionsScroll = document.getElementById('questionsScroll');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const quizView = document.getElementById('quizView');
const resultsView = document.getElementById('resultsView');
const btnExplore = document.getElementById('btnExplore');
const btnSkip = document.getElementById('btnSkip');

// Render all questions at once
function renderAllQuestions() {
  questionsScroll.innerHTML = questions.map((q, i) => `
    <div class="question-block ${i === 0 ? 'active' : 'faded'}" data-index="${i}" data-page="${Math.floor(i / QUESTIONS_PER_PAGE)}" ${Math.floor(i / QUESTIONS_PER_PAGE) !== 0 ? 'style="display:none"' : ''}>
      <div class="question-text">${q.text}</div>
      <div class="likert-scale">
        <div class="scale-options">
          ${[-3, -2, -1, 0, 1, 2, 3].map(val => `
            <button
              class="scale-option"
              data-question="${i}"
              data-value="${val}"
              aria-label="Scale ${val}"
            ></button>
          `).join('')}
        </div>
      </div>
      <div class="scale-labels">
        <span class="scale-label">Disagree</span>
        <span class="scale-label">Agree</span>
      </div>
    </div>
  `).join('') + `
    <div class="page-nav" id="pageNav">
      <button class="page-nav-back" id="btnBack">\u2190 Back</button>
      <button class="page-nav-next" id="btnNext">Next</button>
    </div>
  `;

  // Bind click handlers for all options
  questionsScroll.querySelectorAll('.scale-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const qi = parseInt(btn.dataset.question);
      const val = parseInt(btn.dataset.value);
      answers[qi] = val;

      // Update selected state for this question
      const block = btn.closest('.question-block');
      block.querySelectorAll('.scale-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Find next unanswered question on this page only
      const pageStart = currentPage * QUESTIONS_PER_PAGE;
      const pageEnd = pageStart + QUESTIONS_PER_PAGE;

      let nextUnanswered = -1;
      for (let idx = qi + 1; idx < pageEnd; idx++) {
        if (answers[idx] === null) {
          nextUnanswered = idx;
          break;
        }
      }

      if (nextUnanswered !== -1) {
        currentQuestion = nextUnanswered;
        scrollToQuestion(nextUnanswered);
      } else {
        // Check for any unanswered earlier on this page
        let firstNull = -1;
        for (let idx = pageStart; idx < pageEnd; idx++) {
          if (answers[idx] === null) {
            firstNull = idx;
            break;
          }
        }
        if (firstNull !== -1) {
          currentQuestion = firstNull;
          scrollToQuestion(firstNull);
        }
        // All on page answered - user clicks Next
      }

      updateHighlighting();
      updateProgress();
      updateNavBar();
    });
  });

  // Nav button handlers
  document.getElementById('btnBack').addEventListener('click', () => {
    if (currentPage > 0) showPage(currentPage - 1);
  });

  document.getElementById('btnNext').addEventListener('click', () => {
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    if (currentPage < totalPages - 1) {
      showPage(currentPage + 1);
    } else {
      // Last page - show results if all answered
      if (answers.every(a => a !== null)) {
        showResults();
      }
    }
  });

  updateNavBar();
}

function showPage(page) {
  currentPage = page;
  const pageStart = page * QUESTIONS_PER_PAGE;
  const pageEnd = pageStart + QUESTIONS_PER_PAGE;

  // Show/hide question blocks
  questionsScroll.querySelectorAll('.question-block').forEach(block => {
    const idx = parseInt(block.dataset.index);
    block.style.display = (idx >= pageStart && idx < pageEnd) ? '' : 'none';
  });

  // Set current question to first unanswered on page, or first on page
  let firstUnanswered = -1;
  for (let i = pageStart; i < pageEnd; i++) {
    if (answers[i] === null) {
      firstUnanswered = i;
      break;
    }
  }
  currentQuestion = firstUnanswered !== -1 ? firstUnanswered : pageStart;

  // Scroll to top
  window.scrollTo(0, 0);

  // Update everything
  updateHighlighting();
  updateProgress();
  updateNavBar();
  setupScrollTracking();
}

function scrollToQuestion(index) {
  const block = questionsScroll.querySelector(`.question-block[data-index="${index}"]`);
  if (block) {
    isAutoScrolling = true;
    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { isAutoScrolling = false; }, 800);
  }
}

function updateHighlighting() {
  const blocks = questionsScroll.querySelectorAll('.question-block');
  blocks.forEach((block) => {
    const i = parseInt(block.dataset.index);
    block.classList.remove('active', 'faded');
    if (i === currentQuestion) {
      block.classList.add('active');
    } else {
      block.classList.add('faded');
    }
  });
}

function updateProgress() {
  const answered = answers.filter(a => a !== null).length;
  const pct = (answered / questions.length) * 100;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
}

function updateNavBar() {
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  if (!btnBack || !btnNext) return;

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const isLastPage = currentPage === totalPages - 1;

  // Back button: hidden on first page
  btnBack.style.visibility = currentPage === 0 ? 'hidden' : 'visible';

  // Next/Results button
  if (isLastPage) {
    btnNext.textContent = 'See Results';
    btnNext.disabled = !answers.every(a => a !== null);
  } else {
    btnNext.textContent = 'Next';
    btnNext.disabled = false;
  }
}

// Track active question via scroll position
function setupScrollTracking() {
  if (observer) observer.disconnect();

  const pageStart = currentPage * QUESTIONS_PER_PAGE;
  const pageEnd = pageStart + QUESTIONS_PER_PAGE;

  observer = new IntersectionObserver((entries) => {
    if (isAutoScrolling) return;

    // Pick the entry closest to viewport center
    const viewportCenter = window.innerHeight / 2;
    let best = null;
    let bestDist = Infinity;

    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const rect = entry.boundingClientRect;
        const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = entry;
        }
      }
    });

    if (best) {
      const index = parseInt(best.target.dataset.index);
      currentQuestion = index;
      updateHighlighting();
      updateProgress();
    }
  }, {
    threshold: 0.5,
    rootMargin: '-20% 0px -20% 0px'
  });

  questionsScroll.querySelectorAll('.question-block').forEach(block => {
    const idx = parseInt(block.dataset.index);
    if (idx >= pageStart && idx < pageEnd) {
      observer.observe(block);
    }
  });
}

function calculateType() {
  const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  questions.forEach((q, i) => {
    if (answers[i] === null) return;
    const raw = answers[i];
    const firstLetters = { EI: "E", SN: "S", TF: "T", JP: "J" };
    const isFirstLetter = q.agree === firstLetters[q.dimension];

    if (isFirstLetter) {
      scores[q.dimension] += raw;
    } else {
      scores[q.dimension] -= raw;
    }
  });

  const type = [
    scores.EI >= 0 ? 'E' : 'I',
    scores.SN >= 0 ? 'S' : 'N',
    scores.TF >= 0 ? 'T' : 'F',
    scores.JP >= 0 ? 'J' : 'P',
  ].join('');

  const maxScore = 15;
  const percentages = {};
  for (const dim of ['EI', 'SN', 'TF', 'JP']) {
    const pct = Math.round(50 + (scores[dim] / maxScore) * 50);
    percentages[dim] = Math.max(1, Math.min(99, pct));
  }

  return { type, scores, percentages };
}

// Color wheel animation
const colorWheelOverlay = document.getElementById('colorWheelOverlay');
const slotLabel = document.getElementById('slotLabel');

const slotNames = [
  'Virtuoso', 'Adventurer', 'Entrepreneur', 'Entertainer',
  'Logistician', 'Defender', 'Executive', 'Consul',
  'Architect', 'Logician', 'Commander', 'Debater',
  'Advocate', 'Mediator', 'Protagonist', 'Campaigner'
];

const slotColors = {
  Virtuoso: '#FFD3A8', Adventurer: '#FFE7B7', Entrepreneur: '#FFBC7A', Entertainer: '#FA7779',
  Logistician: '#86DFE0', Defender: '#16C2C3', Executive: '#CCE9FA', Consul: '#7478EA',
  Architect: '#F4298F', Logician: '#CBCDF7', Commander: '#A1A5FD', Debater: '#CC1462',
  Advocate: '#659756', Mediator: '#95C587', Protagonist: '#9EDE91', Campaigner: '#BEFEB7'
};

const typeToSlotName = {
  ISTP: 'Virtuoso', ISFP: 'Adventurer', ESTP: 'Entrepreneur', ESFP: 'Entertainer',
  ISTJ: 'Logistician', ISFJ: 'Defender', ESTJ: 'Executive', ESFJ: 'Consul',
  INTJ: 'Architect', INTP: 'Logician', ENTJ: 'Commander', ENTP: 'Debater',
  INFJ: 'Advocate', INFP: 'Mediator', ENFJ: 'Protagonist', ENFP: 'Campaigner'
};

function playColorWheelAnimation(finalNickname) {
  return new Promise((resolve) => {
    const overlay = colorWheelOverlay;

    function setSlot(name) {
      const color = slotColors[name] || '#ccc';
      slotLabel.innerHTML = `<span class="slot-dot" style="background:${color}"></span>${name}`;
    }

    const wheelCenter = overlay.querySelector('.wheel-center');
    const finalColor = slotColors[finalNickname] || '#BEFEB7';

    // Reset state
    overlay.classList.remove('spinning', 'converge', 'fade-out');
    slotLabel.innerHTML = '';
    wheelCenter.style.background = '';

    // Show overlay
    overlay.classList.add('active');

    // Phase 1: Start spinning (petals appear + ring rotates)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('spinning');
      });
    });

    // Slot machine: fast cycling during spin phase
    let slotIndex = 0;
    const fastInterval = setInterval(() => {
      setSlot(slotNames[slotIndex % slotNames.length]);
      slotIndex++;
    }, 80);

    // Phase 2: Decelerate wheel + slot machine together
    const wheelRing = overlay.querySelector('.wheel-ring');
    const decelDuration = 2300; // total slot decel time in ms

    setTimeout(() => {
      clearInterval(fastInterval);

      // Grab current rotation from CSS animation, then take over with JS
      const computed = getComputedStyle(wheelRing);
      const matrix = computed.transform;
      let angle = 0;
      if (matrix && matrix !== 'none') {
        const v = matrix.split('(')[1].split(')')[0].split(',');
        angle = Math.atan2(parseFloat(v[1]), parseFloat(v[0])) * (180 / Math.PI);
      }
      // Kill CSS animation, set current angle as inline transform
      wheelRing.style.animation = 'none';
      wheelRing.style.transform = `rotate(${angle}deg)`;

      // Smooth JS deceleration via requestAnimationFrame
      const startSpeed = 144; // deg/s (matches CSS 2.5s per full rotation)
      const decelStart = performance.now();
      let lastTime = decelStart;
      let stopped = false;

      function spinFrame(now) {
        if (stopped) return;
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        const elapsed = now - decelStart;
        const progress = Math.min(elapsed / decelDuration, 1);
        // Ease-out: speed drops smoothly to near zero
        const speed = startSpeed * (1 - progress) * (1 - progress);
        angle += speed * dt;
        wheelRing.style.transform = `rotate(${angle}deg)`;
        if (progress < 1) {
          requestAnimationFrame(spinFrame);
        }
      }
      requestAnimationFrame(spinFrame);

      // Slow slot machine deceleration in parallel
      const remaining = [...slotNames].sort(() => Math.random() - 0.5);
      const filtered = remaining.filter(n => n !== finalNickname);
      const slowSequence = filtered.slice(0, 6).concat(finalNickname);
      let i = 0;
      const delays = [120, 160, 220, 300, 400, 500, 600];

      function showNext() {
        if (i < slowSequence.length) {
          setSlot(slowSequence[i]);

          if (i === slowSequence.length - 1) {
            // Final name landed — stop wheel, converge
            wheelCenter.style.background = finalColor;
            stopped = true;
            setTimeout(() => {
              wheelRing.style.animation = '';
              wheelRing.style.transform = '';
              overlay.classList.remove('spinning');
              overlay.classList.add('converge');

              // Hold on result, then fade out
              setTimeout(() => {
                overlay.classList.add('fade-out');
              }, 1400);

              // Clean up and resolve
              setTimeout(() => {
                overlay.classList.remove('active', 'spinning', 'converge', 'fade-out');
                wheelCenter.style.background = '';
                slotLabel.innerHTML = '';
                resolve();
              }, 2000);
            }, 400);
          }
          i++;
          setTimeout(showNext, delays[i - 1] || 600);
        }
      }
      showNext();
    }, 2500);
  });
}

const dimLabels = {
  EI: ['Extraverted', 'Introverted'],
  SN: ['Observing', 'Intuiting'],
  TF: ['Thinking', 'Feeling'],
  JP: ['Structured', 'Exploratory'],
};

const dimColors = { EI: '#E868B3', SN: '#FFD094', TF: '#A0A3F3', JP: '#C0EFB7' };

function buildDimBarsHTML(percentages) {
  return Object.entries(dimLabels).map(([dim, [left, right]]) => {
    const pct = percentages[dim];
    const leftWins = pct >= 50;
    const barWidth = leftWins ? pct : (100 - pct);
    const color = dimColors[dim];
    const leftDot = leftWins ? `<span class="dim-dot" style="background:${color}"></span>` : '';
    const rightDot = !leftWins ? `<span class="dim-dot" style="background:${color}"></span>` : '';
    return `
      <div class="dim-result-row">
        <div class="dim-result-bar-bg">
          <div class="dim-result-bar-fill ${leftWins ? '' : 'right-wins'}" style="width: 0%; background:${color};"></div>
        </div>
        <div class="dim-result-labels">
          <span class="dim-result-left ${leftWins ? 'winner' : ''}">${leftDot}${left}</span>
          <span class="dim-result-right ${!leftWins ? 'winner' : ''}">${right}${rightDot}</span>
        </div>
      </div>
    `;
  }).join('');
}

function populateResults(type, percentages) {
  const info = typeDescriptions[type] || { nickname: "Unknown", description: "" };
  const slotName = typeToSlotName[type] || info.nickname.replace(/^The /, '');
  const color = slotColors[slotName] || '#ccc';

  document.getElementById('resultsCircle').style.background = color;
  document.getElementById('resultsNickname').textContent = slotName;
  document.getElementById('resultsDescription').textContent = info.description;

  const dimResults = document.getElementById('dimensionResults');
  dimResults.innerHTML = buildDimBarsHTML(percentages);
  return { slotName, dimResults, percentages };
}

function showResults() {
  const { type, percentages } = calculateType();
  const { slotName, dimResults } = populateResults(type, percentages);

  playColorWheelAnimation(slotName).then(() => {
    quizView.classList.remove('active');
    resultsView.classList.add('active');
    window.scrollTo(0, 0);

    // Animate bars after view is visible
    setTimeout(() => {
      dimResults.querySelectorAll('.dim-result-bar-fill').forEach((bar, i) => {
        const dim = Object.keys(dimLabels)[i];
        const pct = percentages[dim];
        const leftWins = pct >= 50;
        bar.style.width = `${leftWins ? pct : (100 - pct)}%`;
      });
    }, 50);
  });
}

function retake() {
  currentQuestion = 0;
  currentPage = 0;
  answers = new Array(questions.length).fill(null);
  resultsView.classList.remove('active');
  quizView.classList.add('active');

  // Reset all selections
  questionsScroll.querySelectorAll('.scale-option').forEach(b => b.classList.remove('selected'));

  // Show first page
  showPage(0);
  window.scrollTo(0, 0);
}

function skipToAnimation() {
  // Pick a random personality type
  const types = Object.keys(typeToSlotName);
  const randomType = types[Math.floor(Math.random() * types.length)];

  // Generate random percentages for dimension bars
  const randomPcts = {};
  Object.keys(dimLabels).forEach(dim => {
    const leftLetter = dim[0];
    const wins = randomType.includes(leftLetter);
    randomPcts[dim] = wins ? (50 + Math.floor(Math.random() * 40)) : (10 + Math.floor(Math.random() * 40));
  });

  const { slotName, dimResults } = populateResults(randomType, randomPcts);

  playColorWheelAnimation(slotName).then(() => {
    quizView.classList.remove('active');
    resultsView.classList.add('active');
    window.scrollTo(0, 0);

    setTimeout(() => {
      dimResults.querySelectorAll('.dim-result-bar-fill').forEach((bar, i) => {
        const dim = Object.keys(dimLabels)[i];
        const pct = randomPcts[dim];
        const leftWins = pct >= 50;
        bar.style.width = `${leftWins ? pct : (100 - pct)}%`;
      });
    }, 50);
  });
}

// Event Listeners
btnSkip.addEventListener('click', skipToAnimation);
btnExplore.addEventListener('click', retake);

// Initialize
window.scrollTo(0, 0);
renderAllQuestions();
currentQuestion = 0;
updateHighlighting();
updateProgress();
setupScrollTracking();
