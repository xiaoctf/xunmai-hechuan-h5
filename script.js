const sections = [...document.querySelectorAll(".screen")];
const railDots = [...document.querySelectorAll(".rail-dot")];
const bottomLinks = [...document.querySelectorAll(".bottom-nav a")];

const navLinks = [...railDots, ...bottomLinks];

const setActive = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
  });
};

const scrollToHash = () => {
  const targetId = location.hash.slice(1);
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!target) return;
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "auto" });
  root.style.scrollBehavior = previousBehavior;
  setActive(targetId);
};

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActive(visible.target.id);
      document.title = `${visible.target.dataset.title}｜寻脉合川`;
    }
  },
  {
    threshold: [0.35, 0.55, 0.75],
  },
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${targetId}`);
    setActive(targetId);
  });
});

window.addEventListener("load", () => {
  setTimeout(scrollToHash, 120);
});

window.addEventListener("hashchange", () => {
  setTimeout(scrollToHash, 40);
});
