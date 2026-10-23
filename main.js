// ==========================================================================
// STOPZERA WEBGL ENGINE & SCENE COMPOSITOR (THREE.JS ALCHE CLONE)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initThreeScene();
  initTextScramble();
  initMenu();
});

// --------------------------------------------------------------------------
// 1. THREE.JS 3D SCENE (CYBER TUNNEL + REFRACTIVE PRISM + FLOATING CARDS)
// --------------------------------------------------------------------------
function initThreeScene() {
  const canvas = document.getElementById("webgl-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030305, 0.045);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  // A. CYLINDRICAL CURVED TECH GRID TUNNEL (Alche background)
  const tunnelGeo = new THREE.CylinderGeometry(4.2, 4.2, 36, 32, 48, true);
  const tunnelMat = new THREE.MeshBasicMaterial({
    color: 0x454558,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
    side: THREE.BackSide
  });
  const tunnelMesh = new THREE.Mesh(tunnelGeo, tunnelMat);
  tunnelMesh.rotation.x = Math.PI / 2;
  scene.add(tunnelMesh);

  // B. FLOATING SACRED PRISM (Alche Center Triangle)
  const prismGeo = new THREE.ConeGeometry(1.6, 2.4, 3, 1, false);

  // Wireframe outer cage
  const prismWireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });
  const prismWire = new THREE.Mesh(prismGeo, prismWireMat);

  // Inner Iridescent Core
  const prismCoreGeo = new THREE.ConeGeometry(1.4, 2.1, 3);
  const prismCoreMat = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
    wireframe: false
  });
  const prismCore = new THREE.Mesh(prismCoreGeo, prismCoreMat);

  const prismGroup = new THREE.Group();
  prismGroup.add(prismWire);
  prismGroup.add(prismCore);
  prismGroup.position.set(0, 0, 0);
  scene.add(prismGroup);

  // C. FLOATING 3D CAROUSEL PLANES (Alche Works 3D Cards)
  const cardsGroup = new THREE.Group();
  const cardGeo = new THREE.PlaneGeometry(1.8, 1.1);

  for (let i = 0; i < 3; i++) {
    const cardMat = new THREE.MeshBasicMaterial({
      color: 0x222230,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    const angle = (i / 3) * Math.PI * 2;
    cardMesh.position.set(Math.cos(angle) * 3, Math.sin(angle) * 1.2 - 0.5, Math.sin(angle) * 2 - 2);
    cardMesh.rotation.y = -angle;
    cardsGroup.add(cardMesh);
  }
  scene.add(cardsGroup);

  // D. MOUSE PARALLAX & SCROLL INTERACTION
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("scroll", () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  // Render Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Lerp scroll
    scrollY += (targetScrollY - scrollY) * 0.08;
    const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight || 1);

    // Rotate tunnel & advance along Z
    tunnelMesh.rotation.y = time * 0.05 + scrollProgress * 2;
    tunnelMesh.position.z = (scrollProgress * 12) % 6;

    // Prism subtle levitation + scroll transform
    prismGroup.rotation.y = time * 0.4 + mouseX * 0.5;
    prismGroup.rotation.x = Math.sin(time * 0.5) * 0.2 + mouseY * 0.3;
    prismGroup.position.y = Math.sin(time) * 0.15 - (scrollProgress * 2);
    prismGroup.position.z = Math.sin(scrollProgress * Math.PI) * 1.5;

    // Cards stream orbit
    cardsGroup.rotation.y = time * 0.1 + scrollProgress * 3;

    // Camera breathing
    camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  });
}

// --------------------------------------------------------------------------
// 2. TEXT SCRAMBLE DECODER (ALCHE TYPOGRAPHIC EFFECT 00:02 - 00:04)
// --------------------------------------------------------------------------
function initTextScramble() {
  const el = document.getElementById("manifestoHeading");
  if (!el) return;

  const originalText = "Architect digital realities that move hearts and spark wonder.";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#________";
  let iteration = 0;
  let interval = null;

  function runScramble() {
    clearInterval(interval);
    iteration = 0;
    interval = setInterval(() => {
      el.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 28);
  }

  // Trigger when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runScramble();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(el);
}

// --------------------------------------------------------------------------
// 3. FULLSCREEN NAVIGATION OVERLAY
// --------------------------------------------------------------------------
function initMenu() {
  const toggle = document.getElementById("navToggle");
  const overlay = document.getElementById("menuOverlay");
  const links = document.querySelectorAll(".menu-link");

  if (!toggle || !overlay) return;

  toggle.addEventListener("click", () => {
    overlay.classList.toggle("active");
  });

  links.forEach((l) => {
    l.addEventListener("click", () => {
      overlay.classList.remove("active");
    });
  });
}
