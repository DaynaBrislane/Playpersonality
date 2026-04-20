// Goal data
const goalData = [
  {
    title: 'Implement Values in Action recognition process',
    desc: 'Improve culture activation and employee recognition by implementing a Values in Action submission and dashboard process for all employees reporting to Tim Gregory.',
    actions: [
      { text: 'Design and roll out PPQ roadmap template and training', desc: '', done: true },
      { text: 'Pilot new flow with next two incoming hires', desc: '', done: false },
      { text: 'Redesign day on checklist and welcome experience', desc: '', done: false },
    ],
  },
  {
    title: 'Hire a new principle product designer',
    desc: 'Source, interview, and hire a senior-to-principal level product designer to lead the design system and mentor junior designers on the team.',
    actions: [
      { text: 'Publish job listing and begin sourcing candidates', desc: 'Post to LinkedIn, Dribbble, and internal referral channels with a clear role brief and compensation range.', done: true },
      { text: 'Complete first-round interviews with shortlist', desc: 'Conduct portfolio reviews and culture-fit interviews with the top five candidates by end of month.', done: false },
      { text: 'Final panel interview and offer', desc: '', done: false },
    ],
  },
  {
    title: 'Implement a robust design system',
    desc: 'Build and document a scalable design system with reusable components, tokens, and guidelines that the full product team can adopt.',
    actions: [
      { text: 'Audit existing components and identify gaps', desc: 'Catalog every component in use across the product and flag inconsistencies and missing patterns.', done: true },
      { text: 'Define core token set (color, type, spacing)', desc: '', done: false },
      { text: 'Build and publish first component library release', desc: '', done: false },
    ],
  },
  {
    title: 'Improve onboarding NPS score',
    desc: 'Raise the new-hire onboarding NPS from 62 to 80+ by redesigning the first-week experience and adding structured check-ins at day 30 and 60.',
    actions: [
      { text: 'Survey recent hires for pain points', desc: 'Send a 5-question pulse survey to everyone who joined in the last 90 days.', done: true },
      { text: 'Redesign day-one checklist and welcome experience', desc: '', done: false },
      { text: 'Implement 30/60-day manager check-in templates', desc: '', done: false },
    ],
  },
  {
    title: 'Launch quarterly business review process',
    desc: 'Establish a repeatable QBR cadence with standardized decks, KPI dashboards, and cross-functional accountability.',
    actions: [
      { text: 'Draft QBR template and circulate for feedback', desc: '', done: true },
      { text: 'Run pilot QBR with product and engineering leads', desc: 'Schedule a dry-run session to pressure-test the format and timing before rolling out org-wide.', done: false },
      { text: 'Finalize calendar and assign owners for Q3', desc: '', done: false },
    ],
  },
];

// Compute percent from actions
function calcPercent(goal) {
  const done = goal.actions.filter(a => a.done).length;
  return Math.round((done / goal.actions.length) * 100);
}

// Which goals are priority vs other
let priorityGoalIndices = [0, 1, 2];

function getOtherGoalIndices() {
  return goalData.map((_, i) => i).filter(i => !priorityGoalIndices.includes(i));
}

// ===== Checkbox HTML helpers =====
const checkDoneHTML = '<div class="action-checkbox-done"><svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
const checkEmptyHTML = '<div class="action-checkbox-empty"></div>';

function actionItemHTML(action, index) {
  return `
    <div class="action-item${action.done ? ' completed' : ''}" data-action-index="${index}">
      <div class="action-checkbox">${action.done ? checkDoneHTML : checkEmptyHTML}</div>
      <div class="action-content">
        <span class="action-title">${action.text}</span>
        ${action.desc ? `<span class="action-desc">${action.desc}</span>` : ''}
      </div>
    </div>`;
}

// ===== Priority Goals Section =====
let selectedPrioritySlot = 0; // which slot in the list is selected

const priorityListEl = document.getElementById('priority-goal-list');
const priorityDetailEl = document.getElementById('priority-goal-detail');

function renderPriorityList() {
  priorityListEl.innerHTML = priorityGoalIndices.map((goalIdx, slot) => {
    const goal = goalData[goalIdx];
    const pct = calcPercent(goal);
    return `
      <div class="goal-list-item${slot === selectedPrioritySlot ? ' active' : ''}" data-priority-slot="${slot}">
        <span class="goal-list-item-title">${goal.title}</span>
        <div class="progress-bar"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>
      </div>`;
  }).join('');

  priorityListEl.querySelectorAll('.goal-list-item').forEach(item => {
    item.addEventListener('click', () => {
      selectedPrioritySlot = parseInt(item.dataset.prioritySlot, 10);
      renderPriorityList();
      renderPriorityDetail();
    });
  });
}

function renderPriorityDetail() {
  const goalIdx = priorityGoalIndices[selectedPrioritySlot];
  const goal = goalData[goalIdx];

  priorityDetailEl.innerHTML = `
    <div class="goal-detail-header">
      <div class="goal-detail-dot"></div>
      <span class="goal-detail-title">${goal.title}</span>
    </div>
    <hr class="goal-detail-divider" />
    <p class="goal-detail-desc">${goal.desc}</p>
    <p class="goal-detail-actions-label">Actions</p>
    <div class="priority-detail-actions">
      ${goal.actions.map((a, i) => actionItemHTML(a, i)).join('')}
    </div>`;

  priorityDetailEl.querySelectorAll('.action-item').forEach(item => {
    item.addEventListener('click', () => {
      const i = parseInt(item.dataset.actionIndex, 10);
      goal.actions[i].done = !goal.actions[i].done;
      renderPriorityDetail();
      renderPriorityList(); // update progress bar in list
    });
  });
}

// ===== Other Goals Grid =====
function renderOtherGoals() {
  const grid = document.getElementById('other-goals-grid');
  const others = getOtherGoalIndices();
  grid.innerHTML = others.map(idx => {
    const goal = goalData[idx];
    const pct = calcPercent(goal);
    return `
      <div class="goal-card" data-panel-goal="${idx}">
        <span class="goal-card-title">${goal.title}</span>
        <div class="goal-card-meta">
          <span class="goal-card-percent">${pct}% complete</span>
          <div class="progress-bar"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>
        </div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.goal-card[data-panel-goal]').forEach(card => {
    card.addEventListener('click', () => {
      openPanel(parseInt(card.dataset.panelGoal, 10));
    });
  });
}

// ===== Side Panel =====
let currentGoalIndex = null;

const panel = document.getElementById('side-panel');
const overlay = document.getElementById('side-panel-overlay');
const closeBtn = document.getElementById('side-panel-close');

function renderPanelActions(goal) {
  const container = document.getElementById('side-panel-actions');
  container.innerHTML = goal.actions.map((a, i) => actionItemHTML(a, i)).join('');

  container.querySelectorAll('.action-item').forEach(item => {
    item.addEventListener('click', () => {
      const i = parseInt(item.dataset.actionIndex, 10);
      goal.actions[i].done = !goal.actions[i].done;
      updatePanelProgress(goal);
      renderPanelActions(goal);
    });
  });
}

function updatePanelProgress(goal) {
  const pct = calcPercent(goal);
  document.getElementById('side-panel-percent').textContent = pct + '% complete';
  document.getElementById('side-panel-progress-fill').style.width = pct + '%';
}

function openPanel(index) {
  const goal = goalData[index];
  if (!goal) return;
  currentGoalIndex = index;

  document.getElementById('side-panel-title').textContent = goal.title;
  document.getElementById('side-panel-desc').textContent = goal.desc;
  updatePanelProgress(goal);
  renderPanelActions(goal);

  // Show/hide priority button (hide if already a priority)
  const priorityBtn = document.getElementById('side-panel-priority-btn');
  priorityBtn.style.display = priorityGoalIndices.includes(index) ? 'none' : '';

  panel.classList.add('open');
  overlay.classList.add('open');
}

function closePanel() {
  panel.classList.remove('open');
  overlay.classList.remove('open');
  closeSwapModal();
  currentGoalIndex = null;
  // Re-render in case actions were toggled
  renderPriorityList();
  renderPriorityDetail();
  renderOtherGoals();
}

closeBtn.addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

// ===== Edit Modal =====
const editModal = document.getElementById('edit-modal');
const editOverlay = document.getElementById('edit-modal-overlay');
const editTitleInput = document.getElementById('edit-modal-title-input');
const editDescInput = document.getElementById('edit-modal-desc-input');

function openEditModal() {
  if (currentGoalIndex === null) return;
  const goal = goalData[currentGoalIndex];
  editTitleInput.value = goal.title;
  editDescInput.value = goal.desc || '';
  editModal.classList.add('open');
  editOverlay.classList.add('open');
  setTimeout(() => editTitleInput.focus(), 50);
}

function closeEditModal() {
  editModal.classList.remove('open');
  editOverlay.classList.remove('open');
}

function submitEditModal() {
  if (currentGoalIndex === null) return;
  const title = editTitleInput.value.trim();
  if (!title) return;
  const goal = goalData[currentGoalIndex];
  goal.title = title;
  goal.desc = editDescInput.value.trim();
  document.getElementById('side-panel-title').textContent = goal.title;
  document.getElementById('side-panel-desc').textContent = goal.desc;
  renderPriorityList();
  renderPriorityDetail();
  renderOtherGoals();
  closeEditModal();
}

document.getElementById('side-panel-edit-btn').addEventListener('click', openEditModal);
document.getElementById('edit-modal-submit').addEventListener('click', submitEditModal);
document.getElementById('edit-modal-cancel').addEventListener('click', closeEditModal);
editOverlay.addEventListener('click', closeEditModal);
editTitleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitEditModal();
});

// ===== Delete Modal =====
const deleteModal = document.getElementById('delete-modal');
const deleteOverlay = document.getElementById('delete-modal-overlay');
const deleteMsg = document.getElementById('delete-modal-msg');

function openDeleteModal() {
  if (currentGoalIndex === null) return;
  const goal = goalData[currentGoalIndex];
  deleteMsg.textContent = `Are you sure you want to delete "${goal.title}"? This can't be undone.`;
  deleteModal.classList.add('open');
  deleteOverlay.classList.add('open');
}

function closeDeleteModal() {
  deleteModal.classList.remove('open');
  deleteOverlay.classList.remove('open');
}

function submitDeleteModal() {
  if (currentGoalIndex === null) return;
  const idx = currentGoalIndex;
  priorityGoalIndices = priorityGoalIndices
    .filter(i => i !== idx)
    .map(i => i > idx ? i - 1 : i);
  goalData.splice(idx, 1);
  if (selectedPrioritySlot >= priorityGoalIndices.length) selectedPrioritySlot = 0;
  closeDeleteModal();
  closePanel();
}

document.getElementById('side-panel-delete-btn').addEventListener('click', openDeleteModal);
document.getElementById('delete-modal-submit').addEventListener('click', submitDeleteModal);
document.getElementById('delete-modal-cancel').addEventListener('click', closeDeleteModal);
deleteOverlay.addEventListener('click', closeDeleteModal);

// ===== Swap Modal =====
const swapModal = document.getElementById('swap-modal');
const swapModalList = document.getElementById('swap-modal-list');
const swapModalCancel = document.getElementById('swap-modal-cancel');
const priorityBtn = document.getElementById('side-panel-priority-btn');

function openSwapModal() {
  swapModalList.innerHTML = priorityGoalIndices.map((idx, slot) => {
    const goal = goalData[idx];
    const pct = calcPercent(goal);
    return `
      <div class="swap-modal-item" data-swap-slot="${slot}">
        <span class="swap-modal-item-title">${goal.title}</span>
        <div class="progress-bar"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>
      </div>`;
  }).join('');

  swapModalList.querySelectorAll('.swap-modal-item').forEach(item => {
    item.addEventListener('click', () => {
      const slot = parseInt(item.dataset.swapSlot, 10);
      if (currentGoalIndex !== null) {
        priorityGoalIndices[slot] = currentGoalIndex;
        selectedPrioritySlot = slot;
      }
      closeSwapModal();
      closePanel();
    });
  });

  swapModal.classList.add('open');
}

function closeSwapModal() {
  swapModal.classList.remove('open');
}

priorityBtn.addEventListener('click', openSwapModal);
swapModalCancel.addEventListener('click', closeSwapModal);

// ===== Team Goals Data =====
const teamMembers = [
  {
    name: 'Grace MacNamara',
    role: 'Product Manager',
    color: '#F4298F',
    priorityGoals: [
      { title: 'Redesign checkout flow', percent: 67 },
      { title: 'Build out component library', percent: 67 },
      { title: 'Run 3 usability tests this quarter', percent: 67 },
    ],
    otherGoals: [
      { title: 'Document design review process', percent: 40 },
      { title: 'Onboard two new contractors', percent: 20 },
      { title: 'Prepare Q3 roadmap presentation', percent: 10 },
    ],
  },
  {
    name: 'Jordan Lee',
    role: 'Product Manager',
    color: '#CBCDF7',
    priorityGoals: [
      { title: 'Design system token migration', percent: 67 },
      { title: 'Establish weekly design critique', percent: 67 },
      { title: 'Own design for onboarding v2', percent: 67 },
    ],
    otherGoals: [
      { title: 'Create accessibility audit checklist', percent: 50 },
      { title: 'Mentor junior designer', percent: 33 },
    ],
  },
  {
    name: 'Eve Malone',
    role: 'Engineer',
    color: '#FFE7B7',
    priorityGoals: [
      { title: 'Design system token migration', percent: 67 },
      { title: 'Establish weekly design critique', percent: 67 },
      { title: 'Own design for onboarding v2', percent: 67 },
    ],
    otherGoals: [
      { title: 'Reduce page load time by 20%', percent: 45 },
      { title: 'Write integration tests for checkout', percent: 30 },
    ],
  },
  {
    name: 'Lucas Freeman',
    role: 'Operations Strategist',
    color: '#FFBC7A',
    priorityGoals: [
      { title: 'Design system token migration', percent: 67 },
      { title: 'Establish weekly design critique', percent: 67 },
      { title: 'Own design for onboarding v2', percent: 67 },
    ],
    otherGoals: [
      { title: 'Streamline vendor approval workflow', percent: 55 },
      { title: 'Launch internal knowledge base', percent: 25 },
    ],
  },
  {
    name: 'Eileen Neslon',
    role: 'Sales Rep',
    color: '#FA7779',
    priorityGoals: [
      { title: 'Design system token migration', percent: 67 },
      { title: 'Establish weekly design critique', percent: 67 },
      { title: 'Own design for onboarding v2', percent: 67 },
    ],
    otherGoals: [
      { title: 'Build enterprise outreach playbook', percent: 40 },
      { title: 'Close 3 net-new accounts this quarter', percent: 33 },
    ],
  },
];

function renderTeamGoals() {
  const container = document.getElementById('team-goals-tab');
  container.innerHTML = teamMembers.map((member, idx) => `
    ${idx > 0 ? '<hr class="team-member-divider" />' : ''}
    <div class="team-member-section">
      <div class="team-member-header">
        <div class="team-member-info">
          <div class="team-member-dot">
            <div class="team-member-dot-circle" style="background:${member.color}"></div>
          </div>
          <div class="team-member-text">
            <span class="team-member-name" data-member-drawer="${idx}" style="cursor:pointer">${member.name}</span>
            <span class="team-member-role">${member.role}</span>
          </div>
        </div>
        <button class="team-assign-btn" data-member-index="${idx}">Assign a goal</button>
      </div>
      <div class="team-goals-grid">
        ${member.priorityGoals.map(g => `
          <div class="team-goal-card">
            <span class="team-goal-card-title">${g.title}</span>
            <div class="goal-card-meta">
              <span class="team-goal-card-percent">${g.percent}% complete</span>
              <div class="progress-bar"><div class="progress-track"><div class="progress-fill" style="width:${g.percent}%"></div></div></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.team-assign-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openAssignModal(parseInt(btn.dataset.memberIndex, 10));
    });
  });

  container.querySelectorAll('[data-member-drawer]').forEach(el => {
    el.addEventListener('click', () => {
      openMemberDrawer(parseInt(el.dataset.memberDrawer, 10));
    });
  });
}

// ===== Member Drawer =====
let memberDrawerIndex = null;
const memberDrawer = document.getElementById('member-drawer');
const memberDrawerOverlay = document.getElementById('member-drawer-overlay');
const memberDrawerClose = document.getElementById('member-drawer-close');
const memberDrawerHeader = document.getElementById('member-drawer-header');
const memberDrawerBody = document.getElementById('member-drawer-body');
const memberDrawerAssignBtn = document.getElementById('member-drawer-assign-btn');

function openMemberDrawer(index) {
  const member = teamMembers[index];
  if (!member) return;
  memberDrawerIndex = index;

  memberDrawerHeader.innerHTML = `
    <div class="member-drawer-header-left">
      <div class="team-member-dot-circle" style="background:${member.color}"></div>
      <div class="member-drawer-name-text">
        <span class="member-drawer-name">${member.name}</span>
        <span class="member-drawer-role">${member.role}</span>
      </div>
    </div>
    <button class="member-drawer-view-profile">View Profile</button>
  `;

  const priorityRows = member.priorityGoals.map(g => `
    <div class="member-drawer-priority-row">
      <span class="member-drawer-goal-title">${g.title}</span>
      <div class="goal-card-meta">
        <span class="member-drawer-goal-percent">${g.percent}% complete</span>
        <div class="progress-bar"><div class="progress-track"><div class="progress-fill" style="width:${g.percent}%"></div></div></div>
      </div>
    </div>
  `).join('<hr class="member-drawer-priority-divider" />');

  memberDrawerBody.innerHTML = `
    <div class="member-drawer-section">
      <p class="member-drawer-section-label">Priority Goals</p>
      <div class="member-drawer-priority-card">${priorityRows}</div>
    </div>
    <div class="member-drawer-section">
      <p class="member-drawer-section-label">Other Goals</p>
      ${member.otherGoals.map(g => `
        <div class="member-drawer-other-goal-card">
          <span class="member-drawer-goal-title">${g.title}</span>
          <div class="progress-bar"><div class="progress-track"><div class="progress-fill" style="width:${g.percent}%"></div></div></div>
        </div>
      `).join('')}
    </div>
  `;

  memberDrawer.classList.add('open');
  memberDrawerOverlay.classList.add('open');
}

function closeMemberDrawer() {
  memberDrawer.classList.remove('open');
  memberDrawerOverlay.classList.remove('open');
  memberDrawerIndex = null;
}

memberDrawerClose.addEventListener('click', closeMemberDrawer);
memberDrawerOverlay.addEventListener('click', closeMemberDrawer);

memberDrawerAssignBtn.addEventListener('click', () => {
  if (memberDrawerIndex !== null) {
    closeMemberDrawer();
    openAssignModal(memberDrawerIndex);
  }
});

// ===== Assign Goal Modal =====
let assignMemberIndex = null;
const assignModal = document.getElementById('assign-modal');
const assignOverlay = document.getElementById('assign-modal-overlay');
const assignInput = document.getElementById('assign-modal-input');
const assignTitle = document.getElementById('assign-modal-title');
const assignSubmit = document.getElementById('assign-modal-submit');
const assignCancel = document.getElementById('assign-modal-cancel');

function openAssignModal(memberIndex) {
  assignMemberIndex = memberIndex;
  const member = teamMembers[memberIndex];
  assignTitle.textContent = 'Assign a goal to ' + member.name;
  assignInput.value = '';
  assignModal.classList.add('open');
  assignOverlay.classList.add('open');
  setTimeout(() => assignInput.focus(), 50);
}

function closeAssignModal() {
  assignModal.classList.remove('open');
  assignOverlay.classList.remove('open');
  assignMemberIndex = null;
}

function submitAssignGoal() {
  const title = assignInput.value.trim();
  if (!title || assignMemberIndex === null) return;
  teamMembers[assignMemberIndex].otherGoals.push({ title, percent: 0 });
  closeAssignModal();
  renderTeamGoals();
}

assignSubmit.addEventListener('click', submitAssignGoal);
assignCancel.addEventListener('click', closeAssignModal);
assignOverlay.addEventListener('click', closeAssignModal);
assignInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitAssignGoal();
});

// ===== Tab Switching =====
const yourTab = document.getElementById('your-goals-tab');
const teamTab = document.getElementById('team-goals-tab');

document.querySelectorAll('.goals-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.goals-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const which = tab.dataset.tab;
    if (which === 'your') {
      yourTab.style.display = '';
      teamTab.style.display = 'none';
    } else {
      yourTab.style.display = 'none';
      teamTab.style.display = '';
    }
  });
});

// ===== Init =====
renderPriorityList();
renderPriorityDetail();
renderOtherGoals();
renderTeamGoals();
