document.addEventListener('DOMContentLoaded', function () {
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
        anchor.addEventListener('click', function (e) {
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
    document.addEventListener('click', function (e) {
        const nav = document.querySelector('nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');

        if (
            nav &&
            nav.classList.contains('active') &&
            !nav.contains(e.target) &&
            e.target !== mobileBtn &&
            (!mobileBtn || !mobileBtn.contains(e.target))
        ) {
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

        const firstItem = items[0];
        if (!firstItem) return;

        const itemWidth = firstItem.offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 20;
        const totalItemsWidth = (itemWidth + gap) * items.length;

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

        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setupInfiniteCarousel(trackSelector, itemSelector, duration);
            }, 100);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        }, { threshold: 0.1 });

        observer.observe(track);
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
    }

    // 7. Inicialização dos carrosseis com verificação de suporte
    function initCarousels() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

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
            setupInfiniteCarousel(carousel.selector, carousel.item, carousel.duration);

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
        const countdownDate = new Date('April 30, 2025 23:59:59').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const updateElement = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value.toString().padStart(2, '0');
            };

            updateElement('countdown-days', days);
            updateElement('countdown-hours', hours);
            updateElement('countdown-minutes', minutes);
            updateElement('countdown-seconds', seconds);

            if (distance < 0) {
                clearInterval(countdownInterval);
                const container = document.querySelector('.countdown-container');
                if (container) {
                    container.innerHTML = '<div class="countdown-ended">OFERTA ENCERRADA!</div>';
                }
            }
        }

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // 9. Animações de elementos com IntersectionObserver
    function setupAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target); // Anima apenas uma vez
                }
            });
        }, { threshold: 0.2 });

        elements.forEach(el => observer.observe(el));
    }

    // Inicializações finais
    initCarousels();
    setupCountdown();
    setupAnimations();
});
