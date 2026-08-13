(function () {
  const leadingNavItems = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
  ];

  const trailingNavItems = [
    { label: "FAQ", href: "faq.html" },
    { label: "Contact", href: "contact.html" },
  ];

  const servicesItems = [
    { label: "Fire Safety Plan & Training", href: "services.html#fire-safety-plan" },
    { label: "Fire Inspection Order Solutions", href: "services.html#inspection-order" },
    { label: "Fire Sprinkler Design", href: "services.html#sprinkler-design" },
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
      .map((item) => `<a href="${item.href}">${item.label}</a>`)
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
            <a class="nav-link nav-cta" href="contact.html?service=Fire%20Safety%20Plans%20%26%20Training">Get a Free Quote</a>
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
              <a href="faq.html">FAQ</a>
              <a href="contact.html">Contact</a>
            </nav>
          </section>
          <section class="footer-column" aria-labelledby="footer-services">
            <h3 id="footer-services">Services</h3>
            <nav class="footer-links" aria-label="Footer services navigation">
              <a href="services.html#fire-safety-plan">Fire Safety Plan &amp; Training</a>
              <a href="services.html#inspection-order">Fire Inspection Order Solutions</a>
              <a href="services.html#sprinkler-design">Fire Sprinkler Design</a>
            </nav>
          </section>
          <section class="footer-column" aria-labelledby="footer-email">
            <h3 id="footer-email">Contact</h3>
            <a href="mailto:info@stellarfpc.com">info@stellarfpc.com</a>
          </section>
          <div class="footer-bottom">&copy; Stellar Fire Protection &amp; Code Consulting. All rights reserved.</div>
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

    const serviceSelect = form.querySelector("[name='service']");
    const requestedService = new URLSearchParams(window.location.search).get("service");

    if (serviceSelect && requestedService) {
      const option = Array.from(serviceSelect.options).find((item) => item.value === requestedService || item.textContent === requestedService);

      if (option) {
        serviceSelect.value = option.value;
      }
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

  function bindShieldRotators() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    document.querySelectorAll("[data-shield-rotator]").forEach((rotator) => {
      const items = Array.from(rotator.querySelectorAll("span"));
      const interval = Math.max(Number(rotator.dataset.interval || 4000), 1400);
      let activeIndex = 0;
      let timerId = null;

      if (!items.length) {
        return;
      }

      function showItem(index) {
        activeIndex = (index + items.length) % items.length;
        items.forEach((item, itemIndex) => {
          item.classList.toggle("is-active", itemIndex === activeIndex);
        });
      }

      function stop() {
        if (!timerId) {
          return;
        }

        window.clearInterval(timerId);
        timerId = null;
      }

      function start() {
        if (items.length < 2 || reducedMotion.matches || timerId) {
          return;
        }

        timerId = window.setInterval(() => showItem(activeIndex + 1), interval);
      }

      function handleMotionPreferenceChange() {
        stop();
        if (reducedMotion.matches) {
          showItem(0);
        } else {
          start();
        }
      }

      rotator.classList.add("is-js-ready");
      showItem(0);
      start();

      rotator.addEventListener("mouseenter", stop);
      rotator.addEventListener("mouseleave", start);
      rotator.addEventListener("focusin", stop);
      rotator.addEventListener("focusout", (event) => {
        if (!rotator.contains(event.relatedTarget)) {
          start();
        }
      });

      if (typeof reducedMotion.addEventListener === "function") {
        reducedMotion.addEventListener("change", handleMotionPreferenceChange);
      } else if (typeof reducedMotion.addListener === "function") {
        reducedMotion.addListener(handleMotionPreferenceChange);
      }
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
  bindShieldRotators();
})();
