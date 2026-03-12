/* ============================================================
   GlobalTrade Exports — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Menu ---------- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  navOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:997;opacity:0;visibility:hidden;transition:.3s ease';
  document.body.appendChild(navOverlay);

  function toggleMenu() {
    navLinks.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    navOverlay.style.opacity = isOpen ? '1' : '0';
    navOverlay.style.visibility = isOpen ? 'visible' : 'hidden';
    document.body.style.overflow = isOpen ? 'hidden' : '';
    // animate hamburger
    const spans = mobileToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) toggleMenu();
  }));

  /* ---------- Header Scroll ---------- */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ---------- Search Overlay ---------- */
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');
  searchToggle?.addEventListener('click', () => searchOverlay?.classList.add('active'));
  searchClose?.addEventListener('click', () => searchOverlay?.classList.remove('active'));
  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) searchOverlay.classList.remove('active');
  });

  /* ---------- Language Dropdown ---------- */
  const langBtn = document.querySelector('.lang-btn');
  const langMenu = document.querySelector('.lang-menu');
  langBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu?.classList.toggle('active');
  });
  document.addEventListener('click', () => langMenu?.classList.remove('active'));
  langMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      langBtn.innerHTML = `<i class="fas fa-globe"></i> ${a.textContent} <i class="fas fa-chevron-down"></i>`;
      langMenu.classList.remove('active');
    });
  });

  /* ---------- Hero Slider ---------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }

  if (slides.length > 0) {
    slideInterval = setInterval(nextSlide, 5000);
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        goToSlide(i);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });
  }

  /* ---------- Testimonial Carousel ---------- */
  const track = document.querySelector('.testimonial-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let carouselIndex = 0;
  let carouselInterval;

  function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function updateCarousel() {
    if (!track || cards.length === 0) return;
    const perView = getCardsPerView();
    const maxIndex = Math.max(0, cards.length - perView);
    carouselIndex = Math.min(carouselIndex, maxIndex);
    const pct = carouselIndex * (100 / perView);
    track.style.transform = `translateX(-${pct}%)`;
  }

  function startCarouselAutoPlay() {
    stopCarouselAutoPlay();
    if (cards.length > 0) {
      carouselInterval = setInterval(() => {
        const perView = getCardsPerView();
        const maxIndex = Math.max(0, cards.length - perView);
        carouselIndex = carouselIndex >= maxIndex ? 0 : carouselIndex + 1;
        updateCarousel();
      }, 5000);
    }
  }

  function stopCarouselAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
  }

  if (track && cards.length > 0) {
    prevBtn?.addEventListener('click', () => {
      carouselIndex = Math.max(0, carouselIndex - 1);
      updateCarousel();
      startCarouselAutoPlay(); // Reset timer on interaction
    });

    nextBtn?.addEventListener('click', () => {
      const perView = getCardsPerView();
      const maxIndex = Math.max(0, cards.length - perView);
      carouselIndex = Math.min(maxIndex, carouselIndex + 1);
      updateCarousel();
      startCarouselAutoPlay(); // Reset timer on interaction
    });

    window.addEventListener('resize', () => {
      updateCarousel();
    });

    // Initialize
    updateCarousel();
    startCarouselAutoPlay();
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('active');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
      });
      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Scroll Reveal ---------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Form Handling (prevent default + alert) ---------- */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn?.textContent;
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }
      setTimeout(() => {
        alert('Thank you! Your submission has been received. We will get back to you shortly.');
        form.reset();
        if (btn) {
          btn.textContent = origText;
          btn.disabled = false;
        }
      }, 1000);
    });
  });

});
