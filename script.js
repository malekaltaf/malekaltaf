/**
 * 3D Interactive Elements and Modern Page Logic for Altaf Malek's Portfolio
 * Powered by Three.js & Vanilla JS
 */

// Global 3D Background Starfield & Floating Polyhedrons
function initGlobal3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Starfield particles
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4); // Cyan
    const color2 = new THREE.Color(0x8b5cf6); // Purple
    const color3 = new THREE.Color(0x3b82f6); // Blue

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i + 1] = (Math.random() - 0.5) * 120;
        positions[i + 2] = (Math.random() - 0.5) * 80;

        const mixedColor = i % 2 === 0 ? color1.clone().lerp(color2, Math.random()) : color2.clone().lerp(color3, Math.random());
        colors[i] = mixedColor.r;
        colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circle texture for soft glowing particles
    const particleTexture = createCircleTexture();
    const material = new THREE.PointsMaterial({
        size: 0.85,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating subtle wireframe icosahedrons in background
    const wireGeom = new THREE.IcosahedronGeometry(8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const floatingMesh1 = new THREE.Mesh(wireGeom, wireMat);
    floatingMesh1.position.set(-25, -10, -10);
    scene.add(floatingMesh1);

    const floatingMesh2 = new THREE.Mesh(new THREE.TorusGeometry(6, 1.5, 16, 50), new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.07
    }));
    floatingMesh2.position.set(28, 12, -15);
    scene.add(floatingMesh2);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.0004;

        floatingMesh1.rotation.x += 0.002;
        floatingMesh1.rotation.y += 0.003;

        floatingMesh2.rotation.y += 0.002;
        floatingMesh2.rotation.z += 0.003;

        camera.position.x = targetX * 10;
        camera.position.y = -targetY * 10;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();
}

// Particle glow texture generation
function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(100, 200, 255, 0.8)');
    gradient.addColorStop(0.8, 'rgba(10, 20, 50, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// 3D Interactive Hero Object (Tech Core / Cyber Sphere with Orbiting Rings)
function initHero3D() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group to hold all 3D hero objects
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Central Sphere (Cyber Globe / Network Core)
    const sphereGeom = new THREE.IcosahedronGeometry(1.6, 3);
    const sphereMat = new THREE.MeshPhongMaterial({
        color: 0x0a192f,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.2,
        wireframe: true,
        transparent: true,
        opacity: 0.85
    });
    const coreSphere = new THREE.Mesh(sphereGeom, sphereMat);
    coreGroup.add(coreSphere);

    // Glowing Inner Nucleus
    const innerGeom = new THREE.SphereGeometry(0.8, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: false
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    coreGroup.add(innerCore);

    // Orbit Ring 1 (Android / Mobile Theme)
    const ring1Geom = new THREE.TorusGeometry(2.3, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Orbit Ring 2 (Server & Infra Theme)
    const ring2Geom = new THREE.TorusGeometry(2.8, 0.04, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    coreGroup.add(ring2);

    // Orbit Ring 3 (Networking Theme)
    const ring3Geom = new THREE.TorusGeometry(3.3, 0.03, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.x = Math.PI / 2.2;
    coreGroup.add(ring3);

    // Satellite Nodes (Representing IT Infra & Android Apps)
    const nodeCount = 6;
    const nodes = [];
    const nodeGeom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(nodeGeom, nodeMat);
        const angle = (i / nodeCount) * Math.PI * 2;
        node.position.set(Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, 0);
        ring2.add(node);
        nodes.push(node);
    }

    // Lighting
    const pointLight = new THREE.PointLight(0x06b6d4, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Mouse Drag Rotation Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('mousemove', (e) => {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        if (isDragging) {
            coreGroup.rotation.y += deltaMove.x * 0.01;
            coreGroup.rotation.x += deltaMove.y * 0.01;
        }

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch interaction for mobile
    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - previousMousePosition.x;
            const deltaY = touch.clientY - previousMousePosition.y;
            coreGroup.rotation.y += deltaX * 0.01;
            coreGroup.rotation.x += deltaY * 0.01;
            previousMousePosition = { x: touch.clientX, y: touch.clientY };
        }
    });

    // Responsive resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w && h) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
    });

    // Animation loop
    function animateHero() {
        requestAnimationFrame(animateHero);

        if (!isDragging) {
            coreGroup.rotation.y += 0.007;
            coreGroup.rotation.x += 0.003;
        }

        ring1.rotation.z += 0.015;
        ring2.rotation.z -= 0.01;
        ring3.rotation.z += 0.008;

        nodes.forEach((node, idx) => {
            node.rotation.x += 0.02;
            node.rotation.y += 0.02;
        });

        renderer.render(scene, camera);
    }
    animateHero();
}

// 3D Tilt Effect on Cards (Vanilla 3D Perspective Mouse Follower)
function init3DTilt() {
    const tiltElements = document.querySelectorAll('.tilt-card, .project-square, .portfolio-card, .skill-card-modern');

    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // max -10deg to 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// Contact Form handler with modern feedback
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
        const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
        const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';

        if (!name || !email || !message) {
            alert('Please complete all fields before submitting.');
            return;
        }

        const mailtoLink = 'mailto:malekaltafn@icloud.com'
            + '?subject=' + encodeURIComponent('Contact from Portfolio: ' + name)
            + '&body=' + encodeURIComponent(message + '\n\n---\nFrom: ' + name + ' (' + email + ')');

        window.location.href = mailtoLink;
    });
}

// Navbar scroll shadow
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initGlobal3DBackground();
    initHero3D();
    init3DTilt();
    initContactForm();
    initNavbarScroll();
});
