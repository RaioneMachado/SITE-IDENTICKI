document.addEventListener('DOMContentLoaded', function() {
    // 1. FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
            
            // Fecha outros itens abertos
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // 2. Smooth scrolling para links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Fecha o menu mobile se estiver aberto
                if (document.querySelector('nav').classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // 3. Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.style.boxShadow = window.scrollY > 50 ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.1)';
    });
    
    // 4. Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    function toggleMobileMenu() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('active');
        
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
    
    // 5. Fecha o menu ao clicar fora
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== mobileBtn && !mobileBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // 6. Carrossel Infinito Otimizado para Mobile
    function setupInfiniteCarousel(trackSelector, itemSelector, duration = 20) {
        const track = document.querySelector(trackSelector);
        const items = document.querySelectorAll(`${trackSelector} ${itemSelector}`);
        
        if (!track || items.length === 0) return;
        
        // Remove clones existentes para evitar duplicação
        track.querySelectorAll('.js-carousel-clone').forEach(clone => clone.remove());
        
        // Duplica os itens (2 cópias para garantir continuidade)
        for (let i = 0; i < 2; i++) {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('js-carousel-clone');
                track.appendChild(clone);
            });
        }
        
        // Configuração da animação
        const firstItem = items[0];
        if (!firstItem) return;
        
        const itemWidth = firstItem.offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 20;
        const totalItemsWidth = (itemWidth + gap) * items.length;
        
        // Cria keyframes dinâmicos
        const styleId = `carousel-style-${trackSelector.replace('.', '')}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            @keyframes infiniteCarousel {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${totalItemsWidth}px); }
            }
            ${trackSelector} {
                animation: infiniteCarousel ${duration}s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
                ${trackSelector} {
                    animation: none;
                }
            }
        `;
        
        // Otimização para mobile - recria ao redimensionar
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setupInfiniteCarousel(trackSelector, itemSelector, duration);
            }, 100);
        }
        
        // Observador para pausar quando não visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    track.style.animationPlayState = 'running';
                } else {
                    track.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(track);
        
        // Event listeners para mobile
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
    }
    
    // 7. Inicialização dos carrosseis com verificação de suporte
    function initCarousels() {
        // Verifica se é mobile
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        // Configurações diferentes para mobile/desktop
        const carousels = [
            {
                selector: '.company-track',
                item: '.company-logo',
                duration: isMobile ? 30 : 20
            },
            {
                selector: '.immersion-track',
                item: '.immersion-photo',
                duration: isMobile ? 30 : 20
            }
        ];
        
        carousels.forEach(carousel => {
            // Inicia imediatamente
            setupInfiniteCarousel(carousel.selector, carousel.item, carousel.duration);
            
            // Reconfigura ao mudar de mobile para desktop ou vice-versa
            window.addEventListener('resize', () => {
                const newIsMobile = window.matchMedia('(max-width: 768px)').matches;
                if (newIsMobile !== isMobile) {
                    setupInfiniteCarousel(
                        carousel.selector, 
                        carousel.item, 
                        newIsMobile ? 30 : 20
                    );
                }
            });
        });
    }
    
    // Inicia tudo
    initCarousels();
});