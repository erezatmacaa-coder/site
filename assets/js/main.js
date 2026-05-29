function setLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  document.getElementById('langToggle').textContent = lang === 'tr' ? 'EN' : 'TR';
  localStorage.setItem('lang', lang);
  resetTypewriter();
}

const typewriterEl = document.getElementById('typewriter');
let typeIdx = 0, charIdx = 0, isDeleting = false;

function resetTypewriter() {
  typeIdx = 0; charIdx = 0; isDeleting = false;
  const lang = document.documentElement.getAttribute('data-lang');
  const words = translations[lang]?.typewriter;
  if (words?.length) typewriterEl.textContent = words[0].charAt(0);
}

function typeEffect() {
  const lang = document.documentElement.getAttribute('data-lang');
  const words = translations[lang]?.typewriter;
  if (!words?.length) { setTimeout(typeEffect, 500); return; }
  typeIdx = typeIdx % words.length;
  const word = words[typeIdx];
  if (!word) { setTimeout(typeEffect, 500); return; }
  if (!isDeleting) {
    typewriterEl.textContent = word.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === word.length) { isDeleting = true; setTimeout(typeEffect, 2000); return; }
  } else {
    typewriterEl.textContent = word.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { isDeleting = false; typeIdx = (typeIdx + 1) % words.length; }
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

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// === REVEAL OBSERVER ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObserver.observe(el));

// === SCROLL PROGRESS & NAV ===
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav.classList.toggle('scrolled', window.scrollY > 80);

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 150;
    if (window.scrollY >= top) current = s.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
  });
});

// === COUNTER ===
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const numEl = target.querySelector('.stat-num');
      if (numEl && !target.dataset.counted) {
        target.dataset.counted = 'true';
        const text = numEl.textContent;
        const digits = text.match(/[\d]+/);
        if (!digits) return;
        const suffix = text.replace(/[\d]/g, '');
        const max = parseInt(digits[0]) || 0;
        let current = 0;
        const inc = max / 40;
        const timer = setInterval(() => {
          current += inc;
          if (current >= max) { numEl.textContent = max + suffix; clearInterval(timer); }
          else numEl.textContent = Math.floor(current) + suffix;
        }, 30);
      }
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat').forEach(el => counterObserver.observe(el));

// === 3D TILT ===
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y - rect.height / 2) / (rect.height / 2) * -6;
    const rotateY = (x - rect.width / 2) / (rect.width / 2) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  });
});

// === SKILL BAR FILL ===
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-bar-fill');
      if (fill) fill.style.width = fill.dataset.width || '0%';
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar-item').forEach(el => skillBarObserver.observe(el));

// === MAGNETIC BUTTONS ===
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// === SPOTLIGHT CURSOR ===
const glow = document.querySelector('.cursor-glow');
if (glow) {
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function animateGlow() {
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// === PARTICLES WITH CONNECTIONS ===
function createParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const count = Math.min(80, Math.floor(window.innerWidth / 12));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.3 + 0.1
    });
  }

  let mx = -1000, my = -1000;
  canvas.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  canvas.addEventListener('mouseleave', () => { mx = -1000; my = -1000; });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;

      const dx = mx - p.x, dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) { p.x -= dx * 0.008; p.y -= dy * 0.008; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}
createParticles();

window.addEventListener('resize', () => {
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
});

// === SPARKLE ON PRIMARY ===
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const colors = ['#00d4ff', '#8b5cf6', '#ec4899', '#fff'];
    for (let i = 0; i < 15; i++) {
      const spark = document.createElement('div');
      spark.style.cssText = `position:fixed;width:5px;height:5px;border-radius:50%;background:${colors[Math.floor(Math.random()*colors.length)]};pointer-events:none;z-index:9999;left:${e.clientX}px;top:${e.clientY}px`;
      document.body.appendChild(spark);
      const angle = (Math.PI * 2 / 15) * i;
      const vel = 100 + Math.random() * 100;
      spark.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle)*vel}px, ${Math.sin(angle)*vel - 80}px) scale(0)`, opacity: 0 }
      ], { duration: 700, easing: 'cubic-bezier(0,.8,.5,1)' }).onfinish = () => spark.remove();
    }
  });
});

// === SMOOTH ANCHOR ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
