document.addEventListener('DOMContentLoaded', function() {
    // Configurações globais
    const config = {
      carousels: [
        { 
          selector: '.company-track', 
          itemSelector: '.company-logo', 
          mobileSpeed: 30, 
          desktopSpeed: 20 
        },
        { 
          selector: '.immersion-track', 
          itemSelector: '.immersion-photo', 
          mobileSpeed: 30, 
          desktopSpeed: 20 
        }
      ],
      countdownEndDate: 'April 30, 2025 23:59:59'
    };
  
    // 1. FAQ Accordion - Versão Otimizada
    const setupFAQ = () => {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
  
        question.addEventListener('click', () => {
          const wasActive = item.classList.contains('active');
          
          // Fecha todos os itens primeiro
          faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
          });
  
          // Abre o item clicado se não estava ativo
          if (!wasActive) {
            item.classList.add('active');
          }
        });
      });
    };
  
    // 2. Smooth Scrolling - Com Debounce
    const setupSmoothScrolling = () => {
      const handleClick = (e) => {
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
  
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
  
      document.addEventListener('click', handleClick, { passive: true });
    };
  
    // 3. Header Scroll Effect - Com Throttle
    const setupHeaderScrollEffect = () => {
      const header = document.querySelector('header');
      if (!header) return;
  
      let lastScrollY = window.scrollY;
      let ticking = false;
  
      const updateHeader = () => {
        header.style.boxShadow = lastScrollY > 50 
          ? '0 2px 10px rgba(0, 0, 0, 0.2)' 
          : '0 2px 10px rgba(0, 0, 0, 0.1)';
        ticking = false;
      };
  
      const handleScroll = () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      };
  
      window.addEventListener('scroll', handleScroll, { passive: true });
    };
  
    // 4. Mobile Menu - Versão Melhorada
    let menuOpen = false;
    const toggleMobileMenu = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
  
      menuOpen = !menuOpen;
      
      if (menuOpen) {
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        nav.classList.remove('active');
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
        if (!menuOpen) return;
  
        const nav = document.querySelector('nav');
        const isClickInsideNav = nav?.contains(e.target);
        const isClickOnButton = e.target.closest('.mobile-menu-btn');
  
        if (!isClickInsideNav && !isClickOnButton) {
          toggleMobileMenu();
        }
      }, { passive: true });
    };
  
    // 5. Carrossel Infinito - Versão Corrigida para Mobile
    const setupCarousel = (trackElement, itemSelector, speed) => {
      const items = trackElement.querySelectorAll(itemSelector);
      if (items.length < 2) return;
  
      // Remove clones existentes
      trackElement.querySelectorAll('.js-carousel-clone').forEach(clone => clone.remove());
  
      // Duplica itens para criar efeito contínuo
      items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('js-carousel-clone');
        trackElement.appendChild(clone);
      });
  
      // Função para calcular e configurar a animação
      const configureAnimation = () => {
        const firstItem = items[0];
        if (!firstItem) return;
        
        // Garante que as imagens estão carregadas
        if (firstItem.querySelector('img') && !firstItem.querySelector('img').complete) {
          firstItem.querySelector('img').addEventListener('load', configureAnimation);
          return;
        }
  
        const itemWidth = firstItem.offsetWidth;
        const gap = parseInt(window.getComputedStyle(trackElement).getPropertyValue('gap')) || 20;
        const totalWidth = (itemWidth + gap) * items.length;
  
        trackElement.style.setProperty('--carousel-duration', `${speed}s`);
        trackElement.style.setProperty('--carousel-translate', `-${totalWidth}px`);
        trackElement.style.animationPlayState = 'running';
      };
  
      // Configura animação após um pequeno delay para garantir que o DOM está pronto
      setTimeout(configureAnimation, 100);
  
      // Configura observer para pausar quando não visível
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          trackElement.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      }, { threshold: 0.1 });
  
      observer.observe(trackElement);
  
      // Reconfigura ao redimensionar
      window.addEventListener('resize', () => {
        setTimeout(configureAnimation, 100);
      });
    };
  
    const initCarousels = () => {
      config.carousels.forEach(carousel => {
        const track = document.querySelector(carousel.selector);
        if (!track) return;
  
        const isMobile = window.innerWidth <= 768;
        const speed = isMobile ? carousel.mobileSpeed : carousel.desktopSpeed;
        
        // Inicializa carrossel
        setupCarousel(track, carousel.itemSelector, speed);
  
        // Atualiza no resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            const newIsMobile = window.innerWidth <= 768;
            const newSpeed = newIsMobile ? carousel.mobileSpeed : carousel.desktopSpeed;
            setupCarousel(track, carousel.itemSelector, newSpeed);
          }, 200);
        });
      });
    };
  
    // 6. Countdown Timer - Versão Simplificada
    const setupCountdown = () => {
      const countdownEnd = new Date(config.countdownEndDate).getTime();
      const container = document.querySelector('.countdown-container');
      if (!container) return;
  
      const update = () => {
        const now = new Date().getTime();
        const distance = countdownEnd - now;
  
        if (distance < 0) {
          container.innerHTML = '<div class="countdown-ended">OFERTA ENCERRADA!</div>';
          return;
        }
  
        const updateElement = (id, value) => {
          const el = document.getElementById(id);
          if (el) el.textContent = Math.floor(value).toString().padStart(2, '0');
        };
  
        updateElement('countdown-days', distance / (1000 * 60 * 60 * 24));
        updateElement('countdown-hours', (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        updateElement('countdown-minutes', (distance % (1000 * 60 * 60)) / (1000 * 60));
        updateElement('countdown-seconds', (distance % (1000 * 60)) / 1000);
      };
  
      update();
      const timer = setInterval(update, 1000);
    };
  
    // 7. Animações on Scroll - Com IntersectionObserver
    const setupScrollAnimations = () => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      if (animatedElements.length === 0) return;
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' 
      });
  
      animatedElements.forEach(el => observer.observe(el));
    };
  
    // Inicialização de todos os componentes
    const init = () => {
      setupFAQ();
      setupSmoothScrolling();
      setupHeaderScrollEffect();
      setupMobileMenu();
      initCarousels();
      setupCountdown();
      setupScrollAnimations();
    };
  
    // Inicia tudo
    init();
});