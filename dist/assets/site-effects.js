const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header, .portal-header");

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (!reduceMotion) {
  document.documentElement.classList.add("motion-ready");

  const revealTargets = document.querySelectorAll(
    ".intro-copy, .facts, .section-heading, .stay-card, .breakfast-photo, .breakfast-copy, .rating-summary, .review-card, .visit-copy, .map-wrap, .page-hero .shell, .detail-grid, .admin-header, .panel",
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealTargets.forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
    observer.observe(element);
  });

  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      hero.style.setProperty("--glow-x", `${x}%`);
      hero.style.setProperty("--glow-y", `${y}%`);
    });

    let queued = false;
    const parallax = () => {
      hero.style.setProperty("--hero-parallax", `${Math.min(window.scrollY * 0.035, 26)}px`);
      queued = false;
    };

    window.addEventListener("scroll", () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(parallax);
    }, { passive: true });
  }
}
