/*
  YOUR SERIES — short list, easy to hand-edit.

  Order here = order everywhere (filter pills, sections). The FIRST entry
  is also what the site shows by default when the page loads — put
  "Selected Photos" first to make it the default view.

  "key" must match the "category" you assign to photos in
  js/photos-data.js (via organizer.html) — matching is exact, including
  capitalization.

  Any photo whose category doesn't match a key here falls back to
  "Uncategorized" automatically, so nothing is ever lost — it just won't
  show up until you give it a real series.
*/

const SERIES = [
  { key: "Selected Photos", title: "Selected Photos", blurb: "" },
  // Add more series as you assign them in organizer.html, e.g.:
  // { key: "Coastal", title: "Coastal", blurb: "Mornings along the water." },
];

// Which series is shown by default when the page loads.
// Must exactly match one of the "key" values above.
const DEFAULT_SERIES = "Selected Photos";
