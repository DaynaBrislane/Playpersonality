// Top tab switching: show/hide panels by data-panel
const tabs = document.querySelectorAll('.nn-tab');
const panels = document.querySelectorAll('.nn-panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    panels.forEach((p) => {
      p.style.display = p.dataset.panel === target ? '' : 'none';
    });
  });
});

// Chip toggles (visual only)
document.querySelectorAll('.nn-chip').forEach((chip) => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// Dimension top-tab switching (Energy / Info / Decision / Org)
const dimTabs = document.querySelectorAll('.pp-dim-tab');
const dimPanels = document.querySelectorAll('.pp-dim-panel');
dimTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    dimTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.dim;
    dimPanels.forEach((p) => {
      p.style.display = p.dataset.dim === target ? '' : 'none';
    });
  });
});

// Sub-tabs inside each dimension panel (visual switch only)
document.querySelectorAll('.pp-subtabs').forEach((group) => {
  const subs = group.querySelectorAll('.pp-subtab');
  subs.forEach((s) => {
    s.addEventListener('click', () => {
      subs.forEach((x) => x.classList.remove('active'));
      s.classList.add('active');
    });
  });
});

// Edit Team modal
const editTeamModal = document.getElementById('edit-team-modal');
if (editTeamModal) {
  // Extra directory people surfaced via search (beyond the suggested list)
  const directoryPool = [
    { name: 'Maya Rosen', role: 'VP Product', meta: '6 meetings', color: '#FFB6C1' },
    { name: 'Daniel Park', role: 'Engineering Manager', meta: '23 meetings', color: '#A0E7E5' },
    { name: 'Sofia Reyes', role: 'UX Researcher', meta: '14 meetings', color: '#FFD3A8' },
    { name: 'Tomás Alvarez', role: 'Data Scientist', meta: '5 meetings', color: '#B4F8C8' },
    { name: 'Rachel Kim', role: 'Marketing Lead', meta: '8 meetings', color: '#FBE7C6' },
    { name: 'Ben Carter', role: 'Engineer', meta: '31 meetings', color: '#E2A0FF' },
    { name: 'Olivia Chen', role: 'Product Manager', meta: '17 meetings', color: '#A6D1FF' },
  ];
  const closeAllRowMenus = () => {
    editTeamModal.querySelectorAll('.net-row-menu').forEach((m) => m.remove());
    editTeamModal.querySelectorAll('.net-chev[aria-expanded="true"]').forEach((c) => c.setAttribute('aria-expanded', 'false'));
  };
  const closeModal = () => { closeAllRowMenus(); editTeamModal.hidden = true; };

  const suggestedList = editTeamModal.querySelector('.net-suggested-list');
  const suggestedLabel = editTeamModal.querySelector('.net-suggested-label');
  const searchInput = editTeamModal.querySelector('[data-directory-search]');
  const clearBtn = editTeamModal.querySelector('[data-clear-search]');
  const emptyState = editTeamModal.querySelector('[data-empty-state]');
  const emptyQuery = editTeamModal.querySelector('[data-empty-query]');

  const buildSugRow = ({ name, role, meta, color }) => {
    const row = document.createElement('div');
    row.className = 'net-sug-row';
    row.dataset.searchOnly = 'true';
    row.innerHTML = `
      <span class="nn-avatar" style="background:${color}"></span>
      <div class="nn-team-info"><p class="nn-team-name">${name}</p><p class="nn-team-role">${role}${meta ? ' · ' + meta : ''}</p></div>
      <button class="net-add-btn" type="button" data-add-suggested>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        Add
      </button>
    `;
    return row;
  };

  const teamNameSet = () => new Set(
    [...editTeamModal.querySelectorAll('[data-team-list] .nn-team-name')].map(n => n.textContent.trim().toLowerCase())
  );

  const runSearch = () => {
    const q = (searchInput?.value || '').trim().toLowerCase();
    if (clearBtn) clearBtn.hidden = !q;
    if (suggestedLabel) suggestedLabel.textContent = q ? 'Directory results' : 'Suggested connections';

    // Remove any previously injected search-only rows
    suggestedList.querySelectorAll('[data-search-only]').forEach(r => r.remove());

    const inTeam = teamNameSet();
    let visibleCount = 0;
    suggestedList.querySelectorAll('.net-sug-row').forEach((row) => {
      const text = row.textContent.toLowerCase();
      const match = !q || text.includes(q);
      row.hidden = !match;
      if (match) visibleCount++;
    });

    if (q) {
      directoryPool
        .filter(p => !inTeam.has(p.name.toLowerCase()))
        .filter(p => (p.name + ' ' + p.role).toLowerCase().includes(q))
        .forEach((p) => {
          const row = buildSugRow(p);
          row.dataset.searchOnly = 'true';
          suggestedList.appendChild(row);
          visibleCount++;
        });
    }

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
      if (emptyQuery) emptyQuery.textContent = q;
    }
  };

  if (searchInput) searchInput.addEventListener('input', runSearch);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    runSearch();
    searchInput?.focus();
  });

  document.querySelectorAll('[data-open-edit-team]').forEach((btn) => {
    btn.addEventListener('click', () => editTeamModal.hidden = false);
  });
  document.querySelectorAll('[data-close-edit-team]').forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });
  editTeamModal.addEventListener('click', (e) => {
    if (e.target === editTeamModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editTeamModal.hidden) closeModal();
  });

  const personIcon = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="#262626" stroke-width="1.3"/><path d="M3 13c.8-2.2 2.7-3.5 5-3.5s4.2 1.3 5 3.5" stroke="#262626" stroke-width="1.3" stroke-linecap="round"/></svg>';
  const trashIcon = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2.5 4h11M6 4V2.5h4V4M4 4l.6 9a1 1 0 001 .9h4.8a1 1 0 001-.9L12 4M6.5 7v5M9.5 7v5" stroke="#c53030" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  editTeamModal.addEventListener('click', (e) => {
    const chev = e.target.closest('[data-row-menu]');
    if (chev) {
      e.stopPropagation();
      const row = chev.closest('.net-team-row');
      const existing = row.querySelector('.net-row-menu');
      closeAllRowMenus();
      if (existing) return;
      const isManager = row.dataset.isManager === 'true';
      const managerLabel = isManager ? 'Remove as manager' : 'Set as manager';
      const menu = document.createElement('div');
      menu.className = 'net-row-menu';
      menu.innerHTML = `
        <button class="net-row-menu-item" type="button">${personIcon}<span>${managerLabel}</span></button>
        <button class="net-row-menu-item is-danger" type="button">${trashIcon}<span>Remove from team</span></button>
      `;
      row.appendChild(menu);
      chev.setAttribute('aria-expanded', 'true');
      return;
    }
    if (!e.target.closest('.net-row-menu')) closeAllRowMenus();

    const addBtn = e.target.closest('[data-add-suggested]');
    if (addBtn) {
      const sugRow = addBtn.closest('.net-sug-row');
      const teamList = editTeamModal.querySelector('[data-team-list]');
      if (!sugRow || !teamList) return;
      const avatarBg = sugRow.querySelector('.nn-avatar')?.style.background || '#D9D9D9';
      const name = sugRow.querySelector('.nn-team-name')?.textContent || '';
      const fullRole = sugRow.querySelector('.nn-team-role')?.textContent || '';
      const role = fullRole.split('·')[0].trim() || 'Teammate';

      const newRow = document.createElement('div');
      newRow.className = 'net-team-row';
      newRow.innerHTML = `
        <div class="net-team-left">
          <span class="nn-avatar" style="background:${avatarBg}"></span>
          <div class="nn-team-info"><p class="nn-team-name">${name}</p><p class="nn-team-role">${role}</p></div>
        </div>
        <div class="net-team-right">
          <button class="net-chev" aria-label="Options" data-row-menu>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#8c8c8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      `;
      teamList.appendChild(newRow);
      sugRow.remove();
      teamList.scrollTop = teamList.scrollHeight;
      runSearch();
    }
  });
}

// Insight row expand/collapse with detail panel
const buildInsightDetail = (title, date) => {
  const div = document.createElement('div');
  div.className = 'nn-insight-detail';
  div.innerHTML = `
    <div class="nn-insight-detail-inner">
    <span class="nn-insight-detail-bar"></span>
    <div class="nn-insight-detail-body">
      <div class="nn-insight-detail-head">
        <div class="nn-insight-detail-top">
          <div class="nn-insight-detail-titles">
            <p class="nn-insight-detail-date">${date}</p>
            <h4 class="nn-insight-detail-title">${title}</h4>
          </div>
          <div class="nn-insight-feedback">
            <button class="nn-insight-fb-btn" aria-label="Helpful" data-fb="up">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 6.5h-2v7h2m0-7l3-5a1.5 1.5 0 011.5 1.5V5h3.5a1 1 0 011 1.2l-1 6a1 1 0 01-1 .8H5m0-7v7" stroke="#262626" stroke-width="1.2" stroke-linejoin="round"/></svg>
            </button>
            <button class="nn-insight-fb-btn" aria-label="Not helpful" data-fb="down">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M11 9.5h2v-7h-2m0 7l-3 5a1.5 1.5 0 01-1.5-1.5V11H3a1 1 0 01-1-1.2l1-6a1 1 0 011-.8h7m0 7v-7" stroke="#262626" stroke-width="1.2" stroke-linejoin="round"/></svg>
            </button>
            <button class="nn-insight-collapse" type="button" aria-label="Collapse" data-collapse-insight>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 10l4-4 4 4" stroke="#262626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
        <div class="nn-insight-detail-divider"></div>
        <p class="nn-insight-detail-desc">You have a real knack for diving straight into something specific&mdash;be it a message, a relationship, or a project&mdash;which makes our sessions productive and focused. Is there ever a time you&rsquo;d like to zoom out and reflect on the bigger picture, or does sticking with what&rsquo;s immediate feel best for you right now?</p>
      </div>
      <div class="nn-insight-detail-bottom">
        <div class="nn-insight-sources">
          <p class="nn-insight-sources-label">Based on</p>
          <div class="nn-insight-source-pills">
            <button class="nn-insight-source-pill" type="button"><span class="nn-insight-pill-dot" style="background:#a1a5fd"></span>Grace&rsquo;s Perspective</button>
            <button class="nn-insight-source-pill" type="button"><span class="nn-insight-pill-dot" style="background:#cc1462"></span>Your Perspective</button>
            <button class="nn-insight-source-pill" type="button">
              <svg width="11" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="1" y="2" width="10" height="9" rx="1" stroke="#262626" stroke-width="1"/><path d="M1 5h10M4 1v2M8 1v2" stroke="#262626" stroke-width="1" stroke-linecap="round"/></svg>
              Calendar
            </button>
          </div>
        </div>
        <button class="nn-dive-deeper-btn" type="button">Dive Deeper</button>
      </div>
    </div>
    </div>
  `;
  return div;
};

document.querySelectorAll('.nn-insight').forEach((wrap) => {
  const row = wrap.querySelector('.nn-insight-row');
  if (!row) return;
  row.addEventListener('click', () => {
    let detail = wrap.querySelector('.nn-insight-detail');
    if (!detail) {
      const title = row.querySelector('.nn-insight-title')?.textContent.replace(/…|\.\.\.+$/, '').trim() || 'Insight detail';
      const date = row.querySelector('.nn-insight-date')?.textContent.trim() || '';
      detail = buildInsightDetail(title, date);
      wrap.appendChild(detail);
    }
    detail.classList.remove('is-closing');
    wrap.classList.add('is-open');
  });
});

document.addEventListener('click', (e) => {
  const collapseBtn = e.target.closest('[data-collapse-insight]');
  if (!collapseBtn) return;
  e.stopPropagation();
  const wrap = collapseBtn.closest('.nn-insight');
  if (!wrap) return;
  const detail = wrap.querySelector('.nn-insight-detail');
  if (!detail) { wrap.classList.remove('is-open'); return; }
  detail.classList.add('is-closing');
  const cleanup = () => {
    wrap.classList.remove('is-open');
    detail.remove();
  };
  detail.addEventListener('animationend', cleanup, { once: true });
  setTimeout(cleanup, 350);
});

// Feedback thumbs toggle
document.addEventListener('click', (e) => {
  const fb = e.target.closest('.nn-insight-fb-btn');
  if (!fb) return;
  e.stopPropagation();
  const group = fb.parentElement;
  group.querySelectorAll('.nn-insight-fb-btn').forEach((b) => b.classList.toggle('is-active', b === fb && !fb.classList.contains('is-active')));
});

// Edit General modal
const editGeneralModal = document.getElementById('edit-general-modal');
const generalCard = document.getElementById('general-card');
if (editGeneralModal && generalCard) {
  const form = editGeneralModal.querySelector('#edit-general-form');
  const closeGeneral = () => { editGeneralModal.hidden = true; };
  const openGeneral = () => {
    form.querySelectorAll('[data-target-field]').forEach((input) => {
      const dd = generalCard.querySelector(`[data-field="${input.dataset.targetField}"]`);
      input.value = dd ? dd.textContent.trim() : '';
    });
    editGeneralModal.hidden = false;
    setTimeout(() => form.querySelector('input')?.focus(), 30);
  };

  document.querySelectorAll('[data-open-edit-general]').forEach((btn) => {
    btn.addEventListener('click', openGeneral);
  });
  editGeneralModal.querySelectorAll('[data-close-edit-general]').forEach((btn) => {
    btn.addEventListener('click', closeGeneral);
  });
  editGeneralModal.addEventListener('click', (e) => {
    if (e.target === editGeneralModal) closeGeneral();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editGeneralModal.hidden) closeGeneral();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.querySelectorAll('[data-target-field]').forEach((input) => {
      const dd = generalCard.querySelector(`[data-field="${input.dataset.targetField}"]`);
      if (dd) dd.textContent = input.value.trim() || dd.textContent;
    });
    closeGeneral();
  });
}

// Action pill hover → change chat placeholder
const chatPlaceholder = document.querySelector('.cpv-chat-placeholder');
if (chatPlaceholder) {
  const defaultPrompt = chatPlaceholder.textContent;
  document.querySelectorAll('.cpv-action-btn').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      if (btn.dataset.prompt) chatPlaceholder.textContent = btn.dataset.prompt;
    });
    btn.addEventListener('mouseleave', () => {
      chatPlaceholder.textContent = defaultPrompt;
    });
  });
}
