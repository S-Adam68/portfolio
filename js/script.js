// ===== Theme toggle =====
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  root.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  if (next === 'dark') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('theme', next);
});

// ===== Mobile nav =====
const burger = document.getElementById('burger');
const navMobile = document.getElementById('nav-mobile');

if (burger && navMobile) {
  burger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    burger.classList.toggle('active');
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMobile.classList.remove('open'));
  });
}

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// ===== Skill bars fill on scroll =====
const bars = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

bars.forEach(bar => barObserver.observe(bar));

// ===== Popups preuves =====
function openPopup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePopup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('popup-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.popup-overlay.open').forEach(el => {
      el.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ===== Terminal typing animation =====
const terminalBody = document.getElementById('terminal-body');

const lines = [
  { prompt: '$ ', text: 'whoami', type: 'cmd' },
  { text: 'adam.sebar — BUT R&T, IUT de Colmar', type: 'out' },
  { prompt: '$ ', text: 'cat objectif.txt', type: 'cmd' },
  { text: 'Acquisition client & IA — alternance recherchée', type: 'out' },
  { prompt: '$ ', text: 'ls projets/', type: 'cmd' },
  { text: 'sae-1.05-gros-fichiers/  sae-1.04-reseau/  cyber-sensibilisation/', type: 'out-muted' },
  { prompt: '$ ', text: 'ping recruteur.fr', type: 'cmd' },
  { text: 'Réponse de recruteur.fr : temps=1ms statut=motivé', type: 'out' },
  { prompt: '$ ', text: '_', type: 'final' },
];

function typeLine(lineEl, text, speed, callback) {
  let i = 0;
  const span = document.createElement('span');
  lineEl.appendChild(span);
  function step() {
    if (i < text.length) {
      span.textContent += text[i];
      i++;
      setTimeout(step, speed);
    } else if (callback) {
      callback();
    }
  }
  step();
}

function runTerminal(index = 0) {
  if (!terminalBody) return;

  const line = lines[index];
  const row = document.createElement('div');

  if (line.type === 'cmd') {
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = line.prompt;
    row.appendChild(promptSpan);
    terminalBody.appendChild(row);
    typeLine(row, line.text, 45, () => setTimeout(() => runTerminal(index + 1), 350));
  } else if (line.type === 'final') {
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = line.prompt;
    row.appendChild(promptSpan);
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    row.appendChild(cursor);
    terminalBody.appendChild(row);
    setTimeout(() => {
      terminalBody.innerHTML = '';
      runTerminal(0);
    }, 4000);
  } else {
    row.className = line.type;
    terminalBody.appendChild(row);
    typeLine(row, line.text, 12, () => setTimeout(() => runTerminal(index + 1), 250));
  }
}

runTerminal();
