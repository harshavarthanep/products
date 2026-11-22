# H24 Creationz Products site

Two designs, one set of data. Upload the whole folder to a GitHub repo and turn on GitHub Pages.

| File | What it is |
|---|---|
| `index.html` | **Clean version**: light (auto dark), app-icon dock hero |
| `index-bold.html` | **Bold version**: the dark navy design, refined |
| `config.js` | **Edit this.** Products, links, UPI IDs, counts, timings |
| `app.js` | All the behaviour (player, carousels, counters, coffee). No need to edit |
| `assets/` | H24 Creationz logo, the logo layers used by the loading screen, favicons, app logos |
| `media/` | Flick Flick and Shelf Shelf demo videos, posters and screenshots, link-preview image |

To pick a version: keep the one you like as `index.html` (rename `index-bold.html` to `index.html` if you choose Bold). Both work side by side too, so you can host both and compare.

## Where the videos come from
ZenPDF Pro, Nodalis, Beam Beam and Nudge Nudge use the demo videos and screenshots already on their own GitHub Pages sites (links in `config.js`). If you rename a file in those repos, update the link here.
Flick Flick and Shelf Shelf videos and screenshots live in this repo under `media/`. Each has a short 30s clip (`video:`, plays on hover in the card) and the full demo (`fullVideo:`, plays in the player).

## Going live later
- **Shelf Shelf apps:** when `Shelf-Shelf/download` is live, set `downloadReady: true` on the `shelfshelf-app` entry. The "Notify me" button turns into "Download for <your OS>".
- **Flick Flick website:** when it is live, put the link in `site:` on the Flick Flick entry and a "Website" link appears.

## Common edits (all in config.js)
- UPI IDs: `coffee.upiIds` (first one is the default in the QR)
- Starting numbers: `counter.baseVisitors`, and `baseViews` / `baseDownloads` per product
- New store listings (Edge, Firefox…): `extensions[].stores`
- Hide/show a product: `ready: true / false`
- Slide speed: `timing.slideInterval`, `timing.videoSlideInterval`

## Counters
Visitors, product views and downloads use the free Abacus counter API. Real counts are added on top of your base numbers.
A browser counts once as a visitor, once per day per product view, and once per product download. If the counter service is down, the base numbers still show.

## Player shortcuts
Space/K play-pause · J/L ±10s · ←/→ ±5s · Shift+←/→ previous/next · ↑/↓ volume · M mute · F full screen · Z zoom · 0–9 jump · Esc leaves full screen, then closes.
