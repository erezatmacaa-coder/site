function setLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  const btn = document.getElementById('langToggle');
  btn.textContent = lang === 'tr' ? 'EN' : 'TR';
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

// === 1. REVEAL OBSERVER ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.section > .container > *').forEach(el => {
  if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  }
});

// === 2. SCROLL PROGRESS ===
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav.classList.toggle('scrolled', window.scrollY > 80);
  const sp = document.getElementById('scrollProgress');
  if (sp) {
    const st = document.documentElement.scrollTop || document.body.scrollTop;
    const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    sp.style.width = ((st / sh) * 100) + '%';
  }
});

// === 3. SKILL BAR FILL ===
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-bar-fill');
      if (fill) fill.style.width = fill.dataset.width || '0%';
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar-item').forEach(el => skillBarObserver.observe(el));

// === 4. COUNTER ANIMATION ===
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

// === 5. 3D TILT ON CARDS ===
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  });
});

// === 6. MAGNETIC BUTTONS ===
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// === 7. SPOTLIGHT CURSOR (upgraded glow) ===
const glow = document.querySelector('.mouse-glow');
if (glow) {
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function animateGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// === 8. SPLIT TEXT REVEAL ===
function splitText() {
  document.querySelectorAll('.split-text').forEach(el => {
    if (el.dataset.split) return;
    el.dataset.split = 'true';
    const text = el.textContent;
    const chars = text.split('');
    el.textContent = '';
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.03}s`;
      span.style.opacity = '0';
      span.style.transform = 'translateY(30px) rotateX(90deg)';
      el.appendChild(span);
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.querySelectorAll('span').forEach(s => { s.style.opacity = '1'; s.style.transform = 'translateY(0) rotateX(0deg)'; });
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
  });
}
splitText();

// === 9. CONFETTI / SPARKLE ON HERO BUTTONS ===
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    for (let i = 0; i < 12; i++) {
      const spark = document.createElement('div');
      spark.style.cssText = `position:fixed;width:6px;height:6px;border-radius:50%;background:${['#6C63FF','#00E5FF','#8B5CF6'][Math.floor(Math.random()*3)]};pointer-events:none;z-index:9999;left:${e.clientX}px;top:${e.clientY}px`;
      document.body.appendChild(spark);
      const angle = (Math.PI * 2 / 12) * i;
      const vel = 120 + Math.random() * 80;
      const dx = Math.cos(angle) * vel;
      const dy = Math.sin(angle) * vel - 100;
      spark.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }], { duration: 800, easing: 'cubic-bezier(0,.8,.5,1)' }).onfinish = () => spark.remove();
    }
  });
});

// === 10. PARTICLES ===
function createParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  const count = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4, speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1
    });
  }
  let mouseX = -1000, mouseY = -1000;
  canvas.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  canvas.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) { p.x -= dx * 0.01; p.y -= dy * 0.01; }
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
  if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
});

// === 11. SMOOTH ANCHOR SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
