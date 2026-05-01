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
