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

// animated bubble background (drift down)
const bubbleCanvas = document.getElementById('bubbleCanvas');
if (bubbleCanvas) {
  const ctx = bubbleCanvas.getContext('2d');
  let bubbles = [];
  const MAX_BUBBLES = 85; // banyakin biar rame

  function resizeCanvas() {
    bubbleCanvas.width = window.innerWidth;
    bubbleCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createBubble(fromTop = false) {
    const r = Math.random() * 4 + 2; // 2 - 6px (kecil-kecil)
    return {
      x: Math.random() * bubbleCanvas.width,
      y: fromTop ? -10 : Math.random() * bubbleCanvas.height,
      r,
      // turun pelan
      vy: Math.random() * 0.4 + 0.2, 
      // geser dikit biar gak kaku
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.4 + 0.15
    };
  }

  // awalnya isi penuh
  for (let i = 0; i < MAX_BUBBLES; i++) {
    bubbles.push(createBubble());
  }

  function animateBubbles() {
    ctx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

    const isLight = document.body.classList.contains('light');

    bubbles.forEach((b, i) => {
      b.y += b.vy;
      b.x += b.vx;

      // kalau sampai bawah -> spawn lagi di atas
      if (b.y - b.r > bubbleCanvas.height + 8) {
        bubbles[i] = createBubble(true);
      }

      // kalau keluar samping dikit, balikin
      if (b.x < -10) b.x = bubbleCanvas.width + 5;
      if (b.x > bubbleCanvas.width + 10) b.x = -5;

      // gambar
      ctx.beginPath();
      ctx.fillStyle = isLight
        ? `rgba(6,182,212,${b.alpha})`
        : `rgba(203,213,225,${b.alpha})`;
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animateBubbles);
  }

  animateBubbles();
}
