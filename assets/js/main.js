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
}

document.getElementById('langToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-lang');
  setLanguage(current === 'tr' ? 'en' : 'tr');
});

const savedLang = localStorage.getItem('lang') || 'tr';
setLanguage(savedLang);

const typewriterEl = document.getElementById('typewriter');
let typeIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
  const lang = document.documentElement.getAttribute('data-lang');
  const words = translations[lang].typewriter;
  const currentWord = words[typeIdx];

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

typeEffect();

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav.classList.toggle('scrolled', window.scrollY > 80);
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
