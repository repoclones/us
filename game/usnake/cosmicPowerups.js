// New file for cosmic power-up functionality
import config from 'config';

export class CosmicPowerUpManager {
    constructor(game) {
        this.game = game;
        this.starfieldActive = false;
        this.starfieldParticles = [];
        this.blackHoleActive = false;
        this.blackHolePosition = null;
        this.blackHoleRadius = 0;
        this.cosmicWaveActive = false;
        this.cosmicWaves = [];
        this.celestialShieldActive = false;
        this.shieldParticles = [];
        this.asteroidFieldActive = false;
        this.asteroids = [];
        this.novaBlastActive = false;
        this.novaBlastTime = null;
        this.supermassiveActive = false;
        this.supermassiveGrowth = 0;
    }
    
    applyCosmicPowerUp(powerUpName) {
        switch (powerUpName) {
            case 'Starfield':
                this.setupStarfield();
                break;
            case 'Black Hole':
                this.setupBlackHole();
                break;
            case 'Cosmic Wave':
                this.setupCosmicWave();
                break;
            case 'Celestial Shield':
                this.setupCelestialShield();
                break;
            case 'Asteroid Field':
                this.setupAsteroidField();
                break;
            case 'Nova Blast':
                this.setupNovaBlast();
                break;
            case 'Supermassive':
                this.setupSupermassive();
                break;
        }
    }
    
    setupStarfield() {
        this.starfieldActive = true;
        this.starfieldParticles = [];
        
        // Create starfield particles
        for (let i = 0; i < 100; i++) {
            this.starfieldParticles.push({
                x: Math.random() * this.game.canvas.width,
                y: Math.random() * this.game.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 1 + 0.5,
                brightness: Math.random() * 100
            });
        }
        
        // Add starfield effect to canvas
        this.game.canvas.classList.add('cosmic-effect');
        
        setTimeout(() => {
            this.starfieldActive = false;
            this.starfieldParticles = [];
            this.game.canvas.classList.remove('cosmic-effect');
        }, config.powerUpDuration);
    }
    
    updateStarfield() {
        if (!this.starfieldActive) return;
        
        // Move stars down
        this.starfieldParticles.forEach(star => {
            star.y += star.speed;
            star.brightness = (Math.sin(Date.now() / 1000 + star.speed) + 1) * 50;
            
            // Wrap around when reaching bottom
            if (star.y > this.game.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.game.canvas.width;
            }
        });
    }
    
    setupBlackHole() {
        this.blackHoleActive = true;
        
        // Create black hole at random position
        this.blackHolePosition = {
            x: Math.floor(Math.random() * this.game.gridWidth),
            y: Math.floor(Math.random() * this.game.gridHeight)
        };
        
        this.blackHoleRadius = 1;
        
        setTimeout(() => {
            this.blackHoleActive = false;
            this.blackHolePosition = null;
        }, config.powerUpDuration);
    }
    
    updateBlackHole() {
        if (!this.blackHoleActive || !this.blackHolePosition) return;
        
        // Pulsate black hole radius
        this.blackHoleRadius = 1 + 0.5 * Math.sin(Date.now() / 200);
        
        // Pull food toward black hole with increasing force as they get closer
        this.game.foods.forEach(food => {
            const dx = this.blackHolePosition.x - food.x;
            const dy = this.blackHolePosition.y - food.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 8) {
                const force = 0.2 / Math.max(0.5, distance);
                
                // Apply gravitational pull
                if (Math.random() < force) {
                    // Move toward black hole
                    if (Math.abs(dx) > Math.abs(dy)) {
                        food.x += dx > 0 ? 1 : -1;
                    } else {
                        food.y += dy > 0 ? 1 : -1;
                    }
                }
                
                // If very close, food gets consumed and respawns elsewhere
                if (distance < 1) {
                    const newFood = this.game.generateFood();
                    food.x = newFood.x;
                    food.y = newFood.y;
                    
                    // Award a point
                    this.game.score++;
                    this.game.updateScore();
                }
            }
        });
    }
    
    setupCosmicWave() {
        this.cosmicWaveActive = true;
        this.cosmicWaves = [];
        
        // Spawn a new wave every second
        this.waveInterval = setInterval(() => {
            // Create a new expanding wave
            this.cosmicWaves.push({
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: Math.floor(Math.random() * this.game.gridHeight),
                radius: 0,
                maxRadius: 15,
                color: this.getRandomCosmicColor(),
                speed: Math.random() * 0.3 + 0.2
            });
        }, 1000);
        
        setTimeout(() => {
            clearInterval(this.waveInterval);
            this.cosmicWaveActive = false;
            this.cosmicWaves = [];
        }, config.powerUpDuration);
    }
    
    getRandomCosmicColor() {
        const colors = [
            '#1E88E5', // Blue
            '#7E57C2', // Purple
            '#E91E63', // Pink
            '#5C6BC0', // Indigo
            '#00BCD4'  // Cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateCosmicWaves() {
        if (!this.cosmicWaveActive) return;
        
        // Update each wave
        for (let i = this.cosmicWaves.length - 1; i >= 0; i--) {
            const wave = this.cosmicWaves[i];
            
            // Expand the wave
            wave.radius += wave.speed;
            
            // Remove waves that have expanded to maximum
            if (wave.radius >= wave.maxRadius) {
                this.cosmicWaves.splice(i, 1);
                continue;
            }
            
            // Check if any food is touched by the wave
            this.game.foods.forEach(food => {
                const dx = food.x - wave.x;
                const dy = food.y - wave.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If food is within the wave and at the edge
                if (Math.abs(distance - wave.radius) < 1) {
                    // Move the food in the direction of expansion
                    const angle = Math.atan2(dy, dx);
                    food.x = Math.round(wave.x + Math.cos(angle) * (wave.radius + 1));
                    food.y = Math.round(wave.y + Math.sin(angle) * (wave.radius + 1));
                    
                    // Ensure within bounds
                    food.x = Math.max(0, Math.min(this.game.gridWidth - 1, food.x));
                    food.y = Math.max(0, Math.min(this.game.gridHeight - 1, food.y));
                }
            });
        }
    }
    
    setupCelestialShield() {
        this.celestialShieldActive = true;
        this.shieldParticles = [];
        
        // Create shield particles that will orbit the snake
        for (let i = 0; i < 20; i++) {
            this.shieldParticles.push({
                angle: (Math.PI * 2 / 20) * i,
                distance: 2.5,
                speed: 0.05 + Math.random() * 0.05,
                size: 0.5 + Math.random() * 0.5,
                color: this.getRandomCosmicColor()
            });
        }
        
        setTimeout(() => {
            this.celestialShieldActive = false;
            this.shieldParticles = [];
        }, config.powerUpDuration);
    }
    
    updateCelestialShield() {
        if (!this.celestialShieldActive || this.game.snake.length === 0) return;
        
        // Update each shield particle
        this.shieldParticles.forEach(particle => {
            // Update particle position
            particle.angle += particle.speed;
            
            // Check for collision with food
            if (this.game.foods.length > 0) {
                const head = this.game.snake[0];
                const particleX = Math.floor(head.x + Math.cos(particle.angle) * particle.distance);
                const particleY = Math.floor(head.y + Math.sin(particle.angle) * particle.distance);
                
                for (let i = 0; i < this.game.foods.length; i++) {
                    const food = this.game.foods[i];
                    if (food.x === particleX && food.y === particleY) {
                        // Shield collected the food
                        this.game.score += 0.5; // Half point
                        this.game.updateScore();
                        
                        // Regenerate the food
                        this.game.foods[i] = this.game.generateFood();
                        break;
                    }
                }
            }
        });
    }
    
    setupAsteroidField() {
        this.asteroidFieldActive = true;
        this.asteroids = [];
        
        // Create initial asteroids
        for (let i = 0; i < 15; i++) {
            this.createAsteroid();
        }
        
        // Add asteroid interval to create new ones periodically
        this.asteroidInterval = setInterval(() => {
            if (this.asteroids.length < 20) {
                this.createAsteroid();
            }
        }, 1000);
        
        setTimeout(() => {
            clearInterval(this.asteroidInterval);
            this.asteroidFieldActive = false;
            this.asteroids = [];
        }, config.powerUpDuration);
    }
    
    createAsteroid() {
        // Create asteroid at the edge of the grid
        const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
        let x, y, vx, vy;
        
        // Determine position and velocity based on side
        switch (side) {
            case 0: // Top
                x = Math.floor(Math.random() * this.game.gridWidth);
                y = 0;
                vx = Math.random() * 2 - 1; // -1 to 1
                vy = Math.random() * 0.5 + 0.5; // 0.5 to 1
                break;
            case 1: // Right
                x = this.game.gridWidth - 1;
                y = Math.floor(Math.random() * this.game.gridHeight);
                vx = -Math.random() * 0.5 - 0.5; // -1 to -0.5
                vy = Math.random() * 2 - 1; // -1 to 1
                break;
            case 2: // Bottom
                x = Math.floor(Math.random() * this.game.gridWidth);
                y = this.game.gridHeight - 1;
                vx = Math.random() * 2 - 1; // -1 to 1
                vy = -Math.random() * 0.5 - 0.5; // -1 to -0.5
                break;
            case 3: // Left
                x = 0;
                y = Math.floor(Math.random() * this.game.gridHeight);
                vx = Math.random() * 0.5 + 0.5; // 0.5 to 1
                vy = Math.random() * 2 - 1; // -1 to 1
                break;
        }
        
        // Add new asteroid
        this.asteroids.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: Math.floor(Math.random() * 2) + 1, // 1 or 2
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.2 - 0.1
        });
    }
    
    updateAsteroidField() {
        if (!this.asteroidFieldActive) return;
        
        // Update each asteroid
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            
            // Update position
            asteroid.x += asteroid.vx;
            asteroid.y += asteroid.vy;
            asteroid.rotation += asteroid.rotationSpeed;
            
            // Remove if out of bounds
            if (asteroid.x < -2 || asteroid.x > this.game.gridWidth + 2 ||
                asteroid.y < -2 || asteroid.y > this.game.gridHeight + 2) {
                this.asteroids.splice(i, 1);
                continue;
            }
            
            // Check for collision with food
            for (let j = 0; j < this.game.foods.length; j++) {
                const food = this.game.foods[j];
                const gridX = Math.floor(asteroid.x);
                const gridY = Math.floor(asteroid.y);
                
                if (food.x === gridX && food.y === gridY) {
                    // Asteroid hit food, move the food to a new position
                    const newFood = this.game.generateFood();
                    food.x = newFood.x;
                    food.y = newFood.y;
                    break;
                }
            }
            
            // Check for collision with snake
            if (!this.game.powerUpManager.getActivePowerUps().includes('Ghost Mode')) {
                for (const segment of this.game.snake) {
                    const gridX = Math.floor(asteroid.x);
                    const gridY = Math.floor(asteroid.y);
                    
                    if (segment.x === gridX && segment.y === gridY) {
                        // Asteroid hit snake, apply knockback effect
                        if (this.celestialShieldActive) {
                            // Shield protects from asteroids
                            this.asteroids.splice(i, 1);
                        } else {
                            // Lose a point or segment
                            if (this.game.snake.length > 3 && this.game.score > 0) {
                                this.game.snake.pop();
                                this.game.score = Math.max(0, this.game.score - 1);
                                this.game.updateScore();
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    
    setupNovaBlast() {
        this.novaBlastActive = true;
        this.novaBlastTime = Date.now() + 3000; // 3 seconds to blast
        
        // Add visual indicator
        const indicator = document.createElement('div');
        indicator.className = 'nova-blast-indicator';
        document.querySelector('.game-container').appendChild(indicator);
        
        setTimeout(() => {
            this.novaBlastActive = false;
            document.querySelector('.nova-blast-indicator')?.remove();
        }, config.powerUpDuration);
    }
    
    updateNovaBlast() {
        if (!this.novaBlastActive) return;
        
        // Check if it's time for the nova blast
        if (this.novaBlastTime && Date.now() >= this.novaBlastTime) {
            // Execute the nova blast
            this.executeNovaBlast();
            this.novaBlastTime = Date.now() + 5000; // Set next blast time
        }
    }
    
    executeNovaBlast() {
        // Create a nova blast effect from the snake head
        if (this.game.snake.length === 0) return;
        
        const head = this.game.snake[0];
        
        // Create nova blast effect
        const blastEffect = document.createElement('div');
        blastEffect.className = 'nova-blast';
        blastEffect.style.left = `${head.x * config.gridSize}px`;
        blastEffect.style.top = `${head.y * config.gridSize}px`;
        document.querySelector('.game-container').appendChild(blastEffect);
        
        // Remove after animation
        setTimeout(() => {
            blastEffect.remove();
        }, 1000);
        
        // Convert all food in a radius to points
        const blastRadius = 5;
        let pointsGained = 0;
        
        this.game.foods.forEach((food, index) => {
            const dx = food.x - head.x;
            const dy = food.y - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= blastRadius) {
                // Convert to points
                pointsGained += (food.type.name === 'Regular') ? 1 : 2;
                
                // Replace the food
                this.game.foods[index] = this.game.generateFood();
            }
        });
        
        // Add points
        if (pointsGained > 0) {
            this.game.score += pointsGained;
            this.game.updateScore();
            
            // Show points gained
            const pointsIndicator = document.createElement('div');
            pointsIndicator.className = 'points-indicator';
            pointsIndicator.textContent = `+${pointsGained}`;
            pointsIndicator.style.left = `${head.x * config.gridSize}px`;
            pointsIndicator.style.top = `${head.y * config.gridSize}px`;
            document.querySelector('.game-container').appendChild(pointsIndicator);
            
            // Remove after animation
            setTimeout(() => {
                pointsIndicator.remove();
            }, 1500);
        }
    }
    
    setupSupermassive() {
        this.supermassiveActive = true;
        this.supermassiveGrowth = 0;
        
        // Add effect to snake
        this.game.canvas.classList.add('supermassive-effect');
        
        // Set a timer to grow the snake periodically
        this.supermassiveInterval = setInterval(() => {
            // Add a new segment
            if (this.game.snake.length > 0) {
                const tail = this.game.snake[this.game.snake.length - 1];
                this.game.snake.push({...tail});
                this.supermassiveGrowth++;
            }
        }, 1000);
        
        setTimeout(() => {
            clearInterval(this.supermassiveInterval);
            this.supermassiveActive = false;
            this.game.canvas.classList.remove('supermassive-effect');
            
            // Remove the extra growth after power-up ends
            if (this.game.snake.length > this.supermassiveGrowth) {
                for (let i = 0; i < this.supermassiveGrowth; i++) {
                    this.game.snake.pop();
                }
            }
            this.supermassiveGrowth = 0;
        }, config.powerUpDuration);
    }
    
    update() {
        if (this.starfieldActive) {
            this.updateStarfield();
        }
        
        if (this.blackHoleActive) {
            this.updateBlackHole();
        }
        
        if (this.cosmicWaveActive) {
            this.updateCosmicWaves();
        }
        
        if (this.celestialShieldActive) {
            this.updateCelestialShield();
        }
        
        if (this.asteroidFieldActive) {
            this.updateAsteroidField();
        }
        
        if (this.novaBlastActive) {
            this.updateNovaBlast();
        }
    }
    
    draw(ctx, gridSize) {
        if (this.starfieldActive) {
            this.drawStarfield(ctx);
        }
        
        if (this.blackHoleActive) {
            this.drawBlackHole(ctx, gridSize);
        }
        
        if (this.cosmicWaveActive) {
            this.drawCosmicWaves(ctx, gridSize);
        }
        
        if (this.celestialShieldActive) {
            this.drawCelestialShield(ctx, gridSize);
        }
        
        if (this.asteroidFieldActive) {
            this.drawAsteroidField(ctx, gridSize);
        }
    }
    
    drawStarfield(ctx) {
        // Draw each star
        this.starfieldParticles.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness / 100})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawBlackHole(ctx, gridSize) {
        if (!this.blackHolePosition) return;
        
        const centerX = this.blackHolePosition.x * gridSize + gridSize / 2;
        const centerY = this.blackHolePosition.y * gridSize + gridSize / 2;
        const radius = gridSize * this.blackHoleRadius;
        
        // Create black hole effect
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius * 2
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.7, 'rgba(75, 0, 130, 0.8)');
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw accretion disk
        ctx.beginPath();
        ctx.ellipse(
            centerX, centerY,
            radius * 2, radius * 0.8,
            Date.now() / 1000, 0, Math.PI * 2
        );
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    drawCosmicWaves(ctx, gridSize) {
        // Draw each cosmic wave
        this.cosmicWaves.forEach(wave => {
            const centerX = wave.x * gridSize + gridSize / 2;
            const centerY = wave.y * gridSize + gridSize / 2;
            const radius = wave.radius * gridSize;
            
            // Draw wave
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 1 - (wave.radius / wave.maxRadius);
            ctx.stroke();
        });
        
        ctx.globalAlpha = 1;
    }
    
    drawCelestialShield(ctx, gridSize) {
        if (this.game.snake.length === 0) return;
        
        const head = this.game.snake[0];
        const centerX = head.x * gridSize + gridSize / 2;
        const centerY = head.y * gridSize + gridSize / 2;
        
        // Draw each shield particle
        this.shieldParticles.forEach(particle => {
            const x = centerX + Math.cos(particle.angle) * particle.distance * gridSize;
            const y = centerY + Math.sin(particle.angle) * particle.distance * gridSize;
            
            ctx.beginPath();
            ctx.arc(x, y, particle.size * gridSize / 3, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = 0.7;
            ctx.fill();
            
            // Add glow effect
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(x, y, particle.size * gridSize / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        ctx.globalAlpha = 1;
    }
    
    drawAsteroidField(ctx, gridSize) {
        // Draw each asteroid
        this.asteroids.forEach(asteroid => {
            const x = asteroid.x * gridSize;
            const y = asteroid.y * gridSize;
            const size = asteroid.size * gridSize / 2;
            
            ctx.save();
            ctx.translate(x + gridSize / 2, y + gridSize / 2);
            ctx.rotate(asteroid.rotation);
            
            // Draw asteroid
            ctx.fillStyle = '#8B4513'; // Brown
            ctx.beginPath();
            
            // Create irregular shape
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                const radius = size * (0.8 + Math.sin(i * 3) * 0.2);
                
                if (i === 0) {
                    ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                } else {
                    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                }
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Add crater details
            ctx.fillStyle = '#6d4c41';
            for (let i = 0; i < 3; i++) {
                const craterX = (Math.random() - 0.5) * size * 0.8;
                const craterY = (Math.random() - 0.5) * size * 0.8;
                const craterSize = size * 0.2;
                
                ctx.beginPath();
                ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
    }
}