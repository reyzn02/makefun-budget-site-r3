// Hearth & Ledger — state, totals and persistence.
// The sample data lives in data.js; every edit lands in localStorage under one
// key, so the family's budget survives a reload and the Reset button can
// always bring the sample back.

import { CATEGORIES, INCOME_SOURCES, MONTHS, SEED_GOALS, SEED_TRANSACTIONS, TODAY, UPCOMING_BILLS } from './data.js';

const STORAGE_KEY = 'hearth-ledger-v3';
export const CURRENT_MONTH = '2026-11';

function freshState() {
  const tx = {};
  for (const month of MONTHS) {
    tx[month.id] = SEED_TRANSACTIONS[month.id].map((row, i) => ({
      id: `${month.id}-${String(i + 1).padStart(2, '0')}`,
      ...row,
    }));
  }
  return {
    month: CURRENT_MONTH,
    income: Object.fromEntries(INCOME_SOURCES.map((s) => [s.id, s.amount])),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.name, c.budget])),
    transactions: tx,
    goals: SEED_GOALS.map((g) => ({ ...g })),
    nextId: 1000,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.transactions || !parsed.goals) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export const state = loadState();

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetSampleData() {
  const fresh = freshState();
  state.month = fresh.month;
  state.income = fresh.income;
  state.budgets = fresh.budgets;
  state.transactions = fresh.transactions;
  state.goals = fresh.goals;
  state.nextId = fresh.nextId;
  saveState();
}

export function monthLabel(monthId) {
  return MONTHS.find((m) => m.id === monthId)?.label ?? monthId;
}

export function monthRows(monthId) {
  return state.transactions[monthId] ?? [];
}

export function incomeTotal() {
  return Object.values(state.income).reduce((sum, v) => sum + Number(v || 0), 0);
}

export function spentTotal(monthId) {
  return monthRows(monthId).reduce((sum, row) => sum + Number(row.amt || 0), 0);
}

export function leftTotal(monthId) {
  return incomeTotal() - spentTotal(monthId);
}

export function savingsRate(monthId) {
  const income = incomeTotal();
  if (!income) return 0;
  return Math.round((leftTotal(monthId) / income) * 100);
}

export function budgetTotal() {
  return Object.values(state.budgets).reduce((sum, v) => sum + Number(v || 0), 0);
}

export function categorySpent(monthId, category) {
  return monthRows(monthId)
    .filter((row) => row.cat === category)
    .reduce((sum, row) => sum + Number(row.amt || 0), 0);
}

export function overBudgetCategories(monthId) {
  return CATEGORIES.filter((c) => categorySpent(monthId, c.name) > Number(state.budgets[c.name] || 0));
}

export function categoryTotals(monthId) {
  return CATEGORIES.map((c) => ({
    ...c,
    budget: Number(state.budgets[c.name] || 0),
    spent: categorySpent(monthId, c.name),
  }));
}

export function addTransaction(monthId, row) {
  const id = `${monthId}-x${state.nextId++}`;
  state.transactions[monthId] = [...monthRows(monthId), { id, ...row }];
  saveState();
  return id;
}

export function updateTransaction(monthId, id, row) {
  state.transactions[monthId] = monthRows(monthId).map((t) => (t.id === id ? { id, ...row } : t));
  saveState();
}

export function deleteTransaction(monthId, id) {
  state.transactions[monthId] = monthRows(monthId).filter((t) => t.id !== id);
  saveState();
}

export function findTransaction(monthId, id) {
  return monthRows(monthId).find((t) => t.id === id);
}

export function addToGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goal.saved = Math.round((Number(goal.saved) + Number(amount)) * 100) / 100;
  saveState();
}

export function createGoal(goal) {
  state.goals.push({ id: `goal-${state.nextId++}`, ...goal });
  saveState();
}

export function goalsTotals() {
  const saved = state.goals.reduce((s, g) => s + Number(g.saved), 0);
  const target = state.goals.reduce((s, g) => s + Number(g.target), 0);
  return { saved, target, pct: target ? Math.round((saved / target) * 100) : 0 };
}

export function quietDays(monthId) {
  const [year, month] = monthId.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const busy = new Set(monthRows(monthId).map((row) => Number(row.d.slice(-2))));
  const quiet = [];
  for (let day = 1; day <= daysInMonth; day++) if (!busy.has(day)) quiet.push(day);
  return quiet;
}

export function billsWithDue() {
  const today = new Date(`${TODAY}T00:00:00`);
  return UPCOMING_BILLS.map((bill) => {
    const due = new Date(`${bill.due}T00:00:00`);
    const days = Math.round((due - today) / 86400000);
    return { ...bill, days };
  });
}

export function split502030(monthId) {
  const income = incomeTotal();
  const needs = CATEGORIES.filter((c) => c.kind === 'need')
    .reduce((sum, c) => sum + categorySpent(monthId, c.name), 0);
  const wants = CATEGORIES.filter((c) => c.kind === 'want')
    .reduce((sum, c) => sum + categorySpent(monthId, c.name), 0);
  const saved = leftTotal(monthId);
  const pct = (value) => (income ? Math.round((value / income) * 100) : 0);
  return {
    needs: { amount: needs, pct: pct(needs) },
    wants: { amount: wants, pct: pct(wants) },
    saved: { amount: saved, pct: pct(saved) },
  };
}

// ---- formatting helpers ----

export function money(value) {
  const n = Number(value || 0);
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function money0(value) {
  const n = Math.round(Number(value || 0));
  return `$${n.toLocaleString('en-US')}`;
}

export function prettyDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${names[m - 1]} ${d}, ${y}`;
}

export function esc(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
