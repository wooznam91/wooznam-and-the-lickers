const root = document.documentElement;
const scenes = [...document.querySelectorAll("[data-scene]")];
const reveals = [...document.querySelectorAll("[data-reveal]")];
const coins = [...document.querySelectorAll(".coin:not(.coin--small)")];
const depthNumber = document.querySelector(".depth strong");
const masthead = document.querySelector(".masthead");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
const heroMemories = document.querySelector(".hero__memories");
const avatars = [...document.querySelectorAll("[data-avatar]")];
let frame = 0;

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const closeMenu = ({ returnFocus = false } = {}) => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  if (returnFocus) menuToggle.focus();
};

menuToggle?.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opening));
  navigation?.classList.toggle("is-open", opening);
  document.body.classList.toggle("nav-open", opening);
});

navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.classList.contains("is-open")) closeMenu({ returnFocus:true });
});

const loadHeroMemories = () => {
  if (!heroMemories || navigator.connection?.saveData || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const deferred = [...heroMemories.querySelectorAll("img[data-src]")];
  Promise.all(deferred.map((image) => new Promise((resolve) => {
    image.addEventListener("load", resolve, { once:true });
    image.addEventListener("error", resolve, { once:true });
    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  }))).then(() => heroMemories.classList.add("is-ready"));
};

window.addEventListener("load", () => {
  if ("requestIdleCallback" in window) requestIdleCallback(loadHeroMemories, { timeout:3000 });
  else setTimeout(loadHeroMemories, 1200);
}, { once:true });

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const tossCoin = (coin) => {
  coin.classList.remove("is-dragging", "is-tossing");
  coin.style.removeProperty("--coin-drag");
  coin.style.removeProperty("--coin-lift");
  void coin.offsetWidth;
  coin.classList.add("is-tossing");
};

coins.forEach((coin) => {
  let gesture = null;
  let suppressClickUntil = 0;

  coin.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    gesture = { id:event.pointerId, x:event.clientX, y:event.clientY };
    coin.classList.remove("is-tossing");
    coin.classList.add("is-grabbed");
    coin.setPointerCapture?.(event.pointerId);
  });

  coin.addEventListener("pointermove", (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (Math.abs(dx) < 4) return;
    coin.classList.add("is-dragging");
    coin.style.setProperty("--coin-drag", `${dx * 4.8}deg`);
    coin.style.setProperty("--coin-lift", `${-Math.min(22, Math.abs(dx) * .15)}px`);
    if (Math.abs(dx) > Math.abs(dy)) event.preventDefault();
  });

  const finishGesture = (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    const isSwipe = Math.abs(dx) >= 18 && Math.abs(dx) >= Math.abs(dy) * .75;
    const isTap = Math.hypot(dx, dy) < 9;
    gesture = null;
    coin.classList.remove("is-grabbed", "is-dragging");
    coin.releasePointerCapture?.(event.pointerId);
    if (isSwipe || isTap) {
      suppressClickUntil = performance.now() + 500;
      tossCoin(coin);
    } else {
      coin.style.removeProperty("--coin-drag");
      coin.style.removeProperty("--coin-lift");
    }
  };

  coin.addEventListener("pointerup", finishGesture);
  coin.addEventListener("pointercancel", (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    gesture = null;
    coin.classList.remove("is-grabbed", "is-dragging");
    coin.style.removeProperty("--coin-drag");
    coin.style.removeProperty("--coin-lift");
  });
  coin.addEventListener("click", (event) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  coin.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    tossCoin(coin);
  });
  coin.addEventListener("animationend", (event) => {
    if (event.animationName === "coin-swipe") coin.classList.remove("is-tossing");
  });
});

const resetAvatar = (avatar) => {
  avatar.style.setProperty("--avatar-rx", "0deg");
  avatar.style.setProperty("--avatar-ry", "0deg");
  avatar.style.setProperty("--avatar-scale", "1");
};

const spinAvatar = (avatar) => {
  avatar.classList.remove("is-spinning", "is-dragging");
  resetAvatar(avatar);
  void avatar.offsetWidth;
  avatar.classList.add("is-spinning");
};

avatars.forEach((avatar) => {
  let gesture = null;

  avatar.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    gesture = { id:event.pointerId, x:event.clientX, y:event.clientY };
    avatar.classList.remove("is-spinning");
    avatar.classList.add("is-dragging");
    avatar.setPointerCapture?.(event.pointerId);
  });

  avatar.addEventListener("pointermove", (event) => {
    if (gesture && event.pointerId === gesture.id) {
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      avatar.style.setProperty("--avatar-ry", `${Math.max(-58,Math.min(58,dx * .38))}deg`);
      avatar.style.setProperty("--avatar-rx", `${Math.max(-12,Math.min(12,-dy * .18))}deg`);
      avatar.style.setProperty("--avatar-scale", "1.025");
      if (Math.abs(dx) > Math.abs(dy)) event.preventDefault();
      return;
    }
    if (event.pointerType !== "mouse") return;
    const rect = avatar.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    avatar.style.setProperty("--avatar-ry", `${x * 18}deg`);
    avatar.style.setProperty("--avatar-rx", `${y * -12}deg`);
  });

  const finishAvatarGesture = (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    const shouldSpin = Math.hypot(dx,dy) < 10 || (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy) * .75);
    gesture = null;
    avatar.releasePointerCapture?.(event.pointerId);
    avatar.classList.remove("is-dragging");
    if (shouldSpin) spinAvatar(avatar);
    else resetAvatar(avatar);
  };

  avatar.addEventListener("pointerup", finishAvatarGesture);
  avatar.addEventListener("pointercancel", () => {
    gesture = null;
    avatar.classList.remove("is-dragging");
    resetAvatar(avatar);
  });
  avatar.addEventListener("pointerleave", () => {
    if (!gesture && !avatar.classList.contains("is-spinning")) resetAvatar(avatar);
  });
  avatar.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    spinAvatar(avatar);
  });
  avatar.addEventListener("animationend", (event) => {
    if (event.animationName === "avatar-spin") avatar.classList.remove("is-spinning");
  });
});

const update = () => {
  frame = 0;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  root.style.setProperty("--progress", clamp(window.scrollY / maxScroll).toFixed(4));
  const curtainShift = clamp(window.scrollY / (window.innerHeight * .72));
  root.style.setProperty("--curtain-drift", `${(curtainShift * Math.min(window.innerWidth * .045, 44)).toFixed(2)}px`);
  masthead?.classList.toggle("is-scrolled", window.scrollY > 44);

  const marker = window.innerHeight * 0.5;
  let active = "00";

  scenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom >= marker) active = scene.dataset.label || active;
  });

  if (depthNumber && depthNumber.textContent !== active) depthNumber.textContent = active;
};

const requestUpdate = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
window.addEventListener("resize", () => {
  if (window.innerWidth > 680 && navigation?.classList.contains("is-open")) closeMenu();
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -6%" });
  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

update();
