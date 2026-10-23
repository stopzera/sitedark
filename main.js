// STOPZERA — interações, cursor, preloader, scroll reveal e partículas WebGL

document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const cursor = document.getElementById("cursor");
  const navbar = document.getElementById("navbar");
  const year = document.getElementById("year");

  // Ano automático no footer
  if (year) year.textContent = new Date().getFullYear();

  // Preloader
  setTimeout(() => {
    preloader.classList.add("hidden");
    setTimeout(() => preloader.remove(), 1100);
  }, 1500);

  // Navbar compacta ao rolar
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Cursor customizado
  if (window.matchMedia("(pointer: fine)").matches) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener("mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    });

    function animateCursor() {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      cursor.style.left = currentX + "px";
      cursor.style.top = currentY + "px";
      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("mouseenter", () => cursor.classList.add("active"));
      element.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    });
  }

  // Animações ao rolar
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  // Parallax leve no Hero
  const heroContent = document.querySelector(".hero-content");
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
  }, { passive: true });

  // Campo de partículas interativo
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: null, y: null };
  let animationId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 1.75);
    canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 1.75);
    ctx.scale(Math.min(window.devicePixelRatio, 1.75), Math.min(window.devicePixelRatio, 1.75));
  }

  function createParticles() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 700 : 1600;
    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        z: Math.random() * 1 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 140) {
          particle.x -= dx * 0.008;
          particle.y -= dy * 0.008;
        }
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.z * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(124, 92, 255, 0.75)";
      ctx.fill();
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  function startParticles() {
    resizeCanvas();
    createParticles();

    if (animationId) cancelAnimationFrame(animationId);
    drawParticles();
  }

  window.addEventListener("resize", startParticles);

  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Pausa quando o Hero sai da tela — melhora performance
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!animationId) drawParticles();
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  });

  heroObserver.observe(document.getElementById("hero"));

  startParticles();
});
