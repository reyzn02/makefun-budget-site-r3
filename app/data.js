// Hearth & Ledger — the Marlowe household's own figures.
// Every number below is the family's real (sample) record for Sep–Nov 2026:
// income $5,850 a month, rent $1,450 on the 1st, and 88 dated transactions
// that add up to $3,340 (Sep), $3,612 (Oct) and $3,141.02 (Nov).

export const FAMILY = {
  name: 'The Marlowe Family',
  home: 'A rented three-bedroom house on Maple Street',
  members: [
    { name: 'Daniel', role: 'Teacher', note: 'Payday on the 1st' },
    { name: 'Priya', role: 'Nurse, part-time', note: 'Payday on the 11th' },
    { name: 'Maya', role: 'Daughter, 9', note: 'Saving for her first bike' },
    { name: 'Leo', role: 'Son, 7', note: 'Soccer every Saturday' },
  ],
};

export const INCOME_SOURCES = [
  { id: 'daniel', label: "Daniel's teaching pay", day: 1, amount: 3850 },
  { id: 'priya', label: "Priya's nursing pay", day: 11, amount: 2000 },
  { id: 'other', label: 'Other income', day: 0, amount: 0 },
];

export const CATEGORIES = [
  { name: 'Housing', budget: 1450, kind: 'need' },
  { name: 'Groceries', budget: 620, kind: 'need' },
  { name: 'Utilities', budget: 210, kind: 'need' },
  { name: 'Transport', budget: 340, kind: 'need' },
  { name: 'Dining Out', budget: 180, kind: 'want' },
  { name: 'Kids & School', budget: 260, kind: 'need' },
  { name: 'Health', budget: 150, kind: 'need' },
  { name: 'Entertainment', budget: 120, kind: 'want' },
  { name: 'Household', budget: 140, kind: 'want' },
  { name: 'Other', budget: 80, kind: 'want' },
];

// Needs = Housing, Groceries, Utilities, Transport, Kids & School, Health.
// Wants = Dining Out, Entertainment, Household, Other.
// November works out near 50% needs / 3% wants / 46% saved.

export const MONTHS = [
  { id: '2026-09', label: 'September 2026', short: 'Sep' },
  { id: '2026-10', label: 'October 2026', short: 'Oct' },
  { id: '2026-11', label: 'November 2026', short: 'Nov' },
];

export const SEED_TRANSACTIONS = {
  '2026-09': [
    { d: '2026-09-01', desc: 'Rent — Maple Street house', cat: 'Housing', amt: 1450.0 },
    { d: '2026-09-02', desc: 'Gas fill-up — Main Street station', cat: 'Transport', amt: 41.6 },
    { d: '2026-09-03', desc: 'Bus passes for the month', cat: 'Transport', amt: 64.0 },
    { d: '2026-09-04', desc: 'Electric bill — August usage', cat: 'Utilities', amt: 96.75 },
    { d: '2026-09-05', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 138.45 },
    { d: '2026-09-06', desc: 'School lunch money — Maya & Leo', cat: 'Kids & School', amt: 45.0 },
    { d: '2026-09-07', desc: 'Water bill', cat: 'Utilities', amt: 51.2 },
    { d: '2026-09-08', desc: 'Pharmacy refill — Daniel', cat: 'Health', amt: 31.2 },
    { d: '2026-09-09', desc: 'Internet bill', cat: 'Utilities', amt: 58.0 },
    { d: '2026-09-10', desc: 'Winter coats — Maya & Leo', cat: 'Kids & School', amt: 168.0 },
    { d: '2026-09-11', desc: "Bike repair — Daniel's commuter bike", cat: 'Transport', amt: 22.5 },
    { d: '2026-09-12', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 126.8 },
    { d: '2026-09-13', desc: 'School fundraiser — bake sale table', cat: 'Kids & School', amt: 40.0 },
    { d: '2026-09-14', desc: 'Sushi takeout — Friday treat', cat: 'Dining Out', amt: 32.5 },
    { d: '2026-09-15', desc: 'Movie rental — family film night', cat: 'Entertainment', amt: 11.99 },
    { d: '2026-09-16', desc: "Maya's art supplies", cat: 'Kids & School', amt: 24.6 },
    { d: '2026-09-17', desc: 'Gas fill-up — Main Street station', cat: 'Transport', amt: 37.45 },
    { d: '2026-09-18', desc: 'Dentist check-up — Priya', cat: 'Health', amt: 55.0 },
    { d: '2026-09-19', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 151.25 },
    { d: '2026-09-20', desc: "Leo's soccer ball", cat: 'Kids & School', amt: 19.95 },
    { d: '2026-09-21', desc: 'Pizza night', cat: 'Dining Out', amt: 33.8 },
    { d: '2026-09-22', desc: 'Laundry supplies', cat: 'Household', amt: 28.75 },
    { d: '2026-09-23', desc: 'Family haircuts', cat: 'Other', amt: 62.0 },
    { d: '2026-09-24', desc: 'Board game night — new game', cat: 'Entertainment', amt: 24.0 },
    { d: '2026-09-25', desc: 'Kitchen towels', cat: 'Household', amt: 12.4 },
    { d: '2026-09-26', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 129.6 },
    { d: '2026-09-27', desc: 'Family diner — Sunday lunch', cat: 'Dining Out', amt: 27.25 },
    { d: '2026-09-28', desc: "Leo's comic book", cat: 'Entertainment', amt: 9.5 },
    { d: '2026-09-29', desc: 'Gift for the neighbours', cat: 'Other', amt: 18.5 },
    { d: '2026-09-30', desc: 'Costco stock-up — pantry & freezer', cat: 'Groceries', amt: 327.96 },
  ],
  '2026-10': [
    { d: '2026-10-01', desc: 'Rent — Maple Street house', cat: 'Housing', amt: 1450.0 },
    { d: '2026-10-02', desc: 'Gas fill-up — Main Street station', cat: 'Transport', amt: 44.1 },
    { d: '2026-10-03', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 148.2 },
    { d: '2026-10-03', desc: 'Bus passes for the month', cat: 'Transport', amt: 64.0 },
    { d: '2026-10-04', desc: 'Electric bill — September usage', cat: 'Utilities', amt: 102.15 },
    { d: '2026-10-06', desc: 'School lunch money — Maya & Leo', cat: 'Kids & School', amt: 45.0 },
    { d: '2026-10-07', desc: 'Water bill', cat: 'Utilities', amt: 48.6 },
    { d: '2026-10-08', desc: 'Pharmacy refill — Priya', cat: 'Health', amt: 28.4 },
    { d: '2026-10-09', desc: 'Internet bill', cat: 'Utilities', amt: 58.0 },
    { d: '2026-10-10', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 132.75 },
    { d: '2026-10-11', desc: 'Flu shots — whole family', cat: 'Health', amt: 60.0 },
    { d: '2026-10-12', desc: 'Family haircuts', cat: 'Other', amt: 68.0 },
    { d: '2026-10-13', desc: 'School photos — Maya & Leo', cat: 'Kids & School', amt: 32.0 },
    { d: '2026-10-14', desc: 'Pizza night', cat: 'Dining Out', amt: 36.4 },
    { d: '2026-10-15', desc: 'Sushi takeout — Friday treat', cat: 'Dining Out', amt: 28.75 },
    { d: '2026-10-16', desc: 'Vitamins — winter stock', cat: 'Health', amt: 16.25 },
    { d: '2026-10-17', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 159.4 },
    { d: '2026-10-18', desc: 'Halloween costumes — Maya & Leo', cat: 'Kids & School', amt: 86.5 },
    { d: '2026-10-19', desc: 'Winter boots — Leo', cat: 'Kids & School', amt: 74.95 },
    { d: '2026-10-20', desc: 'Halloween candy', cat: 'Kids & School', amt: 24.6 },
    { d: '2026-10-21', desc: "Leo's workbook set", cat: 'Kids & School', amt: 18.75 },
    { d: '2026-10-22', desc: 'Car wash', cat: 'Transport', amt: 18.5 },
    { d: '2026-10-23', desc: 'Cafe lunch — Priya & Daniel', cat: 'Dining Out', amt: 19.9 },
    { d: '2026-10-24', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 141.85 },
    { d: '2026-10-25', desc: 'Costco stock-up — pantry & freezer', cat: 'Groceries', amt: 455.3 },
    { d: '2026-10-26', desc: 'Cleaning supplies', cat: 'Household', amt: 26.4 },
    { d: '2026-10-27', desc: 'Light bulbs & batteries', cat: 'Household', amt: 14.95 },
    { d: '2026-10-28', desc: 'Movie night tickets — family of four', cat: 'Entertainment', amt: 28.0 },
    { d: '2026-10-29', desc: "Maya's puzzle book", cat: 'Entertainment', amt: 12.5 },
    { d: '2026-10-30', desc: 'Birthday card & gift wrap', cat: 'Other', amt: 9.35 },
    { d: '2026-10-31', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 118.6 },
    { d: '2026-10-31', desc: 'Gas fill-up — Main Street station', cat: 'Transport', amt: 39.85 },
  ],
  '2026-11': [
    { d: '2026-11-01', desc: 'Rent — Maple Street house', cat: 'Housing', amt: 1450.0 },
    { d: '2026-11-02', desc: 'Gas fill-up — Main Street station', cat: 'Transport', amt: 42.5 },
    { d: '2026-11-03', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 142.6 },
    { d: '2026-11-03', desc: 'Bus passes for the month', cat: 'Transport', amt: 64.0 },
    { d: '2026-11-05', desc: 'Electric bill — October usage', cat: 'Utilities', amt: 98.4 },
    { d: '2026-11-06', desc: 'School lunch money — Maya & Leo', cat: 'Kids & School', amt: 45.0 },
    { d: '2026-11-07', desc: 'Water bill', cat: 'Utilities', amt: 54.29 },
    { d: '2026-11-08', desc: "Pharmacy refill — Priya's prescription", cat: 'Health', amt: 34.99 },
    { d: '2026-11-09', desc: 'Internet bill', cat: 'Utilities', amt: 58.0 },
    { d: '2026-11-10', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 128.15 },
    { d: '2026-11-11', desc: "Soccer fees — Leo's autumn term", cat: 'Kids & School', amt: 90.0 },
    { d: '2026-11-12', desc: 'Takeout — Thai noodles', cat: 'Dining Out', amt: 24.5 },
    { d: '2026-11-13', desc: "Kids' shoes — Maya", cat: 'Kids & School', amt: 89.95 },
    { d: '2026-11-14', desc: 'Pizza night', cat: 'Dining Out', amt: 34.75 },
    { d: '2026-11-15', desc: 'Movie rental — family film night', cat: 'Entertainment', amt: 12.99 },
    { d: '2026-11-16', desc: 'Library fine', cat: 'Entertainment', amt: 14.4 },
    { d: '2026-11-17', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 156.8 },
    { d: '2026-11-17', desc: 'Dentist check-up — Daniel', cat: 'Health', amt: 55.0 },
    { d: '2026-11-18', desc: 'Gas fill-up — Main Street station', cat: 'Transport', amt: 38.2 },
    { d: '2026-11-19', desc: 'Birthday gift — Aunt Rosa', cat: 'Other', amt: 45.0 },
    { d: '2026-11-20', desc: 'Takeout — burgers after practice', cat: 'Dining Out', amt: 22.0 },
    { d: '2026-11-21', desc: "Board game — Maya's pick", cat: 'Entertainment', amt: 14.0 },
    { d: '2026-11-22', desc: 'Laundry supplies', cat: 'Household', amt: 36.8 },
    { d: '2026-11-23', desc: 'Car insurance — monthly premium', cat: 'Transport', amt: 159.0 },
    { d: '2026-11-24', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 133.4 },
    { d: '2026-11-25', desc: 'Thanksgiving groceries', cat: 'Groceries', amt: 96.3 },
  ],
};

export const SEED_GOALS = [
  { id: 'emergency', name: 'Emergency fund', note: 'Three months of rent, for real surprises', target: 4350, saved: 2980, deadline: '2027-03-31' },
  { id: 'roadtrip', name: 'Summer road trip to the lake', note: 'Cabin, canoe hire and ice cream money', target: 1200, saved: 640, deadline: '2027-06-15' },
  { id: 'bike', name: "Maya's first bike", note: 'A red one, with a basket — almost there', target: 320, saved: 285, deadline: '2026-12-20' },
  { id: 'heater', name: 'New water heater', note: 'The old one groans every morning', target: 950, saved: 150, deadline: '2027-02-28' },
];

export const UPCOMING_BILLS = [
  { name: 'Electric bill (estimated)', amount: 98.0, due: '2026-11-28', repeat: 'Monthly' },
  { name: 'Water heater service', amount: 75.0, due: '2026-11-29', repeat: 'One-off' },
  { name: 'Streaming family plan', amount: 15.99, due: '2026-11-30', repeat: 'Monthly' },
  { name: 'School trip deposit — Leo', amount: 40.0, due: '2026-12-02', repeat: 'One-off' },
];

// The sample month's last day: due-in-days on the dashboard counts from here.
export const TODAY = '2026-11-26';

export const SAVING_RULES = {
  payday: 'On every payday — the 1st and the 11th — $200 moves straight into the emergency fund before anything else is spent.',
  windfall: 'Windfalls split 50 / 30 / 20: half to savings, 30% to the fun jar, 20% to extra debt-free treats.',
};
