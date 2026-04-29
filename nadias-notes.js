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
