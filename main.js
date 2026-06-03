// Loader
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 2200);
});

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      obs.unobserve(e.target);
    }
  });
}, { threshold: .06, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// Parallax hero
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.querySelector('.hero h1');
  const sub = document.querySelector('.hero-sub');
  if (h && s < window.innerHeight) {
    h.style.transform = `translateY(${s * .12}px)`;
    sub.style.transform = `translateY(${s * .08}px)`;
    sub.style.opacity = 1 - s / (window.innerHeight * .7);
  }
});

// Mobile menu
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('menuBtn');
  menu.classList.toggle('open');
  btn.classList.toggle('active');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('menuBtn').classList.remove('active');
  document.body.style.overflow = '';
}

// Video lightbox
function embedVideo(card) {
  const vid = card.dataset.vid;
  if (!vid) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'video-lightbox';
  overlay.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-container">
      <button class="lb-close" aria-label="Close">&times;</button>
      <div class="lb-frame">
        <iframe
          src="https://drive.google.com/file/d/${vid}/preview"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Animate in
  requestAnimationFrame(() => overlay.classList.add('open'));

  // Close handlers
  function closeLightbox() {
    overlay.classList.remove('open');
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 300);
  }

  overlay.querySelector('.lb-close').addEventListener('click', closeLightbox);
  overlay.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', onKey); }
  });
}