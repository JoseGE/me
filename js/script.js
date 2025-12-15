document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                menuToggle.classList.remove('is-active');
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Typing Effect ---
    const textElement = document.getElementById('typing-text');
    const textToType = "Hybrid Mobile Developer";
    let index = 0;

    function typeText() {
        if (index < textToType.length) {
            textElement.textContent += textToType.charAt(index);
            index++;
            setTimeout(typeText, 100);
        }
    }

    // Start typing after a small delay
    setTimeout(typeText, 500);

    // --- Scroll Observer ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .timeline-item, .project-card').forEach(el => {
        observer.observe(el);
    });

    // --- Canvas Background Animation (Floating Tech Symbols) ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    // Configuration
    const symbols = ['{ }', '< />', '[]', '//', '=>', '()', ';', '*', '&&', '||', '!', '$', 'const', 'let', 'fn'];
    const symbolCount = 60;
    const connectionDistance = 100;
    const mouseRadius = 200;
    const particles = [];

    // Mouse interaction
    let mouse = {
        x: -1000,
        y: -1000
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.text = symbols[Math.floor(Math.random() * symbols.length)];
            this.size = Math.random() * 14 + 10; // 10px to 24px
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.angle = Math.random() * 360;
        }

        update() {
            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouseRadius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouseRadius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to natural drift
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }

            // Constant drift
            this.x += this.speedX;
            this.y += this.speedY;
            this.baseX += this.speedX;
            this.baseY += this.speedY;

            // Wrap around screen
            if (this.x > width + 50) { this.x = -50; this.baseX = this.x; }
            if (this.x < -50) { this.x = width + 50; this.baseX = this.x; }
            if (this.y > height + 50) { this.y = -50; this.baseY = this.y; }
            if (this.y < -50) { this.y = height + 50; this.baseY = this.y; }
        }

        draw() {
            ctx.font = `${this.size}px 'Fira Code', monospace`; // Use a coding font if available, fallback to monospace
            ctx.fillStyle = 'rgba(56, 189, 248, 0.15)'; // Low opacity cyan
            ctx.save();
            ctx.translate(this.x, this.y);
            // Optional: slight rotation for some chaos
            // ctx.rotate(this.angle * Math.PI / 180); 
            ctx.fillText(this.text, 0, 0);
            ctx.restore();
        }
    }

    function initParticles() {
        particles.length = 0;
        // Adjust count based on screen size
        const count = (width * height) / 15000;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('resize', resize);
    resize();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Optional: Draw connections between close particles for a "network" feel
        connectParticles();

        requestAnimationFrame(animate);
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = dx * dx + dy * dy;

                if (distance < (connectionDistance * connectionDistance)) {
                    opacityValue = 1 - (distance / 10000);
                    ctx.strokeStyle = 'rgba(56, 189, 248,' + (opacityValue * 0.1) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    animate();

    // --- Active Navigation Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
