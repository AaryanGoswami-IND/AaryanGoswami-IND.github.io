/* ===== CUSTOM CURSOR ===== */
const cursorOrb = document.getElementById('cursor-orb');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, orbX = 0, orbY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function animateCursor() {
  orbX += (mouseX - orbX) * 0.2;
  orbY += (mouseY - orbY) * 0.2;
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorOrb.style.left = orbX + 'px';
  cursorOrb.style.top = orbY + 'px';
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mouseover', e => {
  const target = e.target.closest('a, button, .project-card, .showcase-item, .skill-card, .contact-card, .filter-btn, .stat-card, .project-modal-close');
  if (target) {
    document.body.classList.add('cursor-hover');
  } else {
    document.body.classList.remove('cursor-hover');
  }
});

/* ===== NAV SCROLL ===== */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== MOBILE MENU ===== */
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.querySelector('.nav-links');
mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ===== TYPED TEXT ===== */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Building immersive game worlds.',
  'Sculpting characters with soul.',
  'Crafting stunning 3D environments.',
  'Turning imagination into polygons.'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
  const current = phrases[phraseIdx];
  typedEl.textContent = current.substring(0, charIdx);

  if (!isDeleting && charIdx < current.length) {
    charIdx++;
    setTimeout(typeLoop, 60 + Math.random() * 40);
  } else if (!isDeleting && charIdx === current.length) {
    setTimeout(() => { isDeleting = true; typeLoop(); }, 2200);
  } else if (isDeleting && charIdx > 0) {
    charIdx--;
    setTimeout(typeLoop, 30);
  } else {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    setTimeout(typeLoop, 400);
  }
}
typeLoop();

/* ===== PARTICLE BACKGROUND ===== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() > 0.7 ? 20 : (Math.random() > 0.5 ? 270 : 15);
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsl(${this.hue}, 80%, 60%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    // Glow
    ctx.shadowColor = `hsl(${this.hue}, 80%, 60%)`;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.08;
        ctx.strokeStyle = '#ff6a3d';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ===== SKILL BAR ANIMATION ===== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

/* ===== 3D TILT EFFECT ===== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
  });
});

/* ===== PROJECT FILTERS ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category === filter;
      if (matches) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const showcaseItems = document.querySelectorAll('.showcase-item');
let currentLightbox = 0;

showcaseItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentLightbox = index;
    openLightbox(item.dataset.lightbox, item.dataset.caption);
  });
});

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.querySelector('.lightbox-prev').addEventListener('click', e => {
  e.stopPropagation();
  currentLightbox = (currentLightbox - 1 + showcaseItems.length) % showcaseItems.length;
  const item = showcaseItems[currentLightbox];
  lightboxImg.src = item.dataset.lightbox;
  lightboxCaption.textContent = item.dataset.caption || '';
});

document.querySelector('.lightbox-next').addEventListener('click', e => {
  e.stopPropagation();
  currentLightbox = (currentLightbox + 1) % showcaseItems.length;
  const item = showcaseItems[currentLightbox];
  lightboxImg.src = item.dataset.lightbox;
  lightboxCaption.textContent = item.dataset.caption || '';
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
  if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
});

/* ===== FADE-IN KEYFRAME ===== */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== PROJECT DETAIL MODAL ===== */
const projectData = {
  omt: {
    title: 'OneMoreTry',
    category: 'Game Development',
    image: 'assets/images/project_one_more_try.png',
    tools: ['Unity', 'C#', '2D Platformer', 'Game'],
    intro: 'OneMoreTry is a 2D precision platformer that weaponizes your expectations. The world looks like a simple, monochrome throwback to a forgotten arcade cabinet, but don\'t let the retro charm fool you. Every room is designed to lie to you.',
    content: `
      <h3><span class="pm-icon">⚠️</span> Trust Nothing</h3>
      <p>In this world, floors vanish, walls rise from nowhere, and ghosts materialize just as you're about to land. OneMoreTry isn't just about how fast you can jump — it's about how fast you can learn. Every death is a lesson. Every attempt is one step closer to the portal.</p>
      <h3><span class="pm-icon">🖱️</span> Your Cursor is Your Shield</h3>
      <p>Unlike traditional platformers, you aren't helpless against the environment. Use your cursor to interact with the world in real-time. See a spike about to fall? Click it to neutralize it. See a trap primed to fire? Disable it before it clicks back.</p>
      <h3><span class="pm-icon">⏳</span> Master Time Itself</h3>
      <p>When the chaos becomes too much, hold your breath and slow down the world. Use your Time Slow Ability to thread the needle through deadly trap formations and plan your next move in the heat of the moment.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Precision Platforming</strong><span>Tight, physics-based movement with satisfying weight and momentum</span></div>
        <div class="pm-feature"><strong>Deception System</strong><span>Fake floors, rising walls, and ghost objects to subvert your intuition</span></div>
        <div class="pm-feature"><strong>Cursor Interaction</strong><span>Click and hover to disable traps and manipulate the environment</span></div>
        <div class="pm-feature"><strong>Time Manipulation</strong><span>Compress time to survive the most punishing corridors</span></div>
        <div class="pm-feature"><strong>CRT Aesthetic</strong><span>Stunning green-phosphor visual identity dripping with nostalgia</span></div>
        <div class="pm-feature"><strong>Handcrafted Levels</strong><span>3 massive levels of increasing complexity and mastery</span></div>
      </div>
      <div class="pm-controls">
        <h4>Controls</h4>
        <div class="pm-control-row"><span class="pm-control-key">A / D</span><span class="pm-control-action">Move</span></div>
        <div class="pm-control-row"><span class="pm-control-key">Space</span><span class="pm-control-action">Jump</span></div>
        <div class="pm-control-row"><span class="pm-control-key">RMB Hold</span><span class="pm-control-action">Slow Time</span></div>
        <div class="pm-control-row"><span class="pm-control-key">LMB</span><span class="pm-control-action">Disable Highlighted Traps</span></div>
        <div class="pm-control-row"><span class="pm-control-key">Esc</span><span class="pm-control-action">Pause / Settings</span></div>
      </div>`,
    link: 'https://aaryangoswami.itch.io'
  },
  foxy: {
    title: 'Jumpie Fox',
    category: 'Game Development',
    image: 'assets/images/project_foxy.png',
    tools: ['Unity', 'C#', '2D', 'Game'],
    intro: 'Jumpie Fox is a charming 2D platformer prototype built as a gameplay mechanics exploration in Unity. Featuring a lovable fox character, the game tests core platforming fundamentals through colorful block-out levels.',
    content: `
      <h3><span class="pm-icon">🦊</span> Meet Jumpie Fox</h3>
      <p>Play as an adorable fox navigating through a vibrant world of platforming challenges. Each level is designed as a block-out prototype to test jump mechanics, enemy patterns, and level flow before full art pass.</p>
      <h3><span class="pm-icon">🎮</span> Core Mechanics</h3>
      <p>Built with a focus on tight responsive controls, variable jump heights, and smooth character movement. The project served as a deep dive into Unity's 2D physics system, tilemap workflows, and player controller architecture.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Responsive Controls</strong><span>Variable jump height with coyote time and input buffering</span></div>
        <div class="pm-feature"><strong>Level Design</strong><span>Block-out levels testing difficulty curves and pacing</span></div>
        <div class="pm-feature"><strong>Character Animation</strong><span>Sprite-based animation system with state machine</span></div>
        <div class="pm-feature"><strong>Physics Tuning</strong><span>Custom gravity and movement curves for satisfying feel</span></div>
      </div>`,
    link: 'https://aaryangoswami.itch.io'
  },
  titan: {
    title: 'Attack Titan — Fan Art Sculpt',
    category: 'Character Sculpting',
    image: 'assets/images/project_attack_titan.jpg',
    tools: ['ZBrush', 'Substance Painter'],
    intro: 'A highly detailed digital sculpt of the iconic Attack Titan, focusing on raw anatomical power, intricate skin textures, and a menacing presentation.',
    content: `
      <h3><span class="pm-icon">🗿</span> Sculpting Process</h3>
      <p>Starting from a base mesh, the sculpt was built up layer by layer in ZBrush. Intense focus was placed on the exposed musculature, hyper-detailed skin texturing, and the aggressive facial structure to capture the raw, terrifying energy of the Titan. Anatomical accuracy was meticulously balanced with the stylized proportions of the source material.</p>
      <h3><span class="pm-icon">💡</span> Lighting & Texturing</h3>
      <p>The model features complex subsurface scattering to give the flesh a realistic, organic feel. Set against a pure black background, the dramatic studio lighting highlights the micro-surface details of the skin, while the haunting, glowing green eyes serve as a piercing focal point.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Anatomical Detail</strong><span>Realistic muscle fiber and dynamic tendon sculpting</span></div>
        <div class="pm-feature"><strong>Micro-Detailing</strong><span>High-frequency skin pores, veins, and organic imperfections</span></div>
        <div class="pm-feature"><strong>Material Work</strong><span>Subsurface scattering for realistic skin flesh tones</span></div>
        <div class="pm-feature"><strong>Cinematic Lighting</strong><span>Striking contrast with a pitch-black void and glowing elements</span></div>
      </div>`,
    link: null
  },
  minotaur: {
    title: 'Minotaur — Creature Bust',
    category: 'Character Sculpting',
    image: 'assets/images/project_minotaur.png',
    tools: ['ZBrush', 'Substance Painter'],
    intro: 'A highly detailed creature bust sculpt of a mythological Minotaur, focusing on raw muscular power, deep leathery skin textures, and a commanding silhouette.',
    content: `
      <h3><span class="pm-icon">🐂</span> Design Philosophy</h3>
      <p>The Minotaur bust was designed with an emphasis on an intimidating silhouette and bestial ferocity. Exaggerated, massive blackened horns and a thick, muscular neck create a dominating presence. The deep, blood-red skin tone is sharply contrasted by the golden nose ring and piercing, fiery red eyes.</p>
      <h3><span class="pm-icon">✨</span> Surface Detailing</h3>
      <p>Fine detail passes in ZBrush bring the creature to life, featuring deep facial scarring, rough leathery skin textures, and organic asymmetry. The horns showcase realistic growth rings and weathering, while the metallic gold accents provide brilliant material contrast against the dark aesthetic.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Silhouette Design</strong><span>Strong, aggressive shape from every viewing angle</span></div>
        <div class="pm-feature"><strong>Leathery Texturing</strong><span>High-frequency pore and wrinkle detailing for realistic thick skin</span></div>
        <div class="pm-feature"><strong>Horn Detailing</strong><span>Deep growth rings, organic weathering, and a blackened finish</span></div>
        <div class="pm-feature"><strong>Material Contrast</strong><span>Matte red skin contrasted with reflective gold jewelry</span></div>
      </div>`,
    link: null
  },
  katana: {
    title: 'Rengoku Katana — Fan Art',
    category: 'Weapons & Props',
    image: 'assets/images/project_katana.jpg',
    tools: ['Blender', 'Substance Painter'],
    intro: 'A detailed 3D recreation of an iconic flame-themed katana, presented on a wooden stand against a serene sunset and reflective water surface.',
    content: `
      <h3><span class="pm-icon">🔥</span> Blade & Hilt Design</h3>
      <p>Every element of this weapon — from the iconic flame-shaped tsuba (guard) to the deep red, heated blade — incorporates an intense fire-inspired aesthetic. The blade's material is designed to convey a subtle, constant heat, contrasting beautifully with the dark wooden display stand.</p>
      <h3><span class="pm-icon">🎬</span> Cinematic Presentation</h3>
      <p>The final render places the katana in a serene, glowing environment. It rests just above calm, rippling water set against a vibrant sunset sky. Volumetric light sparks and floating embers dance across the scene, drawing attention to the intricate silhouette and the sweeping curvature of the blade.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Hard-Surface Modeling</strong><span>Clean topology for the complex flame guard and sharp blade edge</span></div>
        <div class="pm-feature"><strong>PBR Materials</strong><span>Realistic metal, wrapped fabric, and polished wood shaders</span></div>
        <div class="pm-feature"><strong>Atmospheric FX</strong><span>Floating embers and light particles interacting with the scene</span></div>
        <div class="pm-feature"><strong>Environmental Lighting</strong><span>Warm sunset HDRI paired with a reflective water surface</span></div>
      </div>`,
    link: null
  },
  axe: {
    title: 'Fantasy War Axe',
    category: 'Weapons & Props',
    image: 'assets/images/project_fantasy_axe.jpg',
    tools: ['Maya', 'Substance Painter'],
    intro: 'A stylized game-ready fantasy war axe featuring ornate swirl engravings, dark forged steel, and optimized geometry for real-time game engine deployment.',
    content: `
      <h3><span class="pm-icon">⚔️</span> Design & Modeling</h3>
      <p>The axe design balances fantasy aesthetics with robust, functional weapon proportions. Ornate, swirling engravings cover the dark steel axe head, contrasting beautifully with the deeply textured, realistic dark wooden handle.</p>
      <h3><span class="pm-icon">🎨</span> Texturing Pipeline</h3>
      <p>Textured entirely in Substance Painter using a layered approach to create the dark forged metal look, complete with subtle edge wear. The final presentation uses a clean gradient backdrop to draw pure focus to the high-quality PBR materials.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Game-Ready Mesh</strong><span>Optimized polycount with clean UV layout</span></div>
        <div class="pm-feature"><strong>Ornate Engravings</strong><span>Intricate swirl details baked from a high-poly sculpt</span></div>
        <div class="pm-feature"><strong>Material Definition</strong><span>Strong contrast between the rough wood and the forged steel</span></div>
        <div class="pm-feature"><strong>PBR Compliant</strong><span>Albedo, Normal, Roughness, and Metallic maps</span></div>
      </div>`,
    link: null
  },
  gun: {
    title: 'Cinematic Gun Composition',
    category: 'Weapons & Props',
    image: 'assets/images/project_gun_composition.jpg',
    tools: ['Maya', 'Arnold', 'Substance Painter'],
    intro: 'A sleek, futuristic hard-surface rendering exercise. This composition features a sci-fi handgun on a highly reflective surface with dynamically hovering bullets and soft ambient lighting.',
    content: `
      <h3><span class="pm-icon">🛸</span> Sci-Fi Weapon Design</h3>
      <p>The handgun was designed with a focus on modern sci-fi aesthetics — combining sharp, angular geometric plates with smooth, ergonomic grips. The hovering bullets add a dynamic, anti-gravity element to an otherwise still composition.</p>
      <h3><span class="pm-icon">✨</span> Lighting & Materials</h3>
      <p>The scene utilizes a soft, purple-hued ambient light to create a moody, vaporwave-adjacent atmosphere. The weapon's matte finishes perfectly contrast against the hyper-reflective, pristine white floor, pushing the futuristic tone.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Hard-Surface Modeling</strong><span>Precise edge flow for the complex angular geometry</span></div>
        <div class="pm-feature"><strong>Material Contrast</strong><span>Matte gunmetal and polymer grips against a glossy floor</span></div>
        <div class="pm-feature"><strong>Scene Composition</strong><span>Hovering bullets breaking the static horizontal lines</span></div>
        <div class="pm-feature"><strong>Atmospheric Lighting</strong><span>Soft, colored ambient lighting for a sleek sci-fi mood</span></div>
      </div>`,
    link: null
  },
  haunted: {
    title: 'Haunted House',
    category: 'Environment Art',
    image: 'assets/images/project_haunted_house.jpg',
    tools: ['Maya', 'Arnold', 'Substance Painter'],
    intro: 'A stylized spooky environment featuring rustic architecture, eerie environmental props, and a striking neon horizon. Built as an atmospheric scene composition exercise.',
    content: `
      <h3><span class="pm-icon">🏚️</span> Rustic Environment Design</h3>
      <p>The haunted house was designed with stylized, slightly warped proportions to give it an eerie, whimsical character. The environment is detailed with rustic storytelling props like wooden crates, barrels, and a heavy stone chimney, all anchored by a barren, twisted tree beside the porch.</p>
      <h3><span class="pm-icon">🌌</span> Atmospheric Lighting</h3>
      <p>The scene features a striking, neon blue and pink horizon glow that creates a beautiful contrast against the dark foreground. This vibrant sky produces a stark silhouette of the roofline and chimney, casting cool, moody shadows across the textured stucco walls.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Stylized Architecture</strong><span>Warped proportions and stylized textures for spooky charm</span></div>
        <div class="pm-feature"><strong>Prop Modeling</strong><span>Detailed rustic elements including barrels, crates, and lanterns</span></div>
        <div class="pm-feature"><strong>Atmospheric Lighting</strong><span>Vibrant neon horizon paired with moody foreground shadows</span></div>
        <div class="pm-feature"><strong>Scene Composition</strong><span>Guided eye flow balancing the heavy structure and dead tree</span></div>
      </div>`,
    link: null
  },
  cheetah: {
    title: 'Cheetah Skull — Anatomical Sculpt',
    category: 'Character Sculpting',
    image: 'assets/images/project_cheetah_skull.jpg',
    tools: ['ZBrush', 'Substance Painter'],
    intro: 'A highly detailed osteological sculpt of a cheetah skull, focusing on complex bone textures, sharp dental anatomy, and realistic weathering patterns.',
    content: `
      <h3><span class="pm-icon">🦴</span> Sculpting Process</h3>
      <p>The skull was meticulously sculpted in ZBrush from reference photography to ensure strict anatomical accuracy. Special attention was paid to the intricate fusion lines of the cranium, the deeply porous bone surfaces, and the sharp, imposing structure of the feline fangs.</p>
      <h3><span class="pm-icon">🎨</span> Surface & Material Detailing</h3>
      <p>The model features a highly realistic, aged bone material created in Substance Painter. Subtle layers of dirt accumulation, fine micro-scratches, and organic discoloration give the skull an authentic, weathered history. The clean, neutral background allows the high-frequency surface details to truly stand out.</p>
      <div class="pm-features">
        <div class="pm-feature"><strong>Anatomical Accuracy</strong><span>Careful adherence to real-world cheetah skull proportions</span></div>
        <div class="pm-feature"><strong>Bone Texturing</strong><span>High-frequency porous detail and subtle micro-scratches</span></div>
        <div class="pm-feature"><strong>Weathering</strong><span>Realistic dirt and organic discoloration passes</span></div>
        <div class="pm-feature"><strong>PBR Compliant</strong><span>Fully textured using advanced PBR workflows</span></div>
      </div>`,
    link: null
  }
};

const projectModal = document.getElementById('project-modal');
const pmImage = document.getElementById('pm-image');
const pmTitle = document.getElementById('pm-title');
const pmCategory = document.getElementById('pm-category');
const pmTools = document.getElementById('pm-tools');
const pmContent = document.getElementById('pm-content');
const pmFooter = document.getElementById('pm-footer');

function openProjectModal(id) {
  const data = projectData[id];
  if (!data) return;
  pmImage.src = data.image;
  pmTitle.textContent = data.title;
  pmCategory.textContent = data.category;
  pmTools.innerHTML = data.tools.map(t => `<span>${t}</span>`).join('');
  pmContent.innerHTML = `<p class="pm-intro">${data.intro}</p>${data.content}`;
  if (data.link) {
    pmFooter.innerHTML = `<a href="${data.link}" target="_blank"><span>Play on itch.io</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg></a>`;
  } else {
    pmFooter.innerHTML = '';
  }
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  projectModal.querySelector('.project-modal-panel').scrollTop = 0;
}

function closeProjectModal() {
  projectModal.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.project-link')) return;
    const id = card.dataset.project;
    if (id) openProjectModal(id);
  });
});

document.querySelector('.project-modal-close').addEventListener('click', closeProjectModal);
document.querySelector('.project-modal-backdrop').addEventListener('click', closeProjectModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && projectModal.classList.contains('active')) closeProjectModal();
});

/* ===== MOUSE REPULSION ON PARTICLES ===== */
let mouseParticleX = -9999, mouseParticleY = -9999;
document.addEventListener('mousemove', e => {
  mouseParticleX = e.clientX;
  mouseParticleY = e.clientY;
});

const _origUpdate = Particle.prototype.update;
Particle.prototype.update = function() {
  _origUpdate.call(this);
  const dx = this.x - mouseParticleX;
  const dy = this.y - mouseParticleY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const repelRadius = 100;
  if (dist < repelRadius && dist > 0) {
    const force = (repelRadius - dist) / repelRadius;
    this.x += (dx / dist) * force * 3;
    this.y += (dy / dist) * force * 3;
  }
};

/* ===== GLITCH TEXT EFFECT (cinematic flicker) ===== */
function triggerGlitch(el) {
  const frames = [
    { filter: 'brightness(1.8) saturate(2)', transform: 'translateX(3px)', duration: 50 },
    { filter: 'brightness(0.6)', transform: 'translateX(-2px)', duration: 50 },
    { filter: 'brightness(1.4)', transform: 'translateX(1px)', duration: 40 },
    { filter: '', transform: '', duration: 0 }
  ];
  let i = 0;
  function runFrame() {
    if (i >= frames.length) return;
    const f = frames[i];
    el.style.filter = f.filter;
    el.style.transform = f.transform;
    i++;
    if (i < frames.length) setTimeout(runFrame, f.duration);
  }
  runFrame();
}

// Trigger glitch on page load
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.glitch-text').forEach((el, i) => {
      setTimeout(() => triggerGlitch(el), i * 250);
    });
  }, 900);
  // Subtle repeat every 6 seconds
  setInterval(() => {
    document.querySelectorAll('.glitch-text').forEach((el, i) => {
      setTimeout(() => triggerGlitch(el), i * 200);
    });
  }, 6000);
});

/* ===== MAGNETIC BUTTONS ===== */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s ease';
  });
});

/* ===== CURSOR TRAIL ===== */
const trailContainer = document.getElementById('cursor-trail-container');
const trailDots = [];
const TRAIL_LENGTH = 12;

for (let i = 0; i < TRAIL_LENGTH; i++) {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail-dot';
  dot.style.opacity = (1 - i / TRAIL_LENGTH) * 0.6;
  dot.style.width = dot.style.height = (8 - i * 0.5) + 'px';
  trailContainer.appendChild(dot);
  trailDots.push({ el: dot, x: -100, y: -100 });
}

let trailMouseX = -100, trailMouseY = -100;
document.addEventListener('mousemove', e => {
  trailMouseX = e.clientX;
  trailMouseY = e.clientY;
});

function animateTrail() {
  let x = trailMouseX, y = trailMouseY;
  trailDots.forEach((dot, i) => {
    const prev = trailDots[i - 1];
    if (i === 0) {
      dot.x += (trailMouseX - dot.x) * 0.4;
      dot.y += (trailMouseY - dot.y) * 0.4;
    } else {
      dot.x += (prev.x - dot.x) * 0.5;
      dot.y += (prev.y - dot.y) * 0.5;
    }
    dot.el.style.left = dot.x + 'px';
    dot.el.style.top = dot.y + 'px';
  });
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ===== TEXT SCRAMBLE ON SCROLL ===== */
function scrambleReveal(el) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%';
  const original = el.textContent;
  let iterations = 0;
  const maxIter = Math.ceil(original.length * 1.2);
  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, i) => {
      if (char === ' ') return ' ';
      if (i < iterations) return original[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    iterations++;
    if (iterations >= maxIter) {
      el.textContent = original;
      clearInterval(interval);
    }
  }, 18);
}

const scrambleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Scramble the h2 tag inside section headers
      const h2 = entry.target.querySelector('h2');
      if (h2) {
        setTimeout(() => scrambleReveal(h2), 200);
      }
      scrambleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.section-header').forEach(el => scrambleObserver.observe(el));

/* ===== NOISE / GRAIN OVERLAY ===== */
const noiseCanvas = document.getElementById('noise-canvas');
const noiseCtx = noiseCanvas.getContext('2d');

function resizeNoise() {
  noiseCanvas.width = window.innerWidth;
  noiseCanvas.height = window.innerHeight;
}
resizeNoise();
window.addEventListener('resize', resizeNoise);

function generateNoise() {
  const imageData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = Math.random() * 255;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = Math.random() * 15; // very subtle, max ~6% opacity
  }
  noiseCtx.putImageData(imageData, 0, 0);
  requestAnimationFrame(generateNoise);
}
generateNoise();
