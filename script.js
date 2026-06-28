const sections = [...document.querySelectorAll(".screen")];
const railDots = [...document.querySelectorAll(".rail-dot")];
const bottomLinks = [...document.querySelectorAll(".bottom-nav a")];
const bottomNav = document.querySelector(".bottom-nav");
let lockedTargetId = null;
let unlockTimer = null;

const bottomKeyBySection = {
  home: "home",
  intro: "home",
  heritage: "home",
  artisan: "home",
  craft: "home",
  route: "route",
  product: "product",
  creative: "product",
  credits: "survey",
  survey: "survey",
};

const setActive = (id) => {
  railDots.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
  });

  const bottomKey = bottomKeyBySection[id] || "home";
  const activeIndex = Math.max(
    0,
    bottomLinks.findIndex((link) => link.getAttribute("href") === `#${bottomKey}`),
  );

  bottomLinks.forEach((link, index) => {
    const isActive = index === activeIndex;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  bottomNav?.style.setProperty("--active-index", activeIndex);
};

const lockActiveUntilTarget = (id) => {
  lockedTargetId = id;
  window.clearTimeout(unlockTimer);
  unlockTimer = window.setTimeout(() => {
    lockedTargetId = null;
  }, 1100);
};

const releaseActiveLock = () => {
  lockedTargetId = null;
  window.clearTimeout(unlockTimer);
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
  lockActiveUntilTarget(targetId);
  setActive(targetId);
  document.title = `${target.dataset.title}｜寻脉合川`;
};

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      if (lockedTargetId && visible.target.id !== lockedTargetId) {
        return;
      }
      if (lockedTargetId === visible.target.id) {
        releaseActiveLock();
      }
      setActive(visible.target.id);
      document.title = `${visible.target.dataset.title}｜寻脉合川`;
    }
  },
  {
    threshold: [0.35, 0.55, 0.75],
  },
);

sections.forEach((section) => observer.observe(section));

setActive(location.hash.slice(1) || "home");

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    lockActiveUntilTarget(targetId);
    setActive(targetId);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${targetId}`);
  });
});

bottomLinks.forEach((link) => {
  link.addEventListener("pointerdown", () => link.classList.add("is-pressing"));
  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    link.addEventListener(eventName, () => link.classList.remove("is-pressing"));
  });
});

window.addEventListener("load", () => {
  setTimeout(scrollToHash, 120);
});

window.addEventListener("hashchange", () => {
  setTimeout(scrollToHash, 40);
});
