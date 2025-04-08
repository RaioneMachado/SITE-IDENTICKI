document.addEventListener('DOMContentLoaded', function() {
    // Configurações globais
    const config = {
      carousels: [
        { selector: '.company-track', item: '.company-logo', mobileDuration: 30, desktopDuration: 20 },
        { selector: '.immersion-track', item: '.immersion-photo', mobileDuration: 30, desktopDuration: 20 }
      ],
      countdownEndDate: 'April 30, 2025 23:59:59'
    };
  
    // 1. FAQ Accordion - Versão Ultra Leve
    const setupFAQ = () => {
      const faqItems = document.querySelectorAll('.faq-item');
      if (!faqItems.length) return;
  
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
  
        question.addEventListener('click', () => {
          const isActive = item.classList.toggle('active');
          
          // Fecha outros itens se este foi aberto
          if (isActive) {
            faqItems.forEach(otherItem => {
              if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
              }
            });
          }
        });
      });
    };
  
    // 2. Smooth Scrolling Otimizado
    const setupSmoothScrolling = () => {
      document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor || anchor.getAttribute('href') === '#') return;
  
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Fecha o menu mobile se estiver aberto
          const nav = document.querySelector('nav');
          if (nav && nav.classList.contains('active')) {
            toggleMobileMenu();
          }
  
          // Scroll suave com fallback
          if ('scrollBehavior' in document.documentElement.style) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        }
      }, { passive: true }); // Melhora performance com passive: true
    };
  
    // 3. Header Scroll Effect - Debounced
    const setupHeaderScrollEffect = () => {
      const header = document.querySelector('header');
      if (!header) return;
  
      let lastScrollY = window.scrollY;
      let ticking = false;
  
      const updateHeader = () => {
        header.style.boxShadow = lastScrollY > 50 ? 
          '0 2px 10px rgba(0, 0, 0, 0.2)' : 
          '0 2px 10px rgba(0, 0, 0, 0.1)';
        ticking = false;
      };
  
      window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      }, { passive: true });
    };
  
    // 4. Mobile Menu - Versão Otimizada
    const toggleMobileMenu = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
  
      const isOpening = !nav.classList.contains('active');
      nav.classList.toggle('active');
  
      // Animações mais suaves
      if (isOpening) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
  
      // Atualiza ícone
      const icon = document.querySelector('.mobile-menu-btn i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    };
  
    const setupMobileMenu = () => {
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
      }
  
      // Fecha o menu ao clicar em um link ou fora
      document.addEventListener('click', (e) => {
        const nav = document.querySelector('nav');
        if (!nav || !nav.classList.contains('active')) return;
  
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnButton = e.target.closest('.mobile-menu-btn');
  
        if (!isClickInsideNav && !isClickOnButton) {
          toggleMobileMenu();
        }
      }, { passive: true });
    };
  
    // 5. Carrossel Infinito - Versão Super Otimizada
    const setupInfiniteCarousel = (trackSelector, itemSelector, duration) => {
      const track = document.querySelector(trackSelector);
      if (!track) return;
  
      // Limpa clones existentes
      track.querySelectorAll('.js-carousel-clone').forEach(clone => clone.remove());
  
      // Cria clones apenas se necessário
      const items = document.querySelectorAll(`${trackSelector} ${itemSelector}`);
      if (items.length < 5) { // Apenas para carrosseis com poucos itens
        items.forEach(item => {
          const clone = item.cloneNode(true);
          clone.classList.add('js-carousel-clone');
          track.appendChild(clone);
        });
      }
  
      // Configura animação
      const firstItem = items[0];
      if (!firstItem) return;
  
      const itemWidth = firstItem.offsetWidth;
      const gap = parseInt(window.getComputedStyle(track).gap) || 20;
      const totalWidth = (itemWidth + gap) * items.length;
  
      track.style.setProperty('--carousel-duration', `${duration}s`);
      track.style.setProperty('--carousel-translate', `-${totalWidth}px`);
  
      // Pausa animação quando não visível
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      }, { threshold: 0.1 });
  
      observer.observe(track);
    };
  
    const initCarousels = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
      config.carousels.forEach(carousel => {
        const duration = isMobile ? carousel.mobileDuration : carousel.desktopDuration;
        setupInfiniteCarousel(carousel.selector, carousel.item, duration);
  
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            const newIsMobile = window.matchMedia('(max-width: 768px)').matches;
            if (newIsMobile !== isMobile) {
              const newDuration = newIsMobile ? carousel.mobileDuration : carousel.desktopDuration;
              setupInfiniteCarousel(carousel.selector, carousel.item, newDuration);
            }
          }, 100);
        });
      });
    };
  
    // 6. Countdown Timer - Versão Leve
    const setupCountdown = () => {
      const countdownDate = new Date(config.countdownEndDate).getTime();
      const countdownContainer = document.querySelector('.countdown-container');
      if (!countdownContainer) return;
  
      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
  
        if (distance < 0) {
          countdownContainer.innerHTML = '<div class="countdown-ended">OFERTA ENCERRADA!</div>';
          return;
        }
  
        const days = Math.floor(distance / (86400000));
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);
  
        const updateElement = (id, value) => {
          const el = document.getElementById(id);
          if (el) el.textContent = value.toString().padStart(2, '0');
        };
  
        updateElement('countdown-days', days);
        updateElement('countdown-hours', hours);
        updateElement('countdown-minutes', minutes);
        updateElement('countdown-seconds', seconds);
      };
  
      updateCountdown();
      const countdownInterval = setInterval(updateCountdown, 1000);
    };
  
    // 7. Animações com IntersectionObserver - Versão Otimizada
    const setupAnimations = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
      document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    };
  
    // Inicialização de todos os componentes
    const init = () => {
      setupFAQ();
      setupSmoothScrolling();
      setupHeaderScrollEffect();
      setupMobileMenu();
      initCarousels();
      setupCountdown();
      setupAnimations();
    };
  
    // Inicia tudo
    init();
  });