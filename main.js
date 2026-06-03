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

// Autoplay muted when card enters viewport, pause when it leaves
const videoObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const vid = e.target.querySelector('video.poster');
    if (!vid) return;
    if (e.isIntersecting) vid.play().catch(() => {});
    else { vid.pause(); vid.currentTime = 0; }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.bento-card').forEach(card => videoObs.observe(card));

// Unmute on hover, remute on leave
document.querySelectorAll('.bento-card').forEach(card => {
  const vid = card.querySelector('video.poster');
  if (!vid) return;
  card.addEventListener('mouseenter', () => { vid.muted = false; });
  card.addEventListener('mouseleave', () => { vid.muted = true; });
});

// Video lightbox — native player
function embedVideo(card) {
  const src = card.dataset.vid;
  if (!src) return;

  // Mute the card video when lightbox opens
  const cardVid = card.querySelector('video.poster');
  if (cardVid) cardVid.muted = true;

  const overlay = document.createElement('div');
  overlay.id = 'video-lightbox';
  overlay.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-container">
      <button class="lb-close" aria-label="Close">&times;</button>
      <div class="lb-frame">
        <video src="${src}" controls autoplay playsinline style="width:100%;height:100%;background:#000"></video>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('open'));

  function closeLightbox() {
    overlay.querySelector('video').pause();
    overlay.classList.remove('open');
    setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 300);
  }

  overlay.querySelector('.lb-close').addEventListener('click', closeLightbox);
  overlay.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', onKey); }
  });
}