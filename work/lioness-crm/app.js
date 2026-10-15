/* ------------------------------------------------------------------
   Lioness Beauty Studio — sample CRM (front-end only demo)
   Data lives in localStorage so edits feel real. No server, no login.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  const KEY = 'lioness_crm_demo_v1';
  const DAY = 86400000;

  /* ---------------- store ---------------- */
  let db = load();
  let ui = { route: 'dashboard', id: null, filters: {}, modal: null, sheet: null };

  /* keep a copy of the starting sample data in this browser, so edits and
     "reset" behave consistently from the very first visit */
  try { if (!localStorage.getItem(KEY)) save(); } catch (e) {}

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  /* every note needs its own id, so two notes written on the same day
     are edited and deleted independently */
  function normalize(d) {
    (d.clients || []).forEach((c) => {
      (c.notes || []).forEach((n, i) => { if (!n.id) n.id = c.id + '-' + n.at + '-' + i; });
    });
    return d;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === window.CRM_SEED.version) return normalize(parsed);
      }
    } catch (e) { /* fall through to seed */ }
    return normalize(clone(window.CRM_SEED));
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
  function reset() { db = normalize(clone(window.CRM_SEED)); save(); }

  /* ---------------- helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const client = (id) => db.clients.find((c) => c.id === id);
  const service = (id) => db.services.find((s) => s.id === id);
  const appt = (id) => db.appointments.find((a) => a.id === id);
  const uid = (p) => p + Math.random().toString(36).slice(2, 8);

  function today() { const d = new Date(); d.setHours(12, 0, 0, 0); return d; }
  function isoOf(d) { return new Date(d).toISOString().slice(0, 10); }
  function addDays(d, n) { const x = new Date(d); x.setTime(x.getTime() + n * DAY); return x; }
  function parseISO(s) { const d = new Date(s + 'T12:00:00'); return d; }
  function daysFromToday(s) { return Math.round((parseISO(s) - today()) / DAY); }

  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function fmtDay(s) { const d = parseISO(s); return DOW[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()]; }
  function fmtFull(s) { const d = parseISO(s); return DOW[d.getDay()] + ', ' + d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }
  function fmtShort(s) { const d = parseISO(s); return d.getDate() + ' ' + MON[d.getMonth()]; }
  function relDay(s) {
    const n = daysFromToday(s);
    if (n === 0) return 'Today';
    if (n === 1) return 'Tomorrow';
    if (n === -1) return 'Yesterday';
    if (n > 1 && n < 7) return 'In ' + n + ' days';
    return fmtDay(s);
  }
  function money(n) { return 'R' + Number(n || 0).toLocaleString('en-ZA'); }
  function initials(name) { return String(name).trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase(); }
  function timeAgo(isoDate) {
    const n = -daysFromToday(isoDate);
    if (n <= 0) return 'today';
    if (n === 1) return 'yesterday';
    if (n < 7) return n + ' days ago';
    if (n < 30) return Math.round(n / 7) + ' wk ago';
    return Math.round(n / 30) + ' mo ago';
  }

  const ICON = {
    dash: '<path d="M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z"/>',
    cal: '<path d="M4 5h16v15H4zM8 3v4M16 3v4M4 10h16"/>',
    users: '<path d="M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c0-3.5 3.1-6 7-6s7 2.5 7 6M17 4a4 4 0 010 8M18 21c0-2-.6-3.7-1.6-5"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    note: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h5"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    gear: '<path d="M12 15a3 3 0 100-6 3 3 0 000 6zM3 12h2M19 12h2M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    edit: '<path d="M4 20h4L20 8l-4-4L4 16z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
    phone: '<path d="M5 3h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a15 15 0 01-16-16z"/>',
    mail: '<path d="M3 6h18v12H3zM3 7l9 6 9-6"/>',
    cash: '<path d="M3 7h18v11H3zM12 15a3 3 0 100-6 3 3 0 000 6z"/>'
  };
  function icon(n, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[n] || '') + '</svg>';
  }

  /* ---------------- derived data ---------------- */
  const live = (a) => a.status !== 'cancelled';
  const apptsOn = (iso) => db.appointments.filter((a) => a.date === iso && live(a))
    .sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = () => db.appointments.filter((a) => live(a) && daysFromToday(a.date) >= 0)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = () => db.appointments.filter((a) => daysFromToday(a.date) < 0)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  function revenueBetween(fromISO, toISO) {
    return db.appointments.filter((a) => a.status === 'done' && a.date >= fromISO && a.date <= toISO)
      .reduce((s, a) => s + a.price, 0);
  }
  function clientStats(id) {
    const list = db.appointments.filter((a) => a.clientId === id);
    const done = list.filter((a) => a.status === 'done');
    const spend = done.reduce((s, a) => s + a.price, 0);
    const last = done.map((a) => a.date).sort().pop() || null;
    const next = list.filter((a) => live(a) && daysFromToday(a.date) >= 0).map((a) => a.date).sort()[0] || null;
    return { total: list.length, done: done.length, spend: spend, last: last, next: next, cancelled: list.filter((a) => a.status === 'cancelled').length };
  }

  /* ---------------- shell ---------------- */
  const NAV = [
    ['dashboard', 'Dashboard', 'dash'],
    ['appointments', 'Appointments', 'cal'],
    ['clients', 'Clients', 'users'],
    ['services', 'Services & Prices', 'sparkle'],
    ['tasks', 'Tasks', 'check'],
    ['notes', 'Notes', 'note'],
    ['settings', 'Settings', 'gear']
  ];

  function navCount(r) {
    if (r === 'appointments') return apptsOn(isoOf(today())).length || '';
    if (r === 'tasks') return db.tasks.filter((t) => !t.done).length || '';
    return '';
  }

  function shell() {
    const route = ui.route;
    const titles = {
      dashboard: ['Overview', db.studio.name],
      appointments: ['Bookings', 'Appointments'],
      clients: ['Client book', 'Clients'],
      services: ['Menu', 'Services & Prices'],
      tasks: ['To-do', 'Tasks'],
      notes: ['Client history', 'Notes'],
      settings: ['Demo', 'Settings']
    };
    const t = titles[route] || ['', ''];
    const nav = NAV.map(([r, label, ic]) => {
      const c = navCount(r);
      return '<a href="#/' + r + '" class="' + (route === r ? 'is-active' : '') + '">' + icon(ic) + '<span>' + label + '</span>' + (c ? '<i>' + c + '</i>' : '') + '</a>';
    }).join('');
    return '' +
      '<a class="skip-link" href="#view">Skip to content</a>' +
      '<div class="app">' +
        '<div class="scrim" id="scrim" data-action="close-nav"></div>' +
        '<aside class="sidebar" id="sidebar">' +
          '<div class="sb-brand">' +
            '<img src="assets/lioness-logo.jpg" alt="">' +
            '<b>LIONESS BEAUTY STUDIO<span>CRM DEMO</span></b>' +
          '</div>' +
          '<nav class="sb-nav" aria-label="Sections">' + nav + '</nav>' +
          '<div class="sb-foot">' +
            '<b>Signed in as Lerato</b><br>Owner · full access' +
            '<button class="sb-reset" data-action="reset">RESET SAMPLE DATA</button>' +
          '</div>' +
        '</aside>' +
        '<div class="main">' +
          '<header class="topbar">' +
            '<button class="burger" data-action="open-nav" aria-label="Open menu"><span></span><span></span><span></span></button>' +
            '<div><div class="crumb">' + esc(t[0]).toUpperCase() + '</div><h1 class="page-title">' + esc(t[1]) + '</h1></div>' +
            '<div class="top-search">' + icon('search') + '<input type="search" id="q" placeholder="Search clients, services, notes" value="' + esc(ui.filters.q || '') + '" aria-label="Search"></div>' +
            '<button class="btn" data-action="new-appt">' + icon('plus') + 'New booking</button>' +
            '<div class="top-user"><div class="avatar">LL</div><div class="who-text"><b>Lerato L.</b><span>Owner</span></div></div>' +
          '</header>' +
          '<main class="view" id="view">' + view(route) + '</main>' +
        '</div>' +
      '</div>' +
      '<div class="backdrop" id="backdrop" data-action="close-sheet"><div class="sheet" data-stop="1"></div></div>' +
      '<div class="overlay" id="overlay" data-action="close-modal"><div class="dialog" data-stop="1"></div></div>' +
      '<div class="toast" id="toast"></div>';
  }

  /* ---------------- views ---------------- */
  function view(route) {
    if (route === 'appointments') return viewAppointments();
    if (route === 'clients') return viewClients();
    if (route === 'services') return viewServices();
    if (route === 'tasks') return viewTasks();
    if (route === 'notes') return viewNotes();
    if (route === 'settings') return viewSettings();
    return viewDashboard();
  }

  function demoNote(text) {
    return '<p class="demo-note">' + icon('sparkle') + '<span><b>Demo site.</b> ' + esc(text) + ' Your changes are saved in this browser only — resets have no effect on the live studio site.</span></p>';
  }

  /* ---- dashboard ---- */
  function viewDashboard() {
    const t = isoOf(today());
    const todays = apptsOn(t);
    const expected = todays.reduce((s, a) => s + a.price, 0);
    const last7 = revenueBetween(isoOf(addDays(today(), -6)), t);
    const prev7 = revenueBetween(isoOf(addDays(today(), -13)), isoOf(addDays(today(), -7)));
    const delta = prev7 ? Math.round(((last7 - prev7) / prev7) * 100) : null;
    const pending = db.appointments.filter((a) => a.status === 'pending' && daysFromToday(a.date) >= 0).length;
    const newClients = db.clients.filter((c) => c.since.slice(0, 7) === t.slice(0, 7)).length;
    const openTasks = db.tasks.filter((x) => !x.done);

    const kpis = '' +
      kpi('Today\u2019s bookings', todays.length, todays.filter((a) => a.status === 'confirmed').length + ' confirmed · ' + todays.filter((a) => a.status === 'pending').length + ' awaiting reply', '') +
      kpi('Expected today', money(expected), 'If every slot is kept', '') +
      kpi('Income, last 7 days', money(last7), delta === null ? 'No prior week to compare' : '<em class="' + (delta < 0 ? 'down' : '') + '">' + (delta >= 0 ? '+' : '') + delta + '%</em> vs the week before', spark(last7 ? 0 : 0)) +
      kpi('Needs attention', pending + openTasks.length, pending + ' unconfirmed booking(s) · ' + openTasks.length + ' open task(s) · ' + newClients + ' new client(s) this month', '');

    const bars = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(today(), -i);
      const iso = isoOf(d);
      const v = db.appointments.filter((a) => a.date === iso && a.status === 'done').reduce((s, a) => s + a.price, 0);
      bars.push({ iso: iso, label: i === 0 ? 'Today' : DOW[d.getDay()], value: v });
    }
    const max = Math.max.apply(null, bars.map((b) => b.value).concat([1]));

    const timeline = todays.length ? todays.map(dayRow).join('') :
      '<div class="empty"><b>Nothing booked today</b>Enjoy the quiet — or add a booking with the button up top.</div>';

    return demoNote('This is a working sample of the client book for the studio.') +
      '<div class="grid-4">' + kpis + '</div>' +

      '<div class="grid-2" style="margin-top:14px">' +
        '<section class="card pad">' +
          '<div class="sect-head"><div><h2>Today\u2019s schedule</h2><p>' + esc(fmtFull(t)) + ' · ' + esc(db.studio.hours) + '</p></div>' +
          '<button class="btn ghost sm" data-action="new-appt">' + icon('plus') + 'Add</button></div>' +
          '<div class="timeline">' + timeline + '</div>' +
        '</section>' +
        '<div class="stack">' +
          '<section class="card pad">' +
            '<div class="sect-head"><div><h2>Income by day</h2><p>Last 7 days, completed visits</p></div></div>' +
            '<div class="bars">' + bars.map((b) => '<div class="bar-col"><span class="bar-val">' + (b.value ? money(b.value).replace('R', 'R') : '') + '</span><div class="bar' + (b.value ? '' : ' peek') + '" style="height:' + Math.max(3, Math.round((b.value / max) * 100)) + '%" title="' + esc(fmtDay(b.iso) + ': ' + money(b.value)) + '"></div><small>' + esc(b.label) + '</small></div>').join('') + '</div>' +
          '</section>' +
          '<section class="card pad">' +
            '<div class="sect-head"><div><h2>Open tasks</h2><p>' + openTasks.length + ' to do</p></div><a class="link" href="#/tasks">All tasks</a></div>' +
            (openTasks.length ? '<ul class="list-clean">' + openTasks.slice(0, 5).map(taskRow).join('') + '</ul>' : '<div class="empty"><b>All clear</b>Nothing outstanding.</div>') +
          '</section>' +
        '</div>' +
      '</div>' +

      '<section class="card pad" style="margin-top:14px">' +
        '<div class="sect-head"><div><h2>Coming up</h2><p>The next 14 days</p></div><a class="link" href="#/appointments">Full diary</a></div>' +
        '<div class="tbl-wrap"><table><thead><tr><th>When</th><th>Client</th><th>Service</th><th>Stylist</th><th>Status</th><th class="num">Price</th></tr></thead><tbody>' +
        (upcoming().filter((a) => daysFromToday(a.date) <= 14).slice(0, 6).map(uRow).join('') || '<tr><td colspan="6" class="empty">No upcoming bookings.</td></tr>') +
        '</tbody></table></div>' +
      '</section>';
  }

  function kpi(label, num, sub, sparkSvg) {
    return '<div class="kpi"><span class="lbl">' + esc(label) + '</span><b class="num">' + esc(String(num)) + '</b><small>' + sub + '</small>' + (sparkSvg || '') + '</div>';
  }
  function spark() {
    const pts = [];
    for (let i = 13; i >= 0; i--) {
      const iso = isoOf(addDays(today(), -i));
      pts.push(db.appointments.filter((a) => a.date === iso && a.status === 'done').reduce((s, a) => s + a.price, 0));
    }
    const max = Math.max.apply(null, pts.concat([1]));
    const step = 96 / 13;
    const line = pts.map((v, i) => (i * step).toFixed(1) + ',' + (44 - (v / max) * 40).toFixed(1)).join(' ');
    return '<svg class="spark" viewBox="0 0 96 46" preserveAspectRatio="none"><polyline points="' + line + '" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  }

  function dayRow(a) {
    const c = client(a.clientId) || { name: 'Unknown' };
    const s = service(a.serviceId) || { name: 'Service' };
    return '<div class="tl-item">' +
      '<div class="tl-time">' + esc(a.time) + '<small>' + s.duration + ' min</small></div>' +
      '<div class="tl-main"><b>' + esc(c.name) + '</b><span>' + esc(s.name) + ' · ' + esc(a.staff) + '</span></div>' +
      '<div class="tl-right"><em>' + money(a.price) + '</em>' + badge(a.status) + '</div>' +
      '</div>';
  }
  function uRow(a) {
    const c = client(a.clientId) || { name: 'Unknown', phone: '' };
    const s = service(a.serviceId) || { name: 'Service' };
    return '<tr data-action="open-appt" data-id="' + a.id + '" style="cursor:pointer">' +
      '<td><b>' + esc(relDay(a.date)) + '</b><br><span style="font-size:10px;color:var(--muted)">' + esc(a.time) + '</span></td>' +
      '<td><div class="who"><div class="avatar sm">' + esc(initials(c.name)) + '</div><div><b>' + esc(c.name) + '</b><span>' + esc(c.phone || '') + '</span></div></div></td>' +
      '<td>' + esc(s.name) + '</td><td>' + esc(a.staff) + '</td><td>' + badge(a.status) + '</td><td class="num">' + money(a.price) + '</td></tr>';
  }
  function badge(st) { return '<span class="badge ' + st + '">' + st + '</span>'; }
  function taskRow(t) {
    const c = t.clientId ? client(t.clientId) : null;
    return '<li><span class="dot" style="' + (t.done ? 'background:var(--ok)' : '') + '"></span><div style="flex:1"><b style="' + (t.done ? 'text-decoration:line-through;color:var(--muted)' : '') + '">' + esc(t.title) + '</b><time>' + (t.done ? 'Done' : 'Due ' + esc(relDay(t.due))) + ' · ' + esc(t.owner) + (c ? ' · ' + esc(c.name) : '') + '</time></div>' +
      '<button class="btn ghost sm" data-action="toggle-task" data-id="' + t.id + '">' + (t.done ? 'Undo' : 'Done') + '</button></li>';
  }

  /* ---- appointments ---- */
  function viewAppointments() {
    const f = ui.filters;
    const range = f.range || 'upcoming';
    const status = f.status || 'all';
    const q = (f.q || '').toLowerCase();

    let list = range === 'today' ? apptsOn(isoOf(today()))
      : range === 'upcoming' ? upcoming()
      : range === 'past' ? past()
      : db.appointments.slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

    if (status !== 'all') list = list.filter((a) => a.status === status);
    if (q) list = list.filter((a) => {
      const c = client(a.clientId) || { name: '' };
      const s = service(a.serviceId) || { name: '' };
      return (c.name + ' ' + s.name + ' ' + a.staff + ' ' + a.notes).toLowerCase().indexOf(q) > -1;
    });

    const sum = list.filter(live).reduce((s, a) => s + a.price, 0);
    const pills = [['today', 'Today'], ['upcoming', 'Upcoming'], ['past', 'Past'], ['all', 'Everything']];

    return demoNote('Add, reschedule, confirm or complete a booking — the diary updates instantly.') +
      '<section class="card">' +
        '<div class="pad">' +
          '<div class="filters">' +
            '<div class="pillset" role="group" aria-label="Range">' + pills.map(([v, l]) => '<button data-action="set-filter" data-key="range" data-value="' + v + '" class="' + (range === v ? 'on' : '') + '">' + l + '</button>').join('') + '</div>' +
            '<select data-action="set-filter" data-key="status" aria-label="Status">' + ['all', 'pending', 'confirmed', 'done', 'cancelled'].map((s) => '<option value="' + s + '"' + (status === s ? ' selected' : '') + '>' + (s === 'all' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)) + '</option>').join('') + '</select>' +
            '<span class="count">' + list.length + ' booking(s) · ' + money(sum) + ' book value</span>' +
          '</div>' +
          '<div class="tbl-wrap"><table><thead><tr><th>When</th><th>Client</th><th>Service</th><th>Stylist</th><th>Status</th><th class="num">Price</th><th></th></tr></thead><tbody>' +
          (list.map((a) => {
            const c = client(a.clientId) || { name: 'Unknown', phone: '' };
            const s = service(a.serviceId) || { name: 'Service', duration: 0 };
            return '<tr><td style="cursor:pointer" data-action="open-appt" data-id="' + a.id + '"><b>' + esc(relDay(a.date)) + '</b><br><span style="font-size:10px;color:var(--muted)">' + esc(a.time) + ' · ' + s.duration + 'm</span></td>' +
              '<td><div class="who" data-action="open-client" data-id="' + a.clientId + '" style="cursor:pointer"><div class="avatar sm">' + esc(initials(c.name)) + '</div><div><b>' + esc(c.name) + '</b><span>' + esc(c.phone || '') + '</span></div></div></td>' +
              '<td>' + esc(s.name) + (a.notes ? '<br><span style="font-size:10px;color:var(--muted)">' + esc(a.notes.slice(0, 46)) + (a.notes.length > 46 ? '…' : '') + '</span>' : '') + '</td>' +
              '<td>' + esc(a.staff) + '</td><td>' + badge(a.status) + '</td><td class="num">' + money(a.price) + '</td>' +
              '<td><button class="btn icon" data-action="open-appt" data-id="' + a.id + '" aria-label="Open booking">' + icon('edit') + '</button></td></tr>';
          }).join('') || '<tr><td colspan="7" class="empty">No bookings match these filters.</td></tr>') +
          '</tbody></table></div>' +
        '</div>' +
      '</section>';
  }

  /* ---- clients ---- */
  function viewClients() {
    const f = ui.filters;
    const q = (f.q || '').toLowerCase();
    let list = db.clients.slice().sort((a, b) => a.name.localeCompare(b.name));
    if (f.tag) list = list.filter((c) => c.tags.indexOf(f.tag) > -1);
    if (q) list = list.filter((c) => (c.name + ' ' + c.phone + ' ' + c.email + ' ' + c.tags.join(' ') + ' ' + c.notes.map((n) => n.text).join(' ')).toLowerCase().indexOf(q) > -1);

    const tags = [];
    db.clients.forEach((c) => c.tags.forEach((t) => { if (tags.indexOf(t) < 0) tags.push(t); }));

    return demoNote('Every client has contact details, preferences, allergies and a full history of notes.') +
      '<section class="card">' +
        '<div class="pad">' +
          '<div class="filters">' +
            '<input type="search" data-action="search" placeholder="Search name, phone, note…" value="' + esc(ui.filters.q || '') + '">' +
            '<select data-action="set-filter" data-key="tag" aria-label="Tag"><option value="">All tags</option>' + tags.map((t) => '<option' + (f.tag === t ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select>' +
            '<button class="btn ghost sm" data-action="new-client">' + icon('plus') + 'Add client</button>' +
            '<span class="count">' + list.length + ' client(s)</span>' +
          '</div>' +
          '<div class="tbl-wrap"><table><thead><tr><th>Client</th><th>Contact</th><th>Tags</th><th class="num">Visits</th><th class="num">Spent</th><th>Last seen</th><th>Next</th></tr></thead><tbody>' +
          (list.map((c) => {
            const st = clientStats(c.id);
            return '<tr data-action="open-client" data-id="' + c.id + '" style="cursor:pointer">' +
              '<td><div class="who"><div class="avatar sm">' + esc(initials(c.name)) + '</div><div><b>' + esc(c.name) + '</b><span>Client since ' + esc(fmtShort(c.since)) + '</span></div></div></td>' +
              '<td><span style="font-size:11px">' + esc(c.phone) + '</span><br><span style="font-size:10px;color:var(--muted)">' + esc(c.email) + '</span></td>' +
              '<td>' + c.tags.map((t) => '<span class="chip' + (t === 'Loyal' || t === 'Bridal' ? ' gold' : '') + '">' + esc(t) + '</span>').join('') + '</td>' +
              '<td class="num">' + st.done + '</td><td class="num">' + money(st.spend) + '</td>' +
              '<td style="font-size:11px;color:var(--muted)">' + (st.last ? esc(timeAgo(st.last)) : '—') + '</td>' +
              '<td style="font-size:11px">' + (st.next ? esc(relDay(st.next)) : '<span style="color:var(--muted)">not booked</span>') + '</td></tr>';
          }).join('') || '<tr><td colspan="7" class="empty">No clients match that search.</td></tr>') +
          '</tbody></table></div>' +
        '</div>' +
      '</section>';
  }

  /* ---- services ---- */
  function viewServices() {
    const cats = [];
    db.services.forEach((s) => { if (cats.indexOf(s.category) < 0) cats.push(s.category); });
    return demoNote('The price list the studio works from. Bookings pull prices straight from here.') +
      '<div class="sect-head"><div><h2>' + db.services.length + ' services on the menu</h2><p>Average treatment value ' + money(Math.round(db.services.reduce((s, x) => s + x.price, 0) / db.services.length)) + ' · average ' + Math.round(db.services.reduce((s, x) => s + x.duration, 0) / db.services.length) + ' min</p></div><button class="btn" data-action="new-appt">' + icon('plus') + 'New booking</button></div>' +
      '<div class="stack">' + cats.map((cat) => {
        const items = db.services.filter((s) => s.category === cat);
        return '<section><div class="sect-head"><div><h2>' + esc(cat) + '</h2><p>' + items.length + ' service(s)</p></div></div>' +
          '<div class="grid-4">' + items.map((s) => {
            const count = db.appointments.filter((a) => a.serviceId === s.id && a.status === 'done').length;
            return '<article class="svc-card"><header><h3>' + esc(s.name) + '</h3><span class="price">' + money(s.price) + '</span></header>' +
              '<p>' + esc(s.desc) + '</p>' +
              '<div class="svc-meta"><span><b>' + s.duration + '</b> min</span><span><b>' + count + '</b> booked</span></div></article>';
          }).join('') + '</div></section>';
      }).join('') + '</div>';
  }

  /* ---- tasks ---- */
  function viewTasks() {
    const open = db.tasks.filter((t) => !t.done).sort((a, b) => a.due.localeCompare(b.due));
    const done = db.tasks.filter((t) => t.done);
    return demoNote('A simple to-do list tied to clients — the studio\u2019s follow-up reminders.') +
      '<div class="grid-2e">' +
        '<section class="card pad"><div class="sect-head"><div><h2>To do</h2><p>' + open.length + ' outstanding</p></div><button class="btn ghost sm" data-action="new-task">' + icon('plus') + 'Add task</button></div>' +
          (open.length ? '<ul class="list-clean">' + open.map(taskRow).join('') + '</ul>' : '<div class="empty"><b>All clear</b>Everything is ticked off.</div>') + '</section>' +
        '<section class="card pad"><div class="sect-head"><div><h2>Done</h2><p>' + done.length + ' completed</p></div></div>' +
          (done.length ? '<ul class="list-clean">' + done.map(taskRow).join('') + '</ul>' : '<div class="empty"><b>Nothing yet</b>Completed tasks land here.</div>') + '</section>' +
      '</div>';
  }

  /* ---- notes ---- */
  function viewNotes() {
    const q = (ui.filters.q || '').toLowerCase();
    const only = ui.filters.clientId || '';
    let rows = [];
    db.clients.forEach((c) => c.notes.forEach((n) => rows.push({ c: c, n: n })));
    if (only) rows = rows.filter((r) => r.c.id === only);
    if (q) rows = rows.filter((r) => (r.c.name + ' ' + r.n.text).toLowerCase().indexOf(q) > -1);
    rows.sort((a, b) => b.n.at.localeCompare(a.n.at));

    return demoNote('Notes build the memory of the studio — what each client likes, dislikes and is owed.') +
      '<div class="grid-2">' +
        '<section class="card pad">' +
          '<div class="sect-head"><div><h2>' + rows.length + ' note(s)</h2><p>Newest first</p></div>' +
          '<select data-action="set-filter" data-key="clientId" style="max-width:190px"><option value="">Everyone</option>' +
          db.clients.slice().sort((a, b) => a.name.localeCompare(b.name)).map((c) => '<option value="' + c.id + '"' + (only === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') + '</select></div>' +
          (rows.map((r) => '<article class="note-card mine"><header><b>' + esc(r.c.name) + '</b><time>' + esc(fmtDay(r.n.at)) + ' · ' + esc(timeAgo(r.n.at)) + '</time></header><p>' + esc(r.n.text) + '</p>' +
            '<div style="margin-top:8px"><a class="link" href="#/clients/' + r.c.id + '">Open client</a></div></article>').join('') || '<div class="empty"><b>No notes here</b>Try another client or clear the search.</div>') +
        '</section>' +
        '<section class="card pad">' +
          '<div class="sect-head"><div><h2>Add a note</h2><p>Pick the client it belongs to</p></div></div>' +
          '<form data-form="note">' +
            '<div class="field"><label for="n-client">Client</label><select id="n-client" name="clientId" required><option value="">Choose a client…</option>' + db.clients.slice().sort((a, b) => a.name.localeCompare(b.name)).map((c) => '<option value="' + c.id + '">' + esc(c.name) + '</option>').join('') + '</select></div>' +
            '<div class="field"><label for="n-text">Note</label><textarea id="n-text" name="text" required placeholder="Shade used, reaction, what to remember for next time…"></textarea></div>' +
            '<button class="btn" type="submit">' + icon('check') + 'Save note</button>' +
          '</form>' +
        '</section>' +
      '</div>';
  }

  /* ---- settings ---- */
  function viewSettings() {
    const bytes = JSON.stringify(db).length;
    return demoNote('This is a front-end demo — everything is stored inside this browser. Nothing is sent to a server.') +
      '<div class="grid-2">' +
        '<section class="card pad">' +
          '<div class="sect-head"><div><h2>The studio</h2><p>Shown on the dashboard</p></div></div>' +
          '<dl class="dl">' +
            '<dt>Name</dt><dd>' + esc(db.studio.name) + '</dd>' +
            '<dt>Tagline</dt><dd>' + esc(db.studio.tagline) + '</dd>' +
            '<dt>Hours</dt><dd>' + esc(db.studio.hours) + '</dd>' +
            '<dt>Team</dt><dd>' + db.studio.staff.map((s) => '<span class="chip">' + esc(s) + '</span>').join('') + '</dd>' +
          '</dl>' +
          '<div class="stat-row">' +
            '<div class="stat-mini"><span>Clients</span><b>' + db.clients.length + '</b></div>' +
            '<div class="stat-mini"><span>Bookings</span><b>' + db.appointments.length + '</b></div>' +
            '<div class="stat-mini"><span>Services</span><b>' + db.services.length + '</b></div>' +
            '<div class="stat-mini"><span>Lifetime</span><b>' + money(db.appointments.filter((a) => a.status === 'done').reduce((s, a) => s + a.price, 0)) + '</b></div>' +
          '</div>' +
        '</section>' +
        '<div class="stack">' +
          '<section class="card pad">' +
            '<div class="sect-head"><div><h2>Sample data</h2><p>' + Math.round(bytes / 1024) + ' KB in this browser</p></div></div>' +
            '<p style="font-size:12px;color:var(--muted);margin:0 0 14px">Reset puts the sample clients, bookings, prices and notes back exactly as they were. Export saves a copy of the current data as a JSON file.</p>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
              '<button class="btn ghost" data-action="export">Export JSON</button>' +
              '<button class="btn danger ghost" data-action="reset">' + icon('trash') + 'Reset to sample data</button>' +
            '</div>' +
          '</section>' +
          '<section class="card pad">' +
            '<div class="sect-head"><div><h2>What a live version would add</h2><p>For the paid build</p></div></div>' +
            '<ul class="list-clean">' +
              '<li><span class="dot"></span><div><b>Real logins</b><time>Staff sign in, see only their own diary</time></div></li>' +
              '<li><span class="dot"></span><div><b>Shared cloud database</b><time>Bookings visible on phone, tablet and desktop</time></div></li>' +
              '<li><span class="dot"></span><div><b>WhatsApp + SMS reminders</b><time>Fewer no-shows, automatic 24h confirmations</time></div></li>' +
              '<li><span class="dot"></span><div><b>Online booking page</b><time>Clients pick their own slot, it lands in this diary</time></div></li>' +
              '<li><span class="dot"></span><div><b>Deposits &amp; invoices</b><time>Card or EFT payment recorded against the booking</time></div></li>' +
            '</ul>' +
          '</section>' +
        '</div>' +
      '</div>';
  }

  /* ---------------- client sheet ---------------- */
  function openClient(id) {
    const c = client(id);
    if (!c) return;
    const st = clientStats(id);
    const history = db.appointments.filter((a) => a.clientId === id).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    const notes = c.notes.slice().sort((a, b) => b.at.localeCompare(a.at));
    ui.sheet = { type: 'client', id: id };

    $('#backdrop .sheet').innerHTML =
      '<div class="sheet-head"><div class="avatar lg">' + esc(initials(c.name)) + '</div>' +
        '<div><small>CLIENT FILE</small><h2>' + esc(c.name) + '</h2><span style="font-size:10px;color:var(--muted)">Client since ' + esc(fmtFull(c.since)) + '</span></div>' +
        '<button class="btn icon" data-action="close-sheet" aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="sheet-body">' +
        '<div class="stat-row">' +
          '<div class="stat-mini"><span>Visits</span><b>' + st.done + '</b></div>' +
          '<div class="stat-mini"><span>Spent</span><b>' + money(st.spend) + '</b></div>' +
          '<div class="stat-mini"><span>No-shows</span><b>' + st.cancelled + '</b></div>' +
        '</div>' +
        '<dl class="dl">' +
          '<dt>Phone</dt><dd>' + esc(c.phone) + '</dd>' +
          '<dt>Email</dt><dd style="word-break:break-all">' + esc(c.email) + '</dd>' +
          '<dt>Birthday</dt><dd>' + esc(c.birthday) + '</dd>' +
          '<dt>Prefers</dt><dd>' + esc(c.preferred || '—') + '</dd>' +
          '<dt>Allergies</dt><dd>' + esc(c.allergies || '—') + '</dd>' +
          '<dt>Found us</dt><dd>' + esc(c.source) + '</dd>' +
          '<dt>Tags</dt><dd>' + c.tags.map((t) => '<span class="chip gold">' + esc(t) + '</span>').join('') + '</dd>' +
          '<dt>Last seen</dt><dd>' + (st.last ? esc(fmtDay(st.last) + ' · ' + timeAgo(st.last)) : '—') + '</dd>' +
          '<dt>Next</dt><dd>' + (st.next ? esc(fmtFull(st.next)) : 'Not booked') + '</dd>' +
        '</dl>' +
        '<div style="display:flex;gap:10px;margin:20px 0 8px">' +
          '<button class="btn" data-action="new-appt" data-client="' + c.id + '">' + icon('plus') + 'Book</button>' +
          '<a class="btn ghost" href="#/notes">Note</a>' +
        '</div>' +
        '<div class="sect-head" style="margin-top:22px"><div><h2>Notes</h2><p>' + notes.length + ' on file</p></div></div>' +
        '<form data-form="note" style="margin-bottom:14px">' +
          '<input type="hidden" name="clientId" value="' + c.id + '">' +
          '<div class="field"><textarea name="text" required placeholder="Add a note about this client…"></textarea></div>' +
          '<button class="btn sm" type="submit">Save note</button>' +
        '</form>' +
        (notes.length ? notes.map((n) => '<article class="note-card mine"><header><b>Note</b><time>' + esc(fmtDay(n.at)) + '</time></header><p>' + esc(n.text) + '</p>' +
          '<div style="margin-top:6px"><button class="btn icon" data-action="del-note" data-id="' + c.id + '" data-note="' + esc(n.id) + '" aria-label="Delete note">' + icon('trash') + '</button></div></article>').join('') : '<div class="empty"><b>No notes yet</b>Add the first one above.</div>') +
        '<div class="sect-head" style="margin-top:26px"><div><h2>History</h2><p>' + history.length + ' booking(s)</p></div></div>' +
        '<div class="timeline">' + (history.slice(0, 12).map((a) => {
          const s = service(a.serviceId) || { name: 'Service', duration: 0 };
          return '<div class="tl-item"><div class="tl-time">' + esc(fmtShort(a.date)) + '<small>' + esc(a.time) + '</small></div>' +
            '<div class="tl-main"><b>' + esc(s.name) + '</b><span>' + esc(a.staff) + (a.notes ? ' · ' + esc(a.notes) : '') + '</span></div>' +
            '<div class="tl-right"><em>' + money(a.price) + '</em>' + badge(a.status) + '</div></div>';
        }).join('') || '<div class="empty">No bookings yet.</div>') + '</div>' +
      '</div>';
    $('#backdrop').classList.add('open');
  }

  /* ---------------- appointment sheet ---------------- */
  function openAppt(id) {
    const a = appt(id);
    if (!a) return;
    const c = client(a.clientId) || { name: 'Unknown' };
    const s = service(a.serviceId) || { name: 'Service', duration: 0 };
    ui.sheet = { type: 'appt', id: id };
    const next = { pending: 'confirmed', confirmed: 'done' }[a.status];

    $('#backdrop .sheet').innerHTML =
      '<div class="sheet-head"><div><small>BOOKING</small><h2>' + esc(s.name) + '</h2><span style="font-size:10px;color:var(--muted)">' + esc(fmtFull(a.date)) + ' · ' + esc(a.time) + '</span></div>' +
        '<button class="btn icon" data-action="close-sheet" aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="sheet-body">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">' + badge(a.status) + '<span style="font-size:11px;color:var(--muted)">with ' + esc(a.staff) + ' · ' + s.duration + ' minutes</span></div>' +
        '<dl class="dl">' +
          '<dt>Client</dt><dd><a class="link" href="#/clients/' + a.clientId + '" data-action="close-sheet">' + esc(c.name) + '</a></dd>' +
          '<dt>Phone</dt><dd>' + esc(c.phone || '—') + '</dd>' +
          '<dt>Price</dt><dd>' + money(a.price) + '</dd>' +
          '<dt>Service</dt><dd>' + esc(s.name) + '</dd>' +
          '<dt>Notes</dt><dd>' + (a.notes ? esc(a.notes) : '—') + '</dd>' +
        '</dl>' +
        '<div class="sect-head" style="margin-top:24px"><div><h2>Actions</h2><p>Same as the buttons on the diary</p></div></div>' +
        '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
          (next ? '<button class="btn" data-action="set-status" data-id="' + a.id + '" data-status="' + next + '">Mark ' + next + '</button>' : '') +
          '<button class="btn ghost" data-action="edit-appt" data-id="' + a.id + '">Reschedule</button>' +
          '<button class="btn ghost" data-action="set-status" data-id="' + a.id + '" data-status="cancelled">Cancel booking</button>' +
          '<button class="btn ghost danger" data-action="del-appt" data-id="' + a.id + '">' + icon('trash') + 'Delete</button>' +
        '</div>' +
      '</div>';
    $('#backdrop').classList.add('open');
  }

  /* ---------------- modal: booking form ---------------- */
  function bookingForm(a, presetClient) {
    const x = a || { id: '', clientId: presetClient || '', serviceId: '', date: isoOf(today()), time: '09:00', staff: db.studio.staff[0], status: 'confirmed', price: '', notes: '' };
    const opts = (list, sel, label) => list.map((o) => '<option value="' + o.id + '"' + (sel === o.id ? ' selected' : '') + '>' + esc(o.name || label(o)) + '</option>').join('');
    return '<form data-form="appt">' +
      '<input type="hidden" name="id" value="' + esc(x.id) + '">' +
      '<div class="field"><label>Client</label><select name="clientId" required><option value="">Choose a client…</option>' + opts(db.clients.slice().sort((p, q) => p.name.localeCompare(q.name)), x.clientId) + '</select></div>' +
      '<div class="field"><label>Service</label><select name="serviceId" required data-action="pick-service">' + opts(db.services, x.serviceId) + '</select></div>' +
      '<div class="form-grid">' +
        '<div class="field"><label>Date</label><input type="date" name="date" value="' + esc(x.date) + '" required></div>' +
        '<div class="field"><label>Time</label><input type="time" name="time" value="' + esc(x.time) + '" required></div>' +
        '<div class="field"><label>Stylist</label><select name="staff">' + db.studio.staff.map((s) => '<option' + (x.staff === s ? ' selected' : '') + '>' + esc(s) + '</option>').join('') + '</select></div>' +
        '<div class="field"><label>Status</label><select name="status">' + ['pending', 'confirmed', 'done', 'cancelled'].map((s) => '<option' + (x.status === s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></div>' +
        '<div class="field"><label>Price (R)</label><input type="number" name="price" min="0" step="10" value="' + esc(x.price) + '" required></div>' +
      '</div>' +
      '<div class="field"><label>Notes for the stylist</label><textarea name="notes" placeholder="Shade, allergies, what to remember…">' + esc(x.notes) + '</textarea></div>' +
      '</form>';
  }

  function openBooking(a, presetClient) {
    const title = a ? 'Edit booking' : 'New booking';
    $('#overlay .dialog').innerHTML =
      '<div class="dialog-head"><div><small style="font-size:9px;letter-spacing:.18em;color:var(--gold);font-weight:700">DIARY</small><h2>' + title + '</h2></div>' +
      '<button class="btn icon" data-action="close-modal" aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="dialog-body">' + bookingForm(a, presetClient) + '</div>' +
      '<div class="dialog-foot"><button class="btn ghost" data-action="close-modal">Cancel</button><span class="spacer"></span><button class="btn" data-action="submit-form" data-form="appt">' + icon('check') + 'Save booking</button></div>';
    $('#overlay').classList.add('open');
    const sel = $('#overlay select[name=serviceId]');
    syncPrice(sel);
  }
  function syncPrice(sel) {
    if (!sel) return;
    const inp = $('#overlay input[name=price]');
    const s = service(sel.value);
    if (s && inp && !inp.dataset.touched) inp.value = s.price;
  }

  function openClientForm() {
    $('#overlay .dialog').innerHTML =
      '<div class="dialog-head"><div><small style="font-size:9px;letter-spacing:.18em;color:var(--gold);font-weight:700">CLIENT BOOK</small><h2>New client</h2></div>' +
      '<button class="btn icon" data-action="close-modal" aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="dialog-body"><form data-form="client">' +
        '<div class="field"><label>Full name</label><input name="name" required></div>' +
        '<div class="form-grid">' +
          '<div class="field"><label>Phone</label><input name="phone" placeholder="082 000 0000" required></div>' +
          '<div class="field"><label>Email</label><input type="email" name="email" placeholder="name@gmail.com"></div>' +
          '<div class="field"><label>Birthday</label><input name="birthday" placeholder="12 March"></div>' +
          '<div class="field"><label>Found us via</label><input name="source" placeholder="Instagram, referral…"></div>' +
        '</div>' +
        '<div class="field"><label>Preferred times</label><input name="preferred" placeholder="Saturday mornings"></div>' +
        '<div class="field"><label>Allergies / sensitivities</label><input name="allergies" placeholder="None"></div>' +
        '<div class="field"><label>First note</label><textarea name="note" placeholder="Anything to remember on the first visit…"></textarea></div>' +
      '</form></div>' +
      '<div class="dialog-foot"><button class="btn ghost" data-action="close-modal">Cancel</button><span class="spacer"></span><button class="btn" data-action="submit-form" data-form="client">' + icon('check') + 'Save client</button></div>';
    $('#overlay').classList.add('open');
  }

  function openTaskForm() {
    $('#overlay .dialog').innerHTML =
      '<div class="dialog-head"><div><small style="font-size:9px;letter-spacing:.18em;color:var(--gold);font-weight:700">TO-DO</small><h2>New task</h2></div>' +
      '<button class="btn icon" data-action="close-modal" aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="dialog-body"><form data-form="task">' +
        '<div class="field"><label>What needs doing</label><input name="title" required placeholder="Confirm Saturday bookings"></div>' +
        '<div class="form-grid">' +
          '<div class="field"><label>Due</label><input type="date" name="due" value="' + isoOf(today()) + '" required></div>' +
          '<div class="field"><label>Owner</label><select name="owner">' + db.studio.staff.concat(['Front desk']).map((s) => '<option>' + esc(s) + '</option>').join('') + '</select></div>' +
        '</div>' +
        '<div class="field"><label>Related client (optional)</label><select name="clientId"><option value="">None</option>' + db.clients.map((c) => '<option value="' + c.id + '">' + esc(c.name) + '</option>').join('') + '</select></div>' +
      '</form></div>' +
      '<div class="dialog-foot"><button class="btn ghost" data-action="close-modal">Cancel</button><span class="spacer"></span><button class="btn" data-action="submit-form" data-form="task">' + icon('check') + 'Save task</button></div>';
    $('#overlay').classList.add('open');
  }

  /* ---------------- form handling ---------------- */
  function formValues(scope) {
    const out = {};
    Array.prototype.forEach.call(scope.querySelectorAll('input,select,textarea'), (el) => {
      if (!el.name) return;
      out[el.name] = el.value.trim();
    });
    return out;
  }

  function submitForm(kind) {
    if (kind === 'appt') {
      const scope = $('#overlay');
      const v = formValues(scope.querySelector('form'));
      if (!v.clientId || !v.serviceId || !v.date || !v.time) return toast('Fill in client, service, date and time.');
      const s = service(v.serviceId);
      const payload = {
        clientId: v.clientId, serviceId: v.serviceId, date: v.date, time: v.time,
        staff: v.staff, status: v.status, price: Number(v.price) || (s ? s.price : 0), notes: v.notes
      };
      if (v.id) {
        const a = appt(v.id);
        Object.assign(a, payload);
        toast('Booking updated.');
      } else {
        db.appointments.push(Object.assign({ id: uid('a') }, payload));
        toast('Booking added to the diary.');
      }
      save(); closeAll(); render();
    } else if (kind === 'client') {
      const v = formValues($('#overlay').querySelector('form'));
      if (!v.name || !v.phone) return toast('Name and phone are needed.');
      const c = {
        id: uid('c'), name: v.name, phone: v.phone, email: v.email, since: isoOf(today()),
        birthday: v.birthday || '—', tags: ['New'], preferred: v.preferred || 'Flexible',
        source: v.source || 'Walk-in', allergies: v.allergies || 'None', visits: 0,
        notes: v.note ? [{ at: isoOf(today()), text: v.note }] : []
      };
      db.clients.push(c);
      save(); closeAll(); ui.route = 'clients'; location.hash = '#/clients'; render();
      toast('Client added.');
    } else if (kind === 'task') {
      const v = formValues($('#overlay').querySelector('form'));
      if (!v.title) return toast('Give the task a title.');
      db.tasks.push({ id: uid('t'), title: v.title, due: v.due, done: false, owner: v.owner, clientId: v.clientId });
      save(); closeAll(); render();
      toast('Task added.');
    } else if (kind === 'note') {
      const form = ui.sheet && ui.sheet.type === 'client' && $('#backdrop form[data-form=note]') ? $('#backdrop form[data-form=note]') : $('#view form[data-form=note]');
      const v = formValues(form);
      if (!v.clientId || !v.text) return toast('Pick a client and write something.');
      const c = client(v.clientId);
      const at = isoOf(today());
      c.notes.push({ id: c.id + '-' + at + '-' + c.notes.length + '-' + Math.random().toString(36).slice(2, 6), at: at, text: v.text });
      save();
      const keep = ui.sheet;
      render();
      if (keep) openClient(keep.id);
      toast('Note saved.');
    }
  }

  function closeAll() {
    $('#backdrop').classList.remove('open');
    $('#overlay').classList.remove('open');
    ui.sheet = null;
  }
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    const node = e.target.closest('[data-action]');
    if (!node) return;
    const a = node.dataset.action;
    if (node.closest('[data-stop]') && a !== 'close-sheet' && a !== 'close-modal' && a !== 'submit-form' && a !== 'export' && a !== 'reset' && a !== 'toggle-task' && a !== 'del-note' && a !== 'set-filter' && a !== 'open-client' && a !== 'open-appt') { /* inside sheet */ }

    if (a === 'open-nav') { $('#sidebar').classList.add('open'); $('#scrim').classList.add('open'); return; }
    if (a === 'close-nav') { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('open'); return; }
    if (a === 'close-sheet') { if (node === $('#backdrop') && e.target.closest('.sheet')) return; closeAll(); return; }
    if (a === 'close-modal') { if (node === $('#overlay') && e.target.closest('.dialog')) return; closeAll(); return; }
    if (a === 'open-client') { e.preventDefault(); ui.filters.q = ''; $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('open'); openClient(node.dataset.id); return; }
    if (a === 'open-appt') { openAppt(node.dataset.id); return; }
    if (a === 'new-appt') { openBooking(null, node.dataset.client); return; }
    if (a === 'edit-appt') { closeAll(); openBooking(appt(node.dataset.id)); return; }
    if (a === 'new-client') { openClientForm(); return; }
    if (a === 'new-task') { openTaskForm(); return; }
    if (a === 'submit-form') { submitForm(node.dataset.form); return; }
    if (a === 'set-status') {
      const x = appt(node.dataset.id);
      x.status = node.dataset.status;
      if (x.status === 'done' && !x.paid) x.paid = true;
      save(); closeAll(); render();
      toast('Booking ' + x.status + '.');
      return;
    }
    if (a === 'del-appt') {
      if (!confirm('Delete this booking for good?')) return;
      db.appointments = db.appointments.filter((x) => x.id !== node.dataset.id);
      save(); closeAll(); render(); toast('Booking deleted.');
      return;
    }
    if (a === 'del-note') {
      const c = client(node.dataset.id);
      c.notes = c.notes.filter((n) => String(n.id) !== String(node.dataset.note));
      save(); openClient(c.id); toast('Note removed.');
      return;
    }
    if (a === 'toggle-task') {
      const t = db.tasks.find((x) => x.id === node.dataset.id);
      t.done = !t.done; save(); render();
      return;
    }
    if (a === 'set-filter') {
      /* buttons carry the value in data-value; selects/inputs in .value */
      const v = node.dataset.value !== undefined ? node.dataset.value : node.value;
      ui.filters[node.dataset.key] = v;
      render(); return;
    }
    if (a === 'reset') {
      if (!confirm('Reset all sample data back to the original demo set?')) return;
      reset(); closeAll(); render(); toast('Sample data restored.');
      return;
    }
    if (a === 'export') {
      const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'lioness-crm-sample-data.json';
      document.body.appendChild(link); link.click(); link.remove();
      URL.revokeObjectURL(url); toast('Downloaded.');
      return;
    }
  });

  document.addEventListener('submit', function (e) {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    submitForm(form.dataset.form);
  });

  document.addEventListener('input', function (e) {
    const el = e.target;
    if (el.dataset && el.dataset.action === 'search') {
      ui.filters.q = el.value;
      render(true);
      return;
    }
    if (el.id === 'q') { ui.filters.q = el.value; render(true); return; }
    if (el.name === 'price') el.dataset.touched = '1';
  });

  document.addEventListener('change', function (e) {
    const el = e.target;
    if (el.dataset && el.dataset.action === 'pick-service') syncPrice(el);
    if (el.dataset && el.dataset.action === 'set-filter') {
      ui.filters[el.dataset.key] = el.value;
      render();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  window.addEventListener('hashchange', function () {
    closeAll();
    parseHash();
    render();
  });

  /* ---------------- router ---------------- */
  function parseHash() {
    const h = (location.hash || '#/dashboard').replace(/^#\/?/, '');
    const parts = h.split('/');
    ui.route = parts[0] || 'dashboard';
    if (NAV.every((n) => n[0] !== ui.route)) ui.route = 'dashboard';
    ui.id = parts[1] || null;
    const sb = $('#sidebar'), sc = $('#scrim');
    if (sb) sb.classList.remove('open');
    if (sc) sc.classList.remove('open');
  }

  function render(keepFocus) {
    const active = document.activeElement;
    const focusId = keepFocus && active && active.id ? active.id : null;
    const selStart = focusId && active.setSelectionRange ? active.selectionStart : null;

    document.body.innerHTML = shell();

    if (ui.route === 'clients' && ui.id) openClient(ui.id);

    if (focusId) {
      const el = document.getElementById(focusId);
      if (el) {
        el.focus();
        if (selStart != null && el.setSelectionRange) { try { el.setSelectionRange(selStart, selStart); } catch (err) {} }
      }
    }
  }

  parseHash();
  render();
})();
