const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");
const nav = document.getElementById("main-nav");
const navLinksContainer = document.querySelector(".nav-links");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const heroTitle = document.getElementById("hero-title");
const heroSubtitle = document.getElementById("hero-subtitle");
const heroBtns = document.getElementById("hero-btns");

const frameCount = 232;
const currentFrame = (index) =>
  `./frames/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;

const images = [];
let loadedCount = 0;

// Set canvas size to fill the hero container exactly
const updateCanvasSize = () => {
  const container = document.querySelector('.hero');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;
};

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    loadedCount++;
    if (loadedCount === Math.floor(frameCount * 0.1)) {
        startAnimation();
        triggerEntranceAnimations();
    }
  };
  images.push(img);
}

let frameIndex = 0;
const fps = 30;
const interval = 1000 / fps;
let lastTime = 0;

const render = (time) => {
  if (!lastTime) lastTime = time;
  const deltaTime = time - lastTime;

  if (deltaTime >= interval) {
    lastTime = time - (deltaTime % interval);
    
    const img = images[frameIndex];
    if (img && img.complete) {
      const w = canvas.width;
      const h = canvas.height;
      const loopProgress = frameIndex / frameCount;
      const scale = 1.05 + (loopProgress * 0.1); 
      
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      
      let drawWidth, drawHeight;
      
      if (canvasRatio > imgRatio) {
        drawWidth = w * scale;
        drawHeight = (w / imgRatio) * scale;
      } else {
        drawWidth = (h * imgRatio) * scale;
        drawHeight = h * scale;
      }
      
      const offsetX = (w - drawWidth) / 2;
      const offsetY = (h - drawHeight) / 2;
      
      context.clearRect(0, 0, w, h);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
    
    frameIndex = (frameIndex + 1) % frameCount;
  }
  
  requestAnimationFrame(render);
};

function startAnimation() {
  requestAnimationFrame(render);
}

function triggerEntranceAnimations() {
    if (heroTitle) setTimeout(() => heroTitle.classList.add('animate'), 100);
    if (heroSubtitle) setTimeout(() => heroSubtitle.classList.add('animate'), 400);
    if (heroBtns) setTimeout(() => heroBtns.classList.add('animate'), 700);
}

// Navbar Scroll Effect & Active Link Highlight
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    if (window.pageYOffset >= sectionTop - 150) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

// Smooth Scroll for Navbar Links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu on link click
        navLinksContainer.classList.remove("active");
        const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
        if (icon) icon.textContent = "menu";

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Toggle Logic
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle("active");
        const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
        if (icon) {
            icon.textContent = navLinksContainer.classList.contains("active") ? "close" : "menu";
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinksContainer.classList.contains("active")) {
        navLinksContainer.classList.remove("active");
        const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
        if (icon) icon.textContent = "menu";
    }
});

window.addEventListener("resize", () => {
  updateCanvasSize();
});

updateCanvasSize();
