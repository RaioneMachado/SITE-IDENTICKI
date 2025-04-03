document.addEventListener('DOMContentLoaded', function() {
    // ===== FAQ Accordion =====
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
            
            // Fecha outros itens
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
                    block: 'start' // Alinhar ao topo
                });
                
                // Fecha menu mobile se aberto
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

    // ===== Contadores Animados (FIX PRINCIPAL) =====
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        const startCounting = () => {
            counters.forEach(counter => {
                const target = +counter.dataset.target || 0;
                const duration = 2000; // 2s para completar
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

        // Tenta usar IntersectionObserver
        const mentorSection = document.querySelector('.mentor-section');
        if (mentorSection) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        startCounting();
                        observer.disconnect();
                    }
                },
                { 
                    threshold: 0.1,
                    rootMargin: '0px 0px -100px 0px' // Ativa 100px antes de chegar no elemento
                }
            );
            observer.observe(mentorSection);
        } else {
            // Fallback: Inicia após 500ms
            setTimeout(startCounting, 500);
        }
    }

    // ===== Contador Regressivo (Compatible com Safari) =====
    function updateTimer() {
        const now = new Date().getTime();
        const endDate = now + (3 * 24 * 60 * 60 * 1000); // 3 dias no futuro

        const diff = endDate - now;
        const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

        // Atualiza apenas elementos existentes
        const setIfExists = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        setIfExists('days', days);
        setIfExists('hours', hours);
        setIfExists('minutes', minutes);
        setIfExists('seconds', seconds);
    }

    // ===== Carrossel de Logos =====
    function setupCarousel() {
        const track = document.querySelector('.company-track');
        if (!track) return;

        const logos = track.querySelectorAll('img');
        track.style.width = `${logos.length * 100}px`;

        // Reinicia animação suavemente
        track.addEventListener('animationiteration', () => {
            track.style.animation = 'none';
            void track.offsetWidth; // Force reflow
            track.style.animation = 'scroll 30s linear infinite';
        });
    }

    // ===== Inicialização =====
    animateCounters();
    setupCarousel();
    
    if (document.getElementById('days')) {
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ===== Observador de Elementos Animados =====
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 }).observe(document.querySelector('.slide-in-left, .slide-in-right, .rotate-3d'));
});