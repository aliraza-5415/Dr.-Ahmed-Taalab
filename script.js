// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 80,
  easing: 'ease-out-cubic'
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
  
  if (scrollTop > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  if (scrollTop > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  if (navLinks.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  });
});

// Typing effect
const typingText = document.getElementById('typingText');
const phrases = [
  'Welcome to Taalab Plastic Surgery',
  'Where Artistry Meets Precision',
  'Your Journey to Confidence Starts Here'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }
  
  let typeSpeed = isDeleting ? 50 : 100;
  
  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500;
  }
  
  setTimeout(typeEffect, typeSpeed);
}
typeEffect();

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const animateCounter = (counter) => {
  const target = +counter.getAttribute('data-count');
  const duration = 2000;
  const start = performance.now();
  
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);
    counter.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  };
  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// Particles canvas
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * (1 - dist/130)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Before/After slider
const baSlider = document.getElementById('baSlider');
const baBefore = document.getElementById('baBefore');
const baHandle = document.getElementById('baHandle');
let isDragging = false;

const setSliderPosition = (clientX) => {
  const rect = baSlider.getBoundingClientRect();
  let x = clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));
  const percent = (x / rect.width) * 100;
  baBefore.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
  baHandle.style.left = percent + '%';
};

baSlider.addEventListener('mousedown', (e) => {
  isDragging = true;
  setSliderPosition(e.clientX);
});
window.addEventListener('mousemove', (e) => {
  if (isDragging) setSliderPosition(e.clientX);
});
window.addEventListener('mouseup', () => { isDragging = false; });

baSlider.addEventListener('touchstart', (e) => {
  isDragging = true;
  setSliderPosition(e.touches[0].clientX);
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (isDragging) setSliderPosition(e.touches[0].clientX);
}, { passive: true });
window.addEventListener('touchend', () => { isDragging = false; });

// Auto animate slider on first view
let autoSlideDone = false;
const baObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !autoSlideDone) {
      autoSlideDone = true;
      let progress = 50;
      let direction = 1;
      const autoSlide = setInterval(() => {
        progress += direction * 1.5;
        if (progress >= 70) direction = -1;
        if (progress <= 30) direction = 1;
        baBefore.style.clipPath = `inset(0 ${100 - progress}% 0 0)`;
        baHandle.style.left = progress + '%';
        if (progress >= 50 && direction === -1 && progress <= 50.5) {
          clearInterval(autoSlide);
          baBefore.style.clipPath = `inset(0 50% 0 0)`;
          baHandle.style.left = '50%';
        }
      }, 30);
      setTimeout(() => clearInterval(autoSlide), 2000);
    }
  });
}, { threshold: 0.4 });
baObserver.observe(baSlider);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
