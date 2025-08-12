/*!
 * FLORYN THEME - MOBILE INTERACTIONS
 * JavaScript otimizado para dispositivos móveis
 */

(function() {
  'use strict';
  
  // Utility functions
  function isMobile() {
    return window.innerWidth <= 1024;
  }
  
  function isTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Mobile Navigation
  class MobileNavigation {
    constructor() {
      this.nav = document.querySelector('.mobile-nav-wrapper');
      this.toggle = document.querySelector('.mobile-nav-toggle');
      this.overlay = document.querySelector('.mobile-nav-overlay');
      this.isOpen = false;
      
      this.init();
    }
    
    init() {
      if (!this.nav || !this.toggle) return;
      
      // Create overlay if it doesn't exist
      if (!this.overlay) {
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(this.overlay);
      }
      
      this.bindEvents();
    }
    
    bindEvents() {
      this.toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleNav();
      });
      
      this.overlay.addEventListener('click', () => {
        this.closeNav();
      });
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeNav();
        }
      });
      
      // Handle window resize
      window.addEventListener('resize', debounce(() => {
        if (!isMobile() && this.isOpen) {
          this.closeNav();
        }
      }, 250));
    }
    
    toggleNav() {
      this.isOpen ? this.closeNav() : this.openNav();
    }
    
    openNav() {
      this.nav.classList.add('is-open');
      this.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      
      // Focus management
      const firstFocusable = this.nav.querySelector('a, button, input');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
    
    closeNav() {
      this.nav.classList.remove('is-open');
      this.overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      this.isOpen = false;
      
      // Return focus to toggle button
      this.toggle.focus();
    }
  }
  
  // Sticky Header
  class StickyHeader {
    constructor() {
      this.header = document.querySelector('.site-header');
      this.lastScrollY = window.scrollY;
      this.threshold = 100;
      
      this.init();
    }
    
    init() {
      if (!this.header || !isMobile()) return;
      
      this.handleScroll = throttle(this.handleScroll.bind(this), 16);
      window.addEventListener('scroll', this.handleScroll);
    }
    
    handleScroll() {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > this.threshold) {
        this.header.classList.add('scrolled');
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
          this.header.style.transform = 'translateY(-100%)';
        } else {
          this.header.style.transform = 'translateY(0)';
        }
      } else {
        this.header.classList.remove('scrolled');
        this.header.style.transform = 'translateY(0)';
      }
      
      this.lastScrollY = currentScrollY;
    }
  }
  
  // Product Image Gallery
  class ProductGallery {
    constructor() {
      this.gallery = document.querySelector('.product-single__photos');
      this.thumbnails = document.querySelectorAll('.product-single__thumbnail');
      this.mainImages = document.querySelectorAll('.product-single__photo');
      
      this.init();
    }
    
    init() {
      if (!this.gallery || !isMobile()) return;
      
      this.setupSwipeGallery();
      this.setupThumbnails();
    }
    
    setupSwipeGallery() {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      let currentIndex = 0;
      
      this.gallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      });
      
      this.gallery.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        
        // Add visual feedback
        this.gallery.style.transform = `translateX(-${diffX}px)`;
      });
      
      this.gallery.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        const diffX = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0 && currentIndex < this.mainImages.length - 1) {
            currentIndex++;
          } else if (diffX < 0 && currentIndex > 0) {
            currentIndex--;
          }
          
          this.showImage(currentIndex);
        }
        
        this.gallery.style.transform = '';
        isDragging = false;
      });
    }
    
    setupThumbnails() {
      this.thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', (e) => {
          e.preventDefault();
          this.showImage(index);
        });
      });
    }
    
    showImage(index) {
      // Hide all images
      this.mainImages.forEach(img => img.classList.add('hide'));
      
      // Show selected image
      if (this.mainImages[index]) {
        this.mainImages[index].classList.remove('hide');
      }
      
      // Update thumbnail active state
      this.thumbnails.forEach(thumb => thumb.classList.remove('active'));
      if (this.thumbnails[index]) {
        this.thumbnails[index].classList.add('active');
      }
    }
  }
  
  // Sticky Add to Cart
  class StickyAddToCart {
    constructor() {
      this.stickyForm = document.querySelector('.stiky_form');
      this.productForm = document.querySelector('#AddToCartForm');
      this.threshold = 300;
      
      this.init();
    }
    
    init() {
      if (!this.stickyForm || !this.productForm || !isMobile()) return;
      
      this.handleScroll = throttle(this.handleScroll.bind(this), 16);
      window.addEventListener('scroll', this.handleScroll);
      
      // Sync sticky form with main form
      this.syncForms();
    }
    
    handleScroll() {
      const scrollY = window.scrollY;
      const productFormRect = this.productForm.getBoundingClientRect();
      
      // Show sticky form when main form is out of view
      if (productFormRect.bottom < 0 && scrollY > this.threshold) {
        this.stickyForm.classList.add('show');
      } else {
        this.stickyForm.classList.remove('show');
      }
    }
    
    syncForms() {
      // Sync variant selection
      const mainSelects = this.productForm.querySelectorAll('.single-option-selector');
      const stickyButton = this.stickyForm.querySelector('.stiky_button');
      
      if (stickyButton) {
        stickyButton.addEventListener('click', () => {
          const submitButton = this.productForm.querySelector('[type="submit"]');
          if (submitButton) {
            submitButton.click();
          }
        });
      }
    }
  }
  
  // Touch Optimizations
  class TouchOptimizations {
    constructor() {
      this.init();
    }
    
    init() {
      if (!isTouch()) return;
      
      this.optimizeButtons();
      this.preventZoom();
      this.optimizeInputs();
    }
    
    optimizeButtons() {
      // Add touch feedback to buttons
      const buttons = document.querySelectorAll('.btn, .product-card, .swatch-element');
      
      buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
          button.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', () => {
          setTimeout(() => {
            button.classList.remove('touch-active');
          }, 150);
        });
      });
    }
    
    preventZoom() {
      // Prevent zoom on input focus (iOS)
      const inputs = document.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        if (input.type !== 'file') {
          const fontSize = window.getComputedStyle(input).fontSize;
          if (parseFloat(fontSize) < 16) {
            input.style.fontSize = '16px';
          }
        }
      });
    }
    
    optimizeInputs() {
      // Add proper input types for mobile keyboards
      const emailInputs = document.querySelectorAll('input[name*="email"]');
      const phoneInputs = document.querySelectorAll('input[name*="phone"]');
      const numberInputs = document.querySelectorAll('input[name*="quantity"]');
      
      emailInputs.forEach(input => {
        if (input.type === 'text') {
          input.type = 'email';
        }
      });
      
      phoneInputs.forEach(input => {
        if (input.type === 'text') {
          input.type = 'tel';
        }
      });
      
      numberInputs.forEach(input => {
        if (input.type === 'text') {
          input.type = 'number';
          input.inputMode = 'numeric';
        }
      });
    }
  }
  
  // Performance Monitor
  class PerformanceMonitor {
    constructor() {
      this.init();
    }
    
    init() {
      if (!window.performance) return;
      
      // Monitor page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          
          if (perfData) {
            console.log('📱 Mobile Performance:', {
              loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
              domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
              firstPaint: this.getFirstPaint()
            });
          }
        }, 0);
      });
    }
    
    getFirstPaint() {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      return firstPaint ? Math.round(firstPaint.startTime) : null;
    }
  }
  
  // Initialize everything when DOM is ready
  function init() {
    // Only initialize mobile features on mobile devices
    if (isMobile()) {
      new MobileNavigation();
      new StickyHeader();
      new ProductGallery();
      new StickyAddToCart();
    }
    
    // Initialize touch optimizations on touch devices
    if (isTouch()) {
      new TouchOptimizations();
    }
    
    // Always initialize performance monitoring
    new PerformanceMonitor();
    
    // Add mobile class to body
    if (isMobile()) {
      document.body.classList.add('is-mobile');
    }
    
    if (isTouch()) {
      document.body.classList.add('is-touch');
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Re-initialize on resize (for responsive behavior)
  window.addEventListener('resize', debounce(() => {
    const wasMobile = document.body.classList.contains('is-mobile');
    const isMobileNow = isMobile();
    
    if (wasMobile !== isMobileNow) {
      if (isMobileNow) {
        document.body.classList.add('is-mobile');
      } else {
        document.body.classList.remove('is-mobile');
      }
      
      // Reinitialize components
      init();
    }
  }, 250));
  
})();