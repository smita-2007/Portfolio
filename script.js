(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");

  const roles = [
    "Full-Stack Developer",
    "Software Engineer",
    "Prompt Engineer",
    "Open-Source Contributor"
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const header = $("#siteHeader");
  const scrollProgress = $("#scrollProgress");
  const cursorGlow = $("#cursorGlow");
  const roleRotator = $("#roleRotator");
  const backToTop = $("#backToTop");
  const profileCard = $("#profileCard");
  const year = $("#year");

  if (year) year.textContent = new Date().getFullYear();

  const closeMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    $$(".nav-menu a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1040) closeMenu();
    }, { passive: true });
  }

  if (roleRotator && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let roleIndex = 0;

    window.setInterval(() => {
      roleRotator.classList.add("switching");

      window.setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleRotator.textContent = roles[roleIndex];
        roleRotator.classList.remove("switching");
      }, 260);
    }, 2200);
  }

  const revealElements = $$(".reveal");
  if ("IntersectionObserver" in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;
          const finalValue = Number(target.dataset.count || 0);
          const duration = finalValue > 100 ? 1300 : 850;
          const start = performance.now();

          const animateCount = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(finalValue * eased);

            target.textContent = finalValue === 2028 ? String(current) : `${current}+`;

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              target.textContent = finalValue === 2028 ? "2028" : `${finalValue}+`;
            }
          };

          requestAnimationFrame(animateCount);
          observer.unobserve(target);
        });
      },
      { threshold: 0.7 }
    );

    counters.forEach((element) => countObserver.observe(element));
  }

  let ticking = false;

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = (scrollTop / docHeight) * 100;

    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    if (header) header.classList.toggle("scrolled", scrollTop > 18);
    if (backToTop) backToTop.classList.toggle("show", scrollTop > 650);

    const sections = $$("main section[id]");
    const navLinks = $$(".nav-menu a");
    let current = "home";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 170;
      if (scrollTop >= sectionTop) current = section.id;
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });

  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (cursorGlow && canHover && !reducedMotion) {
    let glowX = 0;
    let glowY = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorGlow.style.opacity = "1";
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      cursorGlow.style.opacity = "0";
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.14;
      glowY += (targetY - glowY) * 0.14;
      cursorGlow.style.transform = `translate3d(${glowX - 160}px, ${glowY - 160}px, 0)`;
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  if (canHover && !reducedMotion) {
    $$(".magnetic").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });

    if (profileCard) {
      profileCard.addEventListener("pointermove", (event) => {
        const rect = profileCard.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 14;
        const rotateX = ((y / rect.height) - 0.5) * -14;
        profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      profileCard.addEventListener("pointerleave", () => {
        profileCard.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    }
  }
})();
