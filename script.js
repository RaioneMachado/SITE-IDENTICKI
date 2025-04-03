document.addEventListener('DOMContentLoaded', function() {
    // FAQ Toggle
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
    
    // Smooth scrolling para links
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
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.style.boxShadow = window.scrollY > 50 ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.1)';
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    function toggleMobileMenu() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('active');
        
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
    
    // Fecha o menu ao clicar fora
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== mobileBtn && !mobileBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    function setupInfiniteCarousel(trackSelector, itemSelector, duration = 30) {
        const track = document.querySelector(trackSelector);
        const items = document.querySelectorAll(`${trackSelector} ${itemSelector}`);
        
        if (!track || items.length === 0) return;
        
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        track.style.display = 'flex';
        track.style.gap = '20px';
        track.style.animation = `scroll ${duration}s linear infinite`;
    }
    
    setupInfiniteCarousel('.company-track', '.company-logo', 20);
    setupInfiniteCarousel('.immersion-track', '.immersion-photo', 20);
});
