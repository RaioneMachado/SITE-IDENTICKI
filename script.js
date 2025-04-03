document.addEventListener('DOMContentLoaded', function() {
    // ===== Configuração do Carrossel Infinito =====
    function setupInfiniteCarousel() {
        const carousel = document.querySelector('.immersion-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.immersion-track');
        const items = track.querySelectorAll('.immersion-photo');
        
        // Configurações adaptáveis
        const isMobile = window.innerWidth <= 768;
        const baseSpeed = isMobile ? 0.4 : 0.7; // Mais lento no mobile
        let speed = baseSpeed;
        const gap = parseInt(window.getComputedStyle(track).gap) || 20;
        
        // Clona os itens para efeito infinito
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        let position = 0;
        let animationId;
        let isPaused = false;
        let isDragging = false;
        let dragStartX = 0;
        let dragOffset = 0;

        function animate() {
            if (isPaused || isDragging) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            position -= speed;
            const firstItemWidth = items[0].offsetWidth + gap;
            const totalWidth = firstItemWidth * items.length;
            
            // Reinicia suavemente quando chega ao final
            if (position <= -totalWidth) {
                position = 0;
                track.style.transition = 'none';
                track.style.transform = `translateX(${position}px)`;
                // Força um reflow antes de restaurar a transição
                void track.offsetWidth;
                track.style.transition = 'transform 0.5s linear';
            } else {
                track.style.transform = `translateX(${position}px)`;
            }
            
            animationId = requestAnimationFrame(animate);
        }

        // ===== Controles de Touch =====
        function handleTouchStart(e) {
            isDragging = true;
            isPaused = true;
            dragStartX = e.touches ? e.touches[0].clientX : e.clientX;
            track.style.transition = 'none';
            cancelAnimationFrame(animationId);
        }

        function handleTouchMove(e) {
            if (!isDragging) return;
            const touchX = e.touches ? e.touches[0].clientX : e.clientX;
            dragOffset = touchX - dragStartX;
            track.style.transform = `translateX(${position + dragOffset}px)`;
        }

        function handleTouchEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            // Ajusta a posição baseada no arrasto
            position += dragOffset;
            dragOffset = 0;
            
            // Suaviza o retorno à animação
            track.style.transition = 'transform 0.3s ease-out';
            setTimeout(() => {
                isPaused = false;
                track.style.transition = 'transform 0.5s linear';
                animate();
            }, 300);
        }

        // Event listeners para touch
        track.addEventListener('touchstart', handleTouchStart, { passive: true });
        track.addEventListener('mousedown', handleTouchStart);
        
        track.addEventListener('touchmove', handleTouchMove, { passive: false });
        track.addEventListener('mousemove', handleTouchMove);
        
        track.addEventListener('touchend', handleTouchEnd);
        track.addEventListener('mouseup', handleTouchEnd);
        track.addEventListener('mouseleave', handleTouchEnd);

        // ===== Controles de Hover =====
        carousel.addEventListener('mouseenter', () => {
            if (!isMobile) {
                isPaused = true;
                track.style.transition = 'transform 0.3s ease-out';
            }
        });

        carousel.addEventListener('mouseleave', () => {
            if (!isMobile) {
                isPaused = false;
                track.style.transition = 'transform 0.5s linear';
                if (!animationId) animate();
            }
        });

        // ===== Adaptação ao Redimensionamento =====
        function handleResize() {
            cancelAnimationFrame(animationId);
            
            // Recalcula a posição proporcionalmente
            const firstItemWidth = items[0].offsetWidth + gap;
            const ratio = position / (firstItemWidth * items.length);
            
            position = ratio * (firstItemWidth * items.length);
            speed = baseSpeed * (window.innerWidth <= 768 ? 0.6 : 1);
            
            track.style.transition = 'none';
            track.style.transform = `translateX(${position}px)`;
            
            // Força um reflow antes de reiniciar a animação
            void track.offsetWidth;
            
            animate();
        }

        window.addEventListener('resize', handleResize);

        // ===== Inicialização =====
        function init() {
            // Garante que os itens estão visíveis antes de calcular tamanhos
            setTimeout(() => {
                track.style.opacity = '1';
                animate();
            }, 100);
        }

        init();

        // ===== Limpeza =====
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            track.removeEventListener('touchstart', handleTouchStart);
            track.removeEventListener('mousedown', handleTouchStart);
            track.removeEventListener('touchmove', handleTouchMove);
            track.removeEventListener('mousemove', handleTouchMove);
            track.removeEventListener('touchend', handleTouchEnd);
            track.removeEventListener('mouseup', handleTouchEnd);
            track.removeEventListener('mouseleave', handleTouchEnd);
            carousel.removeEventListener('mouseenter', () => {});
            carousel.removeEventListener('mouseleave', () => {});
        };
    }

    // ===== Inicialização do Carrossel =====
    setupInfiniteCarousel();

    // ===== Restante do seu código existente =====
    // ... (mantenha todo o resto do seu código JavaScript aqui)
    
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