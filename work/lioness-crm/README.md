# Lioness Beauty Studio — Client Book & Appointments (CRM demo)

A front-end-only sample of the client management system for Lioness Beauty Studio.
No server, no login, no database: it runs entirely in the browser and stores its
data in `localStorage`, so it is safe to host on any free static host.

**Preview:** `python -m http.server 8799` from this folder, then open http://127.0.0.1:8799
**Live studio site (separate):** https://lionessbeauty.co.za

## What it does

- **Dashboard** — today's bookings, expected income, last-7-days income vs the
  previous week, open tasks, income-by-day chart, next 14 days.
- **Appointments** — filter by today / upcoming / past / everything, filter by
  status, search, and open a booking to confirm, complete, cancel, reschedule or
  delete it. New bookings are added from the "New booking" button.
- **Clients** — the client book with contact details, tags, visit counts, spend,
  last seen and next booking. Opening a client shows the full file: preferences,
  allergies, where they found the studio, notes (add and delete) and booking history.
- **Services & Prices** — the menu the studio works from, grouped by category,
  with how often each service has been booked.
- **Tasks** — follow-ups tied to clients (confirm bookings, order stock, invoice).
- **Notes** — every client note in one timeline, filterable per client.
- **Settings** — studio details, data size, export to JSON, and reset to the
  original sample data.

## Files

| File | Purpose |
|---|---|
| `index.html` | Shell page, loads `data.js` then `app.js` |
| `styles.css` | Brand styling (Playfair Display / DM Sans, cream + gold palette) |
| `data.js` | Sample data: 12 clients, 12 services, 40 bookings, 7 tasks |
| `app.js` | The whole app: store, router, views, forms |
| `assets/` | Logo and icons copied from the studio site |

Sample dates are generated relative to "today", so the diary always looks current.

## Honest limitations of this demo

- Data is per-browser only. Clearing the browser's site data resets it.
- No logins, so anyone with the link sees the same sample data (fine for a demo,
  not for real client information).
- WhatsApp reminders, online booking and payments are **not** in this version —
  they are listed on the Settings page as what the live build would add.

## Reskinning for another business

1. Edit `data.js`: studio name, staff, services, clients, bookings, tasks.
2. Edit the CSS variables at the top of `styles.css` (`--paper`, `--ink`, `--gold`).
3. Swap `assets/lioness-logo.jpg`.

## Publishing (free)

Any static host works: GitHub Pages, Netlify drop, Cloudflare Pages. Keep the
`index.html`, `styles.css`, `data.js`, `app.js`, `assets/` structure. This page is
marked `noindex` in `index.html` — remove that meta tag if it should be findable
on Google.
