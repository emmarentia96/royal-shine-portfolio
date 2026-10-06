# Royal Shine Digital Services — portfolio site

A dark, gold-accented portfolio page for selling website work. Built with plain
HTML/CSS/JavaScript — no build step, no dependencies, free to host.

## Preview locally

```bash
cd ~/royal-shine-portfolio
python -m http.server 8799 --bind 127.0.0.1
```

Then open http://127.0.0.1:8799/

## What is in here

```
index.html          the portfolio page
styles.css          all styling
script.js           mobile menu, WhatsApp links, quote form
assets/
  work-lioness.jpg        screenshot of the live Lioness site
  work-blossom.jpg        screenshot of the Beauty Blossom sample
  work-cleaning.jpg       screenshot of the Royal Shine Cleaning sample
  work-blossom-mobile.jpg phone-width screenshot used in the "On phones" section
  og-image.jpg            1200x630 share card for WhatsApp link previews
  favicon.svg             gold crown favicon
work/
  beauty-blossom-studio/  full sample site, clickable from the Work section
  royal-shine-cleaning/   full sample site, clickable from the Work section
```

The two samples live *inside* this folder on purpose: one folder, one publish,
and the "click through the sample" links keep working without extra setup.

## BEFORE PUBLISHING — five things to do

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

4. **Decide about the CRM promise.** The flyer advertises "CRM Access". This portfolio
   deliberately does not mention a CRM, because there is no CRM to hand over yet. Do
   not add it back to any advertising until there is something real behind it.

5. **Publish and then fill in the canonical address.** Nothing here is published yet.

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
and the two samples are at
`https://emmarentia96.github.io/royal-shine-portfolio/work/beauty-blossom-studio/`
and `.../work/royal-shine-cleaning/`.

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
