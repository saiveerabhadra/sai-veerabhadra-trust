/* ===== Current Year in Footer ===== */
document.getElementById('current-year').textContent = new Date().getFullYear();

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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

function openVideoModal(src, title) {
  if (!videoModal) return;
  videoModal.hidden = false;
  if (videoModalTitle) videoModalTitle.textContent = title;
  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    videoPlayer.load();
    if (src) videoPlayer.src = src;
    videoPlayer.load();
    videoPlayer.style.display = 'block';
    videoPlayer.style.background = 'transparent';
  }
  videoModal.classList.add('active');
  videoModal.style.opacity = '1';
  videoModal.style.visibility = 'visible';
  document.body.style.overflow = 'hidden';
  if (videoPlayer) videoPlayer.play().catch(() => {});

}

document.querySelectorAll('.video-card, .carousel-slide.video-slide').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-video');
    const title = card.getAttribute('data-title') || '';
    openVideoModal(src, title);
  });
});

function closeVideoModal() {
  if (!videoModal) return;

  // Hide the modal before clearing the video source so the reset frame is never visible.
  videoModal.classList.remove('active');
  videoModal.hidden = true;
  videoModal.style.opacity = '0';
  videoModal.style.visibility = 'hidden';

  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    videoPlayer.onended = null;
    videoPlayer.src = '';
    videoPlayer.removeAttribute('src');
    videoPlayer.load();
    videoPlayer.style.display = 'none';
  }

  document.body.style.overflow = '';
}

if (videoPlayer) {
  videoPlayer.addEventListener('ended', closeVideoModal);
  videoPlayer.addEventListener('error', closeVideoModal);
}
if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
if (videoModal) videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) closeVideoModal();
});

/* ===== Donate Tabs ===== */
const donateTabs = document.querySelectorAll('.donate-tab');
const donatePanels = document.querySelectorAll('.donate-tab-panel');

donateTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    donateTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    donatePanels.forEach(p => {
      p.classList.remove('active');
      p.hidden = true;
    });

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(target);
    if (panel) {
      panel.classList.add('active');
      panel.hidden = false;
    }
  });
});

/* ===== Contact Form Submission ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://formspree.io/f/mzezzybe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      if (!response.ok) throw new Error('Submission failed');
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    } catch (error) {
      alert('Could not send message. Please try again or email directly.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ===== Assistance Form Submission ===== */
const assistForm = document.getElementById('assistForm');
if (assistForm) {
  assistForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = assistForm.querySelector('button[type="submit"]');
    const status = document.getElementById('assist-status');
    if (submitBtn) submitBtn.disabled = true;
    if (status) {
      status.className = 'donation-status';
      status.textContent = 'Submitting...';
    }
    try {
      const formData = new FormData(assistForm);
      const response = await fetch('https://formspree.io/f/mzezzybe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Submission failed' }));
        throw new Error(errorData.error || `Submission failed (${response.status})`);
      }
      if (status) {
        status.className = 'donation-status success';
        status.textContent = 'Thank you for your request! The Trust will review your application and get back to you.';
      }
assistForm.reset();
    } catch (error) {
      if (status) {
        status.className = 'donation-status error';
        status.textContent = error.message;
      }
    } finally {
      const submitBtn = assistForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = false;
    }
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
  donateForm.addEventListener('submit', async (e) => {
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
      status.className = 'donation-status';
      status.textContent = 'Submitting...';
    }

    const formData = new FormData(donateForm);
    const donation = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://formspree.io/f/mzezzybe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donation)
      });

      if (!response.ok) throw new Error('Email notification failed');

      if (status) {
        status.className = 'donation-status success';
        status.textContent = 'Thank you, ' + donatorName + '! UTR ' + transactionId + ' submitted. We\'ll verify and confirm within 24 hours.';
      }
    } catch (error) {
      if (status) {
        status.className = 'donation-status success';
        status.textContent = 'Thank you, ' + donatorName + '! UTR ' + transactionId + ' submitted. We\'ll verify and confirm within 24 hours.';
      }
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
document.querySelectorAll('.carousel').forEach(carousel => {
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
});

// The JavaScript to make it click
document.querySelectorAll('.donate-tab').forEach(button => {
  button.addEventListener('click', function() {
    // Get the URL from the data-url attribute
    const url = this.getAttribute('data-url');

    // If a URL exists, open it in a new tab
    if (url) {
      window.open(url, '_blank');
    }
  });
});

/* =========================================================
   PROFESSIONAL UPI PAYMENT FLOW + ORDER SUMMARY
   ========================================================= */
(function initProfessionalPayment() {

  /* ⚠️⚠️⚠️ CHANGE THIS TO YOUR REAL TRUST UPI ID ⚠️⚠️⚠️ */
  const UPI_ID = 'saiveerabhadra24@sbi';

  const PAYEE_NAME = 'SAI VEERA BHADRA TRUST';
  const PAYEE_NAME_ENCODED = encodeURIComponent(PAYEE_NAME);

  const amountInput = document.getElementById('upiAmount');
  if (!amountInput) return;

  // 1. Force reset values on initial load
  amountInput.value = '500';

    // If not on a mobile device, disable UPI option and select QR option
    if (!isMobileDevice()) {
      const upiRadioBtn = document.getElementById('method-upi');
      const qrRadioBtn = document.getElementById('method-qr');
      
      // 1. Disable UPI option
      if (upiRadioBtn) {
        upiRadioBtn.checked = false;
        upiRadioBtn.disabled = true;
        const upiLabel = upiRadioBtn.closest('.pay-method');
        if (upiLabel) upiLabel.classList.add('disabled-method');
      } 
      
      // 2. Select QR option (Notice this is an 'if' now, not 'else if')
      if (qrRadioBtn) {
        qrRadioBtn.checked = true;
      } 
      
      // 3. Force the UI to hide the apps and show the QR code/sidebar
      // This uses your existing showOnly() function. 
      // We wrap it in a setTimeout to ensure the function is fully defined before it runs.
      setTimeout(() => {
        const qrRadio = document.getElementById('method-qr');
        if (qrRadio) qrRadio.dispatchEvent(new Event('change'));
      }, 10);
    }

  // Clear the name input on page load (prevents browser refresh from keeping it)
  const donorNameInput = document.getElementById('donorName');
  if (donorNameInput) {
    donorNameInput.value = '';

    // Also clear it when the page is loaded from the browser's back/forward cache
    window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      amountInput.value = '500';
      if (nameInput) nameInput.value = '';
      
      document.querySelectorAll('.quick-amt').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.amt === '500');
      });

      // RESET THE DISABLED STATE ON REFRESH
      const upiRadioBtn = document.getElementById('method-upi');
      if (upiRadioBtn) {
        upiRadioBtn.disabled = false;
        upiRadioBtn.closest('.pay-method').classList.remove('disabled-method');
      }

      const upiRadio = document.getElementById('method-upi');
      if (upiRadio) {
        upiRadio.checked = true;
        upiRadio.dispatchEvent(new Event('change')); 
      }
    }
  });
  }

  const purposeSelect  = document.getElementById('payPurpose');
  const qrBlock        = document.getElementById('qrBlock');
  const appsBlock      = document.getElementById('upiAppsBlock');
  const otherBlock     = document.getElementById('otherBlock');
  const methodRadios   = document.querySelectorAll('input[name="payMethod"]');
  const methodRows     = document.querySelectorAll('.pay-method');
  const appCards       = document.querySelectorAll('.upi-app-card');
  const chips          = document.querySelectorAll('.quick-amt');

  /* Order summary elements */
  const summaryAmount  = document.getElementById('summaryAmount');
  const summaryMethod  = document.getElementById('summaryMethod');
  const summaryPurpose = document.getElementById('summaryPurpose');
  const totalEl        = document.getElementById('payTotal');
  const ctaAmtEl       = document.getElementById('payNowAmt');

  const ctaBtn         = document.getElementById('payNowBtn');
  const confirmBox     = document.getElementById('paymentConfirmBox');
  const amtPaidInput   = document.getElementById('payAmount');

  let selectedApp    = 'phonepe';
  let selectedMethod = 'upi';

  /* ---- Helpers ---- */
  function fmt(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function getAmount() {
    const v = parseFloat(amountInput.value);
    return (!v || v <= 0) ? 0 : v;
  }

  function appLabel(app) {
    switch (app) {
      case 'phonepe': return 'PhonePe';
      case 'gpay':    return 'Google Pay';
      case 'paytm':   return 'Paytm';
      //case 'bhim':    return 'BHIM UPI';
      //case 'any':     return 'Any UPI App';
      default:        return 'UPI';
    }
  }

  function updateSummary() {
    const amt  = getAmount();
    const disp = amt > 0 ? fmt(amt) : '—';

    /* Amounts */
    if (summaryAmount) summaryAmount.textContent = disp;
    if (totalEl)       totalEl.textContent       = disp;
    if (ctaAmtEl)      ctaAmtEl.textContent      = amt > 0 ? fmt(amt) : '';
    if (amtPaidInput)  amtPaidInput.value        = amt;

    // NEW: Update the sidebar QR amount
    const sidebarQrAmount = document.getElementById('sidebarQrAmount');
    if (sidebarQrAmount) sidebarQrAmount.textContent = disp;

    /* Method */
    if (summaryMethod) {
      let label = '—';
      if (selectedMethod === 'upi')   label = appLabel(selectedApp);
      if (selectedMethod === 'qr')    label = 'QR Code';
      if (selectedMethod === 'other') label = 'SBI Collect';
      summaryMethod.textContent = label;
    }

    /* Purpose */
    if (summaryPurpose && purposeSelect) {
      let label = purposeSelect.value;
      if (label === 'Other') {
        const custom = document.getElementById('customPurposeInput');
        const val = custom && custom.value.trim();
        label = val ? 'Other: ' + val : 'Other (specify)';
      }
      summaryPurpose.textContent = label;
    }
  }

  // /* ---- QR block ---- */
  // function showQrBlock() {
  //   const amt = getAmount();
  //   if (!qrBlock || amt <= 0) {
  //     if (qrBlock) { qrBlock.hidden = true; qrBlock.innerHTML = ''; }
  //     return;
  //   }
  //   // const upiUrl =
  //   //   'upi://pay?pa=' + encodeURIComponent(UPI_ID) +
  //   //   '&pn='          + PAYEE_NAME_ENCODED +
  //   //   '&am='          + amt.toFixed(2) +
  //   //   '&cu=INR&tn='   + encodeURIComponent('Donation');

  //   // const qrSrc =
  //   //   'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' +
  //   //   encodeURIComponent(upiUrl);
  //   const qrSrc = '../images/saiveerabhadra-qr.jpeg';

  //   qrBlock.innerHTML =
  //     '<div class="upi-qr-box">' +
  //       '<img src="' + qrSrc + '" alt="UPI QR Code" width="240" height="240">' +
  //     '</div>' +
  //     '<div class="upi-qr-meta">' +
  //       '<p>Amount: <strong>' + fmt(amt) + '</strong></p>' +
  //       '<p>UPI ID: <strong>' + UPI_ID + '</strong></p>' +
  //       '<p class="upi-qr-hint">Scan with PhonePe, Google Pay, Paytm, BHIM or any UPI app</p>' +
  //     '</div>';
  //   qrBlock.hidden = false;
  // }

  // function hideQrBlock() {
  //   if (!qrBlock) return;
  //   qrBlock.hidden    = true;
  //   qrBlock.innerHTML = '';
  // }

  /* ---- QR block — static image ---- */
  function showQrBlock() {
    if (!qrBlock) return;
    qrBlock.hidden = false;
  }

  function hideQrBlock() {
    if (!qrBlock) return;
    qrBlock.hidden = true;
  }

  /* ---- UPI deep-links ---- */
  function buildUpiUrl(app, amount) {
    const note = encodeURIComponent('Donation to SAI VEERA BHADRA TRUST');
    const am   = amount.toFixed(2);
    const qs   = 'pa=' + UPI_ID +
                 '&pn=' + PAYEE_NAME_ENCODED +
                 '&am=' + am +
                 '&cu=INR&tn=' + note;
    switch (app) {
      case 'phonepe': return 'phonepe://pay?' + qs;
      case 'gpay':    return 'tez://upi/pay?' + qs;
      case 'paytm':   return 'paytmmp://pay?' + qs;
      default:        return 'upi://pay?' + qs;
    }
  }

  function showConfirm(amount) {
    if (!confirmBox) return;
    confirmBox.hidden = false;
    if (amtPaidInput) amtPaidInput.value = amount;
    confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---- Mutual exclusion ---- */
  function showOnly(method) {
    selectedMethod = method;

    if (appsBlock)  appsBlock.hidden  = true;
    if (otherBlock) otherBlock.hidden = true;
    hideQrBlock();

    if (selectedMethod === 'upi') {
      if (appsBlock) appsBlock.hidden = false;
    } else if (selectedMethod === 'qr') {
      showQrBlock();
    } else if (selectedMethod === 'other') {
      if (otherBlock) otherBlock.hidden = false;
    }

    // NEW: Toggle Order Summary and Sidebar QR
    const orderSummaryCardQrCode = document.getElementById('orderSummaryCardQrCode');
    const sidebarQrCard    = document.getElementById('sidebarQrCard');

    if (selectedMethod === 'qr') {
      // Hide Order Summary, Show Sidebar QR
      if (orderSummaryCardQrCode) orderSummaryCardQrCode.hidden = true;
      if (sidebarQrCard)    sidebarQrCard.hidden    = false;
    } else {
      // Show Order Summary, Hide Sidebar QR
      if (orderSummaryCardQrCode) orderSummaryCardQrCode.hidden = false;
      if (sidebarQrCard)    sidebarQrCard.hidden    = true;
    }

    methodRows.forEach(row => {
      const radio = row.querySelector('input[type="radio"]');
      row.classList.toggle('selected', !!radio && radio.checked);
    });

    updateSummary();
  }

  /* ---- Bind radios ---- */
  methodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) showOnly(radio.value);
    });
  });

  /* ---- Amount input ---- */
  amountInput.addEventListener('input', () => {
    updateSummary();
    if (selectedMethod === 'qr') showQrBlock();
  });

  /* ---- Quick amounts ---- */
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      amountInput.value = chip.dataset.amt;
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      updateSummary();
      if (selectedMethod === 'qr') showQrBlock();
    });
  });

  /* ---- Purpose change ---- */
  if (purposeSelect) {
    purposeSelect.addEventListener('change', updateSummary);
  }

  /* ---- UPI app click ---- */
  appCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const app = card.dataset.app;
      const amount = getAmount();
      if (!amount || amount <= 0) {
        alert('Please enter a valid amount first.');
        amountInput.focus();
        return;
      }
      selectedApp = app;
      updateSummary();
      window.location.href = buildUpiUrl(app, amount);

      const onVisible = () => {
        if (!document.hidden) {
          // showConfirm(amount);
          document.removeEventListener('visibilitychange', onVisible);
        }
      };
      document.addEventListener('visibilitychange', onVisible);
      // setTimeout(() => { if (!document.hidden) showConfirm(amount); }, 2500);
      setTimeout(2500);      
    });
  });

  /* ---- Main CTA ---- */
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      // 1. Validate Name
      const nameInput = document.getElementById('donorName');
      if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter your name.');
        nameInput && nameInput.focus();
        return;
      }

      // 2. Validate Amount
      const amt = getAmount();
      if (amt <= 0) {
        alert('Please enter a valid donation amount.');
        amountInput.focus();
        return;
      }

      if (selectedMethod === 'upi') {
        // if (appsBlock) appsBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // DEFAULT TO PHONEPE if no app is explicitly selected yet
        selectedApp = selectedApp || 'phonepe';
        updateSummary();

        // // Trigger the UPI redirect exactly like clicking the app card does
        // const url = buildUpiUrl(selectedApp, amt);
        // // window.location.href = url;
        // console.log('Build UPI URL:', url);

        // // Force the redirect
        // window.location.replace(url);

        // // Show confirmation form when they return
        // const onVisible = () => {
        //   if (!document.hidden) {
        //     showConfirm(amt);
        //     document.removeEventListener('visibilitychange', onVisible);
        //   }
        // };

        // document.addEventListener('visibilitychange', onVisible);
        // setTimeout(() => { if (!document.hidden) showConfirm(amt); }, 2500);

        // --- NEW DESKTOP VS MOBILE LOGIC ---
        if (isMobileDevice()) {
          const url = buildUpiUrl(selectedApp, amt);
          window.location.replace(url);
          
          const onVisible = () => {
            if (!document.hidden) {
              showConfirm(amt);
              document.removeEventListener('visibilitychange', onVisible);
            }
          };
          document.addEventListener('visibilitychange', onVisible);
          setTimeout(() => { if (!document.hidden) showConfirm(amt); }, 2500);

        } else {
          // Desktop Flow: Force QR
          console.log("Desktop payment detected. Please scan the QR code with your phone to complete the donation.");

          const upiRadioBtn = document.getElementById('method-upi');
          if (upiRadioBtn) {
            upiRadioBtn.checked = false;
            upiRadioBtn.disabled = true;
            upiRadioBtn.closest('.pay-method').classList.add('disabled-method');
          }

          const qrRadioBtn = document.getElementById('method-qr');
          if (qrRadioBtn) {
            qrRadioBtn.checked = true;
            qrRadioBtn.dispatchEvent(new Event('change'));
          }

          setTimeout(() => {
            const qrBlock = document.getElementById('qrBlock');
            if (qrBlock) qrBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);

          showConfirm(amt);
        }
      } else if (selectedMethod === 'qr') {
        if (qrBlock && !qrBlock.hidden) {
          qrBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        showConfirm(amt);
      } else if (selectedMethod === 'other') {
        if (otherBlock) otherBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ---- Confirmation form ---- */
  const confirmForm = document.getElementById('paymentConfirmForm');
  if (confirmForm) {
    confirmForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (window.__validatePurpose && !window.__validatePurpose()) {
        alert('Please specify your purpose since you selected "Other".');
        return;
      }

      const status = document.getElementById('paymentConfirmStatus');
      const submitBtn = confirmForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      if (status) {
        status.className = 'donation-status';
        status.textContent = 'Submitting...';
      }

      // Get the correct name from Step 1
      const nameInput = document.getElementById('donorName');
      const finalName = nameInput ? nameInput.value.trim() : 'Anonymous';

      const payload = {
        _subject: "New Donation Attempt - SAI VEERA BHADRA TRUST",
        payment_status: "Payment Initiated (Pending Verification)",
        name:      finalName,
        mobile:    document.getElementById('payerMobile').value.trim(),
        amount:    amtPaidInput.value,
        utr:       document.getElementById('utrNumber').value.trim(),
        purpose:   (window.__getEffectivePurpose && window.__getEffectivePurpose())
                        || (purposeSelect ? purposeSelect.value : 'General Donation'),
        upiId:     UPI_ID,
        method:    selectedMethod,
        app:       selectedApp,
        timestamp: new Date().toISOString()
      };

      try {
        const res = await fetch('https://formspree.io/f/mzezzybe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed');
        if (status) {
          status.className = 'donation-status success';
          status.textContent =
            'Thank you, ' + payload.name + '! We received UTR ' + payload.utr +
            '. Receipt will arrive within 24 hours.';
        }
        confirmForm.reset();
        confirmBox.hidden = true;
      } catch (err) {
        if (status) {
          status.className = 'donation-status error';
          status.textContent =
            'Could not submit. Please screenshot your payment and WhatsApp us at 7702550818.';
        }
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---- Initial state ---- */
  showOnly('upi');
  updateSummary();

  /* Expose for custom purpose handler */
  window.__payUpdateSummary = updateSummary;

})();

/* =========================================================
   CUSTOM PURPOSE TEXTAREA HANDLER
   ========================================================= */
(function initCustomPurposeHandler() {

  const purposeSelect = document.getElementById('payPurpose');
  if (!purposeSelect) return;

  const customWrap   = document.getElementById('customPurposeWrap');
  const customInput  = document.getElementById('customPurposeInput');
  const customCount  = document.getElementById('customPurposeCount');
  const messageBox   = document.getElementById('donorMessage');
  const messageCount = document.getElementById('messageCount');

  /* ---- Show/hide textarea based on dropdown ---- */
  function toggleCustomPurpose() {
    const isOther = purposeSelect.value === 'Other';

    if (customWrap) {
      customWrap.hidden = !isOther;
    }

    if (customInput) {
      if (isOther) {
        customInput.required = true;
        /* focus after the slide-in animation */
        setTimeout(() => customInput.focus(), 260);
      } else {
        customInput.required = false;
        customInput.value = '';
        if (customCount) customCount.textContent = '0';
      }
    }

    /* Tell the order summary to refresh */
    if (typeof window.__payUpdateSummary === 'function') {
      window.__payUpdateSummary();
    }
  }

  purposeSelect.addEventListener('change', toggleCustomPurpose);
  toggleCustomPurpose();  /* run once on load */

  /* ---- Character counter: custom purpose ---- */
  if (customInput && customCount) {
    const updateCustomCount = () => {
      customCount.textContent = customInput.value.length;

      /* Keep the order summary in sync as the donor types */
      if (typeof window.__payUpdateSummary === 'function') {
        window.__payUpdateSummary();
      }
    };
    customInput.addEventListener('input', updateCustomCount);
    updateCustomCount();
  }

  /* ---- Character counter: message ---- */
  if (messageBox && messageCount) {
    const updateMsgCount = () => {
      messageCount.textContent = messageBox.value.length;
    };
    messageBox.addEventListener('input', updateMsgCount);
    updateMsgCount();
  }

  /* ---- Exposed helpers for the confirmation form ---- */
  window.__getEffectivePurpose = function () {
    if (!purposeSelect) return 'General Donation';
    if (purposeSelect.value === 'Other') {
      const custom = (customInput && customInput.value.trim()) || '';
      return custom ? 'Other: ' + custom : 'Other';
    }
    return purposeSelect.value;
  };

  window.__getDonorMessage = function () {
    return messageBox ? messageBox.value.trim() : '';
  };

  /* ---- Validation before submit ---- */
  window.__validatePurpose = function () {
    if (purposeSelect.value === 'Other') {
      const custom = (customInput && customInput.value.trim()) || '';
      if (!custom) {
        if (customInput) {
          customInput.focus();
          customInput.style.borderColor = '#B42318';
          customInput.style.boxShadow = '0 0 0 3px rgba(180,35,24,.08)';
          setTimeout(() => {
            customInput.style.borderColor = '';
            customInput.style.boxShadow = '';
          }, 2000);
        }
        return false;
      }
    }
    return true;
  };

})();