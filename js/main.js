const GITHUB_USER = "antonioalvescarvalho3322-max";

// Cores das linguagens mais comuns (mesmas do GitHub)
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  PHP: "#4F5D95",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
};

/* ===== Tema claro/escuro ===== */
const root = document.documentElement;

function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // armazenamento indisponível: apenas não lembra a escolha
  }
}

const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
root.setAttribute("data-theme", getSavedTheme() || (prefersLight ? "light" : "dark"));

document.querySelector(".theme-toggle").addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
});

/* ===== Menu mobile ===== */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

/* ===== Link ativo no menu conforme a rolagem ===== */
const sections = document.querySelectorAll("main section[id]");
const menuLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      menuLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ===== Animação de entrada ===== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

function observeReveal(elements) {
  elements.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

observeReveal(document.querySelectorAll(".section-header, .project-card, .contact-card"));

/* ===== Repositórios do GitHub ===== */
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderRepo(repo) {
  const card = document.createElement("a");
  card.className = "repo-card";
  card.href = repo.html_url;
  card.target = "_blank";
  card.rel = "noopener";

  const lang = repo.language
    ? `<span class="repo-lang" style="--lang-color:${LANG_COLORS[repo.language] || "var(--primary)"}">${escapeHTML(repo.language)}</span>`
    : "";

  card.innerHTML = `
    <h3>📁 ${escapeHTML(repo.name)}</h3>
    <p>${escapeHTML(repo.description || "Sem descrição.")}</p>
    <div class="repo-meta">
      ${lang}
      <span>⭐ ${repo.stargazers_count}</span>
      <span>Atualizado em ${formatDate(repo.pushed_at)}</span>
    </div>
  `;
  return card;
}

async function loadRepos() {
  const grid = document.getElementById("repos-grid");

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=100`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const repos = (await res.json()).filter((r) => !r.fork);
    grid.innerHTML = "";

    if (repos.length === 0) {
      grid.innerHTML = '<p class="repos-status">Nenhum repositório público encontrado.</p>';
      return;
    }

    const cards = repos.map(renderRepo);
    grid.append(...cards);
    observeReveal(cards);
  } catch (err) {
    console.error("Erro ao carregar repositórios:", err);
    grid.innerHTML = `
      <p class="repos-status">
        Não foi possível carregar os repositórios agora.
        <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener" style="color:var(--primary)">Veja direto no GitHub ↗</a>
      </p>`;
  }
}

loadRepos();

/* ===== Ano no rodapé ===== */
document.getElementById("year").textContent = new Date().getFullYear();
