# Hearth & Ledger — the Marlowe family budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/reyzn02/makefun-budget-site-r3/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/reyzn02/makefun-budget-site-r3/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A working household budget site for the Marlowe family of four — Daniel
(teacher), Priya (nurse, part-time), Maya (9) and Leo (7) — living in a
rented three-bedroom house on Maple Street. Built for the
[make.fun "Make the best household budget site" bounty](https://make.fun/bounty/best-household-budget-site-20261126-1457).

## What is inside

- **88 real transactions across 3 months** — September (30), October (32) and
  November (26), adding up to $3,340 / $3,612 / $3,141.02 against $5,850 of
  income a month. Switch months in the header; no month is ever empty.
- **5 pages, each reached from the top nav:**
  - **Dashboard** — income, spent, left and savings rate; a donut of spending
    by category; the latest 8 transactions; three plain-English wins; upcoming
    bills with due-in-days.
  - **Budget Planner** — editable income from 3 sources; 10 category budgets
    with spent / budget / left / %-used bars and red over-budget rows; an
    add / edit / delete transaction form; reset sample data.
  - **Transactions** — search plus category filter (shareable through the URL),
    a full table with edit/delete, and CSV download.
  - **Savings Goals** — 4 goals, $4,055 of $6,820 funded (59%): emergency fund,
    summer road trip, Maya's first bike, new water heater. Add money to any goal
    or create a new one, plus the family's payday saving rules.
  - **Insights** — a 3-month spending trend chart; the live 50/30/20 split;
    a what-if calculator (cut weekly takeout + payday top-ups → yearly effect);
    a debt payoff calculator (your own balance, APR and monthly payment —
    months to clear plus total interest); three moves for next month; a budget
    health check; year-at-a-glance projections ($32,508 at November's pace,
    $29,828 at the 3-month average).
- **Everything persists in localStorage** and every total updates live on edit.
- **Static and offline** — no libraries, no network requests, system fonts only.
  Works on desktop and on a phone (single-column layout, Actions column hidden).

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`).

## License

MIT — see [LICENSE](LICENSE).
