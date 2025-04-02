document.addEventListener('DOMContentLoaded', function() {
    // Add CSS variable for fruit size
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --fruit-size: 80px;
        }
    `;
    document.head.appendChild(style);
    
    const canvas = document.getElementById('fruitCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    const ctx = canvas.getContext('2d');
    let fruits = [];
    let trail = [];
    let lastTime = 0;
    let fruitSpawnTimer = 0;
    let particles = [];
    const fruitTypes = ['🍎', '🍊', '🍇', '🍓', '🍐', '🍑', '🍉', '❤️', '🫐'];
    const particleColors = ['#FF4136', '#FFDC00', '#2ECC40', '#FF851B', '#7FDBFF'];
    
    // Flag to detect if we're on a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    function resizeCanvas() {
        const heroSection = canvas.parentElement;
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
        
        // Set responsive fruit size based on device width
        const isMobile = window.innerWidth <= 768;
        const fruitSize = isMobile ? '60px' : '80px';
        document.documentElement.style.setProperty('--fruit-size', fruitSize);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Input tracking variables
    let isMouseDown = false;
    let isTouching = false;
    let lastMousePosition = { x: 0, y: 0 };
    let lastTouchPosition = { x: 0, y: 0 };

    // Mouse event handlers
    canvas.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        const rect = canvas.getBoundingClientRect();
        lastMousePosition = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        trail = [];
    });

    canvas.addEventListener('mouseup', function() {
        isMouseDown = false;
        trail = [];
    });

    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const currentPosition = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        // Add interpolation for smooth trail
        if (lastMousePosition.x && lastMousePosition.y) {
            const dx = currentPosition.x - lastMousePosition.x;
            const dy = currentPosition.y - lastMousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) { // Only create trail if mouse is moving
                trail.push({ x: currentPosition.x, y: currentPosition.y, age: 0 });
                checkCollisions(currentPosition.x, currentPosition.y);
            }
        }
        
        lastMousePosition = currentPosition;
    });

    canvas.addEventListener('mouseleave', function() {
        lastMousePosition = { x: 0, y: 0 };
        trail = [];
    });
    
    // Touch event handlers
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent scrolling when touching the canvas
        isTouching = true;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        lastTouchPosition = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        trail = [];
    }, { passive: false });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        isTouching = false;
        trail = [];
    }, { passive: false });
    
    canvas.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        isTouching = false;
        trail = [];
    }, { passive: false });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault(); // Prevent scrolling when swiping on canvas
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const currentPosition = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        
        // Add interpolation for smooth trail
        if (lastTouchPosition.x && lastTouchPosition.y) {
            const dx = currentPosition.x - lastTouchPosition.x;
            const dy = currentPosition.y - lastTouchPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) { // Only create trail if touch is moving
                trail.push({ x: currentPosition.x, y: currentPosition.y, age: 0 });
                checkCollisions(currentPosition.x, currentPosition.y);
            }
        }
        
        lastTouchPosition = currentPosition;
    }, { passive: false });

    // Update the update function to manage trail length
    function update(deltaTime) {
        // Keep trail at a reasonable length
        if (trail.length > 20) {
            trail = trail.slice(-20);
        }
        
        trail = trail.filter(point => point.age < 8);
        trail.forEach(point => point.age++);

        particles = particles.filter(particle => particle.life > 0);
        particles.forEach(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life -= 0.02;
            particle.velocityY += 0.2;
        });

        fruitSpawnTimer += deltaTime;
        if (fruitSpawnTimer > 1000 && fruits.length < 10) {
            const burstCount = Math.floor(Math.random() * 4) + 2; // 2-5 fruits at once
            const spawnWidth = canvas.width * 0.8;
            const startX = canvas.width * 0.1;
            
            for (let i = 0; i < burstCount; i++) {
                setTimeout(() => {
                    const fruit = {
                        x: startX + (spawnWidth * (i / burstCount)) + (Math.random() * 200 - 100),
                        y: canvas.height + 30,
                        type: fruitTypes[Math.floor(Math.random() * fruitTypes.length)],
                        velocityY: -15 - Math.random() * 15, // Consistent launch speed
                        velocityX: (Math.random() - 0.5) * 15, // Consistent horizontal speed
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.4, // Consistent rotation speed
                        sliced: false,
                        opacity: 1,
                        gravity: 1 + Math.random() * 0.01 // Consistent gravity
                    };
                    fruits.push(fruit);
                }, i * (Math.random() * 300 + 100)); // Random delay between fruits in burst
            }
            fruitSpawnTimer = 0;
        }

        // Update fruit physics with individual gravity
        fruits.forEach(fruit => {
            fruit.y += fruit.velocityY * deltaTime / 16;
            fruit.x += fruit.velocityX * deltaTime / 16;
            fruit.velocityY += fruit.gravity; // Use individual gravity
            fruit.rotation += fruit.rotationSpeed;
            
            if (fruit.sliced && fruit.slicedPieces) {
                fruit.slicedPieces[0].offsetX -= 1.5;
                fruit.slicedPieces[0].offsetY -= 1.5;
                fruit.slicedPieces[1].offsetX += 1.5;
                fruit.slicedPieces[1].offsetY += 1.5;
                fruit.slicedPieces[0].rotation += 0.08;
                fruit.slicedPieces[1].rotation -= 0.08;
            }
        });
    }

    // Replace the entire draw function with this
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw trail with glow effect
        if (trail.length > 1) {
            // Outer glow
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for (let i = 1; i < trail.length; i++) {
                ctx.lineTo(trail[i].x, trail[i].y);
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Inner bright line
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for (let i = 1; i < trail.length; i++) {
                ctx.lineTo(trail[i].x, trail[i].y);
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        // Draw particles
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.life})`;
            ctx.fill();
        });

        // Draw fruits
        const fruitSize = window.getComputedStyle(document.documentElement).getPropertyValue('--fruit-size') || '80px';
        fruits.forEach(fruit => {
            if (fruit.sliced && fruit.slicedPieces) {
                fruit.slicedPieces.forEach(piece => {
                    ctx.save();
                    ctx.translate(fruit.x + piece.offsetX, fruit.y + piece.offsetY);
                    ctx.rotate(piece.rotation);
                    ctx.font = fruitSize + ' Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(fruit.type, 0, 0);
                    ctx.restore();
                });
            } else {
                ctx.save();
                ctx.translate(fruit.x, fruit.y);
                ctx.rotate(fruit.rotation);
                ctx.font = fruitSize + ' Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(fruit.type, 0, 0);
                ctx.restore();
            }
        });
    }

    function spawnFruit() {
        const fruit = {
            x: Math.random() * canvas.width,
            y: canvas.height + 30,
            type: fruitTypes[Math.floor(Math.random() * fruitTypes.length)],
            velocityY: -25 - Math.random() * 8,
            velocityX: (Math.random() - 0.5) * 8,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            sliced: false,
            opacity: 1
        };
        fruits.push(fruit);
    }

    function spawnParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            particles.push({
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: (Math.random() - 0.5) * 10,
                size: Math.random() * 4 + 2,
                color: color,
                life: 1.0
            });
        }
    }

    // Add at the top with other variables
    let score = 0;
    
    function createScoreDisplay() {
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        scoreDisplay.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 24px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            z-index: 1001;
        `;
        canvas.parentElement.appendChild(scoreDisplay);
        return scoreDisplay;
    }

    const scoreDisplay = createScoreDisplay();

    // Update the checkCollisions function
    function checkCollisions(x, y) {
        fruits.forEach(fruit => {
            if (!fruit.sliced) {
                const dx = x - fruit.x;
                const dy = y - fruit.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 50) {
                    fruit.sliced = true;
                    fruit.velocityY *= 0.5;
                    fruit.velocityX = (Math.random() - 0.5) * 15;
                    
                    fruit.slicedPieces = [
                        { offsetX: -20, offsetY: -20, rotation: fruit.rotation - 0.5 },
                        { offsetX: 20, offsetY: 20, rotation: fruit.rotation + 0.5 }
                    ];
                    
                    const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
                    spawnParticles(fruit.x, fruit.y, randomColor);
                    
                    // Increment score
                    score += 10;
                    scoreDisplay.textContent = `Score: ${score}`;
                }
            }
        });
    }

    // Update the update function to handle continuous gameplay
    // Modify the update function's fruit spawning section
    function update(deltaTime) {
        // Keep trail at a reasonable length
        if (trail.length > 20) {
            trail = trail.slice(-20);
        }
        
        trail = trail.filter(point => point.age < 8);
        trail.forEach(point => point.age++);

        particles = particles.filter(particle => particle.life > 0);
        particles.forEach(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life -= 0.02;
            particle.velocityY += 0.2;
        });

        fruitSpawnTimer += deltaTime;
        if (fruitSpawnTimer > 1000 && fruits.length < 10) {
            const burstCount = Math.floor(Math.random() * 5) + 1; // 2-4 fruits at once
            const spawnWidth = canvas.width * 0.8; // Use 80% of canvas width
            const startX = canvas.width * 0.1; // Start from 10% of canvas width
            
            // Adjust velocity and gravity based on device type
            const isMobile = window.innerWidth <= 768;
            const baseVelocityY = isMobile ? -18 : -20; // Increased launch velocity on mobile (was -15)
            const velocityYRandom = isMobile ? 5 : 10; // Less random variation on mobile
            const baseGravity = isMobile ? 0.4 : 0.4; // Reduced gravity on mobile for higher arcs (was 0.5)
            
            for (let i = 0; i < burstCount; i++) {
                const fruit = {
                    x: startX + (spawnWidth * (i / burstCount)) + (Math.random() * 100 - 50),
                    y: canvas.height + 30,
                    type: fruitTypes[Math.floor(Math.random() * fruitTypes.length)],
                    velocityY: baseVelocityY - Math.random() * velocityYRandom, // Adjusted launch velocity
                    velocityX: (Math.random() - 0.5) * (isMobile ? 8 : 12), // Less horizontal movement on mobile
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.3,
                    sliced: false,
                    opacity: 1,
                    gravity: baseGravity // Adjusted gravity
                };
                fruits.push(fruit);
            }
            fruitSpawnTimer = 0;
        }

        // Update fruits filtering to keep sliced fruits visible
        fruits = fruits.filter(fruit => {
            if (fruit.sliced) {
                return fruit.y < canvas.height + 200; // Keep sliced fruits longer
            }
            return fruit.y < canvas.height + 100; // Normal filtering for unsliced fruits
        });

        fruits.forEach(fruit => {
            fruit.y += fruit.velocityY * deltaTime / 16;
            fruit.x += fruit.velocityX * deltaTime / 16;
            fruit.velocityY += fruit.gravity || 0.4; // Use individual gravity or default value
            fruit.rotation += fruit.rotationSpeed;
            
            if (fruit.sliced && fruit.slicedPieces) {
                fruit.slicedPieces[0].offsetX -= 1; // Reduced speed
                fruit.slicedPieces[0].offsetY -= 1;
                fruit.slicedPieces[1].offsetX += 1;
                fruit.slicedPieces[1].offsetY += 1;
                fruit.slicedPieces[0].rotation += 0.05;
                fruit.slicedPieces[1].rotation -= 0.05;
            }
        });
    }

    // Remove the duplicate update function and keep only this version
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '255, 255, 255';
    }

    function animate(currentTime = 0) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        update(deltaTime);
        draw();

        requestAnimationFrame(animate);
    }

    // Add after createScoreDisplay function
    function createSeparatorLine() {
        const separator = document.createElement('div');
        separator.id = 'game-separator';
        separator.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                #00ff00 20%, 
                #00ff88 50%, 
                #00ff00 80%, 
                transparent 100%
            );
            box-shadow: 0 0 10px #00ff00,
                       0 0 20px #00ff00,
                       0 0 30px #00ff00;
            animation: breathe 2s ease-in-out infinite;
            z-index: 1001;
        `;

        // Add the animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes breathe {
                0% { opacity: 0.5; }
                50% { opacity: 1; }
                100% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
        canvas.parentElement.appendChild(separator);
    }

    // Add this line after createScoreDisplay() call
    createSeparatorLine();
    animate();
});