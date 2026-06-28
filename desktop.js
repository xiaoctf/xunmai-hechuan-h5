const desktopSections = [...document.querySelectorAll("main section[id]")];
const desktopLinks = [...document.querySelectorAll(".site-nav a")];

const setDesktopActive = (id) => {
  desktopLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
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

if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) {
    setTimeout(() => target.scrollIntoView({ block: "start" }), 80);
  }
}
