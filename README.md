# Baby, from day one

**Open the guide: https://hassan-elkholy.github.io/baby-from-day-one/**

A free, phone-first guide for parents of a new baby, written in simple Arabic close to Egyptian speech.

Each card covers one real moment, like "is the baby eating enough?" or "how do I store expressed milk?". It gives the steps, the common mistake, why it matters, the objections people hear from relatives, and when to see a doctor.

Every fact has a small numbered footnote. Tap it to see the source, the exact link and the date it was checked. We only use these sources: WHO, UNICEF, the American Academy of Pediatrics (healthychildren.org), the NHS, the CDC, the Egyptian Ministry of Health, Cochrane, and peer-reviewed reviews. Where the sources disagree, the card says so.

This guide is for information. It does not replace a doctor.

Found a mistake, or a source that says something different? Please [open an issue](https://github.com/Hassan-Elkholy/baby-from-day-one/issues).

## Privacy

The site has no accounts, no analytics and no server code. The birth date you type is saved in your browser only (`localStorage`). It is never sent anywhere. Fonts load from Google Fonts.

## Run it locally

It is a static site with no build step. Serve the folder with any static server, for example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from disk does not work, because the page loads its text with `fetch`.

## Install it like an app

On the hosted site, an install button sits in the top bar of every page until the guide is installed, and a box at the top of home offers the same (it can be put away). Neither shows once the guide runs from the home screen, after the browser reports the install, or in Chrome when it makes no offer (it doesn't while installed). iPhone Safari has no install offer, so the button there shows the three steps. After one visit the guide opens with no internet: `sw.js` saves every file. `sw.js` is made by `tools/make_sw.py` in the full project; run it after any change, so phones pick up the new version.

## Licence

© 2026 Hassan Elkholy. Code: MIT. Text and drawings: CC BY 4.0. See `LICENSE`. The medical sources keep their own rights; the guide only links to them.

## How it is organised

```
index.html            the page shell
assets/app.js         renders home, cards and the emergency page; holds no text
assets/search.js      the search: weighted fields, Arabic spellings, card rank
assets/pwa.js         registers sw.js and keeps the install offer (hosted site only)
sw.js                 saves every file for offline use (made by tools/make_sw.py)
manifest.webmanifest  name, colours and icons for "add to home screen"
assets/draw.js        the drawings, as inline SVG; labels come from the language files
assets/style.css      styles, light and dark
data/sources.json     every source: link and date checked (same for all languages)
data/regions.json     country settings, e.g. the ambulance number
data/tags.json        hidden search words per card
data/rank.json        how important each card is, 1 to 5
data/groups.json      the topic groups on the home screen
data/voice.json       recorded audio per card (empty for now)
locales/index.json    the languages, and whether each one is complete
locales/<lang>/       ui.json, cards.json, draw.json, sources.json, regions.json
```

Card text marks a source with `[^sourceKey]` and bold text with `**...**`. Cards that apply to one country only (for example a vaccine schedule) carry `"region": "eg"` and appear only when that country is selected.

## Add a language

1. Copy `locales/ar/` to `locales/<code>/` and translate every value. Keep the keys and the `[^...]` markers.
2. Add the language to `locales/index.json` with `"complete": false`.
3. When every file is translated and checked, set `"complete": true`. The language menu then appears on the home page.

## Add a country

Add an entry to `data/regions.json` and its name to each `locales/<lang>/regions.json`. Country-only cards use the same code in their `region` field.
