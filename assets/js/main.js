/**
 * SIB-SHInE Interactive Frontend Engine
 * School of International Biodesign - IIT Kanpur & KGMU Lucknow
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initStatsCounter();
  initFellowsFilter();
  initFaqAccordion();
  initEligibilityChecker();
  initBackToTop();
  initWhySlider();
  initHeroSlider();
  highlightActiveNav();
});

/* --- Navbar Sticky & Active State --- */
function initNavbar() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();
    
    if (linkPath === currentPath || (currentPath === '' && (linkPath === 'index.html' || linkPath === 'index-2.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Mobile Menu Drawer --- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* --- Animated Numbers Counter --- */
function initStatsCounter() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad formula
      const ease = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(ease * target);

      el.textContent = currentVal.toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('en-IN');
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  } else {
    counters.forEach(c => animateCounter(c));
  }
}

/* --- Fellows Directory Filtering & Search --- */
function initFellowsFilter() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchInput = document.querySelector('#fellowSearch');
  const fellowCards = document.querySelectorAll('.fellow-card');
  const fellowsGrid = document.querySelector('#fellowsGrid');
  const emptyState = document.querySelector('#fellowsEmptyState');
  const comingSoon = document.querySelector('#cohort3ComingSoon');
  const countBadge = document.querySelector('#fellowsCount');

  if (!fellowCards.length) return;

  let currentBatch = 'all';
  let currentQuery = '';

  const applyFilters = () => {
    const isCohort3 = currentBatch === 'cohort3';

    if (isCohort3) {
      if (fellowsGrid) fellowsGrid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'none';
      if (comingSoon) comingSoon.style.display = 'block';
      if (countBadge) countBadge.textContent = 'Coming Soon';
      return;
    }

    if (fellowsGrid) fellowsGrid.style.display = '';
    if (comingSoon) comingSoon.style.display = 'none';

    let visibleCount = 0;

    fellowCards.forEach(card => {
      const batch = card.getAttribute('data-batch') || '';
      const name = (card.querySelector('.fellow-name')?.textContent || '').toLowerCase();
      const role = (card.querySelector('.fellow-role')?.textContent || '').toLowerCase();

      const matchesBatch = (currentBatch === 'all' || batch === currentBatch);
      const matchesSearch = !currentQuery || name.includes(currentQuery) || role.includes(currentQuery);

      if (matchesBatch && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = `${visibleCount} Fellows`;
    }

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentBatch = pill.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* --- FAQ Accordion --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Optional: close other open items for cleaner accordion
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (isOpen) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* --- Interactive Eligibility Checker (apply.html) --- */
function initEligibilityChecker() {
  const widget = document.querySelector('.eligibility-widget');
  if (!widget) return;

  const checkboxes = widget.querySelectorAll('.check-item input[type="checkbox"]');
  const resultBox = widget.querySelector('#eligibilityResult');
  const resultTitle = widget.querySelector('#eligibilityTitle');
  const resultDesc = widget.querySelector('#eligibilityDesc');

  if (!checkboxes.length || !resultBox) return;

  const evaluate = () => {
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;

    resultBox.classList.remove('qualified', 'unqualified');

    if (checked === total) {
      resultBox.classList.add('qualified');
      resultTitle.textContent = '🎉 You Meet All Minimum Eligibility Criteria!';
      resultDesc.textContent = 'You are an excellent candidate for the SIB-SHInE Fellowship. Prepare your essay and application portfolio to apply.';
    } else if (checked >= 2) {
      resultBox.classList.add('unqualified');
      resultTitle.textContent = `Criteria Met: ${checked} of ${total}`;
      resultDesc.textContent = 'Please verify that you meet the remaining eligibility requirements (degree qualification, age 20-35, and 12-month full-time commitment).';
    } else {
      resultTitle.textContent = 'Check the boxes above to test your eligibility';
      resultDesc.textContent = 'Select all requirements that match your background to verify your candidacy.';
    }
  };

  checkboxes.forEach(cb => cb.addEventListener('change', evaluate));
}

/* --- Back to Top Button --- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
/* --- Gallery Category Filtering --- */
function initGalleryFilter() {
  const filterPills = document.querySelectorAll('.gallery-filter-pill');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length || !filterPills.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-category') || 'all';

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category') || '';
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --- Lightbox Modal for Gallery & Patents --- */
function initLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox]');
  if (!triggers.length) return;

  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close modal">&times;</button>
        <img src="" alt="Enlarged preview">
        <div class="lightbox-caption-text"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalImg = modal.querySelector('img');
  const modalCaption = modal.querySelector('.lightbox-caption-text');
  const closeBtn = modal.querySelector('.lightbox-close');

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(trig => {
    trig.addEventListener('click', () => {
      const src = trig.getAttribute('data-lightbox-src') || trig.querySelector('img')?.src;
      const caption = trig.getAttribute('data-lightbox-caption') || trig.querySelector('img')?.alt || '';

      if (!src) return;
      modalImg.src = src;
      modalCaption.textContent = caption;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Ensure newly initialized on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

/* --- Homepage Hero Image Slider (index-slider.html) --- */
function initHeroSlider() {
  const slider = document.querySelector('#heroSlider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const dots = Array.from(slider.querySelectorAll('.hero-dot'));
  const prevBtn = slider.querySelector('.hero-prev');
  const nextBtn = slider.querySelector('.hero-next');
  const counter = slider.querySelector('.hero-counter');
  const bar = slider.querySelector('#heroProgress');
  if (!slides.length) return;

  const AUTOPLAY_MS = 5000;
  let index = 0;
  let timer = null;
  let touchX = null;

  const pad = (n) => String(n).padStart(2, '0');

  const paintBar = () => {
    if (!bar) return;
    bar.classList.remove('playing');
    void bar.offsetWidth;
    bar.classList.add('playing');
  };

  const go = (n) => {
    index = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === index));
    if (counter) counter.textContent = pad(index + 1) + ' / ' + pad(slides.length);
    paintBar();
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (bar) bar.classList.remove('playing');
  };

  const start = () => {
    stop();
    if (document.hidden) return;
    timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
    paintBar();
  };

  if (prevBtn) prevBtn.addEventListener('click', () => { go(index - 1); start(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { go(index + 1); start(); });

  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); start(); }));

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  slider.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
    stop();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX = null;
    start();
  }, { passive: true });

  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { go(index + 1); start(); }
    else if (e.key === 'ArrowLeft') { go(index - 1); start(); }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  go(0);
  start();
}

/* --- Why SIB-SHInE Story Slider (index.html) --- */
function initWhySlider() {
  const slider = document.querySelector('#whySlider');
  if (!slider) return;

  const track = slider.querySelector('.why-track');
  const slides = Array.from(track.children);
  const prevBtn = slider.querySelector('.why-prev');
  const nextBtn = slider.querySelector('.why-next');
  const dotsWrap = document.querySelector('#whyDots');
  const counter = document.querySelector('#whyCounter');
  if (!track || !slides.length || !prevBtn || !nextBtn) return;

  const AUTOPLAY_MS = 4000;
  let index = 0;
  let perView = 4;
  let timer = null;
  let touchX = null;

  const perViewFor = () => {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 820) return 2;
    if (w <= 1100) return 3;
    return 4;
  };

  const maxIndex = () => Math.max(0, slides.length - perView);

  const stepPx = () => {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return slides[0].getBoundingClientRect().width + gap;
  };

  const render = () => {
    track.style.transform = 'translateX(' + (-index * stepPx()) + 'px)';
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }
    if (counter) {
      const pad = (n) => String(n).padStart(2, '0');
      counter.textContent = pad(index + 1) + ' / ' + pad(slides.length);
    }
  };

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'why-dot' + (i === index ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to slider page ' + (i + 1));
      dot.addEventListener('click', () => {
        go(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    }
  };

  const go = (i) => {
    const max = maxIndex();
    if (i > max) index = 0;
    else if (i < 0) index = max;
    else index = i;
    render();
  };

  const stopAutoplay = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (document.hidden) return;
    timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
  };

  const restartAutoplay = () => startAutoplay();

  prevBtn.addEventListener('click', () => {
    go(index - 1);
    restartAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    go(index + 1);
    restartAutoplay();
  });

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  slider.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX = null;
    startAutoplay();
  }, { passive: true });

  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      go(index + 1);
      restartAutoplay();
    } else if (e.key === 'ArrowLeft') {
      go(index - 1);
      restartAutoplay();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  window.addEventListener('resize', () => {
    perView = perViewFor();
    if (index > maxIndex()) index = maxIndex();
    buildDots();
    render();
  });

  perView = perViewFor();
  buildDots();
  render();
  startAutoplay();
}
