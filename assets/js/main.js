// SHILTECH — shared site behaviour
document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav){
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    // mobile: tap a mega-menu parent to expand instead of navigating
    document.querySelectorAll('.nav-item > a.nav-link').forEach(link => {
      const parent = link.parentElement;
      if (!parent.querySelector('.mega')) return;
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1080){
          e.preventDefault();
          parent.classList.toggle('open');
        }
      });
    });
    // close mobile nav when a regular link is tapped
    nav.querySelectorAll('a.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1080 && !link.closest('.nav-item')){
          nav.classList.remove('open');
          toggle.classList.remove('is-open');
          document.body.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded','false');
        }
      });
    });
    // close mobile nav on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')){
        nav.classList.remove('open');
        toggle.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting){
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, {threshold:0.12});
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* Animated stat counters */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length){
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target < 10 && target % 1 !== 0
          ? (target * eased).toFixed(1)
          : Math.floor(target * eased);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window){
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting){ animate(en.target); cio.unobserve(en.target); }
        });
      }, {threshold:0.4});
      counters.forEach(c => cio.observe(c));
    } else {
      counters.forEach(animate);
    }
  }

  /* Header shadow on scroll */
  const header = document.querySelector('.site-header');
  if (header){
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 8px 24px rgba(0,0,0,0.28)' : 'none';
    };
    document.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* Project filter (projects.html) */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && projectCards.length){
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;
        projectCards.forEach(card => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* Basic form UX (visual confirmation; forms POST to FormSubmit) */
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn){ btn.textContent = 'Sending…'; btn.disabled = true; }
    });
  });

});
