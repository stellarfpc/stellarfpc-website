(function () {
  const leadingNavItems = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
  ];

  const trailingNavItems = [
    { label: "Contact", href: "contact.html" },
  ];

  const servicesItems = [
    "Fire Sprinkler System Design",
    "Fire Safety Plans & Training",
    "Fire Code Consulting",
    "Fire Inspection Order Support",
  ];

  const projectsItems = [
    "Healthcare",
    "Commercial",
    "Industrial",
    "Residential",
    "Institutional",
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

    const projectsMenu = projectsItems
      .map((label) => `<a href="projects.html">${label}</a>`)
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
            <div class="nav-dropdown">
              <button class="dropdown-toggle" type="button" aria-expanded="false">Projects</button>
              <div class="dropdown-menu">
                ${projectsMenu}
              </div>
            </div>
            ${trailingLinks}
            <a class="nav-link nav-cta" href="contact.html">Request a Consultation</a>
          </nav>
        </div>
      </header>
    `;
  }

  function renderFooter(target) {
    const year = new Date().getFullYear();

    target.innerHTML = `
      <footer class="site-footer">
        <div class="footer-shell">
          <section class="footer-column" aria-labelledby="footer-contact">
            <img class="footer-brand-logo" src="assets/images/stellarfpc-logo-horizontal.png" alt="StellarFPC">
            <h2 id="footer-contact">Contact</h2>
            <p>Fire protection engineering and code consulting support throughout Ontario.</p>
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
              <a href="services.html">Sprinkler Design</a>
              <a href="services.html">Fire Safety Plans</a>
              <a href="services.html">Code Consulting</a>
              <a href="services.html">Inspection Order Support</a>
            </nav>
          </section>
          <section class="footer-column" aria-labelledby="footer-email">
            <h3 id="footer-email">Email</h3>
            <a href="mailto:info@stellarfpc.com">info@stellarfpc.com</a>
          </section>
          <div class="footer-bottom">&copy; ${year} StellarFPC. All rights reserved.</div>
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

  document.querySelectorAll("[data-component='site-header']").forEach(renderHeader);
  document.querySelectorAll("[data-component='site-footer']").forEach(renderFooter);
  bindNavigation();
  bindDropdowns();
  bindHeaderScrollState();
  bindRevealAnimation();
})();
