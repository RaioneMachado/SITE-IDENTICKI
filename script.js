// Aguarda tudo estar completamente carregado, incluindo imagens
window.addEventListener('load', function() {
    // ===== CARROSSEL DA IMERSÃO - SOLUÇÃO DEFINITIVA =====
    function setupImmersionCarousel() {
        const carousel = document.querySelector('.immersion-carousel');
        if (!carousel) return;

        // Mostra o carrossel imediatamente
        carousel.style.opacity = '1';
        const track = carousel.querySelector('.immersion-track');
        const items = track.querySelectorAll('.immersion-photo');
        
        // Configurações do carrossel
        const isMobile = window.innerWidth <= 768;
        const speed = isMobile ? 0.4 : 0.7;
        const gap = 20;
        
        // Clona os itens para efeito infinito
        items.forEach(item => {
            track.appendChild(item.cloneNode(true));
        });

        let position = 0;
        let animationId;
        let isPaused = false;
        let isDragging = false;
        let dragStartX = 0;

        // Função para garantir que as imagens estão carregadas
        function waitForImages(callback) {
            const images = track.querySelectorAll('img');
            let imagesToLoad = images.length;
            
            if (imagesToLoad === 0) {
                callback();
                return;
            }

            const imageLoaded = () => {
                imagesToLoad--;
                if (imagesToLoad === 0) {
                    callback();
                }
            };

            images.forEach(img => {
                if (img.complete) {
                    imageLoaded();
                } else {
                    img.addEventListener('load', imageLoaded);
                    img.addEventListener('error', imageLoaded); // Trata erros também
                }
            });
        }

        function initCarousel() {
            // Força um reflow antes de iniciar
            void track.offsetWidth;
            
            // Configurações iniciais
            track.style.transition = 'transform 0.5s linear';
            track.style.willChange = 'transform';
            
            // Inicia animação
            animate();
        }

        function animate() {
            if (isPaused || isDragging) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            position -= speed;
            const itemWidth = items[0].offsetWidth + gap;
            const totalWidth = itemWidth * items.length;
            
            if (position <= -totalWidth) {
                position = 0;
                track.style.transition = 'none';
                track.style.transform = `translateX(${position}px)`;
                void track.offsetWidth; // Força reflow
                track.style.transition = 'transform 0.5s linear';
            } else {
                track.style.transform = `translateX(${position}px)`;
            }
            
            animationId = requestAnimationFrame(animate);
        }

        // Touch events
        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            isPaused = true;
            dragStartX = e.touches[0].clientX;
            track.style.transition = 'none';
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touchX = e.touches[0].clientX;
            const diff = touchX - dragStartX;
            track.style.transform = `translateX(${position + diff}px)`;
        }, { passive: false });

        track.addEventListener('touchend', () => {
            isDragging = false;
            isPaused = false;
            track.style.transition = 'transform 0.5s linear';
            animate();
        });

        // Pausa no hover (apenas desktop)
        carousel.addEventListener('mouseenter', () => {
            if (!isMobile) isPaused = true;
        });

        carousel.addEventListener('mouseleave', () => {
            if (!isMobile) isPaused = false;
        });

        // Espera as imagens carregarem antes de iniciar
        waitForImages(initCarousel);

        // Redimensionamento
        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationId);
            position = 0;
            track.style.transform = 'translateX(0)';
            setTimeout(initCarousel, 100);
        });
    }

    // ===== FAQ Accordion =====
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
            
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                if (document.querySelector('nav')?.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // ===== Header Scroll Effect =====
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.style.boxShadow = window.scrollY > 50 
                ? '0 2px 10px rgba(0, 0, 0, 0.2)' 
                : '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    function toggleMobileMenu() {
        const nav = document.querySelector('nav');
        const icon = mobileMenuBtn?.querySelector('i');
        
        if (nav && icon) {
            nav.classList.toggle('active');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    }

    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
        const nav = document.querySelector('nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav?.classList.contains('active') && 
            !nav.contains(e.target) && 
            e.target !== mobileBtn && 
            !mobileBtn?.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // ===== Contadores Animados =====
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        const startCounting = () => {
            counters.forEach(counter => {
                const target = +counter.dataset.target || 0;
                const duration = 2000;
                let start = null;

                const step = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    counter.textContent = Math.floor(progress * target);
                    
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target;
                    }
                };
                requestAnimationFrame(step);
            });
        };

        const mentorSection = document.querySelector('.mentor-section');
        if (mentorSection) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        startCounting();
                        observer.disconnect();
                    }
                },
                { threshold: 0.1 }
            );
            observer.observe(mentorSection);
        } else {
            setTimeout(startCounting, 500);
        }
    }

    // ===== Contador Regressivo =====
    function updateTimer() {
        const now = new Date().getTime();
        const endDate = now + (3 * 24 * 60 * 60 * 1000);

        const diff = endDate - now;
        const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

        const setIfExists = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        setIfExists('days', days);
        setIfExists('hours', hours);
        setIfExists('minutes', minutes);
        setIfExists('seconds', seconds);
    }

    // ===== Inicialização =====
    setupImmersionCarousel(); // Inicia o carrossel da imersão
    animateCounters();
    
    if (document.getElementById('days')) {
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ===== Observador de Elementos Animados =====
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-in-left, .slide-in-right, .rotate-3d').forEach(el => {
        animationObserver.observe(el);
    });
});