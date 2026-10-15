/* ------------------------------------------------------------------
   Lioness Beauty Studio — sample CRM data
   All seed records are generated relative to "today" so the demo
   always looks current. Nothing here leaves the browser.
   ------------------------------------------------------------------ */
(function (global) {
  'use strict';

  const DAY = 86400000;

  function iso(offsetDays) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setTime(d.getTime() + offsetDays * DAY);
    return d.toISOString().slice(0, 10);
  }

  const staff = ['Lerato', 'Nomsa', 'Thandi', 'Zanele'];

  const services = [
    { id: 's1',  name: 'Gel Manicure',            category: 'Nails',     price: 280,  duration: 60,  desc: 'Shape, cuticle care and a long-wear gel finish in your choice of shade.' },
    { id: 's2',  name: 'Acrylic Full Set',        category: 'Nails',     price: 420,  duration: 90,  desc: 'Sculpted extensions with your pick of shape, length and art.' },
    { id: 's3',  name: 'Classic Lash Set',        category: 'Lashes',    price: 550,  duration: 105, desc: 'One extension per natural lash for a soft, everyday flutter.' },
    { id: 's4',  name: 'Volume Lash Refill',      category: 'Lashes',    price: 380,  duration: 75,  desc: 'Infill for 2–3 week old volume sets, includes lash bath.' },
    { id: 's5',  name: 'Hydrating Facial',        category: 'Skin',      price: 620,  duration: 75,  desc: 'Deep cleanse, gentle exfoliation, hyaluronic mask and massage.' },
    { id: 's6',  name: 'Full Leg Wax',            category: 'Waxing',    price: 320,  duration: 45,  desc: 'Warm wax from ankle to thigh, finished with soothing oil.' },
    { id: 's7',  name: 'Brazilian Wax',           category: 'Waxing',    price: 400,  duration: 40,  desc: 'Precision hot-wax treatment with aftercare balm.' },
    { id: 's8',  name: 'Deep Tissue Massage',     category: 'Massage',   price: 750,  duration: 60,  desc: 'Firm pressure work on tension areas, back, neck and shoulders.' },
    { id: 's9',  name: 'Bridal Hair & Makeup',    category: 'Bridal',    price: 1850, duration: 180, desc: 'Trial-informed bridal styling with touch-up kit and veil setting.' },
    { id: 's10', name: 'Gel Pedicure',            category: 'Nails',     price: 340,  duration: 70,  desc: 'Soak, hard-skin removal, massage and a chip-resistant gel finish.' },
    { id: 's11', name: 'Brow Shape & Tint',       category: 'Brows',     price: 240,  duration: 35,  desc: 'Wax and tweeze to shape, finished with a custom-blended tint.' },
    { id: 's12', name: 'Scalp & Hair Treatment',  category: 'Hair',      price: 480,  duration: 60,  desc: 'Protein steam treatment for dry or chemically treated hair.' }
  ];

  const clients = [
    { id: 'c1',  name: 'Naledi Mokoena',   phone: '082 447 1190', email: 'naledi.mokoena@gmail.com',  since: iso(-430), birthday: '12 March',  tags: ['Loyal', 'Lashes'],    preferred: 'Saturdays, mornings', source: 'Instagram', allergies: 'Sensitive to strong fragrance', visits: 24, notes: [
      { at: iso(-6),  text: 'Loves a 0.05 D-curl. Asked about a lash lift instead of a full set next time.' },
      { at: iso(-40), text: 'Wants to book her sister in for a gel set before the wedding season.' }
    ]},
    { id: 'c2',  name: 'Thandeka Ngcobo',  phone: '071 203 8845', email: 'thandeka.n@outlook.com',    since: iso(-210), birthday: '4 July',     tags: ['Bridal'],            preferred: 'Weekdays after 15:00', source: 'Referral — Naledi', allergies: 'None', visits: 9, notes: [
      { at: iso(-12), text: 'October bride. Trial booked, wants a low chignon with baby\u2019s breath.' },
      { at: iso(-75), text: 'Deposit received for bridal package — R1 850.' }
    ]},
    { id: 'c3',  name: 'Aisha Patel',      phone: '083 771 6620', email: 'aisha.patel12@gmail.com',   since: iso(-95),  birthday: '29 November', tags: ['Nails'],            preferred: 'Friday late afternoon', source: 'Walk-in', allergies: 'Latex', visits: 6, notes: [
      { at: iso(-9),  text: 'Latex-free gloves only. Almond shape, short.' }
    ]},
    { id: 'c4',  name: 'Refilwe Dlamini',  phone: '076 918 4402', email: 'refilwe.d@gmail.com',       since: iso(-320), birthday: '2 February',  tags: ['Loyal', 'Skin'],     preferred: 'Tuesday mornings', source: 'Instagram', allergies: 'None', visits: 17, notes: [
      { at: iso(-3),  text: 'Facial series running well — skin much calmer on the cheeks.' }
    ]},
    { id: 'c5',  name: 'Chantelle Adams',  phone: '084 220 5577', email: 'chantelle.adams@yahoo.com', since: iso(-60),  birthday: '18 September', tags: ['New'],              preferred: 'Saturday afternoons', source: 'WhatsApp status', allergies: 'Retinol sensitivity', visits: 2, notes: [
      { at: iso(-4),  text: 'First-time facial client. Avoid retinol actives, keep it hydrating.' }
    ]},
    { id: 'c6',  name: 'Palesa Sithole',   phone: '072 664 3311', email: 'palesa.sithole@gmail.com',  since: iso(-150), birthday: '7 May',      tags: ['Waxing'],            preferred: 'Monthly, mid-month', source: 'Google search', allergies: 'None', visits: 11, notes: [
      { at: iso(-18), text: 'Set reminder for the 15th — pays by EFT on the day.' }
    ]},
    { id: 'c7',  name: 'Zinhle Mabaso',    phone: '081 339 9087', email: 'zinhle.m@gmail.com',        since: iso(-250), birthday: '23 August',  tags: ['Loyal', 'Brows'],    preferred: 'Thursdays 09:00', source: 'Referral — Refilwe', allergies: 'None', visits: 14, notes: [
      { at: iso(-8),  text: 'Prefers a softer, natural brow tint — go one shade lighter.' }
    ]},
    { id: 'c8',  name: 'Michelle van Wyk', phone: '082 556 1174', email: 'michelle.vw@gmail.com',     since: iso(-35),  birthday: '1 December',  tags: ['New', 'Massage'],    preferred: 'Weekday evenings', source: 'Facebook', allergies: 'Peppermint oil', visits: 3, notes: [
      { at: iso(-2),  text: 'Carries a lot of tension in the right shoulder — firmer on the rhomboids.' }
    ]},
    { id: 'c9',  name: 'Lindiwe Khumalo',  phone: '073 812 6640', email: 'lindiwe.k@gmail.com',       since: iso(-540), birthday: '16 June',     tags: ['Loyal'],             preferred: 'Every 3 weeks', source: 'Walk-in', allergies: 'None', visits: 31, notes: [
      { at: iso(-21), text: 'Longest-standing client. Give her the loyalty discount without asking.' }
    ]},
    { id: 'c10', name: 'Grace Mthembu',    phone: '079 445 2298', email: 'grace.mthembu@gmail.com',   since: iso(-120), birthday: '30 April',    tags: ['Hair'],              preferred: 'Saturday mornings', source: 'Instagram', allergies: 'Ammonia', visits: 8, notes: [
      { at: iso(-14), text: 'Ammonia-free colour only, bring in the tint she approved.' }
    ]},
    { id: 'c11', name: 'Bianca Naidoo',    phone: '084 907 7731', email: 'bianca.naidoo@gmail.com',   since: iso(-75),  birthday: '9 October',   tags: ['Pedicure'],          preferred: 'Sunday 11:00', source: 'Referral — Aisha', allergies: 'None', visits: 5, notes: [] },
    { id: 'c12', name: 'Katlego Mahlangu', phone: '078 220 4196', email: 'katlego.m@gmail.com',       since: iso(-14),  birthday: '21 January',  tags: ['New'],               preferred: 'Flexible', source: 'TikTok', allergies: 'Unknown', visits: 1, notes: [
      { at: iso(-10), text: 'Asked about a package deal for nails + lashes. Send pricing.' }
    ]}
  ];

  /* status: pending | confirmed | done | cancelled */
  const appointments = [
    { id: 'a1',  clientId: 'c1',  serviceId: 's4',  date: iso(0),  time: '09:00', staff: 'Nomsa',  status: 'confirmed', price: 380,  notes: 'Refill due — check for gaps on the right eye.' },
    { id: 'a2',  clientId: 'c5',  serviceId: 's5',  date: iso(0),  time: '10:15', staff: 'Lerato', status: 'confirmed', price: 620,  notes: 'No retinol actives.' },
    { id: 'a3',  clientId: 'c9',  serviceId: 's1',  date: iso(0),  time: '11:30', staff: 'Thandi', status: 'confirmed', price: 280,  notes: 'Deep nude, same as last time.' },
    { id: 'a4',  clientId: 'c11', serviceId: 's10', date: iso(0),  time: '13:00', staff: 'Thandi', status: 'pending',   price: 340,  notes: 'Needs to confirm — sent WhatsApp reminder.' },
    { id: 'a5',  clientId: 'c8',  serviceId: 's8',  date: iso(0),  time: '15:00', staff: 'Lerato', status: 'confirmed', price: 750,  notes: 'Right shoulder focus.' },
    { id: 'a6',  clientId: 'c3',  serviceId: 's2',  date: iso(0),  time: '16:30', staff: 'Nomsa',  status: 'pending',   price: 420,  notes: 'Latex-free gloves.' },
    { id: 'a7',  clientId: 'c2',  serviceId: 's9',  date: iso(1),  time: '08:00', staff: 'Lerato', status: 'confirmed', price: 1850, notes: 'Bridal trial follow-up — low chignon.' },
    { id: 'a8',  clientId: 'c6',  serviceId: 's6',  date: iso(1),  time: '12:00', staff: 'Zanele', status: 'confirmed', price: 320,  notes: 'Pays by EFT.' },
    { id: 'a9',  clientId: 'c7',  serviceId: 's11', date: iso(1),  time: '14:00', staff: 'Zanele', status: 'confirmed', price: 240,  notes: 'One shade lighter on the tint.' },
    { id: 'a10', clientId: 'c4',  serviceId: 's5',  date: iso(2),  time: '09:30', staff: 'Lerato', status: 'confirmed', price: 620,  notes: 'Third facial in the series.' },
    { id: 'a11', clientId: 'c10', serviceId: 's12', date: iso(2),  time: '11:00', staff: 'Nomsa',  status: 'confirmed', price: 480,  notes: 'Ammonia-free.' },
    { id: 'a12', clientId: 'c12', serviceId: 's3',  date: iso(3),  time: '10:00', staff: 'Nomsa',  status: 'pending',   price: 550,  notes: 'First lash set — patch test 24h before.' },
    { id: 'a13', clientId: 'c1',  serviceId: 's1',  date: iso(4),  time: '09:00', staff: 'Thandi', status: 'confirmed', price: 280,  notes: '' },
    { id: 'a14', clientId: 'c9',  serviceId: 's3',  date: iso(5),  time: '11:00', staff: 'Nomsa',  status: 'confirmed', price: 550,  notes: 'Loyalty discount applies.' },
    { id: 'a15', clientId: 'c6',  serviceId: 's7',  date: iso(6),  time: '13:30', staff: 'Zanele', status: 'pending',   price: 400,  notes: '' },
    { id: 'a16', clientId: 'c5',  serviceId: 's1',  date: iso(7),  time: '15:00', staff: 'Thandi', status: 'confirmed', price: 280,  notes: '' },
    { id: 'a17', clientId: 'c4',  serviceId: 's11', date: iso(7),  time: '10:00', staff: 'Zanele', status: 'confirmed', price: 240,  notes: '' },
    /* ---- past ---- */
    { id: 'a18', clientId: 'c3',  serviceId: 's1',  date: iso(-1), time: '16:00', staff: 'Thandi', status: 'done',      price: 280,  notes: '' },
    { id: 'a19', clientId: 'c7',  serviceId: 's11', date: iso(-1), time: '10:00', staff: 'Zanele', status: 'done',      price: 240,  notes: '' },
    { id: 'a20', clientId: 'c8',  serviceId: 's8',  date: iso(-2), time: '17:00', staff: 'Lerato', status: 'done',      price: 750,  notes: '' },
    { id: 'a21', clientId: 'c1',  serviceId: 's4',  date: iso(-3), time: '09:00', staff: 'Nomsa',  status: 'done',      price: 380,  notes: '' },
    { id: 'a22', clientId: 'c10', serviceId: 's12', date: iso(-3), time: '11:30', staff: 'Nomsa',  status: 'done',      price: 480,  notes: '' },
    { id: 'a23', clientId: 'c9',  serviceId: 's1',  date: iso(-4), time: '11:00', staff: 'Thandi', status: 'done',      price: 280,  notes: '' },
    { id: 'a24', clientId: 'c11', serviceId: 's10', date: iso(-5), time: '11:00', staff: 'Thandi', status: 'done',      price: 340,  notes: '' },
    { id: 'a25', clientId: 'c4',  serviceId: 's5',  date: iso(-6), time: '09:30', staff: 'Lerato', status: 'done',      price: 620,  notes: '' },
    { id: 'a26', clientId: 'c2',  serviceId: 's6',  date: iso(-6), time: '14:00', staff: 'Zanele', status: 'done',      price: 320,  notes: '' },
    { id: 'a27', clientId: 'c6',  serviceId: 's6',  date: iso(-7), time: '12:30', staff: 'Zanele', status: 'done',      price: 320,  notes: '' },
    { id: 'a28', clientId: 'c5',  serviceId: 's5',  date: iso(-8), time: '15:30', staff: 'Lerato', status: 'done',      price: 620,  notes: '' },
    { id: 'a29', clientId: 'c7',  serviceId: 's11', date: iso(-9), time: '09:00', staff: 'Zanele', status: 'done',      price: 240,  notes: '' },
    { id: 'a30', clientId: 'c3',  serviceId: 's2',  date: iso(-10),time: '16:30', staff: 'Nomsa',  status: 'done',      price: 420,  notes: '' },
    { id: 'a31', clientId: 'c1',  serviceId: 's3',  date: iso(-11),time: '09:00', staff: 'Nomsa',  status: 'done',      price: 550,  notes: '' },
    { id: 'a32', clientId: 'c4',  serviceId: 's1',  date: iso(-12),time: '10:00', staff: 'Thandi', status: 'done',      price: 280,  notes: '' },
    { id: 'a33', clientId: 'c12', serviceId: 's7',  date: iso(-12),time: '13:00', staff: 'Zanele', status: 'cancelled', price: 400,  notes: 'Rescheduling to next month.' },
    { id: 'a34', clientId: 'c8',  serviceId: 's8',  date: iso(-13),time: '17:00', staff: 'Lerato', status: 'done',      price: 750,  notes: '' },
    { id: 'a35', clientId: 'c9',  serviceId: 's10', date: iso(-14),time: '11:00', staff: 'Thandi', status: 'done',      price: 340,  notes: '' },
    { id: 'a36', clientId: 'c7',  serviceId: 's11', date: iso(-16),time: '09:00', staff: 'Zanele', status: 'done',      price: 240,  notes: '' },
    { id: 'a37', clientId: 'c10', serviceId: 's12', date: iso(-17),time: '11:30', staff: 'Nomsa',  status: 'done',      price: 480,  notes: '' },
    { id: 'a38', clientId: 'c1',  serviceId: 's4',  date: iso(-18),time: '09:00', staff: 'Nomsa',  status: 'done',      price: 380,  notes: '' },
    { id: 'a39', clientId: 'c5',  serviceId: 's3',  date: iso(-20),time: '14:00', staff: 'Nomsa',  status: 'done',      price: 550,  notes: '' },
    { id: 'a40', clientId: 'c11', serviceId: 's1',  date: iso(-21),time: '11:00', staff: 'Thandi', status: 'done',      price: 280,  notes: '' }
  ];

  const tasks = [
    { id: 't1', title: 'Confirm Bianca\u2019s 13:00 pedicure',      due: iso(0),  done: false, owner: 'Front desk', clientId: 'c11' },
    { id: 't2', title: 'Send October packages to Katlego',          due: iso(0),  done: false, owner: 'Lerato',     clientId: 'c12' },
    { id: 't3', title: 'Patch test before Katlego\u2019s lash set', due: iso(2),  done: false, owner: 'Nomsa',      clientId: 'c12' },
    { id: 't4', title: 'Order 0.05 D-curl lash trays',              due: iso(1),  done: false, owner: 'Nomsa',      clientId: '' },
    { id: 't5', title: 'Invoice Thandeka for the bridal balance',   due: iso(4),  done: false, owner: 'Lerato',     clientId: 'c2' },
    { id: 't6', title: 'Win back clients with no visit in 60 days', due: iso(3),  done: false, owner: 'Front desk', clientId: '' },
    { id: 't7', title: 'Post this week\u2019s special to WhatsApp',  due: iso(-1), done: true,  owner: 'Lerato',     clientId: '' }
  ];

  global.CRM_SEED = {
    version: 1,
    studio: {
      name: 'Lioness Beauty Studio',
      tagline: 'Client & appointment book',
      staff: staff,
      hours: 'Mon–Sat 08:00–18:00 · Sun by appointment'
    },
    services: services,
    clients: clients,
    appointments: appointments,
    tasks: tasks
  };
})(window);
