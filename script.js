const caseFiles = {
  sarajevo: {
    meta: "Case 01 / Sarajevo / June 1914",
    title: "Sarajevo",
    lede: "An assassination assembled from nationalism, adolescence, imperial pageantry and a sequence of accidents no novelist would dare invent.",
    trouble:
      "Gavrilo Princip and his fellow conspirators wait along the Archduke’s route. The first attempt fails. The motorcade takes a wrong turn. History, having briefly escaped, reverses back towards the gun.",
    people: [
      "Gavrilo Princip, student and assassin",
      "Franz Ferdinand, heir to an empire",
      "Sophie, Duchess of Hohenberg",
      "A sandwich of disputed historical standing",
    ],
    note: "Outcome: two deaths, one world war and a century of consequences.",
  },
  annie: {
    meta: "Case 02 / Ireland & Liverpool / Nineteenth century",
    title: "Annie’s Ghost",
    lede: "A woman emerges from the ledgers: daughter of a man confined for criminal insanity, survivor of poverty, migration and the judgements of polite society.",
    trouble:
      "The official record gives us baptisms, arrests and an indefinite incarceration at the Lord Lieutenant’s pleasure. Everything human must be recovered from the spaces in between.",
    people: [
      "Annie King, ancestor and enigma",
      "Felix King, father and reluctant resident of the state",
      "Thomas Boyle, miner and vanished groom",
      "Several unusually diligent Catholic clerks",
    ],
    note: "Evidence: prison records, parish registers, family testimony and one persistent ghost.",
  },
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const dialog = document.querySelector(".case-file");
const closeDialog = document.querySelector(".case-file__close");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 32);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav?.classList.toggle("is-open", !isOpen);
  document.body.style.overflow = isOpen ? "" : "hidden";
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    document.body.style.overflow = "";
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const fillCaseFile = (key) => {
  const item = caseFiles[key];
  if (!item || !dialog) return;

  dialog.querySelector("[data-case-meta]").textContent = item.meta;
  dialog.querySelector("[data-case-title]").textContent = item.title;
  dialog.querySelector("[data-case-lede]").textContent = item.lede;
  dialog.querySelector("[data-case-trouble]").textContent = item.trouble;
  dialog.querySelector("[data-case-note]").textContent = item.note;

  const people = dialog.querySelector("[data-case-people]");
  people.replaceChildren(
    ...item.people.map((person) => {
      const li = document.createElement("li");
      li.textContent = person;
      return li;
    }),
  );

  dialog.showModal();
};

document.querySelectorAll(".case-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => fillCaseFile(trigger.dataset.case));
});

closeDialog?.addEventListener("click", () => dialog.close());

dialog?.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const isBackdrop =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;
  if (isBackdrop) dialog.close();
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const heroImage = document.querySelector(".hero__image");
const heroContent = document.querySelector(".hero__content");
const processionAct = document.querySelector(".procession__act");
const actSections = [...document.querySelectorAll("[data-act-label]")];
const driftingVisuals = [...document.querySelectorAll(".story__visual img, .interlude img, .about__portrait img")];
let scrollFrame = 0;

const animatePage = () => {
  scrollFrame = 0;
  const pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const pageProgress = Math.min(Math.max(window.scrollY / pageHeight, 0), 1);
  root.style.setProperty("--page-progress", pageProgress.toFixed(4));

  if (motionAllowed) {
    const heroProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    root.style.setProperty("--hero-progress", heroProgress.toFixed(4));
    if (heroImage) heroImage.style.setProperty("--hero-drift", `${window.scrollY * 0.11}px`);
    if (heroContent) heroContent.style.setProperty("--hero-lift", `${window.scrollY * -0.055}px`);

    driftingVisuals.forEach((image) => {
      const rect = image.getBoundingClientRect();
      const centreOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const drift = Math.max(-28, Math.min(28, centreOffset * -0.035));
      image.style.setProperty("--image-drift", `${drift.toFixed(1)}px`);
    });
  }

  const marker = window.innerHeight * 0.46;
  let activeLabel = "Entrance";
  actSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) activeLabel = section.dataset.actLabel;
  });
  if (processionAct && processionAct.textContent !== activeLabel) processionAct.textContent = activeLabel;
};

const requestPageAnimation = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(animatePage);
};

animatePage();
window.addEventListener("scroll", requestPageAnimation, { passive: true });
window.addEventListener("resize", requestPageAnimation);
