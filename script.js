document.addEventListener('DOMContentLoaded', function() {
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

    // ===== Carrosséis com Scroll Automático e Manual =====
    function setupEnhancedCarousel(carouselClass) {
        const track = document.querySelector(`.${carouselClass}`);
        if (!track) return;

        // Configuração inicial
        let isDragging = false;
        let startX = 0;
        let scrollLeftStart = 0;
        let animationId;
        let autoScrollSpeed = 1;
        let isHovering = false;

        // Rolagem automática suave
        function autoScroll() {
            if (!isDragging && !isHovering) {
                track.scrollLeft += autoScrollSpeed;
                
                // Reinicia no final
                if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 10) {
                    track.scrollTo({ left: 0, behavior: 'auto' });
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        }

        // Eventos de mouse
        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            scrollLeftStart = track.scrollLeft;
            track.style.scrollBehavior = 'auto';
            track.style.cursor = 'grabbing';
        });

        // Eventos de touch
        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            scrollLeftStart = track.scrollLeft;
            track.style.scrollBehavior = 'auto';
        }, { passive: true });

        // Movimento
        const handleMove = (x) => {
            if (!isDragging) return;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeftStart - walk;
        };

        document.addEventListener('mousemove', (e) => handleMove(e.pageX));
        document.addEventListener('touchmove', (e) => handleMove(e.touches[0].pageX), { passive: false });

        // Finalização
        const endDrag = () => {
            isDragging = false;
            track.style.scrollBehavior = 'smooth';
            track.style.cursor = 'grab';
        };

        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        // Pausa no hover (desktop)
        track.addEventListener('mouseenter', () => isHovering = true);
        track.addEventListener('mouseleave', () => isHovering = false);

        // Inicia
        track.style.cursor = 'grab';
        track.style.overflowX = 'hidden';
        animationId = requestAnimationFrame(autoScroll);
    }

    // ===== Inicialização =====
    animateCounters();
    setupEnhancedCarousel('company-track');
    setupEnhancedCarousel('immersion-track');
    
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