/* =========================================
   WEDDING PHOTOGRAPHY PORTFOLIO
   JavaScript Interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveal();
  initLightbox();
  initFAQ();
  initGalleryFilters();
});

/* --- Sticky Header --- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (!toggle || !mobileNav) return;
  
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('active');
    
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });
  
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  
  if (!reveals.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(el => observer.observe(el));
}

/* --- Lightbox --- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
  const lightbox = document.querySelector('.lightbox');
  
  if (!galleryItems.length || !lightbox) return;
  
  const lightboxImage = lightbox.querySelector('.lightbox__image');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  
  let currentIndex = 0;
  let images = [];
  
  // Build image array
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-item__caption');
    
    images.push({
      src: img.src,
      title: caption?.querySelector('strong')?.textContent || '',
      subtitle: caption?.querySelector('span')?.textContent || ''
    });
    
    item.addEventListener('click', () => openLightbox(index));
  });
  
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Preload adjacent images
    preloadImage(index - 1);
    preloadImage(index + 1);
  }
  
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  function updateLightboxContent() {
    const image = images[currentIndex];
    lightboxImage.src = image.src;
    
    if (lightboxCaption) {
      lightboxCaption.innerHTML = `
        <strong>${image.title}</strong>
        ${image.subtitle ? `<span>${image.subtitle}</span>` : ''}
      `;
    }
  }
  
  function preloadImage(index) {
    if (index >= 0 && index < images.length) {
      const img = new Image();
      img.src = images[index].src;
    }
  }
  
  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxContent();
    preloadImage(currentIndex - 1);
  }
  
  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxContent();
    preloadImage(currentIndex + 1);
  }
  
  // Event listeners
  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);
  
  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });
  
  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  }
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
        }
      });
      
      // Toggle current
      item.classList.toggle('open');
    });
  });
}

/* --- Gallery Filters --- */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');
  
  if (!filterBtns.length || !galleryItems.length) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter items
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}
