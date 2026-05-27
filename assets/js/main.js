function setLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  const btn = document.getElementById('langToggle');
  btn.textContent = lang === 'tr' ? 'EN' : 'TR';
  localStorage.setItem('lang', lang);
  resetTypewriter();
}

const typewriterEl = document.getElementById('typewriter');
let typeIdx = 0, charIdx = 0, isDeleting = false;

function resetTypewriter() {
  typeIdx = 0;
  charIdx = 0;
  isDeleting = false;
  const lang = document.documentElement.getAttribute('data-lang');
  const words = translations[lang].typewriter;
  if (words && words.length > 0) {
    typewriterEl.textContent = words[0].charAt(0);
  }
}

function typeEffect() {
  const lang = document.documentElement.getAttribute('data-lang');
  const words = translations[lang].typewriter;
  if (!words || words.length === 0) { setTimeout(typeEffect, 500); return; }
  typeIdx = typeIdx % words.length;
  const currentWord = words[typeIdx];
  if (!currentWord) { setTimeout(typeEffect, 500); return; }

  if (!isDeleting) {
    typewriterEl.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === currentWord.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
  } else {
    typewriterEl.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      typeIdx = (typeIdx + 1) % words.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 40 : 80);
}

document.getElementById('langToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-lang');
  setLanguage(current === 'tr' ? 'en' : 'tr');
});

const savedLang = localStorage.getItem('lang') || 'tr';
setLanguage(savedLang);
typeEffect();

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav.classList.toggle('scrolled', window.scrollY > 80);

  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section > .container > *').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-bar-fill');
      if (fill) {
        fill.style.width = fill.dataset.width || '0%';
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-item').forEach(el => {
  skillBarObserver.observe(el);
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const numEl = target.querySelector('.stat-num');
      if (numEl && !target.dataset.counted) {
        target.dataset.counted = 'true';
        const text = numEl.textContent;
        const suffix = text.replace(/[\d]/g, '');
        const max = parseInt(text) || 0;
        let current = 0;
        const increment = max / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= max) {
            numEl.textContent = max + suffix;
            clearInterval(timer);
          } else {
            numEl.textContent = Math.floor(current) + suffix;
          }
        }, 30);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(el => {
  counterObserver.observe(el);
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const mouseGlow = document.querySelector('.mouse-glow');
if (mouseGlow) {
  document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
  });
}

function createParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const count = 60;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 99, 255, ${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

createParticles();

window.addEventListener('resize', () => {
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
