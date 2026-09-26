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
const homeLink = document.getElementById("home-link");

function apiUrl(path) {
  return API_ROOT + "/" + path + "?ref=" + encodeURIComponent(BRANCH) + "&_=" + Date.now();
}

async function fetchJson(path) {
  const response = await fetch(apiUrl(path), {
    cache: "no-store",
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!response.ok) {
    throw new Error("GitHub API: " + response.status + " " + response.statusText);
  }
  return response.json();
}

async function fetchRaw(path) {
  const response = await fetch(apiUrl(path), {
    cache: "no-store",
    headers: {
      "Accept": "application/vnd.github.raw+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

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

function setLoading(value) {
  loading.hidden = !value;
}

function showError(message) {
  catalogError.hidden = false;
  catalogError.textContent = message;
}

async function loadCatalog() {
  catalogError.hidden = true;
  deckList.innerHTML = "";
  refreshButton.disabled = true;

  try {
    const entries = await fetchJson("decks");
    const decks = entries
      .filter(function(item) {
        return item.type === "file" && item.name.toLowerCase().endsWith(".md");
      })
      .sort(function(a, b) {
        return a.name.localeCompare(b.name, "pl");
      });

    if (!decks.length) {
      showError("Brak plików .md w katalogu decks.");
      return;
    }

    decks.forEach(function(deck, index) {
      const id = deck.name.replace(/\.md$/i, "");
      const card = document.createElement("a");
      card.className = "deck-card";
      card.href = "?deck=" + encodeURIComponent(id);

      const number = document.createElement("span");
      number.className = "deck-number";
      number.textContent = "PREZENTACJA " + String(index + 1).padStart(2, "0");

      const title = document.createElement("h3");
      title.textContent = humanize(deck.name);

      const meta = document.createElement("p");
      meta.textContent = "Markdown · ładowana bezpośrednio z main";

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

async function loadDeck(deckId) {
  if (!/^[a-zA-Z0-9._-]+$/.test(deckId)) {
    throw new Error("Nieprawidłowa nazwa prezentacji.");
  }

  setLoading(true);
  try {
    const markdown = await fetchRaw("decks/" + deckId + ".md");
    const parts = splitSlides(markdown);

    slides.innerHTML = "";
    parts.forEach(function(source) {
      const section = document.createElement("section");
      section.innerHTML = marked.parse(source, { gfm: true, breaks: false });
      slides.appendChild(section);
    });

    catalog.hidden = true;
    deckView.hidden = false;
    homeLink.hidden = false;

    await Reveal.initialize({
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
      plugins: [ RevealMath.MathJax3 ],
      mathjax3: {
        mathjax: "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js",
        tex: {
          inlineMath: [["\\(", "\\)"], ["$", "$"]],
          displayMath: [["\\[", "\\]"], ["$$", "$$"]]
        }
      }
    });

    document.title = humanize(deckId) + " — Prezentacje";
  } finally {
    setLoading(false);
  }
}

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
      homeLink.hidden = true;
      showError("Nie udało się otworzyć prezentacji. " + error.message);
      await loadCatalog();
    }
  } else {
    await loadCatalog();
  }
})();
