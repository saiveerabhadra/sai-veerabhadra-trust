/* ===== Mobile Navigation Toggle ===== */
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  /* Close mobile nav on link click */
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('active');
      navLinks && navLinks.classList.remove('active');
      document.querySelectorAll('.dropdown-open').forEach(d => d.classList.remove('dropdown-open'));
    });
  });

  /* Mobile dropdown toggle */
  document.querySelectorAll('.nav-links > li > a').forEach(link => {
    const parent = link.parentElement;
    const dropdown = parent.querySelector('.dropdown, .dropdown-menu');
    if (dropdown && window.innerWidth <= 768) {
      link.addEventListener('click', (e) => {
        if (dropdown) {
          e.preventDefault();
          parent.classList.toggle('dropdown-open');
        }
      });
    }
  });

  /* Sticky Header Shadow */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
  });

  setActiveNav();
}

initNav();

/* ===== Scroll to Top ===== */
const scrollTopBtn = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn && scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn && scrollTopBtn.classList.remove('visible');
  }
});
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Fade Up Animation on Scroll ===== */
const fadeElements = document.querySelectorAll('.fade-up');
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

/* ===== Counter Animation ===== */
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const increment = target / 60;
    let current = 0;
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current) + '+';
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + '+';
      }
    };
    updateCounter();
  });
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

/* ===== Gallery Filter ===== */
const filterBtns = document.querySelectorAll('.gallery-filter button');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'block';
        setTimeout(() => item.style.opacity = '1', 50);
      } else {
        item.style.opacity = '0';
        setTimeout(() => item.style.display = 'none', 300);
      }
    });
  });
});

/* ===== Gallery Lightbox ===== */
const lightbox = document.querySelector('.lightbox');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxDate = document.querySelector('.lightbox-date');

document.querySelectorAll('.carousel-slide').forEach(item => {
  item.addEventListener('click', () => {
    if (lightbox) {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lightboxTitle) lightboxTitle.textContent = item.getAttribute('data-title') || '';
      if (lightboxDate) lightboxDate.textContent = item.getAttribute('data-date') || '';
      const imgDiv = item.querySelector('.carousel-img');
      if (lightboxImg && imgDiv) {
        lightboxImg.style.backgroundImage = imgDiv.style.backgroundImage;
        lightboxImg.style.backgroundSize = item.classList.contains('crop-image') ? '75% auto' : 'contain';
        lightboxImg.style.backgroundRepeat = 'no-repeat';
        lightboxImg.style.backgroundPosition = item.classList.contains('crop-image') ? 'center 30%' : 'center';
      }
    }
  });
});

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeVideoModal();
  }
});

/* ===== Gallery Video Modal ===== */
const videoModal = document.getElementById('video-modal');
const videoModalClose = document.getElementById('video-modal-close');
const videoPlayer = document.getElementById('video-player');
const videoModalTitle = document.getElementById('video-modal-title');

document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', () => {
    if (!videoModal) return;
    const src = card.getAttribute('data-video');
    const title = card.getAttribute('data-title') || '';
    if (videoModalTitle) videoModalTitle.textContent = title;
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.removeAttribute('src');
      videoPlayer.load();
      if (src) videoPlayer.src = src;
      videoPlayer.load();
    }
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (videoPlayer) videoPlayer.play().catch(() => {});
  });
});

function closeVideoModal() {
  if (!videoModal) return;
  videoModal.classList.remove('active');
  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    videoPlayer.load();
  }
  document.body.style.overflow = '';
}
if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
if (videoModal) videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) closeVideoModal();
});

/* ===== Contact Form Submission ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  });
}

/* ===== Assistance Form Submission ===== */
const assistForm = document.getElementById('assistForm');
if (assistForm) {
  assistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your request! The Trust will review your application and get back to you.');
    assistForm.reset();
  });
}

/* ===== Birthday Registration Form ===== */
const birthdayForm = document.getElementById('birthdayForm');
if (birthdayForm) {
  birthdayForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for registering your birthday! We will send you a special greeting on your special day.');
    birthdayForm.reset();
  });
}

/* ===== Donate Form Submission ===== */
const donateForm = document.getElementById('donation-form');
const upiTransactionId = document.getElementById('upiTransactionId');
const donationSubmit = document.getElementById('donation-submit');
if (upiTransactionId && donationSubmit) {
  const updateDonationSubmit = () => {
    donationSubmit.disabled = !upiTransactionId.checkValidity();
  };
  upiTransactionId.addEventListener('input', updateDonationSubmit);
  updateDonationSubmit();
}
if (donateForm) {
  donateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const donatorName = document.getElementById('donatorName').value.trim();
    const status = document.getElementById('donation-status');
    const transactionId = upiTransactionId?.value?.trim();
    
    if (!transactionId) {
      if (status) {
        status.className = 'donation-status error';
        status.textContent = 'Please enter the UPI Transaction ID to complete your donation.';
      }
      return;
    }
    
    if (status) {
      status.className = 'donation-status success';
      status.textContent = 'Thank you, ' + donatorName + '! Your donation was received successfully.';
    }
    donateForm.reset();
    if (donationSubmit) donationSubmit.disabled = true;
  });
}

/* ===== Set Active Nav Link ===== */
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links > li > a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===== Gallery Carousel ===== */
const carousel = document.querySelector('.carousel');
if (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.carousel-arrow.prev');
  const nextBtn = carousel.querySelector('.carousel-arrow.next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const countEl = carousel.querySelector('.carousel-count');
  const progressBar = carousel.querySelector('.carousel-progress-bar');
  const AUTOPLAY_DELAY = 4500;
  const total = slides.length;
  let index = 0;
  let autoPlayTimeout;

  /* Build dots as progress bars */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.innerHTML = '<span class="dot-fill"></span>';
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  function updateCount() {
    if (countEl) countEl.textContent = (index + 1) + ' / ' + total;
  }

  function activeFill() {
    return dots[index] ? dots[index].querySelector('.dot-fill') : null;
  }

  function startProgress() {
    dots.forEach((d, di) => {
      const fill = d.querySelector('.dot-fill');
      if (!fill) return;
      fill.classList.remove('running');
      fill.style.animationPlayState = 'running';
    });
    if (progressBar) {
      progressBar.classList.remove('running');
      progressBar.style.animationPlayState = 'running';
      void progressBar.offsetWidth;
      progressBar.classList.add('running');
    }
    clearTimeout(autoPlayTimeout);
    autoPlayTimeout = setTimeout(next, AUTOPLAY_DELAY);
  }

  function pauseProgress() {
    if (progressBar) progressBar.style.animationPlayState = 'paused';
    clearTimeout(autoPlayTimeout);
  }

  function resumeProgress() {
    if (!progressBar) { startProgress(); return; }
    let remaining = AUTOPLAY_DELAY;
    const anims = progressBar.getAnimations();
    if (anims.length && anims[0].currentTime != null) {
      remaining = Math.max(0, AUTOPLAY_DELAY - anims[0].currentTime);
    }
    progressBar.style.animationPlayState = 'running';
    clearTimeout(autoPlayTimeout);
    autoPlayTimeout = setTimeout(next, remaining);
  }

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
    updateCount();
    startProgress();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  /* Pause on hover */
  carousel.addEventListener('mouseenter', pauseProgress);
  carousel.addEventListener('mouseleave', resumeProgress);

  /* Keyboard navigation */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  updateCount();
  startProgress();
}
