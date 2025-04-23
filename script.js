document.addEventListener('DOMContentLoaded', function() {
    // Configurações globais
    const config = {
        carousels: [
            { 
                selector: '.company-track', 
                itemSelector: '.company-logo', 
                mobileSpeed: 60,
                desktopSpeed: 30  
            },
            { 
                selector: '.immersion-track', 
                itemSelector: '.immersion-photo', 
                mobileSpeed: 60,
                desktopSpeed: 30  
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

    // 5. Carrossel Infinito - Versão Corrigida (solução definitiva)
    const setupCarousel = (trackElement, itemSelector, speed) => {
        const items = trackElement.querySelectorAll(itemSelector);
        if (items.length < 2) return;

        // Remove clones existentes e reseta a animação
        trackElement.querySelectorAll('.js-carousel-clone').forEach(clone => clone.remove());
        trackElement.style.animation = 'none';
        trackElement.style.transform = 'translateX(0)';

        // Verifica se precisa adicionar clones
        const originalItems = trackElement.querySelectorAll(`${itemSelector}:not(.js-carousel-clone)`);
        if (originalItems.length === items.length) {
            // Duplica itens (2 cópias para transição suave)
            for (let i = 0; i < 2; i++) {
                originalItems.forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.classList.add('js-carousel-clone');
                    trackElement.appendChild(clone);
                });
            }
        }

        // Configura animação com garantia de que as imagens estão carregadas
        const configureAnimation = () => {
            const firstItem = originalItems[0];
            if (!firstItem) return;
            
            const checkImageLoad = () => {
                const img = firstItem.querySelector('img');
                if (img && !img.complete) {
                    img.addEventListener('load', configureAnimation);
                    return false;
                }
                return true;
            };

            if (!checkImageLoad()) return;

            const itemWidth = firstItem.offsetWidth;
            const gap = parseInt(window.getComputedStyle(trackElement).getPropertyValue('gap')) || 20;
            const totalWidth = (itemWidth + gap) * originalItems.length;

            // Configura as propriedades CSS
            trackElement.style.setProperty('--item-width', `${itemWidth}px`);
            trackElement.style.setProperty('--gap-width', `${gap}px`);
            trackElement.style.setProperty('--total-items', originalItems.length);

            // Força um reflow antes de aplicar a animação
            void trackElement.offsetWidth;

            // Aplica a animação
            trackElement.style.animation = `carouselScroll ${speed}s linear infinite`;
        };

        // Adiciona keyframes dinamicamente
        if (!document.getElementById('carouselKeyframes')) {
            const style = document.createElement('style');
            style.id = 'carouselKeyframes';
            style.textContent = `
                @keyframes carouselScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-1 * (var(--item-width) + var(--gap-width)) * var(--total-items))); }
                }
            `;
            document.head.appendChild(style);
        }

        // Inicia animação com pequeno delay para garantir o layout
        setTimeout(configureAnimation, 100);

        // Reconfigura ao redimensionar com debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                trackElement.style.animation = 'none';
                setTimeout(() => {
                    configureAnimation();
                }, 50);
            }, 200);
        });
    };

    const initCarousels = () => {
        config.carousels.forEach(carousel => {
            const track = document.querySelector(carousel.selector);
            if (!track) return;

            const isMobile = window.innerWidth <= 768;
            const speed = isMobile ? carousel.mobileSpeed : carousel.desktopSpeed;
            
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

    // 6. Countdown Timer - Versão Corrigida
    const setupCountdown = () => {
        const countdownEnd = new Date(config.countdownEndDate).getTime();
        const container = document.querySelector('.countdown-container');
        if (!container) return;

        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        const update = () => {
            const now = new Date().getTime();
            const distance = countdownEnd - now;

            if (distance < 0) {
                container.innerHTML = '<div class="countdown-ended">OFERTA ENCERRADA!</div>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        };

        update();
        const timer = setInterval(update, 1000);
    };

    // 7. Animações on Scroll
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

    // Inicialização
    const init = () => {
        setupFAQ();
        setupSmoothScrolling();
        setupHeaderScrollEffect();
        setupMobileMenu();
        initCarousels();
        setupCountdown();
        setupScrollAnimations();
    };

    init();
});

document.getElementById("inscricaoForm").addEventListener("submit", async function(e) {
    e.preventDefault();  // Evita o comportamento padrão de envio do formulário

    const loading = document.getElementById("loading");
    const success = document.getElementById("formSuccess");
    const submitButton = document.querySelector("button[type='submit']");

    submitButton.disabled = true; // Desabilita o botão para evitar múltiplos cliques
    loading.classList.remove("hidden");  // Mostra o ícone de carregamento

    // Captura os dados do formulário
    const formData = new FormData(this);

    // URL do seu Google Apps Script
    const urlDoScript = "https://script.google.com/macros/s/AKfycbyyHM9L7c79Iruy-pBsO3FD85Fa_vynilsIAcRlARKtzNJ237BoPPyJPBXveYptcKd1/exec"; 

    // Define o redirecionamento após o envio (alterado para WhatsApp)
    formData.append("_next", "https://wa.me/5562998721211"); // URL do WhatsApp

    try {
        // Envia os dados para o Google Apps Script
        const response = await fetch(urlDoScript, {
            method: "POST",
            body: formData
        });

        // Verifica se a requisição foi bem-sucedida
        if (response.ok) {
            const result = await response.json();  // Converte a resposta para JSON

            if (result.success) {
                loading.classList.add("hidden");  // Esconde o ícone de carregamento
                success.classList.remove("hidden");  // Mostra a mensagem de sucesso

                // Redireciona imediatamente para o WhatsApp (alterado)
                window.location.href = "https://wa.me/5562998721211";  // URL do WhatsApp
            } else {
                alert("Falha ao processar os dados no servidor.");
                loading.classList.add("hidden");  // Esconde o ícone de carregamento
            }
        } else {
            alert("Erro ao enviar o formulário. Tente novamente.");
            loading.classList.add("hidden");  // Esconde o ícone de carregamento
        }
    } catch (error) {
        // Caso ocorra um erro de conexão, mostra um alerta
        alert("Erro de conexão. Verifique sua internet.");
        loading.classList.add("hidden");  // Esconde o ícone de carregamento
    } finally {
        submitButton.disabled = false; // Reabilita o botão após o envio ser completado
    }
});