(function () {
  const main = document.getElementById("series-container");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  const heroImage = document.getElementById("hero-image");

  // Display order is reversed: the LAST photo in js/photos-data.js shows
  // first on the site (and becomes the default hero image, unless
  // overridden below). Your actual photos-data.js file is untouched.
  const ORDERED_PHOTOS = PHOTOS.slice().reverse();

  // Hero image: use index.html's data-hero override if set, otherwise
  // the first photo in display order.
  const heroOverride = heroImage ? heroImage.getAttribute("data-hero") : "";
  const heroUrl = (heroOverride && heroOverride.trim())
    ? heroOverride.trim()
    : (ORDERED_PHOTOS.length > 0 ? ORDERED_PHOTOS[0].url : null);
  if (heroImage && heroUrl) {
    heroImage.style.backgroundImage = 'url("' + heroUrl + '")';
  }

  function openLightbox(photo) {
    lightboxImg.src = photo.url;
    lightboxImg.alt = photo.title || "";
    lightboxCaption.innerHTML = "";
    const t = document.createElement("span");
    t.className = "lightbox-title";
    t.textContent = photo.title || "";
    lightboxCaption.appendChild(t);
    if (photo.caption) {
      const c = document.createElement("span");
      c.className = "lightbox-subcaption";
      c.textContent = photo.caption;
      lightboxCaption.appendChild(c);
    }
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

  // Fade-in-on-scroll for photo frames and section headings.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  // Group photos by category, preserving first-appearance order (in
  // display order, i.e. reversed). Any photo with no category falls
  // back to "Uncategorized" so nothing is ever silently dropped.
  const groups = new Map();
  const order = [];

  ORDERED_PHOTOS.forEach((photo) => {
    const key = (photo.category && photo.category.trim()) || "Uncategorized";
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key).push(photo);
  });

  const seriesList = typeof SERIES !== "undefined" ? SERIES : [];
  const seriesMeta = new Map(seriesList.map((s) => [s.key, s]));
  const definedOrder = seriesList.map((s) => s.key);
  const remaining = order.filter((k) => !definedOrder.includes(k));
  const renderOrder = [...definedOrder, ...remaining].filter((k) => groups.has(k));

  const sectionEls = {};

  renderOrder.forEach((key) => {
    const photos = groups.get(key);
    const meta = seriesMeta.get(key) || { title: key, blurb: "" };

    const section = document.createElement("section");
    section.className = "series";
    section.id = "series-" + key.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    sectionEls[key] = section;

    const heading = document.createElement("h2");
    heading.className = "series-heading reveal";
    heading.textContent = meta.title || key;
    section.appendChild(heading);
    revealObserver.observe(heading);

    const metaLine = document.createElement("p");
    metaLine.className = "series-meta";
    metaLine.textContent = meta.blurb || (photos.length + (photos.length === 1 ? " photo" : " photos"));
    section.appendChild(metaLine);

    const grid = document.createElement("div");
    grid.className = "grid";
    grid.setAttribute("role", "list");

    photos.forEach((photo) => {
      const frame = document.createElement("div");
      frame.className = "frame reveal";
      frame.setAttribute("role", "listitem");
      frame.setAttribute("tabindex", "0");

      const photoWrap = document.createElement("div");
      photoWrap.className = "frame-photo";
      const img = document.createElement("img");
      img.src = photo.url;
      img.alt = photo.title || "";
      img.loading = "lazy";
      photoWrap.appendChild(img);

      const caption = document.createElement("div");
      caption.className = "frame-caption";
      const title = document.createElement("p");
      title.className = "frame-title";
      title.textContent = photo.title || "";
      caption.appendChild(title);

      if (photo.caption) {
        const sub = document.createElement("p");
        sub.className = "frame-sub";
        sub.textContent = photo.caption;
        caption.appendChild(sub);
      }

      frame.appendChild(photoWrap);
      frame.appendChild(caption);
      grid.appendChild(frame);
      revealObserver.observe(frame);

      frame.addEventListener("click", () => openLightbox(photo));
      frame.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(photo);
        }
      });
    });

    section.appendChild(grid);
    main.appendChild(section);
  });

  // Sticky filter bar: one pill per series, plus "All".
  const filterBar = document.getElementById("filter-bar");
  let applyFilter = () => {};

  if (filterBar && renderOrder.length > 1) {
    function setActivePill(btn) {
      filterBar.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
      if (btn) btn.classList.add("active");
    }

    applyFilter = function (targetKey) {
      renderOrder.forEach((key) => {
        const section = sectionEls[key];
        if (!section) return;
        section.hidden = targetKey !== "all" && key !== targetKey;
      });
    };

    const allPill = document.createElement("button");
    allPill.type = "button";
    allPill.className = "filter-pill";
    allPill.textContent = "All";
    allPill.dataset.key = "all";
    allPill.addEventListener("click", () => {
      setActivePill(allPill);
      applyFilter("all");
    });
    filterBar.appendChild(allPill);

    const pillEls = { all: allPill };

    renderOrder.forEach((key) => {
      const meta = seriesMeta.get(key) || { title: key };
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "filter-pill";
      pill.textContent = meta.title || key;
      pill.dataset.key = key;
      pill.addEventListener("click", () => {
        setActivePill(pill);
        applyFilter(key);
      });
      filterBar.appendChild(pill);
      pillEls[key] = pill;
    });

    // Decide the default view: DEFAULT_SERIES if it exists and has at
    // least one photo, otherwise "All" (so the page is never empty).
    const defaultKey = (typeof DEFAULT_SERIES !== "undefined" && DEFAULT_SERIES &&
      renderOrder.includes(DEFAULT_SERIES) && groups.get(DEFAULT_SERIES).length > 0)
      ? DEFAULT_SERIES
      : "all";

    setActivePill(pillEls[defaultKey]);
    applyFilter(defaultKey);
  }
})();
