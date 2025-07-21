// --- MASTER ANIMATION & UTILITY SCRIPT ---

// --- Utility: Intersection Observer for animations ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Start animation if canvas is in view
            if (entry.target.dataset.anim === 'true') {
                const canvasId = entry.target.querySelector('canvas')?.id;
                if (canvasId && window.animationStates) {
                    window.animationStates[canvasId] = true;
                }
            }
        } else {
            // Stop animation if canvas is out of view
            if (entry.target.dataset.anim === 'true') {
                const canvasId = entry.target.querySelector('canvas')?.id;
                if (canvasId && window.animationStates) {
                    window.animationStates[canvasId] = false;
                }
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-section, .canvas-section').forEach(el => {
    if (el.classList.contains('canvas-section')) {
        el.dataset.anim = 'true';
    }
    observer.observe(el);
});

// Global state to control animations
window.animationStates = {
    'hero-canvas': false,
    'skills-canvas': false,
    'projects-canvas': false,
};

// --- 1. Hero Section: 3D Interactive Nebula ---
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
    let scene, camera, renderer, particles;
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function initHero() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        const particleCount = 29000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const color = new THREE.Color();

        // Improved: Vivid, dynamic color gradient for a more vibrant nebula
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = Math.random() * 2000 - 1000;
            positions[i + 1] = Math.random() * 2000 - 1000;
            positions[i + 2] = Math.random() * 2000 - 1000;

            // Use higher chroma for cosmic effect
            const t = Math.random();
            const h = 0.55 + t * 0.25; // Move towards magenta/blue
            const s = 0.85 - t * 0.1;  // Increase saturation
            const l = 0.55 + t * 0.25; // Increase brightness
            color.setHSL(h, s, l);

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 2;
        mouseY = (event.clientY - windowHalfY) / 2;
    }

    function animateHero() {
        if (!window.animationStates['hero-canvas']) {
            requestAnimationFrame(animateHero);
            return;
        }
        requestAnimationFrame(animateHero);
        const time = Date.now() * 0.00005;
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        particles.rotation.x = Math.sin(time * 0.7) * 0.1;
        particles.rotation.y = Math.cos(time * 0.5) * 0.1;
        renderer.render(scene, camera);
    }
    initHero();
    animateHero();
}
 // --- 2. Skills Section: Energy Field ---
 const skillsCanvas = document.getElementById('skills-canvas');
if (skillsCanvas) {
    const ctx = skillsCanvas.getContext('2d');
    let w, h, particles, particleCount = 120;

    function setSkillsSize() {
        w = skillsCanvas.width = skillsCanvas.offsetWidth;
        h = skillsCanvas.height = skillsCanvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.reset();
            this.baseColorT = Math.random();
            this.phase = Math.random() * Math.PI * 2;
            this.popBase = 1 + 0.5 * Math.random();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            const spd = Math.random() * 0.42 + 0.18;
            const ang = Math.random() * Math.PI * 2;
            this.vx = Math.cos(ang) * spd;
            this.vy = Math.sin(ang) * spd;
            this.radius = Math.random() * 2.1 + 1.1;
        }
        cycleColor(time) {
            // Stronger rainbow cycling, vivid pop
            const h = 275 + Math.sin(time * 0.85 + this.baseColorT * 8) * 90; // Pink, purple, blue, teal
            const s = 70 + 22 * Math.sin(time * 0.38 + this.baseColorT * 6.2);
            const l = 63 + 19 * Math.cos(time * 0.25 + this.baseColorT * 9.9);
            return `hsl(${h},${s}%,${l}%)`;
        }
        draw(time) {
            // Pulsing pop-out, each at their own rhythm
            const pop = this.popBase + 0.6 * Math.sin(time * 1.2 + this.phase + this.baseColorT * 10);
            ctx.beginPath();
            ctx.arc(
                this.x,
                this.y,
                this.radius * pop,
                0, Math.PI * 2
            );
            ctx.shadowColor = this.cycleColor(time);
            ctx.shadowBlur = 30 + 16 * Math.abs(Math.sin(this.phase + time));
            ctx.globalAlpha = 0.87 + 0.13 * Math.sin(this.phase + time * 1.25);
            ctx.fillStyle = this.cycleColor(time);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
        update(time) {
            // Gentle floating, some particles drift a little more
            this.x += this.vx * (1.03 + 0.07 * Math.sin(time + this.baseColorT * 7));
            this.y += this.vy * (1.03 + 0.09 * Math.cos(time + this.baseColorT * 8));
            // Wrap around edges for a never-ending field
            if (this.x < -24) this.x = w + 20;
            if (this.x > w + 24) this.x = -20;
            if (this.y < -24) this.y = h + 20;
            if (this.y > h + 24) this.y = -20;
        }
    }

    function initSkills() {
        setSkillsSize();
        particles = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function drawConnections(time) {
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const p1 = particles[i], p2 = particles[j];
                const dx = p1.x - p2.x, dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Pulse and rainbow line
                    const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    grad.addColorStop(0, p1.cycleColor(time));
                    grad.addColorStop(1, p2.cycleColor(time));
                    ctx.strokeStyle = grad;
                    ctx.globalAlpha = 0.16 + 0.2 * Math.abs(Math.sin((time + p1.phase + p2.phase) * 1.2));
                    ctx.lineWidth = 1.15 - (dist / 160);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animateSkills() {
        if (!window.animationStates['skills-canvas']) {
            requestAnimationFrame(animateSkills);
            return;
        }
        requestAnimationFrame(animateSkills);
        ctx.clearRect(0, 0, w, h);
        const time = performance.now() * 0.0026;
        drawConnections(time);
        for (let p of particles) {
            p.update(time);
            p.draw(time);
        }
    }

    window.addEventListener('resize', initSkills);
    initSkills();
    animateSkills();
}

// --- 3. Projects Section: Realistic Aurora ---
const projectsCanvas = document.getElementById('projects-canvas');
if (projectsCanvas) {
    const ctx = projectsCanvas.getContext('2d');
    let w, h, time = 0;
    const rays = 150;
    const colors = [
        [60, 255, 180],    // Green
        [180, 255, 200],   // Cyan
        [220, 180, 255]    // Purple
    ];

    // Resize canvas to match its display size
    function setProjectsSize() {
        w = projectsCanvas.width = projectsCanvas.offsetWidth;
        h = projectsCanvas.height = projectsCanvas.offsetHeight;
        ctx.lineWidth = 2;
    }

    // More organic motion: combined trigonometric noise
    function noise(x, y, t) {
        return Math.sin(x * 0.02 + t) +
               Math.cos(y * 0.02 + t) +
               Math.sin((x + y) * 0.01 + t);
    }

    function drawAurora() {
        if (!window.animationStates || !window.animationStates['projects-canvas']) {
            requestAnimationFrame(drawAurora);
            return;
        }
        requestAnimationFrame(drawAurora);
        time += 0.015; // Slightly faster for smoother waves

        // Fades previous frame, leaving trails for a smooth look
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(2, 0, 10, 0.12)';
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = 'lighter'; // For glow blending

        for (let i = 0; i < rays; i++) {
            const x = (i / rays) * w;
            const rawNoise = noise(x, i, time);
            let n = (rawNoise + 3) / 6;
            n = Math.min(0.9999, Math.max(0, n));

            const y = n * h * 0.5;
            const height = (noise(x, i, time + 10) * 0.5 + 0.5) * h * 0.6;
            // Cycle through colors for smoother animation
            const colorIndex = i % colors.length;
            const color = colors[colorIndex];

            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0,   `rgba(${color[0]},${color[1]},${color[2]},0)`);
            gradient.addColorStop(0.5, `rgba(${color[0]},${color[1]},${color[2]},${n * 0.4})`);
            gradient.addColorStop(1,   `rgba(${color[0]},${color[1]},${color[2]},0)`);
            ctx.fillStyle = gradient;

            // Subtle sway for a natural, fluid look
            const swayX = x + Math.sin(time * 1.5 + i) * 5;
            ctx.fillRect(swayX - 6, y, 12, height);

            // Extra aurora glow: thin, faint vertical streak
            ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${n * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(swayX, y);
            ctx.lineTo(swayX, y + height);
            ctx.stroke();
        }
    }

    setProjectsSize();
    drawAurora();
    window.addEventListener('resize', setProjectsSize);
}


