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
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    function toggleMobileMenu() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('active');
        
        // Altera o ícone do botão
        const icon = mobileMenuBtn.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Fecha o menu ao clicar fora
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            e.target !== mobileBtn && 
            !mobileBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
});
// Adicione este código ao seu script.js
function setupCarousel() {
    const track = document.querySelector('.company-track');
    const logos = document.querySelectorAll('.company-track img');
    const logosCount = logos.length / 2; // Dividido por 2 porque duplicamos os itens
    
    // Ajusta a largura do track para acomodar todas as logos
    const logoWidth = 100; // Largura aproximada de cada logo + gap
    track.style.width = `${logoWidth * logosCount * 2}px`;
    
    // Reinicia a animação quando terminar para evitar piscar
    track.addEventListener('animationiteration', () => {
        track.style.animation = 'none';
        void track.offsetWidth; // Trigger reflow
        track.style.animation = 'scroll 30s linear infinite';
    });
}

// Chame a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', setupCarousel);
// Contadores animados
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed  = 200; // Quanto menor, mais rápido
    const mentorSection = document.querySelector('.mentor-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const increment = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(animateCounters, 1);
                    } else {
                        counter.innerText = target;
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(mentorSection);
}

// Chame a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', animateCounters);
// Contador regressivo
function updateTimer() {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 3); // 3 dias a partir de agora
    
    const diff = endDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Efeito de flip nos dígitos que mudaram
    const timerItems = document.querySelectorAll('.timer-item');
    timerItems.forEach(item => {
        item.classList.add('flip');
        setTimeout(() => item.classList.remove('flip'), 1000);
    });
}

// Iniciar contador
updateTimer();
setInterval(updateTimer, 1000);

// Animar elementos quando visíveis na tela
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.slide-in-left, .slide-in-right, .rotate-3d').forEach(el => {
    observer.observe(el);
});