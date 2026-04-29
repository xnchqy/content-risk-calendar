const monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

const appData = document.getElementById('app-data');
if (!appData) throw new Error('app-data not found');

const currentMonth = parseInt(appData.dataset.currentMonth);
const monthCounts = JSON.parse(appData.dataset.monthCounts);
const strategyMonths = JSON.parse(appData.dataset.strategyMonths);

let activeMonth = currentMonth;
let activeFilter = 'all';

function switchMonth(m) {
  activeMonth = m;

  document.querySelectorAll('.month-nav-btn').forEach(btn => {
    const bm = parseInt(btn.dataset.month);
    const badge = btn.querySelector('span:last-child');
    btn.classList.remove('bg-blue-50', 'text-blue-700', 'font-semibold');
    if (bm === m) {
      btn.classList.add('bg-blue-50', 'text-blue-700', 'font-semibold');
      if (badge) { badge.classList.remove('bg-gray-100', 'text-gray-500'); badge.classList.add('bg-blue-100', 'text-blue-600'); }
    } else {
      if (badge) { badge.classList.remove('bg-blue-100', 'text-blue-600'); badge.classList.add('bg-gray-100', 'text-gray-500'); }
    }
  });

  const count = monthCounts[m] || 0;
  document.getElementById('month-title').textContent = '2026年 ' + monthNames[m - 1];
  document.getElementById('month-subtitle').textContent = count > 0 ? '共 ' + count + ' 个风控节点' : '暂无数据';

  document.querySelectorAll('.month-section').forEach(sec => {
    sec.style.display = parseInt(sec.dataset.month) === m ? '' : 'none';
  });
  document.querySelectorAll('.month-strategy').forEach(sec => {
    sec.style.display = parseInt(sec.dataset.month) === m ? '' : 'none';
  });

  document.getElementById('empty-state').classList.toggle('hidden', count > 0);
  renderFilter();

  if (window.location.hash === '#strategy') {
    const stratSection = document.querySelector('.month-strategy[data-month="' + m + '"]');
    if (stratSection) {
      const details = stratSection.querySelector('details');
      if (details) details.open = true;
      stratSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function setFilter(f) {
  activeFilter = f;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'text-gray-700', 'shadow-sm');
    btn.classList.add('text-gray-500');
  });
  const activeBtn = document.getElementById('filter-' + f);
  if (activeBtn) {
    activeBtn.classList.add('bg-white', 'text-gray-700', 'shadow-sm');
    activeBtn.classList.remove('text-gray-500');
  }
  renderFilter();
}

function renderFilter() {
  const activeSection = document.querySelector('.month-section[data-month="' + activeMonth + '"]');
  if (!activeSection) return;
  activeSection.querySelectorAll('.event-card').forEach(card => {
    card.style.display = (activeFilter === 'all' || card.dataset.level === activeFilter) ? '' : 'none';
  });
}

function getMonthFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const m = parseInt(params.get('month'));
  return (m >= 1 && m <= 12) ? m : currentMonth;
}

switchMonth(getMonthFromUrl());

window.switchMonth = switchMonth;
window.setFilter = setFilter;
