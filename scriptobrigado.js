document.addEventListener('DOMContentLoaded', function() {
    // Criar confetti
    createConfetti();
    
    // Contador regressivo em minutos
    startCountdown(5, 'countdown');
});

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#E96629', '#25D366', '#5CBBB8', '#FFFFFF'];
    
    for (let i = 0; i < 120; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Estilos aleatórios
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${5 + Math.random() * 10}px`;
        confetti.style.height = `${5 + Math.random() * 10}px`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        confetti.style.animationDuration = `${3 + Math.random() * 3}s`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        confettiContainer.appendChild(confetti);
    }
}

function startCountdown(minutes, elementId) {
    const countdownElement = document.getElementById(elementId);
    let remaining = minutes * 60;
    
    const interval = setInterval(() => {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        
        countdownElement.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        remaining--;
        
        if (remaining < 0) {
            clearInterval(interval);
            countdownElement.textContent = "expirado";
            countdownElement.style.color = "#ff5555";
        }
    }, 1000);
}
