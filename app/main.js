// Hearth & Ledger — boot and routing.
// Hash routes: #/dashboard, #/planner, #/transactions, #/goals, #/insights.
// The Transactions page also reads ?q= and ?cat= from the hash, so a filtered
// view is a link you can share. The month picker lives in the header and
// switches every page at once.

import { MONTHS } from './data.js';
import { saveState, state } from './store.js';
import {
  renderDashboard, renderGoals, renderInsights, renderPlanner, renderTransactions,
} from './views.js';

const view = document.getElementById('view');
const picker = document.getElementById('month-picker');

function renderMonthPicker() {
  picker.querySelectorAll('button').forEach((btn) => btn.remove());
  for (const month of MONTHS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = month.short;
    btn.setAttribute('aria-pressed', String(state.month === month.id));
    btn.setAttribute('aria-label', month.label);
    btn.addEventListener('click', () => {
      state.month = month.id;
      saveState();
      renderMonthPicker();
      route();
    });
    picker.appendChild(btn);
  }
}

function route() {
  const raw = location.hash.replace(/^#\/?/, '') || 'dashboard';
  const [page, queryString] = raw.split('?');
  const query = new URLSearchParams(queryString ?? '');
  const pages = {
    dashboard: () => renderDashboard(view),
    planner: () => renderPlanner(view),
    transactions: () => renderTransactions(view, query),
    goals: () => renderGoals(view),
    insights: () => renderInsights(view),
  };
  (pages[page] ?? pages.dashboard)();
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === (pages[page] ? page : 'dashboard'));
  });
  window.scrollTo(0, 0);
}

renderMonthPicker();
window.addEventListener('hashchange', route);
route();
