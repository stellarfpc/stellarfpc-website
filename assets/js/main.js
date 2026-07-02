(function () {
  const leadingNavItems = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
  ];

  const trailingNavItems = [
    { label: "Projects", href: "projects.html" },
    { label: "Contact", href: "contact.html" },
  ];

  const servicesItems = [
    "Fire Sprinkler System Design",
    "Fire Safety Plans & Training",
    "Fire Code Compliance & Inspection Order Solutions",
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  function renderHeader(target) {
    const leadingLinks = leadingNavItems
      .map((item) => {
        const current = item.href === currentPage ? ' aria-current="page"' : "";
        return `<a class="nav-link" href="${item.href}"${current}>${item.label}</a>`;
      })
      .join("");

    const trailingLinks = trailingNavItems
      .map((item) => {
        const current = item.href === currentPage ? ' aria-current="page"' : "";
        return `<a class="nav-link" href="${item.href}"${current}>${item.label}</a>`;
      })
      .join("");

    const servicesMenu = servicesItems
      .map((label) => `<a href="services.html">${label}</a>`)
      .join("");

    target.innerHTML = `
      <header class="site-header">
        <div class="nav-shell">
          <a class="brand" href="index.html" aria-label="StellarFPC home">
            <img class="brand-logo" src="assets/images/stellarfpc-logo-horizontal.png" alt="StellarFPC">
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
            <span class="nav-toggle-lines" aria-hidden="true"></span>
            <span class="visually-hidden">Menu</span>
          </button>
          <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation">
            ${leadingLinks}
            <div class="nav-dropdown">
              <button class="dropdown-toggle" type="button" aria-expanded="false">Services</button>
              <div class="dropdown-menu">
                ${servicesMenu}
              </div>
            </div>
            ${trailingLinks}
            <a class="nav-link nav-cta" href="contact.html">Request Consultation</a>
          </nav>
        </div>
      </header>
    `;
  }

  function renderFooter(target) {
    target.innerHTML = `
      <footer class="site-footer">
        <div class="footer-shell">
          <section class="footer-column" aria-labelledby="footer-contact">
            <img class="footer-brand-logo" src="assets/images/stellarfpc-logo-horizontal.png" alt="StellarFPC">
            <h2 id="footer-contact">StellarFPC</h2>
            <p>Fire protection engineering and code consulting solutions across Ontario.</p>
          </section>
          <section class="footer-column" aria-labelledby="footer-links">
            <h3 id="footer-links">Quick Links</h3>
            <nav class="footer-links" aria-label="Footer navigation">
              <a href="index.html">Home</a>
              <a href="about.html">About</a>
              <a href="services.html">Services</a>
              <a href="projects.html">Projects</a>
              <a href="contact.html">Contact</a>
            </nav>
          </section>
          <section class="footer-column" aria-labelledby="footer-services">
            <h3 id="footer-services">Services</h3>
            <nav class="footer-links" aria-label="Footer services navigation">
              <a href="services.html">Fire Sprinkler System Design</a>
              <a href="services.html">Fire Safety Plans &amp; Training</a>
              <a href="services.html">Fire Code Compliance &amp; Inspection Order Solutions</a>
            </nav>
          </section>
          <section class="footer-column" aria-labelledby="footer-experience">
            <h3 id="footer-experience">Projects</h3>
            <nav class="footer-links" aria-label="Footer projects navigation">
              <a href="projects.html">Projects</a>
            </nav>
          </section>
          <section class="footer-column" aria-labelledby="footer-email">
            <h3 id="footer-email">Contact</h3>
            <a href="mailto:info@stellarfpc.com">info@stellarfpc.com</a>
          </section>
          <div class="footer-bottom">&copy; 2022 Stellar Fire Protection &amp; Code Consulting. All rights reserved.</div>
        </div>
      </footer>
    `;
  }

  function bindNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".primary-nav");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
  }

  function bindDropdowns() {
    document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
      const dropdown = toggle.closest(".nav-dropdown");

      if (!dropdown) {
        return;
      }

      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        dropdown.classList.toggle("is-open", !expanded);
      });
    });
  }

  function bindHeaderScrollState() {
    const header = document.querySelector(".site-header");

    if (!header) {
      return;
    }

    function updateHeaderState() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  function bindRevealAnimation() {
    const elements = document.querySelectorAll(".reveal-on-scroll");

    if (!elements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function bindContactForm() {
    const form = document.querySelector("[data-contact-form]");

    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const lines = [
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Phone: ${data.get("phone") || ""}`,
        `Company / Organization: ${data.get("company") || ""}`,
        `Building Address: ${data.get("buildingAddress") || ""}`,
        `Service Needed: ${data.get("service") || ""}`,
        "",
        "Message:",
        data.get("message") || "",
      ];

      const subject = encodeURIComponent("StellarFPC Consultation Request");
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:info@stellarfpc.com?subject=${subject}&body=${body}`;
    });
  }

  function bindCarousels() {
    const carousels = document.querySelectorAll("[data-carousel]");

    if (!carousels.length) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    carousels.forEach((carousel) => {
      let timerId = null;
      let isPaused = false;

      function getStepSize() {
        const firstCard = carousel.firstElementChild;

        if (!firstCard) {
          return carousel.clientWidth;
        }

        const styles = window.getComputedStyle(carousel);
        const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
        return firstCard.getBoundingClientRect().width + gap;
      }

      function advanceCarousel() {
        if (isPaused || reducedMotion.matches || carousel.scrollWidth <= carousel.clientWidth) {
          return;
        }

        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        const nextScrollLeft = carousel.scrollLeft >= maxScrollLeft - 4 ? 0 : Math.min(carousel.scrollLeft + getStepSize(), maxScrollLeft);

        carousel.scrollTo({
          left: nextScrollLeft,
          behavior: "smooth",
        });
      }

      function startCarousel() {
        if (reducedMotion.matches || timerId) {
          return;
        }

        timerId = window.setInterval(advanceCarousel, 5000);
      }

      function stopCarousel() {
        if (!timerId) {
          return;
        }

        window.clearInterval(timerId);
        timerId = null;
      }

      function pauseCarousel() {
        isPaused = true;
        stopCarousel();
      }

      function resumeCarousel() {
        isPaused = false;
        startCarousel();
      }

      carousel.addEventListener("mouseenter", pauseCarousel);
      carousel.addEventListener("mouseleave", resumeCarousel);
      carousel.addEventListener("focusin", pauseCarousel);
      carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
          resumeCarousel();
        }
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopCarousel();
        } else if (!isPaused) {
          startCarousel();
        }
      });

      if (typeof reducedMotion.addEventListener === "function") {
        reducedMotion.addEventListener("change", () => {
          if (reducedMotion.matches) {
            stopCarousel();
          } else if (!isPaused) {
            startCarousel();
          }
        });
      }

      startCarousel();
    });
  }

  function bindServiceCarousels() {
    const carousels = document.querySelectorAll("[data-service-carousel]");

    if (!carousels.length) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    carousels.forEach((carousel) => {
      const slides = Array.from(carousel.querySelectorAll("[data-service-slide]"));
      const dots = Array.from(carousel.querySelectorAll("[data-service-dot]"));
      const previousButton = carousel.querySelector("[data-service-prev]");
      const nextButton = carousel.querySelector("[data-service-next]");
      const interval = Number(carousel.dataset.interval || 6000);
      let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
      let timerId = null;
      let isPaused = false;

      if (slides.length <= 1) {
        return;
      }

      function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
          const active = slideIndex === activeIndex;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", String(!active));
        });

        dots.forEach((dot, dotIndex) => {
          const active = dotIndex === activeIndex;
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-selected", String(active));
          dot.tabIndex = active ? 0 : -1;
        });
      }

      function stopCarousel() {
        if (!timerId) {
          return;
        }

        window.clearInterval(timerId);
        timerId = null;
      }

      function startCarousel() {
        if (reducedMotion.matches || isPaused || timerId) {
          return;
        }

        timerId = window.setInterval(() => showSlide(activeIndex + 1), interval);
      }

      function pauseCarousel() {
        isPaused = true;
        stopCarousel();
      }

      function resumeCarousel() {
        isPaused = false;
        startCarousel();
      }

      previousButton?.addEventListener("click", () => {
        showSlide(activeIndex - 1);
        stopCarousel();
        startCarousel();
      });

      nextButton?.addEventListener("click", () => {
        showSlide(activeIndex + 1);
        stopCarousel();
        startCarousel();
      });

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          showSlide(index);
          stopCarousel();
          startCarousel();
        });
      });

      carousel.addEventListener("mouseenter", pauseCarousel);
      carousel.addEventListener("mouseleave", resumeCarousel);
      carousel.addEventListener("focusin", pauseCarousel);
      carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
          resumeCarousel();
        }
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopCarousel();
        } else {
          startCarousel();
        }
      });

      if (typeof reducedMotion.addEventListener === "function") {
        reducedMotion.addEventListener("change", () => {
          if (reducedMotion.matches) {
            stopCarousel();
            showSlide(activeIndex);
          } else {
            startCarousel();
          }
        });
      }

      showSlide(activeIndex);
      startCarousel();
    });
  }

  document.querySelectorAll("[data-component='site-header']").forEach(renderHeader);
  document.querySelectorAll("[data-component='site-footer']").forEach(renderFooter);
  bindNavigation();
  bindDropdowns();
  bindHeaderScrollState();
  bindRevealAnimation();
  bindContactForm();
  bindCarousels();
  bindServiceCarousels();
})();


document.querySelectorAll("[data-project-rotator]").forEach((rotator) => {
  const slides = Array.from(rotator.querySelectorAll(".project-type-slide"));
  const dotsWrap = rotator.querySelector(".project-rotator-dots");
  const prev = rotator.querySelector(".project-rotator-btn.prev");
  const next = rotator.querySelector(".project-rotator-btn.next");
  const interval = Number(rotator.dataset.interval || 8000);

  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let timer = null;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show project type ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index, true));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll("button"));

  function showSlide(index, userAction = false) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });

    if (userAction) restart();
  }

  function nextSlide() {
    showSlide(current + 1);
  }

  function start() {
    if (prefersReducedMotion) return;
    stop();
    timer = window.setInterval(nextSlide, interval);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function restart() {
    stop();
    start();
  }

  prev?.addEventListener("click", () => showSlide(current - 1, true));
  next?.addEventListener("click", () => showSlide(current + 1, true));

  rotator.addEventListener("mouseenter", stop);
  rotator.addEventListener("mouseleave", start);
  rotator.addEventListener("focusin", stop);
  rotator.addEventListener("focusout", start);

  showSlide(0);
  start();
});