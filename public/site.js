const pages = [
  { title: 'Home', url: 'index.html', description: 'The literary travel journal' },
  { title: 'Journal', url: 'journal.html', description: 'Dispatches, newest first' },
  { title: 'About Rachel', url: 'about.html', description: 'Meet the girl in a bookstore' },
  { title: 'Travel', url: 'travel.html', description: 'Bookstores, post offices, and places' },
  { title: 'Cuisine', url: 'cuisine.html', description: 'Tables and tastes along the way' },
  { title: 'Books', url: 'books.html', description: 'Reading notes and beautiful editions' },
  { title: 'Videos', url: 'videos.html', description: 'Watch the journey unfold' },
  { title: 'Fashion', url: 'fashion.html', description: 'A traveling wardrobe' },
];

const icons = {
  search: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>',
  menu: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h18M3 17h18"></path></svg>',
  close: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m5 5 14 14M19 5 5 19"></path></svg>',
};

function currentPage() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  return file || 'index.html';
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const active = currentPage();
    const nav = pages.map((page) => `
      <li><a href="${page.url}" ${active === page.url ? 'aria-current="page"' : ''}>${page.title.replace(' Rachel', '')}</a></li>
    `).join('');

    this.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header" data-header>
        <div class="header-note">Literary travel · books, places &amp; the stories between</div>
        <div class="shell masthead">
          <div class="masthead-meta">A journal by Rachel Reynolds</div>
          <a class="brand" href="index.html" aria-label="Girl in a Bookstore, home">
            <span class="brand-kicker">Literary travel journal</span>
            <span class="brand-name">Girl in a Bookstore</span>
          </a>
          <div class="header-actions">
            <button class="icon-button search-button" type="button" aria-label="Open search">${icons.search}</button>
            <button class="icon-button menu-button" type="button" aria-label="Open menu" aria-expanded="false">${icons.menu}</button>
          </div>
        </div>
        <nav class="desktop-nav" aria-label="Main navigation">
          <div class="shell"><ul>${nav}</ul></div>
        </nav>
      </header>
      <div class="mobile-panel" aria-hidden="true">
        <button class="icon-button mobile-close" type="button" aria-label="Close menu">${icons.close}</button>
        <nav aria-label="Mobile navigation"><ul>${nav}</ul></nav>
        <button class="button button--light mobile-search" type="button">Search the journal</button>
      </div>
      <dialog class="search-dialog" aria-label="Search the journal">
        <div class="dialog-inner">
          <button class="icon-button dialog-close" type="button" aria-label="Close search">${icons.close}</button>
          <p class="eyebrow">Find your way</p>
          <h2 class="dialog-title">Search the journal</h2>
          <input class="search-field" type="search" placeholder="Try “books” or “Rachel”" aria-label="Search pages">
          <ul class="search-results" aria-live="polite"></ul>
        </div>
      </dialog>
    `;

    const header = this.querySelector('[data-header]');
    window.addEventListener('scroll', () => header.classList.toggle('is-stuck', window.scrollY > 180), { passive: true });

    const panel = this.querySelector('.mobile-panel');
    const menuButton = this.querySelector('.menu-button');
    const setMenu = (open) => {
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      menuButton.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    };
    menuButton.addEventListener('click', () => setMenu(true));
    this.querySelector('.mobile-close').addEventListener('click', () => setMenu(false));
    panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

    const dialog = this.querySelector('.search-dialog');
    const field = this.querySelector('.search-field');
    const results = this.querySelector('.search-results');
    const renderResults = (query = '') => {
      const term = query.trim().toLowerCase();
      const matches = pages.filter((page) => `${page.title} ${page.description}`.toLowerCase().includes(term));
      results.innerHTML = (matches.length ? matches : pages).map((page) => `
        <li><a href="${page.url}"><span>${page.title}</span><small>${page.description}</small></a></li>
      `).join('');
    };
    const openSearch = () => {
      setMenu(false);
      renderResults();
      dialog.showModal();
      setTimeout(() => field.focus(), 30);
    };
    this.querySelectorAll('.search-button, .mobile-search').forEach((button) => button.addEventListener('click', openSearch));
    this.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    field.addEventListener('input', () => renderResults(field.value));
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="shell footer-main">
          <div>
            <div class="footer-brand">Girl in a<br>Bookstore</div>
            <p class="footer-tagline">If there’s a book or a letter in a faraway place, Rachel will find it.</p>
          </div>
          <div>
            <p class="footer-heading">Explore</p>
            <ul class="footer-links">
              <li><a href="journal.html">Journal</a></li>
              <li><a href="about.html">About Rachel</a></li>
              <li><a href="travel.html">Travel</a></li>
              <li><a href="books.html">Books</a></li>
              <li><a href="videos.html">Videos</a></li>
            </ul>
          </div>
          <div>
            <p class="footer-heading">Follow along</p>
            <ul class="footer-links">
              <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube</a></li>
              <li><a href="#newsletter">Mailing list</a></li>
            </ul>
          </div>
        </div>
        <div class="shell footer-bottom">
          <span>© <span data-year></span> Girl in a Bookstore</span>
          <span>Made for the curious, the bookish, and the faraway-minded.</span>
        </div>
      </footer>
    `;
    this.querySelector('[data-year]').textContent = new Date().getFullYear();
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);

const toast = document.createElement('div');
toast.className = 'toast';
toast.setAttribute('role', 'status');
document.body.appendChild(toast);
let toastTimer;
let revealObserver;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
}

function initializePage() {
  document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = form.querySelector('input[type="email"]');
      const status = form.querySelector('.form-status');
      if (!email.checkValidity()) {
        email.reportValidity();
        return;
      }
      status.textContent = 'You’re on the list — welcome to the journey.';
      showToast('Thanks for joining Rachel’s mailing list.');
      form.reset();
    });
  });

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      showToast('Thanks — your note is ready for Rachel. Connect this form to your inbox before launch.');
      form.reset();
    });
  });

  document.querySelectorAll('[data-coming-soon]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('This dispatch is on Rachel’s writing desk. Join the mailing list for first notice.');
    });
  });

  const videoDialog = document.querySelector('[data-video-dialog]');
  if (videoDialog) {
    document.querySelectorAll('[data-play-video]').forEach((button) => button.addEventListener('click', () => videoDialog.showModal()));
    videoDialog.querySelector('[data-close-video]').addEventListener('click', () => videoDialog.close());
    videoDialog.addEventListener('click', (event) => {
      if (event.target === videoDialog) videoDialog.close();
    });
  }

  revealObserver?.disconnect();
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }
}

function pageFile(url) {
  return url.pathname.split('/').pop() || 'index.html';
}

function isJournalPage(url) {
  return url.origin === window.location.origin && pages.some((page) => page.url === pageFile(url));
}

function closeTransientUI() {
  document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
  const panel = document.querySelector('.mobile-panel');
  panel?.classList.remove('is-open');
  panel?.setAttribute('aria-hidden', 'true');
  document.querySelector('.menu-button')?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

function updateActiveNavigation(url) {
  const activeFile = pageFile(url);
  document.querySelectorAll('site-header nav a').forEach((link) => {
    const isActive = pageFile(new URL(link.href)) === activeFile;
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function updateDocumentMetadata(nextDocument) {
  document.title = nextDocument.title;
  const currentDescription = document.querySelector('meta[name="description"]');
  const nextDescription = nextDocument.querySelector('meta[name="description"]');
  if (currentDescription && nextDescription) {
    currentDescription.setAttribute('content', nextDescription.getAttribute('content') || '');
  }
}

async function loadDocument(url) {
  const requestUrl = new URL(url);
  requestUrl.hash = '';
  const response = await fetch(requestUrl, {
    headers: { Accept: 'text/html' },
  });
  if (!response.ok) throw new Error(`Page request failed with ${response.status}`);

  const nextDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
  if (!nextDocument.querySelector('main')) throw new Error('The destination page has no main content.');
  return nextDocument;
}

async function replacePage(url) {
  document.documentElement.classList.add('is-navigating');
  document.querySelector('main')?.setAttribute('aria-busy', 'true');

  try {
    const nextDocument = await loadDocument(url);
    const currentMain = document.querySelector('main');
    const nextMain = document.importNode(nextDocument.querySelector('main'), true);
    if (!currentMain) throw new Error('The current page has no main content.');

    closeTransientUI();
    const update = () => {
      currentMain.replaceWith(nextMain);
      document.body.className = nextDocument.body.className;
      updateDocumentMetadata(nextDocument);
      updateActiveNavigation(url);
      initializePage();
      window.scrollTo(0, 0);
    };

    if (document.startViewTransition && !reducedMotion.matches) {
      const transition = document.startViewTransition(update);
      await transition.updateCallbackDone;
      await transition.finished;
    } else {
      update();
    }

    nextMain.setAttribute('tabindex', '-1');
    nextMain.focus({ preventScroll: true });
    requestAnimationFrame(() => nextMain.removeAttribute('tabindex'));
  } finally {
    document.documentElement.classList.remove('is-navigating');
    document.querySelector('main')?.removeAttribute('aria-busy');
  }
}

if ('navigation' in window) {
  window.navigation.addEventListener('navigate', (event) => {
    const destination = new URL(event.destination.url);
    const sourceLink = event.sourceElement?.closest?.('a');
    if (
      !event.canIntercept
      || event.hashChange
      || event.navigationType === 'reload'
      || event.downloadRequest
      || event.formData
      || (sourceLink?.target && sourceLink.target !== '_self')
      || !isJournalPage(destination)
    ) return;

    event.intercept({
      focusReset: 'manual',
      scroll: 'manual',
      async handler() {
        try {
          await replacePage(destination);
        } catch (error) {
          console.error('Client-side navigation failed; reloading the destination.', error);
          window.location.reload();
        }
      },
    });
  });
} else {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || !link
      || link.target
      || link.download
    ) return;

    const destination = new URL(link.href);
    const sameDocumentHash = destination.pathname === window.location.pathname && destination.hash;
    if (!isJournalPage(destination) || sameDocumentHash) return;

    event.preventDefault();
    history.pushState({}, '', destination);
    replacePage(destination).catch((error) => {
      console.error('Client-side navigation failed; loading the destination normally.', error);
      window.location.assign(destination);
    });
  });

  window.addEventListener('popstate', () => {
    replacePage(new URL(window.location.href)).catch(() => window.location.reload());
  });
}

initializePage();
