const desktopSections = [...document.querySelectorAll("main section[id]")];
const desktopLinks = [...document.querySelectorAll(".site-nav a")];
const headerOffset = 72;

const setDesktopActive = (id) => {
  desktopLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
};

const getSectionForTarget = (target) => target.closest("main section[id]") || target;

const scrollToDesktopTarget = (target, behavior = "smooth") => {
  const section = getSectionForTarget(target);
  const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior });
  setDesktopActive(section.id);
  document.title = `${section.querySelector("h1,h2")?.textContent || "寻脉合川"}｜桌面端`;
};

const desktopObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      setDesktopActive(visible.target.id);
      document.title = `${visible.target.querySelector("h1,h2")?.textContent || "寻脉合川"}｜桌面端`;
    }
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.3, 0.5] },
);

desktopSections.forEach((section) => desktopObserver.observe(section));

document.querySelectorAll('a[href^="#"]:not([data-product-link])').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    event.preventDefault();
    scrollToDesktopTarget(target, "smooth");
    history.replaceState(null, "", `#${target.id}`);
  });
});

const scrollToHash = () => {
  if (!location.hash) return;
  const target = document.getElementById(location.hash.slice(1));
  if (target) {
    setTimeout(() => scrollToDesktopTarget(target, "auto"), 40);
  }
};

window.addEventListener("load", scrollToHash);
window.addEventListener("hashchange", scrollToHash);
