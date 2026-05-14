const rows = document.querySelectorAll('.ch-row');

function closeAllPopovers() {
  document.querySelectorAll('.ch-row-popover').forEach(p => p.hidden = true);
}

rows.forEach(row => {
  const trigger = row.querySelector('.ch-row-menu');
  const popover = row.querySelector('.ch-row-popover');
  if (!trigger || !popover) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = !popover.hidden;
    closeAllPopovers();
    popover.hidden = wasOpen;
  });

  popover.querySelectorAll('.ch-row-popover-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.hidden = true;
    });
  });
});

// Filter dropdown
const filterBtn = document.querySelector('.ch-filter-btn');
const filterPopover = document.querySelector('.ch-filter-popover');
const filterLabel = document.querySelector('.ch-filter-btn-label');
const filterInputs = document.querySelectorAll('.ch-filter-option input');

function closeFilter() {
  if (!filterBtn || !filterPopover) return;
  filterPopover.hidden = true;
  filterBtn.setAttribute('aria-expanded', 'false');
}

function updateFilterLabel() {
  if (!filterLabel) return;
  const checked = [...filterInputs].filter(i => i.checked);
  if (checked.length === 0) {
    filterLabel.textContent = 'None';
  } else if (checked.length === filterInputs.length) {
    filterLabel.textContent = 'All Sources';
  } else if (checked.length === 1) {
    const labelEl = checked[0].parentElement.querySelector('.ch-filter-label');
    filterLabel.textContent = labelEl ? labelEl.textContent.trim() : checked[0].dataset.short;
  } else {
    filterLabel.textContent = checked.map(i => i.dataset.short).join(' + ');
  }
}

if (filterBtn && filterPopover) {
  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = filterBtn.getAttribute('aria-expanded') === 'true';
    closeAllPopovers();
    closeFilter();
    if (!wasOpen) {
      filterPopover.hidden = false;
      filterBtn.setAttribute('aria-expanded', 'true');
    }
  });
  filterPopover.addEventListener('click', (e) => e.stopPropagation());
  filterInputs.forEach(input => input.addEventListener('change', updateFilterLabel));
  updateFilterLabel();
}

document.addEventListener('click', () => {
  closeAllPopovers();
  closeFilter();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllPopovers();
    closeFilter();
  }
});
