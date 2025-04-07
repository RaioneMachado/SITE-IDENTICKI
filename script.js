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
                const nav = document.querySelector('nav');
                if (nav && nav.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // 3. Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 50 ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
    }
    
    // 4. Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    function toggleMobileMenu() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        nav.classList.toggle('active');
        
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    }
    
    // 5. Fecha o menu ao clicar fora
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav && nav.classList.contains('active') && !nav.contains(e.target) && e.target !== mobileBtn && (!mobileBtn || !mobileBtn.contains(e.target))) {
            toggleMobileMenu();
        }
    });
    
    // 6. Carrossel Infinito Otimizado para Mobile
    function setupInfiniteCarousel(trackSelector, itemSelector, duration = 20) {
        const track = document.querySelector(trackSelector);
        if (!track) return;
        
        const items = document.querySelectorAll(`${trackSelector} ${itemSelector}`);
        if (items.length === 0) return;
        
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
    
    // 8. Countdown Timer
    function setupCountdown() {
        // Configura a data final do countdown (31 de abril de 2025 às 23:59)
        const countdownDate = new Date('April 31, 2025 23:59:59').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            // Cálculos para dias, horas, minutos e segundos
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Atualiza os elementos se existirem
            const updateElement = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value.toString().padStart(2, '0');
            };

            updateElement('countdown-days', days);
            updateElement('countdown-hours', hours);
            updateElement('countdown-minutes', minutes);
            updateElement('countdown-seconds', seconds);

            // Se o contador chegar a zero
            if (distance < 0) {
                clearInterval(countdownInterval);
                const container = document.querySelector('.countdown-container');
                if (container) {
                    container.innerHTML = '<div class="countdown-ended">OFERTA ENCERRADA!</div>';
                }
            }
        }

        // Atualiza o contador a cada 1 segundo
        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Executa imediatamente para evitar delay inicial
    }
    
    // 9. Animações de elementos
    function setupAnimations() {
        // Animação de digitação no texto emocional
        const emotionalLead = document.querySelector('.emotional-lead .highlight-text');
        if (emotionalLead) {
            const originalText = emotionalLead.textContent;
            emotionalLead.textContent = '';
            
            let i = 0;
            const typingEffect = setInterval(() => {
                if (i < originalText.length) {
                    emotionalLead.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typingEffect);
                }
            }, 50);
        }

        // Animação dos cards ao aparecer na tela
        const cards = document.querySelectorAll('.t-card');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            observer.observe(card);
        });

        // Efeito hover nos cards
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px)';
                this.style.boxShadow = '0 20px 40px rgba(233, 102, 41, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            });
        });

        // Efeito nas imagens antes/depois
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        imageWrappers.forEach(wrapper => {
            wrapper.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleY = (x - centerX) / 20;
                const angleX = (centerY - y) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });
            
            wrapper.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // 10. Mobile Images Setup
    function setupMobileImages() {
        const wrappers = document.querySelectorAll('.image-wrapper');

        wrappers.forEach(wrapper => {
            const clone = wrapper.cloneNode(true);
            wrapper.parentNode.replaceChild(clone, wrapper);
        });

        if (window.innerWidth <= 768) {
            const newWrappers = document.querySelectorAll('.image-wrapper');

            newWrappers.forEach(wrapper => {
                wrapper.addEventListener('touchstart', function() {
                    this.style.zIndex = '3';
                    this.style.transform = 'translateX(0) rotate(0deg) scale(1.05)';
                });

                wrapper.addEventListener('touchend', function() {
                    if (this.classList.contains('before-img')) {
                        this.style.transform = 'translateX(10%) rotate(-5deg)';
                    } else {
                        this.style.transform = 'translateX(-10%) rotate(5deg)';
                    }
                    this.style.zIndex = this.classList.contains('before-img') ? '2' : '1';
                });
            });
        }
    }

    // Inicia todas as funções
    initCarousels();
    setupCountdown();
    setupAnimations();
    setupMobileImages();

    // Configura o listener de redimensionamento para mobile images
    window.addEventListener('resize', setupMobileImages);
});
// Efeito ao aparecer na tela (scroll reveal simples)
document.addEventListener("DOMContentLoaded", function () {
    const influenceImage = document.querySelector(".influence-image");
  
    if (influenceImage) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            influenceImage.classList.add("show");
          }
        });
      }, {
        threshold: 0.5,
      });
  
      observer.observe(influenceImage);
    }
  });
  