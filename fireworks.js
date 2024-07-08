// Fireworks.js
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 2 + Math.random() * 3;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.hue = Math.floor(Math.random() * 360);
        this.brightness = 50 + Math.random() * 20;
        this.alpha = 1;
        this.radius = 2;
        this.trail = [];
        this.maxTrailLength = 5;
    }

    update() {
        this.trail.unshift({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.03; // gravity
        this.alpha -= 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        // Draw trail
        this.trail.forEach((pos, index) => {
            ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${pos.alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.radius * (this.trail.length - index) / this.trail.length, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw firework
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.brightness = 50 + Math.random() * 20;
        this.alpha = 1;
        this.radius = 1 + Math.random();
        this.velocity = {
            x: -1 + Math.random() * 2,
            y: -1 + Math.random() * 2
        };
        this.friction = 0.95;
        this.gravity = 0.1;
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let fireworks = [];
let particles = [];

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetX = Math.random() * canvas.width;
    const targetY = Math.random() * canvas.height / 2;
    fireworks.push(new Firework(x, y, targetX, targetY));
}

function explode(firework) {
    const particleCount = 50 + Math.floor(Math.random() * 50);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(firework.x, firework.y, firework.hue));
    }
}

let lastTime = 0;
let fireworkInterval = 1000; // Launch new fireworks every second

function animate(currentTime) {
    requestAnimationFrame(animate);

    // Limit frame rate for performance
    if (currentTime - lastTime < 30) return; // Cap at ~33 FPS
    lastTime = currentTime;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) { // Randomly create fireworks
        createFirework();
    }

    // Update and draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();

        if (fireworks[i].alpha <= 0 || 
            fireworks[i].y <= fireworks[i].targetY) {
            explode(fireworks[i]);
            fireworks.splice(i, 1);
        }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Start the animation
animate();

// Resize canvas when window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Optimize for performance
canvas.style.opacity = 0.8; // Slightly reduce visual impact