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

document.querySelectorAll(".section-header, .project-card, .contact-card").forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

/* ===== Ano no rodapé ===== */
document.getElementById("year").textContent = new Date().getFullYear();
