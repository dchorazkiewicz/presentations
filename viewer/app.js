const REPO = "dchorazkiewicz/presentations";
const BRANCH = "main";
const API_ROOT = "https://api.github.com/repos/" + REPO + "/contents";
const RAW_ROOT = "https://raw.githubusercontent.com/" + REPO + "/" + BRANCH;

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
      setTimeout(function() { reject(new Error(message || "Przekroczono czas oczekiwania.")); }, ms);
    })
  ]);
}

function apiUrl(path) {
  return API_ROOT + "/" + path + "?ref=" + encodeURIComponent(BRANCH) + "&_=" + Date.now();
}

function rawUrl(path) {
  return RAW_ROOT + "/" + path + "?_=" + Date.now();
}

async function fetchJson(path) {
  const response = await withTimeout(fetch(apiUrl(path), {
    cache: "no-store",
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  }), 8000, "GitHub API nie odpowiedziało.");

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
  }), 8000, "GitHub API nie odpowiedziało.");

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

async function discoverDecks() {
  try {
    const entries = await fetchJson("decks");
    return entries
      .filter(function(item) {
        return item.type === "file" && item.name.toLowerCase().endsWith(".md");
      })
      .map(function(item) {
        return {
          id: item.name.replace(/\.md$/i, ""),
          name: item.name
        };
      });
  } catch (error) {
    const manifest = await fetchRaw("decks/index.json");
    return JSON.parse(manifest).decks;
  }
}

async function loadCatalog() {
  catalogError.hidden = true;
  deckList.innerHTML = "";
  refreshButton.disabled = true;

  try {
    const decks = (await discoverDecks()).sort(function(a, b) {
      return (a.title || a.name || a.id).localeCompare((b.title || b.name || b.id), "pl");
    });

    if (!decks.length) {
      showError("Brak prezentacji.");
      return;
    }

    decks.forEach(function(deck, index) {
      const id = deck.id || (deck.name || "").replace(/\.md$/i, "");
      const titleText = deck.title || humanize(deck.name || id);
      const description = deck.description || "Markdown · treść pobierana z repozytorium";

      const card = document.createElement("a");
      card.className = "deck-card";
      card.href = "?deck=" + encodeURIComponent(id);

      const number = document.createElement("span");
      number.className = "deck-number";
      number.textContent = "PREZENTACJA " + String(index + 1).padStart(2, "0");

      const title = document.createElement("h3");
      title.textContent = titleText;

      const meta = document.createElement("p");
      meta.textContent = description;

      const arrow = document.createElement("div");
      arrow.className = "deck-arrow";
      arrow.textContent = "→";

      const top = document.createElement("div");
      top.appendChild(number);
      top.appendChild(title);
      top.appendChild(meta);

      card.appendChild(top);
      card.appendChild(arrow);
      deckList.appendChild(card);
    });
  } catch (error) {
    showError("Nie udało się pobrać listy prezentacji. " + error.message);
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
    .replace(/\\\([\s\S]*?\\\)/g, stash);

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

async function loadDeck(deckId) {
  if (!/^[a-zA-Z0-9._-]+$/.test(deckId)) {
    throw new Error("Nieprawidłowa nazwa prezentacji.");
  }

  setLoading(true, "Pobieranie slajdów…");
  const markdown = await fetchRaw("decks/" + deckId + ".md");
  const parts = splitSlides(markdown);

  if (!parts.length) {
    throw new Error("Prezentacja nie zawiera slajdów.");
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

  setLoading(true, "Uruchamianie prezentacji…");

  await withTimeout(Reveal.initialize({
    hash: true,
    history: true,
    controls: true,
    progress: true,
    slideNumber: "c/t",
    center: true,
    transition: "fade",
    backgroundTransition: "fade",
    width: 1280,
    height: 720,
    margin: 0.075,
    minScale: 0.2,
    maxScale: 2.0,
    touch: true
  }), 8000, "Reveal.js nie zakończył inicjalizacji.");

  setLoading(false);
  document.title = humanize(deckId) + " — Prezentacje";
  typesetMathSoon();
}

fullscreenButton.addEventListener("click", async function() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      fullscreenButton.textContent = "Wyjdź z pełnego ekranu";
    } else {
      await document.exitFullscreen();
      fullscreenButton.textContent = "Pełny ekran";
    }
  } catch (_) {}
});

document.addEventListener("fullscreenchange", function() {
  fullscreenButton.textContent = document.fullscreenElement ? "Wyjdź z pełnego ekranu" : "Pełny ekran";
});

refreshButton.addEventListener("click", loadCatalog);

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
      showError("Nie udało się otworzyć prezentacji. " + error.message);
      await loadCatalog();
    }
  } else {
    await loadCatalog();
  }
})();
