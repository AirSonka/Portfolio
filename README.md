# Your photo site

Plain HTML/CSS/JS. No build step, no dependencies, no subscription. You own
every file, including all 356 photos, which live locally in `images/`.

Design: warm, minimal, editorial, with a single slim sticky bar on top
(your name, filter pills, About/Contact) and a full-bleed hero photo.
Photos are grouped into **series** you define yourself, and one series —
**"Selected Photos"** — is shown by default when someone first opens the
site, so you always control the first impression instead of dumping all
356 photos on a visitor at once.

## Files you'll actually touch

- **`organizer.html`** — open this in a browser to visually set a title,
  caption, and series for every photo, then download the finished data
  file. This is the easiest way to fill in `js/photos-data.js`.
- **`js/series-data.js`** — a short, hand-editable list of your series
  names, in the order you want them to appear. The first one is your
  default view.
- **`index.html`** — swap `you@example.com`, the About paragraph, the
  tagline, and (optionally) `data-hero="..."` to pick a specific banner
  photo.

Everything else (`css/style.css`, `js/script.js`, `images/`) is the site
engine/content — you shouldn't need to touch those.

## Step 1 — set titles, captions, and series with the Organizer

Double-click **`organizer.html`**. For each photo, set:

- **Title** — shown under the photo, and in the enlarged view.
- **Caption** (optional) — a short sentence shown smaller, under the title.
- **Series** — a short group name. To feature a photo in the default
  homepage view, type exactly: `Selected Photos`
  (must match `js/series-data.js` exactly, capitalization included).

Click "Save progress" anytime to keep your work in that browser tab. When
done (or just want to preview), click "Download finished photos-data.js"
and move the downloaded file into `js/`, replacing the old one.

**Until you assign at least one photo to "Selected Photos" and at least
one other series, the filter bar stays hidden and the site just shows
everything under one heading** — so nothing looks broken or empty while
you're still organizing.

## Step 2 — describe each series

Open **`js/series-data.js`** in any text editor. It's short:

```js
const SERIES = [
  { key: "Selected Photos", title: "Selected Photos", blurb: "" },
  { key: "Coastal", title: "Coastal", blurb: "Mornings along the water." },
];

const DEFAULT_SERIES = "Selected Photos";
```

`key` must exactly match the Series text you typed in the Organizer.
`title` is the heading shown on the site. `blurb` is the small text shown
under the heading — keep it to a sentence, or leave it empty. The **order
of this list is the order the filter pills appear in**, and whichever
`key` you put in `DEFAULT_SERIES` is what visitors see first — change
that line any time you want a different default view.

## Step 3 — personalize index.html

Open `index.html` and edit:

- The tagline, inside `<p class="tagline...">`
- The About paragraph, inside `<p class="about-text">`
- Your email, in two places: the visible text AND the `mailto:` link (make
  sure both match!)
- Optionally, `data-hero="images/045.jpg"` on the hero section to pin a
  specific photo as the banner. Leave it as `data-hero=""` to let it
  auto-select.

## Reference: original filenames

If you need to match a numbered file (`001.jpg`) back to its original
export filename, see **`original-filenames.txt`**. That's just a
reference for you; the site doesn't use it.

## Add more photos later

1. Drop new image files into the `images/` folder.
2. Add a matching line in `js/photos-data.js`:
   ```js
   { url: "images/your-new-photo.jpg", title: "Photo title", caption: "", category: "Coastal" },
   ```
   (Or just reopen `organizer.html` — newly added photos will show up
   there too, as long as they're also listed in `photos-data.js`.)

## Publishing changes

Same as always: edit locally → GitHub Desktop → commit → push. If you
ever suspect the CSS and HTML have gotten out of sync (duplicate rules,
broken layout), the safest fix is to replace **both** `index.html` and
`css/style.css` together, in full, rather than partially merging — that
avoids leftover conflicting rules.
