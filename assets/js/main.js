(function () {
  const navItems = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Services", href: "services.html" },
    { label: "Projects", href: "projects.html" },
    { label: "Contact", href: "contact.html" },
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  function renderHeader(target) {
    const links = navItems
      .map((item) => {
        const current = item.href === currentPage ? ' aria-current="page"' : "";
        return `<a class="nav-link" href="${item.href}"${current}>${item.label}</a>`;
      })
      .join("");

    target.innerHTML = `
      <header class="site-header">
        <div class="nav-shell">
          <a class="brand" href="index.html" aria-label="StellarFPC home">
            <span class="brand-mark" aria-hidden="true">SF</span>
            <span>StellarFPC</span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
            <span class="nav-toggle-lines" aria-hidden="true"></span>
            <span class="visually-hidden">Menu</span>
          </button>
          <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation">
            ${links}
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
          <span>&copy; ${year} StellarFPC. All rights reserved.</span>
          <nav class="footer-links" aria-label="Footer navigation">
            <a href="about.html">About</a>
            <a href="services.html">Services</a>
            <a href="projects.html">Projects</a>
            <a href="contact.html">Contact</a>
          </nav>
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

  document.querySelectorAll("[data-component='site-header']").forEach(renderHeader);
  document.querySelectorAll("[data-component='site-footer']").forEach(renderFooter);
  bindNavigation();
})();
