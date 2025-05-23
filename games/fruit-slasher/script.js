const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Detect if device is mobile
const isMobile = window.innerWidth <= 768;

// Responsive scaling factor based on screen width
const scaleFactor = Math.min(1, window.innerWidth / 1024);

let fruits = [];
let score = 0;
let swipeTrail = [];
let gameOver = false;
let particles = [];
let lastTime = 0;
let highScore = 0; // Add high score variable

// Load background image
const backgroundImage = new Image();
backgroundImage.src = "assets/bg.png";

// Handle window resize to maintain responsiveness
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Update responsive variables
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
        // Only update if mobile state changed
        isMobile = newIsMobile;
    }
    
    // Recalculate scale factor
    const newScaleFactor = Math.min(1, window.innerWidth / 1024);
    if (newScaleFactor !== scaleFactor) {
        // Only update if scale factor changed significantly
        scaleFactor = newScaleFactor;
    }
});

// Fruit emojis and bomb symbol
const fruitTypes = ['🍎', '🍊', '🍇', '🍓', '🍐', '🍑', '🍉', '🫐'];
const bombEmoji = '💣';

// Particle colors for juice effects
const particleColors = ['#FF4136', '#FFDC00', '#2ECC40', '#FF851B', '#7FDBFF'];

// Helper function to convert hex to RGB for particle effects
function hexToRgb(hex) {
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return `${r}, ${g}, ${b}`;
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        // Scale particle size based on device
        this.size = (Math.random() * 8 + 2) * scaleFactor; // Adjust particle size for mobile
        this.color = color;
        // Scale particle speed based on device
        this.speedX = (Math.random() * 10 - 5) * scaleFactor; // Adjust horizontal movement
        this.speedY = (Math.random() * 10 - 5) * scaleFactor; // Adjust vertical movement
        this.gravity = 0.15 * scaleFactor;
        this.life = 100;
        this.shape = Math.random() > 0.7 ? 'square' : 'circle'; // Random shapes for variety
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2 * scaleFactor;
    }

    update(deltaTime) {
        this.speedY += this.gravity;
        this.x += this.speedX * (deltaTime / 16);
        this.y += this.speedY * (deltaTime / 16);
        this.life -= 1.5;
        this.rotation += this.rotationSpeed;
        
        // Gradually reduce size
        if (this.size > 0.5) {
            this.size -= 0.08 * (deltaTime / 16);
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        
        // Use rgba for better color control
        const rgbaColor = `rgba(${hexToRgb(this.color)}, ${this.life / 100})`;
        ctx.fillStyle = rgbaColor;
        
        if (this.shape === 'square') {
            // Draw a square
            const halfSize = this.size / 2;
            ctx.fillRect(-halfSize, -halfSize, this.size, this.size);
        } else {
            // Draw a circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class Fruit {
    constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        // Adjust size based on screen width using scaleFactor
        const baseSize = isMobile ? size * 3.5 : size * 1.3;
        this.size = baseSize * scaleFactor;
        this.type = type;
        this.isBomb = type === "bomb";
        this.emoji = this.isBomb ? bombEmoji : fruitTypes[type];
        this.velocity = {
            // Adjust horizontal speed based on screen width
            x: (Math.random() * 6 - 3) * 0.8 * scaleFactor,
            // Adjust vertical velocity based on screen height
            y: (Math.random() * -25 - 20) * 0.8 * scaleFactor
        };
        // Adjust gravity based on screen height
        this.gravity = (0.2 + Math.random() * 0.2) * 0.8 * scaleFactor;
        this.sliced = false;
        this.slicedPieces = null;
        this.rotation = Math.random() * Math.PI * 2;
        // Adjust rotation speed based on screen width
        this.rotationSpeed = (Math.random() - 0.5) * 0.14 * scaleFactor;
        this.opacity = 1;
        this.scale = 1;
        this.pulseDirection = 1;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
        this.glowSize = 0;
        this.glowDirection = 1;
    }

    draw() {
        // Add glow effect for unsliced fruits
        if (!this.sliced) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Draw glow effect
            if (this.isBomb) {
                ctx.shadowColor = 'rgba(255, 0, 0, 0.7)';
            } else {
                ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
            }
            ctx.shadowBlur = 10 + this.glowSize;
            
            // Draw the emoji
            ctx.font = `${this.size * this.scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.rotate(this.rotation);
            ctx.fillText(this.emoji, 0, 0);
            ctx.restore();
        }
        
        if (this.sliced && this.slicedPieces) {
            // Draw sliced pieces
            this.slicedPieces.forEach(piece => {
                ctx.save();
                ctx.translate(this.x + piece.offsetX, this.y + piece.offsetY);
                ctx.rotate(piece.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.font = `${this.size * 0.8}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.emoji, 0, 0);
                ctx.globalAlpha = 1;
                ctx.restore();
            });
        }        
    }

    update(deltaTime) {
        this.y += this.velocity.y * (deltaTime / 16);
        this.x += this.velocity.x * (deltaTime / 16);
        this.velocity.y += this.gravity;
        this.rotation += this.rotationSpeed;
        
        // Pulsing effect for unsliced fruits
        if (!this.sliced) {
            // Update scale for pulsing effect
            this.scale += this.pulseDirection * this.pulseSpeed * (deltaTime / 16);
            if (this.scale > 1.1) {
                this.scale = 1.1;
                this.pulseDirection = -1;
            } else if (this.scale < 0.9) {
                this.scale = 0.9;
                this.pulseDirection = 1;
            }
            
            // Update glow effect
            this.glowSize += this.glowDirection * 0.2 * (deltaTime / 16);
            if (this.glowSize > 5) {
                this.glowSize = 5;
                this.glowDirection = -1;
            } else if (this.glowSize < 0) {
                this.glowSize = 0;
                this.glowDirection = 1;
            }
        }
        
        if (this.sliced && this.slicedPieces) {
            // More dynamic movement for sliced pieces
            this.slicedPieces[0].offsetX -= (2.0 + Math.random() * 0.5) * (deltaTime / 16);
            this.slicedPieces[0].offsetY -= (2.0 + Math.random() * 0.5) * (deltaTime / 16);
            this.slicedPieces[1].offsetX += (2.0 + Math.random() * 0.5) * (deltaTime / 16);
            this.slicedPieces[1].offsetY += (2.0 + Math.random() * 0.5) * (deltaTime / 16);
            this.slicedPieces[0].rotation += 0.1 * (deltaTime / 16);
            this.slicedPieces[1].rotation -= 0.1 * (deltaTime / 16);
            
            // Fade out sliced pieces
            if (this.opacity > 0) {
                this.opacity -= 0.008 * (deltaTime / 16);
            }
        }
    }

    slice() {
        if (!this.sliced) {
            this.sliced = true;
            
            // Create sliced pieces effect with more dynamic initial positions
            // Scale offset based on device size
            const offsetValue = 15 * scaleFactor;
            this.slicedPieces = [
                { offsetX: -offsetValue, offsetY: -offsetValue, rotation: this.rotation - 0.8 },
                { offsetX: offsetValue, offsetY: offsetValue, rotation: this.rotation + 0.8 }
            ];
            
            // Create juice particles with random colors from the palette
            const particleColor = particleColors[Math.floor(Math.random() * particleColors.length)];
            
            // Create more particles for a more dramatic effect
            // Reduce particle count on mobile for better performance
            const particleCount = isMobile ? 15 : 25;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.x, this.y, particleColor));
            }
            
            // Add score (changed from 1 to 10)
            if (!this.isBomb) {
                score += 10;
                document.getElementById("score").innerText = "Score: " + score;
                
                // Update high score if current score is higher
                updateHighScore();
                
                // Show score popup with enhanced effect
                showScorePopup(this.x, this.y);
            }
        }
    }
}

function showScorePopup(x, y) {
    const popup = document.createElement("div");
    popup.className = "score-popup";
    
    // Randomly select a positive emoji for variety
    const scoreEmojis = ['+10 ✨', '+10 🔥', '+10 ⚡', '+10 💯', '+10 🎯'];
    popup.innerText = scoreEmojis[Math.floor(Math.random() * scoreEmojis.length)];
    
    // Random slight position offset for more dynamic feel - scale based on device size
    const offsetX = (Math.random() - 0.5) * 40 * scaleFactor;
    const offsetY = (Math.random() - 0.5) * 20 * scaleFactor;
    
    popup.style.left = (x + offsetX) + "px";
    popup.style.top = (y + offsetY) + "px";
    document.body.appendChild(popup);
    
    // Random color for each popup
    const colors = ['#FF4136', '#FFDC00', '#2ECC40', '#FF851B', '#7FDBFF', '#F012BE'];
    popup.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Adjust font size based on device
    popup.style.fontSize = isMobile ? '20px' : '28px';
    
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

function spawnFruit() {
    if (gameOver) return;
    
    // Create a burst of fruits for more dynamic gameplay
    // Reduce burst count on mobile for less cluttered gameplay
    const burstCount = isMobile ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 1; // 1-2 fruits on mobile, 1-3 on desktop
    
    // Adjust spawn width based on screen size
    const spawnWidth = canvas.width * (isMobile ? 0.6 : 0.8);
    const startX = canvas.width * (isMobile ? 0.2 : 0.1);
    
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            if (gameOver) return;
            
            // Adjust random offset based on screen width to keep fruits in view
            const randomOffset = Math.random() * (isMobile ? 100 : 200) - (isMobile ? 50 : 100);
            const x = startX + (spawnWidth * (i / burstCount)) + randomOffset;
            const y = canvas.height;
            
            // Adjust size based on screen width
            // Smaller size on mobile devices
            const size = isMobile ? 70 : 100;
            
            // Randomly select a fruit type or bomb
            const type = Math.random() < 0.15 ? "bomb" : Math.floor(Math.random() * fruitTypes.length);
            
            fruits.push(new Fruit(x, y, size, type));
        }, i * (Math.random() * 200 + 50)); // Random delay between fruits in burst
    }
}

// Blade trail effect
class BladeTrail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Adjust blade trail size based on device
        this.size = 20 * scaleFactor;
        this.life = 20;
    }
    
    update() {
        this.life -= 1;
        // Adjust size reduction based on scale factor
        this.size -= 0.5 * scaleFactor;
    }
    
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.life / 20})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let bladeTrail = [];
let isMouseDown = false;
let lastMousePosition = { x: 0, y: 0 };

function animate(currentTime = 0) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    if (gameOver) {
        drawGameOver();
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
    
    // Update and draw blade trail
    bladeTrail = bladeTrail.filter(trail => trail.life > 0);
    bladeTrail.forEach(trail => {
        trail.update();
        trail.draw();
    });
    
    // Draw swipe trail
    if (swipeTrail.length > 1) {
        // Outer glow - adjust size based on device
        ctx.beginPath();
        ctx.moveTo(swipeTrail[0].x, swipeTrail[0].y);
        for (let i = 1; i < swipeTrail.length; i++) {
            ctx.lineTo(swipeTrail[i].x, swipeTrail[i].y);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 20 * scaleFactor; // Scale based on device size
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        
        // Inner bright line - adjust size based on device
        ctx.beginPath();
        ctx.moveTo(swipeTrail[0].x, swipeTrail[0].y);
        for (let i = 1; i < swipeTrail.length; i++) {
            ctx.lineTo(swipeTrail[i].x, swipeTrail[i].y);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 3 * scaleFactor; // Scale based on device size
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    
    // Update and draw particles
    particles = particles.filter(particle => particle.life > 0);
    particles.forEach(particle => {
        particle.update(deltaTime);
        particle.draw();
    });
    
    // Update and draw fruits
    fruits = fruits.filter(fruit => {
        if (fruit.sliced) {
            return fruit.y < canvas.height + 200 && fruit.opacity > 0;
        }
        return fruit.y < canvas.height + 100;
    });
    
    fruits.forEach(fruit => {
        fruit.update(deltaTime);
        fruit.draw();
    });
    
    // Draw score - adjust font size based on screen width
    ctx.fillStyle = "#ffffff";
    const scoreFontSize = isMobile ? 24 : 36;
    ctx.font = `bold ${scoreFontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width / 2, isMobile ? 30 : 50);
    
    // Draw high score in bottom right corner - adjust font size based on screen width
    ctx.fillStyle = "#FFDC00"; // Gold color for high score
    const highScoreFontSize = isMobile ? 18 : 28;
    ctx.font = `bold ${highScoreFontSize}px Arial`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("High Score: " + highScore, canvas.width - 20, canvas.height - 20);
    ctx.textAlign = "center"; // Reset text alignment
    ctx.textBaseline = "middle"; // Reset textBaseline
    
    // Manage swipe trail length
    if (swipeTrail.length > 20) {
        swipeTrail = swipeTrail.slice(-20);
    }
    
    // Age the swipe trail points
    swipeTrail.forEach((point, index) => {
        point.age = point.age || 0;
        point.age++;
        if (point.age > 8) {
            swipeTrail.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animate);
}

function drawGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ffffff";
    // Adjust font size based on screen width
    const gameOverFontSize = isMobile ? 48 : 72;
    ctx.font = `bold ${gameOverFontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - (isMobile ? 30 : 50));
    
    const finalScoreFontSize = isMobile ? 32 : 48;
    ctx.font = `bold ${finalScoreFontSize}px Arial`;
    ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + (isMobile ? 30 : 50));
    
    // Display high score in game over screen
    ctx.fillStyle = "#FFDC00"; // Gold color
    const highScoreFontSize = isMobile ? 24 : 36;
    ctx.font = `bold ${highScoreFontSize}px Arial`;
    ctx.fillText("High Score: " + highScore, canvas.width / 2, canvas.height / 2 + (isMobile ? 70 : 100));
    
    ctx.fillStyle = "#ffffff";
    const restartFontSize = isMobile ? 18 : 24;
    ctx.font = `${restartFontSize}px Arial`;
    ctx.fillText("Click anywhere to restart", canvas.width / 2, canvas.height / 2 + (isMobile ? 100 : 150));
}

// Mouse and touch events
canvas.addEventListener("mousedown", (event) => {
    if (gameOver) {
        restartGame();
        return;
    }
    isMouseDown = true;
    const rect = canvas.getBoundingClientRect();
    lastMousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
    swipeTrail = [];
});

canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
    swipeTrail = [];
});

canvas.addEventListener("mousemove", (event) => {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentPosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
    
    // Add interpolation for smooth trail
    if (lastMousePosition.x && lastMousePosition.y) {
        const dx = currentPosition.x - lastMousePosition.x;
        const dy = currentPosition.y - lastMousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) { // Only create trail if mouse is moving
            swipeTrail.push({ x: currentPosition.x, y: currentPosition.y, age: 0 });
            bladeTrail.push(new BladeTrail(currentPosition.x, currentPosition.y));
            checkCollisions(currentPosition.x, currentPosition.y);
        }
    }
    
    lastMousePosition = currentPosition;
});

canvas.addEventListener("mouseleave", () => {
    lastMousePosition = { x: 0, y: 0 };
    swipeTrail = [];
});

// Touch events for mobile
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (gameOver) {
        restartGame();
        return;
    }
    isMouseDown = true;
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastMousePosition = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
    swipeTrail = [];
});

canvas.addEventListener("touchend", (event) => {
    event.preventDefault();
    isMouseDown = false;
    swipeTrail = [];
});

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    if (gameOver) return;
    
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const currentPosition = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
    
    // Add interpolation for smooth trail
    if (lastMousePosition.x && lastMousePosition.y) {
        const dx = currentPosition.x - lastMousePosition.x;
        const dy = currentPosition.y - lastMousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) { // Only create trail if touch is moving
            swipeTrail.push({ x: currentPosition.x, y: currentPosition.y, age: 0 });
            bladeTrail.push(new BladeTrail(currentPosition.x, currentPosition.y));
            checkCollisions(currentPosition.x, currentPosition.y);
        }
    }
    
    lastMousePosition = currentPosition;
});

// Add after the other global variables
let bombHits = 0;
const maxBombHits = 3;

// Add after the score display CSS
const style = document.createElement('style');
style.textContent = `
.score-popup {
    position: absolute;
    color: #fff;
    font-size: ${isMobile ? '20px' : '28px'};
    font-weight: bold;
    pointer-events: none;
    animation: popup 1s ease-out;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.7),
                 0 0 15px rgba(255, 255, 255, 0.5);
    z-index: 1000;
    letter-spacing: 1px;
}

@keyframes popup {
    0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
    20% { transform: scale(1.2) rotate(5deg); opacity: 1; }
    50% { transform: scale(1.5) rotate(-2deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg) translateY(-80px); opacity: 0; }
}

#gameCanvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

#score {
    // position: absolute;
    // top: 20px;
    // right: 20px;
    // font-size: 24px;
    // color: white;
    // text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    // z-index: 2;

    display: none;
}

#gameOver {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    z-index: 3;
    display: none;
}
.bomb-counter {
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 24px;
    color: #FF4136;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    z-index: 2;
    padding: 10px;
    border-radius: 5px;
    transition: color 0.3s ease;
}
`;

// Add after createSeparatorLine function
function createBombCounter() {
    const bombCounter = document.createElement('div');
    bombCounter.className = 'bomb-counter';
    bombCounter.id = 'bomb-counter';
    // Set font size based on device type
    bombCounter.style.fontSize = isMobile ? '20px' : '24px';
    // Adjust padding for mobile
    bombCounter.style.padding = isMobile ? '5px' : '10px';
    updateBombCounter();
    document.body.appendChild(bombCounter);
}

function updateBombCounter() {
    const bombCounter = document.getElementById('bomb-counter');
    if (bombCounter) {
        bombCounter.textContent = `Bombs: ${bombHits}/${maxBombHits}`;
        // Change color based on number of hits
        if (bombHits === 0) {
            bombCounter.style.color = '#2ECC40'; // Green
        } else if (bombHits === 1) {
            bombCounter.style.color = '#FFDC00'; // Yellow
        } else if (bombHits === 2) {
            bombCounter.style.color = '#FF851B'; // Orange
        }
    }
}

// Update the checkCollisions function
function checkCollisions(x, y) {
    fruits.forEach(fruit => {
        if (!fruit.sliced) {
            const dx = x - fruit.x;
            const dy = y - fruit.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Make collision detection more forgiving on mobile devices
            // Increase hit area by 20% on mobile for easier gameplay
            const hitRadius = fruit.size / 2 * (isMobile ? 1.2 : 1);
            
            if (distance < hitRadius) {
                if (fruit.isBomb) {
                    bombHits++;
                    updateBombCounter();
                    fruit.slice();
                    if (bombHits >= maxBombHits) {
                        gameOver = true;
                        // Update high score when game is over
                        updateHighScore();
                    }
                } else {
                    fruit.slice();
                }
            }
        }
    });
}

// Update the restartGame function
function restartGame() {
    fruits = [];
    score = 0;
    bombHits = 0;
    updateBombCounter();
    swipeTrail = [];
    particles = [];
    bladeTrail = [];
    gameOver = false;
    document.getElementById("score").innerText = "Score: 0";
    animate();
}

// Create a separator line at the bottom
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
    const breatheStyle = document.createElement('style');
    breatheStyle.textContent = `
        @keyframes breathe {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(breatheStyle);
    document.body.appendChild(separator);
}

// Load high score from localStorage if available
function loadHighScore() {
    const savedHighScore = localStorage.getItem('fruitSlasherHighScore');
    if (savedHighScore !== null) {
        highScore = parseInt(savedHighScore);
    }
}

// Save high score to localStorage
function saveHighScore() {
    localStorage.setItem('fruitSlasherHighScore', highScore.toString());
}

// Update high score if current score is higher
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        saveHighScore();
    }
}

// Add this line before the animate() call at the end of the file
createBombCounter();
document.head.appendChild(style);

// Load high score when the game starts
loadHighScore();

// Adjust spawn rate based on screen size
const spawnInterval = Math.max(1000, Math.min(1800, window.innerWidth / 1.5));
setInterval(spawnFruit, spawnInterval);

// Create separator line
createSeparatorLine();

// Start the game
animate();
