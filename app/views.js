// Hearth & Ledger — the five pages. Each renderer builds its own HTML from
// the store, then wires its controls. Nothing here fetches anything: every
// figure comes from the family's own stored record.

import { CATEGORIES, FAMILY, MONTHS, SAVING_RULES } from './data.js';
import {
  addToGoal, addTransaction, billsWithDue, budgetTotal, categorySpent, categoryTotals,
  createGoal, deleteTransaction, esc, findTransaction, goalsTotals,
  incomeTotal, leftTotal, money, money0, monthLabel, monthRows, overBudgetCategories,
  prettyDate, quietDays, resetSampleData, savingsRate, saveState, spentTotal, split502030,
  state, updateTransaction,
} from './store.js';
import { donutColors, drawDonut, drawTrend } from './charts.js';

function tiles(tiles) {
  return `<div class="tiles">${tiles.map((t) => `
    <div class="tile">
      <div class="label">${t.label}</div>
      <div class="value ${t.cls ?? ''}" ${t.id ? `id="${t.id}"` : ''}>${t.value}</div>
      <div class="sub">${t.sub}</div>
    </div>`).join('')}</div>`;
}

function txRow(row, withActions) {
  const actions = withActions
    ? `<td class="hide-phone"><button class="small secondary" data-edit="${row.id}">Edit</button>
       <button class="small danger" data-del="${row.id}">Delete</button></td>`
    : '';
  return `<tr>
    <td class="date-cell">${prettyDate(row.d)}</td>
    <td>${esc(row.desc)}</td>
    <td>${esc(row.cat)}</td>
    <td class="num">${money(row.amt)}</td>
    ${actions}
  </tr>`;
}

function bindRowButtons(root, onChange) {
  root.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteTransaction(state.month, btn.dataset.del);
      onChange();
    });
  });
  root.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = findTransaction(state.month, btn.dataset.edit);
      if (!row) return;
      location.hash = '#/planner';
      setTimeout(() => {
        const form = document.getElementById('tx-form');
        if (!form) return;
        form.querySelector('#tx-id').value = row.id;
        form.querySelector('#tx-desc').value = row.desc;
        form.querySelector('#tx-amount').value = row.amt;
        form.querySelector('#tx-date').value = row.d;
        form.querySelector('#tx-cat').value = row.cat;
        form.querySelector('#tx-submit').textContent = 'Save changes';
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    });
  });
}

// ---------------- Dashboard ----------------

export function renderDashboard(view) {
  const month = state.month;
  const income = incomeTotal();
  const spent = spentTotal(month);
  const left = leftTotal(month);
  const rate = savingsRate(month);
  const over = overBudgetCategories(month);
  const rows = [...monthRows(month)].sort((a, b) => (a.d < b.d ? 1 : -1));
  const cats = categoryTotals(month).filter((c) => c.spent > 0);
  const bills = billsWithDue();
  const billsTotal = bills.reduce((s, b) => s + b.amount, 0);
  const wins = monthWins(month);

  view.innerHTML = `
    <div class="page-head">
      <h1>Good evening, Marlowe family</h1>
      <p>Here is ${monthLabel(month)} at a glance — what came in, what went out,
      and what is left for the rest of the month.</p>
    </div>
    ${tiles([
      { label: 'Income', value: money0(income), sub: "Daniel's pay + Priya's pay", id: 'tile-income' },
      { label: 'Spent so far', value: money0(spent), sub: `${rows.length} transactions`, id: 'tile-spent' },
      { label: 'Left to spend', value: money0(left), sub: 'Income minus spending', id: 'tile-left', cls: left >= 0 ? 'good' : 'over' },
      { label: 'Savings rate', value: `${rate}%`, sub: 'Of every dollar kept', id: 'tile-rate', cls: 'good' },
    ])}
    <div class="grid-2-wide">
      <section class="card" aria-label="Spending by category">
        <h2>Where the money went
          <span class="count-pill pill ${over.length ? 'bad' : 'good'}">${over.length} categor${over.length === 1 ? 'y' : 'ies'} over budget</span>
        </h2>
        <div class="chart-wrap"><canvas class="chart" id="donut" width="300" height="300"></canvas></div>
        <ul class="legend">
          ${cats.map((c, i) => `<li class="${c.spent > c.budget ? 'over' : ''}">
            <span><span class="swatch" style="background:${donutColors(cats.length)[i]}"></span>${esc(c.name)}</span>
            <span class="amt">${money(c.spent)}${c.spent > c.budget ? ` · $${Math.round(c.spent - c.budget)} over` : ''}</span>
          </li>`).join('')}
        </ul>
      </section>
      <div>
        <section class="card" aria-label="Latest spending">
          <h2>Latest spending</h2>
          <table id="recent-list">
            <thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
            <tbody>
              ${rows.slice(0, 8).map((r) => `<tr><td>${prettyDate(r.d)}</td><td>${esc(r.desc)}</td><td class="num">${money(r.amt)}</td></tr>`).join('')}
            </tbody>
          </table>
          <p class="muted"><a href="#/transactions">See all ${rows.length} transactions →</a></p>
        </section>
        <section class="card" aria-label="Upcoming bills">
          <h2>Upcoming bills <span class="count-pill pill">${money0(billsTotal)} to pay</span></h2>
          <ul class="bills" id="bills-list">
            ${bills.map((b) => `<li>
              <span>${esc(b.name)}<br><span class="due">Due ${prettyDate(b.due)} · ${esc(b.repeat)}</span></span>
              <span><span class="amt">${money(b.amount)}</span><br><span class="due">in ${b.days} day${b.days === 1 ? '' : 's'}</span></span>
            </li>`).join('')}
          </ul>
        </section>
      </div>
    </div>
    <section class="card" aria-label="This month's wins">
      <h2>Three wins this month</h2>
      <ul class="wins" id="wins-list">
        ${wins.map((w) => `<li>${w}</li>`).join('')}
      </ul>
    </section>
    <section class="card" aria-label="About this household">
      <h2>The household behind the numbers</h2>
      <p>${esc(FAMILY.name)} — ${esc(FAMILY.home)}. ${FAMILY.members.map((m) => `${m.name} (${m.role.toLowerCase()})`).join(', ')}.
      Rent is ${money0(1450)} on the 1st; paydays are the 1st (Daniel) and the 11th (Priya).
      Pick another month above to see September and October with their own real spending.</p>
    </section>`;

  drawDonut(
    view.querySelector('#donut'),
    cats.map((c) => ({ name: c.name, value: c.spent })),
    money0(spent),
  );
}

function monthWins(month) {
  const wins = [];
  const rates = MONTHS.map((m) => ({ id: m.id, rate: savingsRate(m.id) }));
  const best = rates.reduce((a, b) => (b.rate > a.rate ? b : a));
  if (best.id === month) {
    wins.push(`Best saving month yet — <b>${best.rate}% of income kept</b>, ${money0(leftTotal(month))} still in the pot.`);
  } else {
    wins.push(`Saved ${money0(leftTotal(month))} this month — a ${savingsRate(month)}% savings rate.`);
  }
  const diningSpent = {};
  for (const m of MONTHS) {
    diningSpent[m.id] = monthRows(m.id)
      .filter((r) => r.cat === 'Dining Out')
      .reduce((s, r) => s + Number(r.amt), 0);
  }
  const lowestDining = Object.entries(diningSpent).reduce((a, b) => (b[1] < a[1] ? b : a));
  if (lowestDining[0] === month) {
    wins.push(`Dining out cost just <b>${money(lowestDining[1])}</b> — the lowest of the three months.`);
  } else {
    wins.push(`Dining out held to ${money(categoryTotals(month).find((c) => c.name === 'Dining Out')?.spent ?? 0)} this month.`);
  }
  const quiet = quietDays(month);
  wins.push(`<b>${quiet.length} days with no spending at all</b> — the quietest stretch was the end of the month.`);
  const over = overBudgetCategories(month);
  if (over.length === 0) {
    wins.push('Every category stayed inside its budget this month.');
  } else {
    wins.push(`${over.map((c) => `${c.name} ran $${Math.round(categorySpent(month, c.name) - Number(state.budgets[c.name]))} over`).join(' and ')} — the only categories over their caps.`);
  }
  return wins.slice(0, 3);
}

// ---------------- Budget Planner ----------------

export function renderPlanner(view) {
  const month = state.month;
  const income = incomeTotal();
  const budgeted = budgetTotal();
  const spent = spentTotal(month);
  const left = leftTotal(month);
  const cats = categoryTotals(month);
  const rows = [...monthRows(month)].sort((a, b) => (a.d < b.d ? 1 : -1));

  view.innerHTML = `
    <div class="page-head">
      <h1>Budget planner — ${monthLabel(month)}</h1>
      <p>Set the caps, watch each category fill up, and log spending as it happens.
      Everything updates the moment you change a number.</p>
    </div>
    ${tiles([
      { label: 'Monthly income', value: money0(income), sub: 'Edit the sources below', id: 'planner-income' },
      { label: 'Total budgeted', value: money0(budgeted), sub: 'Across 10 categories', id: 'planner-budgeted' },
      { label: 'Spent so far', value: money0(spent), sub: `${rows.length} transactions`, id: 'planner-spent' },
      { label: 'Budget remaining', value: money0(budgeted - spent), sub: 'Budget minus spending', id: 'planner-left', cls: budgeted - spent >= 0 ? 'good' : 'over' },
    ])}
    <div class="grid-2">
      <section class="card" aria-label="Income">
        <h2>Income — where it comes from</h2>
        <div id="income-form">
          ${[{ id: 'daniel', label: "Daniel's teaching pay", day: 'Paid on the 1st' },
             { id: 'priya', label: "Priya's nursing pay", day: 'Paid on the 11th' },
             { id: 'other', label: 'Other income', day: 'Odd jobs, refunds, gifts' }].map((s) => `
            <div class="form-row" style="grid-template-columns: 1fr 140px; align-items: end;">
              <div><label for="inc-${s.id}">${s.label}</label><span class="muted">${s.day}</span></div>
              <div><input type="number" id="inc-${s.id}" data-income="${s.id}" min="0" step="1" value="${Number(state.income[s.id] || 0)}"></div>
            </div>`).join('')}
        </div>
        <p class="muted">Total income: <b id="income-total">${money0(income)}</b> a month.
        The planner's spent and left figures follow these numbers live.</p>
      </section>
      <section class="card" aria-label="Add a transaction">
        <h2>Add spending</h2>
        <form id="tx-form">
          <input type="hidden" id="tx-id" value="">
          <div class="form-row">
            <div><label for="tx-desc">What was it?</label><input id="tx-desc" required maxlength="80" placeholder="e.g. GreenMart weekly shop"></div>
            <div><label for="tx-amount">Amount ($)</label><input id="tx-amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></div>
          </div>
          <div class="form-row">
            <div><label for="tx-date">Date</label><input id="tx-date" type="date" required value="${month}-25"></div>
            <div><label for="tx-cat">Category</label>
              <select id="tx-cat">${CATEGORIES.map((c) => `<option>${esc(c.name)}</option>`).join('')}</select>
            </div>
          </div>
          <button type="submit" id="tx-submit">Add transaction</button>
          <button type="button" class="secondary" id="tx-cancel" hidden>Cancel edit</button>
        </form>
        <h3 style="margin-top:1.2rem;">Latest spending</h3>
        <div class="table-scroll">
        <table id="latest-list">
          <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th class="hide-phone">Actions</th></tr></thead>
          <tbody>${rows.slice(0, 8).map((r) => txRow(r, true)).join('')}</tbody>
        </table>
        </div>
      </section>
    </div>
    <section class="card" aria-label="Category budgets">
      <h2>Category budgets — ${money0(budgeted)} planned</h2>
      <div class="table-scroll">
      <table>
        <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Budget</th><th class="num">Left</th><th>Used</th></tr></thead>
        <tbody>
          ${cats.map((c) => {
            const pct = c.budget ? Math.min(100, Math.round((c.spent / c.budget) * 100)) : 0;
            const over = c.spent > c.budget;
            return `<tr class="${over ? 'over-row' : ''}">
              <td><b>${esc(c.name)}</b>${over ? ` <span class="over-text">$${Math.round(c.spent - c.budget)} over</span>` : ''}</td>
              <td class="num">${money(c.spent)}</td>
              <td class="num"><input type="number" data-budget="${esc(c.name)}" min="0" step="1" value="${c.budget}" aria-label="Budget for ${esc(c.name)}" style="width:96px"></td>
              <td class="num ${over ? 'over-text' : 'good-text'}">${money(c.spent - c.budget > 0 ? -(c.spent - c.budget) : c.budget - c.spent)}</td>
              <td><div class="bar-track"><div class="bar-fill ${over ? 'over' : ''}" style="width:${pct}%"></div></div>
              <span class="muted">${pct}%</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>
      <p style="margin-top:0.9rem;"><button class="secondary" id="reset-data">Reset sample data</button>
      <span class="muted">Restores the original 88 transactions, budgets and goals.</span></p>
    </section>`;

  const rerender = () => renderPlanner(view);

  view.querySelectorAll('[data-income]').forEach((input) => {
    input.addEventListener('change', () => {
      state.income[input.dataset.income] = Number(input.value || 0);
      saveState();
      rerender();
    });
  });
  view.querySelectorAll('[data-budget]').forEach((input) => {
    input.addEventListener('change', () => {
      state.budgets[input.dataset.budget] = Number(input.value || 0);
      saveState();
      rerender();
    });
  });
  view.querySelector('#reset-data').addEventListener('click', () => {
    resetSampleData();
    rerender();
  });
  const form = view.querySelector('#tx-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const row = {
      d: form.querySelector('#tx-date').value,
      desc: form.querySelector('#tx-desc').value.trim(),
      cat: form.querySelector('#tx-cat').value,
      amt: Math.round(Number(form.querySelector('#tx-amount').value) * 100) / 100,
    };
    if (!row.d || !row.desc || !(row.amt > 0)) return;
    const id = form.querySelector('#tx-id').value;
    if (id) updateTransaction(state.month, id, row);
    else addTransaction(state.month, row);
    rerender();
  });
  bindRowButtons(view, rerender);
}

// ---------------- Transactions ----------------

export function renderTransactions(view, query) {
  const month = state.month;
  const q = (query.get('q') ?? '').trim().toLowerCase();
  const cat = query.get('cat') ?? '';
  const all = [...monthRows(month)].sort((a, b) => (a.d < b.d ? 1 : -1));
  const shown = all.filter((r) => {
    if (cat && r.cat !== cat) return false;
    if (q && !(r.desc.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q))) return false;
    return true;
  });
  const out = shown.reduce((s, r) => s + Number(r.amt), 0);
  const catsPresent = [...new Set(all.map((r) => r.cat))];

  view.innerHTML = `
    <div class="page-head">
      <h1>Transactions — ${monthLabel(month)}</h1>
      <p>Every dollar out, in date order. Search by shop or item, filter by category,
      and take a copy with you as a CSV file.</p>
    </div>
    ${tiles([
      { label: 'Transactions', value: String(shown.length), sub: `of ${all.length} this month`, id: 'tx-count' },
      { label: 'Money in', value: money0(incomeTotal()), sub: 'Paydays: 1st + 11th', id: 'tx-in' },
      { label: 'Money out', value: money0(out), sub: `${catsPresent.length} categories shown`, id: 'tx-out' },
    ])}
    <section class="card">
      <div class="toolbar">
        <div class="field search">
          <label for="tx-search">Search</label>
          <input id="tx-search" type="search" placeholder="Try “GreenMart”…" value="${esc(query.get('q') ?? '')}">
        </div>
        <div class="field">
          <label for="tx-filter">Category</label>
          <select id="tx-filter">
            <option value="">All categories</option>
            ${CATEGORIES.map((c) => `<option ${c.name === cat ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="flex:0 0 auto;">
          <button class="amber" id="csv-download">Download CSV</button>
        </div>
      </div>
      <p class="muted" id="tx-summary">Showing ${shown.length} of ${all.length} transactions — ${money(out)} out.</p>
      <div class="table-scroll">
      <table id="tx-table">
        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th class="hide-phone">Actions</th></tr></thead>
        <tbody>
          ${shown.length ? shown.map((r) => txRow(r, true)).join('') : '<tr><td colspan="5">Nothing matches — try a different search.</td></tr>'}
        </tbody>
      </table>
      </div>
    </section>`;

  const applyFilter = () => {
    const next = new URLSearchParams();
    const search = view.querySelector('#tx-search').value.trim();
    const category = view.querySelector('#tx-filter').value;
    if (search) next.set('q', search);
    if (category) next.set('cat', category);
    location.hash = `#/transactions${next.toString() ? `?${next}` : ''}`;
  };
  view.querySelector('#tx-search').addEventListener('input', applyFilter);
  view.querySelector('#tx-filter').addEventListener('change', applyFilter);
  view.querySelector('#csv-download').addEventListener('click', () => {
    const lines = ['Date,Description,Category,Amount'];
    for (const r of shown) {
      lines.push(`${r.d},"${r.desc.replace(/"/g, '""')}",${r.cat},${Number(r.amt).toFixed(2)}`);
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marlowe-transactions-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
  bindRowButtons(view, () => renderTransactions(view, new URLSearchParams(location.hash.split('?')[1] ?? '')));
}

// ---------------- Savings Goals ----------------

export function renderGoals(view) {
  const totals = goalsTotals();
  view.innerHTML = `
    <div class="page-head">
      <h1>Savings goals</h1>
      <p>Four things the family is saving for — from the emergency fund to Maya's first bike.
      Add money to any goal and watch the bar move.</p>
    </div>
    <div class="callout green">
      <b id="goals-total">${money0(totals.saved)} saved of ${money0(totals.target)}</b>
      — <span id="goals-pct">${totals.pct}% funded</span> across ${state.goals.length} goals.
      The emergency fund comes first: $200 on every payday, before anything else is spent.
    </div>
    <div class="grid-2">
      ${state.goals.map((goal) => {
        const pct = goal.target ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
        const left = Math.max(0, goal.target - goal.saved);
        return `<section class="card goal-card" data-goal="${goal.id}">
          <div class="goal-top"><h2>${esc(goal.name)}</h2><span class="saved">${money(goal.saved)} <span class="muted">of ${money(goal.target)}</span></span></div>
          <p class="goal-meta">${esc(goal.note)} · Deadline ${prettyDate(goal.deadline)} · ${money(left)} left · ${pct}% funded</p>
          <div class="bar-track" style="height:14px;"><div class="bar-fill ${pct >= 100 ? '' : 'amber'}" style="width:${pct}%"></div></div>
          <div class="add-money">
            <input type="number" min="1" step="1" placeholder="Add $…" data-add-amount="${goal.id}" aria-label="Amount to add to ${esc(goal.name)}">
            <button data-add-goal="${goal.id}">Add money</button>
          </div>
        </section>`;
      }).join('')}
    </div>
    <div class="grid-2">
      <section class="card" aria-label="Create a goal">
        <h2>Start a new goal</h2>
        <form id="new-goal-form">
          <div class="form-row">
            <div><label for="goal-name">Goal name</label><input id="goal-name" required maxlength="60" placeholder="e.g. Christmas presents"></div>
            <div><label for="goal-target">Target ($)</label><input id="goal-target" type="number" min="1" step="1" required placeholder="500"></div>
          </div>
          <div class="form-row">
            <div><label for="goal-deadline">Deadline</label><input id="goal-deadline" type="date" required value="2027-06-30"></div>
            <div><label for="goal-note">Why it matters (optional)</label><input id="goal-note" maxlength="90" placeholder="One short line"></div>
          </div>
          <button type="submit">Create goal</button>
        </form>
      </section>
      <section class="card" aria-label="How the family saves">
        <h2>How the family saves</h2>
        <p><b>Payday rule.</b> ${esc(SAVING_RULES.payday)}</p>
        <p><b>Windfalls.</b> ${esc(SAVING_RULES.windfall)}</p>
        <p class="muted">Maya's bike is ${money(Math.max(0, (state.goals.find((g) => g.id === 'bike')?.target ?? 0) - (state.goals.find((g) => g.id === 'bike')?.saved ?? 0)))} away —
        at $25 a week it is hers before Christmas.</p>
      </section>
    </div>`;

  view.querySelectorAll('[data-add-goal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = view.querySelector(`[data-add-amount="${btn.dataset.addGoal}"]`);
      const amount = Number(input?.value);
      if (!(amount > 0)) {
        input?.focus();
        return;
      }
      addToGoal(btn.dataset.addGoal, amount);
      renderGoals(view);
    });
  });
  view.querySelector('#new-goal-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    createGoal({
      name: form.querySelector('#goal-name').value.trim(),
      target: Number(form.querySelector('#goal-target').value),
      deadline: form.querySelector('#goal-deadline').value,
      note: form.querySelector('#goal-note').value.trim() || 'A new family goal',
      saved: 0,
    });
    renderGoals(view);
  });
}

// ---------------- Insights ----------------

export function renderInsights(view) {
  const month = state.month;
  const spent = spentTotal(month);
  const saved = leftTotal(month);
  const rate = savingsRate(month);
  const split = split502030(month);
  const over = overBudgetCategories(month);
  const rows = monthRows(month);
  const biggest = [...rows].sort((a, b) => b.amt - a.amt)[0];
  const smallest = [...rows].sort((a, b) => a.amt - b.amt)[0];
  const quiet = quietDays(month);
  const trend = MONTHS.map((m) => ({ label: m.short, spent: spentTotal(m.id), saved: leftTotal(m.id) }));
  const avgSavedRaw = trend.reduce((s, m) => s + m.saved, 0) / trend.length;
  const avgSaved = Math.round(avgSavedRaw);
  const paceYear = Math.round(saved * 12);
  const avgYear = Math.round(avgSavedRaw * 12);
  const heaviest = trend.reduce((a, b) => (b.spent > a.spent ? b : a));
  const moves = nextMonthMoves(month, over);
  const monthName = monthLabel(month).replace(' 2026', '');
  const emergency = state.goals.find((g) => g.id === 'emergency');
  const roadtrip = state.goals.find((g) => g.id === 'roadtrip');
  const yearSentence = paceYear >= 2 * (emergency?.target ?? 0) + (roadtrip?.target ?? 0)
    ? `At ${monthName}'s pace the family banks ${money0(paceYear)} in a year — enough for the emergency fund twice over, with the road trip on top.`
    : `At ${monthName}'s pace the family banks ${money0(paceYear)} in a year — steady progress toward the emergency fund and the road trip.`;

  view.innerHTML = `
    <div class="page-head">
      <h1>Insights — ${monthLabel(month)}</h1>
      <p>What the numbers are actually saying, in plain English — plus three moves
      for next month, a what-if calculator and a debt payoff calculator to play with.</p>
    </div>
    ${tiles([
      { label: 'Saved this month', value: money0(saved), sub: `${rate}% of income`, id: 'insight-saved' },
      { label: '3-month average saved', value: money0(avgSaved), sub: 'Per month, Sep–Nov', id: 'insight-avg' },
      { label: 'Days with no spending', value: String(quiet.length), sub: 'Quiet days this month', id: 'insight-quiet' },
    ])}
    <div class="grid-2">
      <section class="card" aria-label="Three month trend">
        <h2>Spending trend — three months</h2>
        <div class="chart-wrap"><canvas class="chart" id="trend-chart" width="640" height="260"></canvas></div>
        <ul class="legend" id="trend-list">
          ${trend.map((m, i) => `<li><span>${MONTHS[i].label}${m.label === heaviest.label && m.spent === heaviest.spent ? ' — <b>heaviest month yet</b>' : ''}</span><span class="amt">spent ${money(m.spent)} · saved ${money(m.saved)}</span></li>`).join('')}
        </ul>
        <p class="muted">${trendNote(trend)}</p>
      </section>
      <section class="card" aria-label="50 30 20 split">
        <h2>The 50 / 30 / 20 split — live</h2>
        <p class="muted">Needs, wants and savings as a share of this month's ${money0(incomeTotal())} income.</p>
        <div class="split-bar" role="img" aria-label="Needs ${split.needs.pct} percent, wants ${split.wants.pct} percent, savings ${split.saved.pct} percent">
          <div class="seg-needs" style="width:${split.needs.pct}%"></div>
          <div class="seg-wants" style="width:${split.wants.pct}%"></div>
          <div class="seg-saved" style="width:${split.saved.pct}%"></div>
        </div>
        <div class="split-key">
          <span><span class="dot" style="background:#1d4a38"></span>Needs <b id="split-needs">${split.needs.pct}% · ${money(split.needs.amount)}</b></span>
          <span><span class="dot" style="background:#e8a13a"></span>Wants <b id="split-wants">${split.wants.pct}% · ${money(split.wants.amount)}</b></span>
          <span><span class="dot" style="background:#cfe8d8"></span>Saved <b id="split-saved">${split.saved.pct}% · ${money(split.saved.amount)}</b></span>
        </div>
        <p class="muted" style="margin-top:0.4rem;">Shares are rounded to whole percents, so they can add to 99% or 101%.</p>
        <p style="margin-top:0.8rem;"><b>Biggest lever:</b> <span id="lever-tip">${leverTip(month, over)}</span></p>
      </section>
    </div>
    <div class="grid-2">
      <section class="card" aria-label="What if calculator">
        <h2>What-if calculator</h2>
        <p class="muted">Small weekly habits, yearly money. Change either number and watch the year change.</p>
        <div class="form-row">
          <div><label for="whatif-takeout">Cut weekly takeout by ($/week)</label><input id="whatif-takeout" type="number" min="0" step="5" value="40"></div>
          <div><label for="whatif-payday">Add to savings each payday ($)</label><input id="whatif-payday" type="number" min="0" step="10" value="100"></div>
        </div>
        <p><b id="whatif-result">$4,480 a year</b> <span class="muted" id="whatif-monthly">— about $373 a month.</span></p>
        <p class="muted">Takeout savings count 52 weeks a year; payday top-ups count 24 paydays a year.</p>
      </section>
      <section class="card" aria-label="Moves for next month">
        <h2>Three moves for next month</h2>
        <ol class="moves" id="moves-list">
          ${moves.map((m) => `<li>${m}</li>`).join('')}
        </ol>
      </section>
    </div>
    <div class="grid-2">
      <section class="card" aria-label="Budget health check">
        <h2>Budget health check</h2>
        <div class="kv"><span>Categories inside budget</span><b id="health-in-budget">${CATEGORIES.length - over.length} of ${CATEGORIES.length}</b></div>
        <div class="kv"><span>Biggest single expense</span><b id="health-biggest">${esc(biggest.desc)} — ${money(biggest.amt)}</b></div>
        <div class="kv"><span>Smallest expense</span><b id="health-smallest">${esc(smallest.desc)} — ${money(smallest.amt)}</b></div>
        <div class="kv"><span>Days with no spending</span><b id="health-quiet">${quiet.length} days</b></div>
        <div class="kv"><span>Transactions this month</span><b>${rows.length}</b></div>
      </section>
      <section class="card" aria-label="Year at a glance">
        <h2>Year at a glance</h2>
        <div class="kv"><span>Saved this month</span><b>${money(saved)}</b></div>
        <div class="kv"><span>3-month average saved</span><b>${money(avgSaved)} / month</b></div>
        <div class="kv"><span>Projected yearly savings at this month's pace</span><b id="year-pace">${money0(paceYear)} / year</b></div>
        <div class="kv"><span>Projected yearly savings at the 3-month average</span><b id="year-avg">${money0(avgYear)} / year</b></div>
        <p class="muted" style="margin-top:0.7rem;">${yearSentence}</p>
      </section>
    </div>
    <section class="card" aria-label="Debt payoff calculator">
      <h2>Debt payoff calculator</h2>
      <p class="muted">Paying off a card or a loan? Type in your own numbers — nothing is
      filled in for you — and see how many months it takes and what the interest costs.</p>
      <div class="form-row three">
        <div><label for="debt-balance">Balance owed ($)</label><input id="debt-balance" type="number" min="0" step="1" placeholder="e.g. 1000"></div>
        <div><label for="debt-apr">Interest rate (APR %)</label><input id="debt-apr" type="number" min="0" step="0.1" placeholder="e.g. 20"></div>
        <div><label for="debt-payment">Monthly payment ($)</label><input id="debt-payment" type="number" min="0" step="1" placeholder="e.g. 100"></div>
      </div>
      <p><b id="debt-result">Enter a balance, APR and monthly payment to see the payoff time.</b> <span class="muted" id="debt-detail"></span></p>
    </section>`;

  drawTrend(view.querySelector('#trend-chart'), trend);

  const recompute = () => {
    const takeout = Number(view.querySelector('#whatif-takeout').value || 0);
    const payday = Number(view.querySelector('#whatif-payday').value || 0);
    const yearly = Math.round(takeout * 52 + payday * 24);
    const monthly = Math.round(yearly / 12);
    view.querySelector('#whatif-result').textContent = `${money0(yearly)} a year`;
    view.querySelector('#whatif-monthly').textContent = `— about ${money0(monthly)} a month.`;
  };
  view.querySelector('#whatif-takeout').addEventListener('input', recompute);
  view.querySelector('#whatif-payday').addEventListener('input', recompute);
  recompute();

  const debtRecompute = () => {
    const balance = Number(view.querySelector('#debt-balance').value || 0);
    const apr = Number(view.querySelector('#debt-apr').value || 0);
    const payment = Number(view.querySelector('#debt-payment').value || 0);
    const result = view.querySelector('#debt-result');
    const detail = view.querySelector('#debt-detail');
    if (!(balance > 0) || !(payment > 0)) {
      result.textContent = 'Enter a balance, APR and monthly payment to see the payoff time.';
      detail.textContent = '';
      return;
    }
    const rate = apr / 100 / 12;
    if (rate > 0 && payment <= balance * rate) {
      result.textContent = 'That payment never clears the debt — it does not cover the monthly interest.';
      detail.textContent = `Interest alone is ${money(balance * rate)} a month at ${apr}% APR.`;
      return;
    }
    let remaining = balance;
    let months = 0;
    let interest = 0;
    while (remaining > 0 && months < 1200) {
      const charge = remaining * rate;
      interest += charge;
      const paid = Math.min(payment, remaining + charge);
      remaining = remaining + charge - paid;
      months += 1;
    }
    result.textContent = `Paid off in ${months} month${months === 1 ? '' : 's'} — about ${money0(interest)} of interest in total.`;
    detail.textContent = `Total paid ${money(balance + interest)}.`;
  };
  ['#debt-balance', '#debt-apr', '#debt-payment'].forEach((sel) => {
    view.querySelector(sel).addEventListener('input', debtRecompute);
  });
  debtRecompute();
}

function trendNote(trend) {
  const lightest = trend.reduce((a, b) => (b.spent < a.spent ? b : a));
  const bestSaver = trend.reduce((a, b) => (b.saved > a.saved ? b : a));
  return `${lightest.label} is the lightest month of the three — and ${bestSaver.label} saved the most.`;
}

function leverTip(month, over) {
  if (!over.length) return 'Nothing is over budget — the lever this month is keeping it that way.';
  const worst = over
    .map((c) => ({ name: c.name, overBy: categoryTotals(month).find((t) => t.name === c.name).spent - Number(state.budgets[c.name]) }))
    .sort((a, b) => b.overBy - a.overBy)[0];
  return `${worst.name} is the lever: it ran $${Math.round(worst.overBy)} over its cap. Bringing it back inside the cap closes most of the gap.`;
}

function nextMonthMoves(month, over) {
  const moves = [];
  if (over.length) {
    const worst = over
      .map((c) => ({ name: c.name, overBy: categoryTotals(month).find((t) => t.name === c.name).spent - Number(state.budgets[c.name]) }))
      .sort((a, b) => b.overBy - a.overBy)[0];
    moves.push(`Trim <b>${esc(worst.name)} — $${Math.round(worst.overBy)} over</b> its cap: swap one GreenMart shop for the pantry stock-up and keep the list on the fridge.`);
  } else {
    moves.push('Hold every category inside its cap — the budget is working, so protect it.');
  }
  const dining = categoryTotals(month).find((c) => c.name === 'Dining Out');
  const diningCap = Math.max(10, Math.round((dining.spent * 0.8) / 5) * 5);
  moves.push(`Cap dining out at <b>${money0(diningCap)}</b> next month — this month it cost ${money(dining.spent)}, and takeout is the easiest habit to halve.`);
  moves.push('Automate <b>$100 to the road-trip fund on each payday</b> — $2,400 a year, and the lake trip pays for itself.');
  return moves.slice(0, 3);
}
