// smooth scroll to section
function scrollToSection(id) {
  const el = document.getElementById(id) || document.querySelector('.hero');
  el.scrollIntoView({ behavior: 'smooth' });
}

// scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));

// parallax on hero-right
const parallaxCard = document.querySelector('[data-parallax]');
const parallaxWrapper = document.querySelector('.hero-parallax');

if (parallaxCard && parallaxWrapper) {
  parallaxWrapper.addEventListener('mousemove', (e) => {
    const rect = parallaxWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = (x - midX) / 25;
    const rotateX = (midY - y) / 25;

    parallaxCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  });

  parallaxWrapper.addEventListener('mouseleave', () => {
    parallaxCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// theme toggle
const themeBtn = document.getElementById('themeToggle');
const body = document.body;

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    body.classList.toggle('light');
    body.classList.toggle('dark');
    if (body.classList.contains('light')) {
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  });
}

// custom cursor + particle trail
const cursor = document.querySelector('.cursor');
let particleCap = 0;

document.addEventListener('mousemove', (e) => {
  if (cursor) {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }

  if (particleCap < 60) {
    createParticle(e.clientX, e.clientY);
    particleCap++;
    setTimeout(() => { particleCap--; }, 500);
  }
});

function createParticle(x, y) {
  const particle = document.createElement('span');
  particle.className = 'particle';
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  document.body.appendChild(particle);
  setTimeout(() => {
    particle.remove();
  }, 600);
}

// animated bubble background
const bubbleCanvas = document.getElementById('bubbleCanvas');
if (bubbleCanvas) {
  const ctx = bubbleCanvas.getContext('2d');
  let bubbles = [];
  const MAX_BUBBLES = 35; // jadi 55



  function resizeCanvas() {
    bubbleCanvas.width = window.innerWidth;
    bubbleCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createBubble() {
    const r = Math.random() * 18 + 6; // radius 6 - 24
    return {
      x: Math.random() * bubbleCanvas.width,
      y: Math.random() * bubbleCanvas.height,
      r,
      vx: (Math.random() - 0.5) * 1.5,   // gerak pelan
      vy: (Math.random() - 0.5) * 1.5,
      alpha: Math.random() * 0.35 + 0.15
    };
  }

  for (let i = 0; i < MAX_BUBBLES; i++) {
    bubbles.push(createBubble());
  }

  function animateBubbles() {
    ctx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

    bubbles.forEach(b => {
      // gerak
      b.x += b.vx;
      b.y += b.vy;

      // mantul
      if (b.x - b.r < 0 || b.x + b.r > bubbleCanvas.width) b.vx *= -1;
      if (b.y - b.r < 0 || b.y + b.r > bubbleCanvas.height) b.vy *= -1;

      // gambar
      ctx.beginPath();
      // warna beda kalau light
      const isLight = document.body.classList.contains('light');
      ctx.strokeStyle = isLight
        ? `rgba(6,182,212,${b.alpha})`
        : `rgba(56,189,248,${b.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.fillStyle = isLight
        ? `rgba(255,255,255,0.02)`
        : `rgba(3,7,18,0.05)`;
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    requestAnimationFrame(animateBubbles);
  }

  animateBubbles();
}
