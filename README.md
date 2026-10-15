# Royal Shine Digital Services — portfolio site

A dark, gold-accented portfolio page for selling website work. Built with plain
HTML/CSS/JavaScript — no build step, no dependencies, free to host.

## Preview locally

```bash
cd ~/royal-shine-portfolio
python -m http.server 8801 --bind 127.0.0.1
```

Then open http://127.0.0.1:8801/

## What is in here

```
index.html          the portfolio page
styles.css          all styling
script.js           mobile menu, WhatsApp links, quote form
assets/
  work-lioness.jpg        screenshot of the live Lioness site
  work-blossom.jpg        screenshot of the Beauty Blossom sample
  work-cleaning.jpg       screenshot of the Royal Shine Cleaning sample
  work-crm.png            screenshot of the client-book CRM demo dashboard
  work-blossom-mobile.jpg phone-width screenshot used in the "On phones" section
  og-image.jpg            1200x630 share card for WhatsApp link previews
  favicon.svg             gold crown favicon
work/
  beauty-blossom-studio/  full sample site, clickable from the Work section
  royal-shine-cleaning/   full sample site, clickable from the Work section
  lioness-crm/            working client-book CRM demo (sample data, no login)
```

The samples live *inside* this folder on purpose: one folder, one publish,
and the "click through the sample" links keep working without extra setup.

## The CRM demo

`work/lioness-crm/` is a real, clickable client-book app, not a mockup: appointments
diary (today / upcoming / past), client files with notes, allergies and history, the
service list with prices, tasks, and a dashboard showing expected income. It runs on
plain HTML/CSS/JS with the sample data generated relative to today, and every edit is
stored in the visitor's own browser — no server, no login, no database.

What it is **not**: a multi-user CRM with real client data. Notes and bookings saved in
one visitor's browser are not visible to anyone else. A paid build would add logins and
a shared (free-tier) database in the client's own name. Keep any advertising wording
inside that line.

## BEFORE PUBLISHING — six things to do

1. **Add the WhatsApp number.** Open `script.js` and set `WHATSAPP_NUMBER` near the
   top. Digits only, full international format: drop the leading 0 and start with 27.
   Example: `082 123 4567` becomes `'27821234567'`.
   Until it is set, the WhatsApp buttons and the quote form say so out loud instead
   of opening a dead link.

2. **Fill in the two sample sites.** They are demonstration designs and are labelled
   as such in their footers. Each one still has demo values where the real details go:
   prices ("Enquire for pricing"), contact details, gallery photographs, and the
   About wording. Anything you write on them must be something the business actually
   does — check claims like "clean, sterilised tools" before a sample goes out as a
   real client site.

3. **Confirm you may show the Lioness Beauty Studio site** in the Work section. It is
   a live site with a real client's photographs and testimonials, so it can only stay
   here if the owner agrees.

4. **Keep the CRM wording honest.** The flyer advertises "CRM Access" and the portfolio
   now shows a working CRM demo, so there is something real behind the promise — but it
   is a single-browser demo, not a shared multi-user system. Say "client-book CRM", show
   the demo link, and only promise logins plus shared client data once the live version
   with its own free database is actually built (see "The CRM demo" above).

5. **Check the free-offer claims.** The page now promises free hosting, a free client-book
   CRM and a free first year of the domain. That is only true while the site stays on free
   hosting plans and you personally pay the R49 first-year domain fee — budget for it, and
   correct the page if that ever changes.

6. **Publish and then fill in the canonical address.**

## Publishing (free, GitHub Pages)

The folder is already a complete static site. Steps:

```bash
cd ~/royal-shine-portfolio
git init -b main
git add -A && git commit -m "Royal Shine Digital Services portfolio"
gh repo create royal-shine-portfolio --public --source=. --push
gh api -X POST repos/emmarentia96/royal-shine-portfolio/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

Then the site serves at `https://emmarentia96.github.io/royal-shine-portfolio/`,
and the samples are at
`https://emmarentia96.github.io/royal-shine-portfolio/work/lioness-crm/`,
`.../work/beauty-blossom-studio/` and `.../work/royal-shine-cleaning/`.

Once it is live, switch the relative `og:image` and `twitter:image` paths in
`index.html` to the absolute `https://` URLs — crawlers need absolute URLs.

A custom domain for the portfolio is a separate decision and a separate cost
(a `.co.za` is R49 for the first year, then about R109 a year).

## Editing after publishing

```bash
cd ~/royal-shine-portfolio
# edit the files
git add -A && git commit -m "what changed"
git push
```

If a change touches the sample sites, edit them in this folder — that is the copy
that gets published.
