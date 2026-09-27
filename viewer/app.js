const REPO = "dchorazkiewicz/presentations";
const BRANCH = "main";
const API_ROOT = "https://api.github.com/repos/" + REPO + "/contents";

const catalog = document.getElementById("catalog");
const deckList = document.getElementById("deck-list");
const catalogError = document.getElementById("catalog-error");
const refreshButton = document.getElementById("refresh-button");
const deckView = document.getElementById("deck-view");
const slides = document.getElementById("slides");
const loading = document.getElementById("loading");
const loadingText = document.getElementById("loading-text");
const deckToolbar = document.getElementById("deck-toolbar");
const fullscreenButton = document.getElementById("fullscreen-button");

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise(function(_, reject) {
      setTimeout(function() { reject(new Error(message || "The request timed out.")); }, ms);
    })
  ]);
}

function apiUrl(path) {
  return API_ROOT + "/" + path + "?ref=" + encodeURIComponent(BRANCH) + "&_=" + Date.now();
}

async function fetchJson(path) {
  const response = await withTimeout(fetch(apiUrl(path), {
    cache: "no-store",
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  }), 8000, "GitHub API did not respond.");

  if (!response.ok) {
    throw new Error("GitHub API: " + response.status + " " + response.statusText);
  }
  return response.json();
}

async function fetchRaw(path) {
  const response = await withTimeout(fetch(apiUrl(path), {
    cache: "no-store",
    headers: {
      "Accept": "application/vnd.github.raw+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  }), 8000, "GitHub API did not respond.");

  if (!response.ok) {
    throw new Error("GitHub API: " + response.status + " " + response.statusText);
  }
  return response.text();
}

function humanize(filename) {
  const withoutExtension = filename.replace(/\.md$/i, "");
  return withoutExtension
    .split(/[-_]+/)
    .filter(Boolean)
    .map(function(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function setLoading(value, text) {
  loading.hidden = !value;
  if (text) loadingText.textContent = text;
}

function showError(message) {
  catalogError.hidden = false;
  catalogError.textContent = message;
}

async function discoverCatalog() {
  try {
    const manifestText = await fetchRaw("decks/index.json");
    const manifest = JSON.parse(manifestText);
    if (Array.isArray(manifest.sections)) return manifest.sections;
    if (Array.isArray(manifest.decks)) {
      return [{ id: "presentations", title: "Presentations", decks: manifest.decks }];
    }
  } catch (_) {}

  const entries = await fetchJson("decks");
  const decks = entries
    .filter(function(item) {
      return item.type === "file" && item.name.toLowerCase().endsWith(".md");
    })
    .map(function(item) {
      return {
        id: item.name.replace(/\.md$/i, ""),
        title: humanize(item.name),
        description: "Markdown presentation"
      };
    });

  return [{ id: "presentations", title: "Presentations", decks }];
}

function createDeckRow(deck, index) {
  const row = document.createElement("a");
  row.className = "deck-row";
  row.href = "?deck=" + encodeURIComponent(deck.id);

  const number = document.createElement("span");
  number.className = "deck-index";
  number.textContent = String(index + 1).padStart(2, "0");

  const copy = document.createElement("div");
  copy.className = "deck-copy";

  const title = document.createElement("h3");
  title.textContent = deck.title || humanize(deck.id);

  const description = document.createElement("p");
  description.textContent = deck.description || "";

  copy.appendChild(title);
  copy.appendChild(description);

  const arrow = document.createElement("span");
  arrow.className = "deck-row-arrow";
  arrow.textContent = "→";

  row.appendChild(number);
  row.appendChild(copy);
  row.appendChild(arrow);
  return row;
}

async function loadCatalog() {
  catalogError.hidden = true;
  deckList.innerHTML = "";
  refreshButton.disabled = true;

  try {
    const sections = await discoverCatalog();

    if (!sections.length) {
      showError("No presentations found.");
      return;
    }

    sections.forEach(function(section) {
      const block = document.createElement("section");
      block.className = "catalog-section";

      const heading = document.createElement("div");
      heading.className = "catalog-section-title";
      heading.textContent = section.title || "Presentations";

      const list = document.createElement("div");
      list.className = "presentation-list";

      (section.decks || []).forEach(function(deck, index) {
        list.appendChild(createDeckRow(deck, index));
      });

      block.appendChild(heading);
      block.appendChild(list);
      deckList.appendChild(block);
    });
  } catch (error) {
    showError("Could not load the presentation list. " + error.message);
  } finally {
    refreshButton.disabled = false;
  }
}

function splitSlides(markdown) {
  return markdown
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n---\n/g)
    .map(function(part) { return part.trim(); })
    .filter(Boolean);
}

function renderMarkdownPreservingMath(source) {
  const math = [];

  function stash(value) {
    const token = "MATHPLACEHOLDER" + math.length + "END";
    math.push(value);
    return token;
  }

  let protectedSource = source
    .replace(/\$\$[\s\S]*?\$\$/g, stash)
    .replace(/\\\[[\s\S]*?\\\]/g, stash)
    .replace(/\\\([\s\S]*?\\\)/g, stash)
    .replace(/\$(?!\$)[^\n$]+\$/g, stash);

  let html = marked.parse(protectedSource, { gfm: true, breaks: false });

  math.forEach(function(value, index) {
    const token = "MATHPLACEHOLDER" + index + "END";
    html = html.split(token).join(value);
  });

  return html;
}

async function typesetMathSoon() {
  for (let i = 0; i < 20; i += 1) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      try {
        await window.MathJax.typesetPromise([slides]);
      } catch (_) {}
      return;
    }
    await new Promise(function(resolve) { setTimeout(resolve, 250); });
  }
}

function getRevealViewport() {
  const width = window.innerWidth || document.documentElement.clientWidth || 1280;
  const height = window.innerHeight || document.documentElement.clientHeight || 720;
  const ratio = width / Math.max(height, 1);

  if (ratio < 0.85) {
    return { width: 760, height: 1200 };
  }

  if (ratio < 1.35) {
    return { width: 1100, height: 900 };
  }

  if (ratio > 1.85) {
    return { width: 1500, height: 800 };
  }

  return { width: 1440, height: 900 };
}

function applyRevealViewport() {
  if (!window.Reveal || !Reveal.isReady()) return;
  const viewport = getRevealViewport();
  Reveal.configure({
    width: viewport.width,
    height: viewport.height
  });
  Reveal.layout();
  window.PresentationInteractives?.refresh();
}

async function loadDeck(deckId) {
  if (!/^[a-zA-Z0-9._-]+$/.test(deckId)) {
    throw new Error("Invalid presentation name.");
  }

  setLoading(true, "Loading slides…");
  const markdown = await fetchRaw("decks/" + deckId + ".md");
  const parts = splitSlides(markdown);

  if (!parts.length) {
    throw new Error("The presentation contains no slides.");
  }

  slides.innerHTML = "";
  parts.forEach(function(source) {
    const section = document.createElement("section");
    section.innerHTML = renderMarkdownPreservingMath(source);
    slides.appendChild(section);
  });

  catalog.hidden = true;
  deckView.hidden = false;
  deckToolbar.hidden = false;

  setLoading(true, "Starting presentation…");

  const viewport = getRevealViewport();

  await withTimeout(Reveal.initialize({
    hash: true,
    history: true,
    controls: true,
    progress: true,
    slideNumber: "c/t",
    center: false,
    transition: "fade",
    backgroundTransition: "fade",
    width: viewport.width,
    height: viewport.height,
    margin: 0.035,
    minScale: 0.2,
    maxScale: 1.15,
    touch: true
  }), 8000, "Reveal.js did not finish initialization.");

  window.PresentationInteractives?.init(slides);
  Reveal.on("slidechanged", function() {
    setTimeout(function() {
      window.PresentationInteractives?.refresh();
    }, 80);
  });

  setLoading(false);
  document.title = humanize(deckId) + " · Presentations";
  typesetMathSoon();
  setTimeout(function() {
    window.PresentationInteractives?.refresh();
  }, 250);
}

fullscreenButton.addEventListener("click", async function() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      fullscreenButton.textContent = "Exit full screen";
    } else {
      await document.exitFullscreen();
      fullscreenButton.textContent = "Full screen";
    }
  } catch (_) {}
});

document.addEventListener("fullscreenchange", function() {
  fullscreenButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
});

refreshButton.addEventListener("click", loadCatalog);

let resizeTimer = null;
window.addEventListener("resize", function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(applyRevealViewport, 120);
});

window.addEventListener("orientationchange", function() {
  setTimeout(applyRevealViewport, 180);
});

(async function start() {
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get("deck");

  if (deckId) {
    try {
      await loadDeck(deckId);
    } catch (error) {
      setLoading(false);
      catalog.hidden = false;
      deckView.hidden = true;
      deckToolbar.hidden = true;
      showError("Could not open the presentation. " + error.message);
      await loadCatalog();
    }
  } else {
    await loadCatalog();
  }
})();
