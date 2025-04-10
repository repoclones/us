// New file for physics-based power-ups that affect the game's fundamental mechanics
import config from 'config';

export class PhysicalPowerUpManager {
    constructor(game) {
        this.game = game;
        this.antiGravityActive = false;
        this.magneticFieldActive = false;
        this.magneticPoles = [];
        this.lightSpeedActive = false;
        this.lightSpeedTrail = [];
        this.timeRiftActive = false;
        this.timeRiftZones = [];
        this.wormholeActive = false;
        this.wormholes = [];
        this.multiDimensionalActive = false;
        this.dimensions = [];
        this.currentDimension = 0;
    }

    applyPhysicalPowerUp(powerUpName) {
        switch (powerUpName) {
            case 'Anti Gravity':
                this.setupAntiGravity();
                break;
            case 'Magnetic Field':
                this.setupMagneticField();
                break;
            case 'Light Speed':
                this.setupLightSpeed();
                break;
            case 'Time Rift':
                this.setupTimeRift();
                break;
            case 'Wormhole Field':
                this.setupWormholeField();
                break;
            case 'Multi Dimensional':
                this.setupMultiDimensional();
                break;
        }
    }

    setupAntiGravity() {
        this.antiGravityActive = true;
        
        // Apply visual effect
        document.getElementById('game-canvas').classList.add('anti-gravity');
        
        setTimeout(() => {
            this.antiGravityActive = false;
            document.getElementById('game-canvas').classList.remove('anti-gravity');
        }, config.powerUpDuration);
    }

    applyAntiGravityEffect(head) {
        if (!this.antiGravityActive) return head;
        
        // Calculate the center of the grid
        const centerX = Math.floor(this.game.gridWidth / 2);
        const centerY = Math.floor(this.game.gridHeight / 2);
        
        // Calculate direction vector from center
        const dx = head.x - centerX;
        const dy = head.y - centerY;
        
        // Apply "antigravity" by slightly pushing away from center
        if (Math.random() < 0.3) { // 30% chance to apply effect
            if (Math.abs(dx) > Math.abs(dy)) {
                head.x += dx > 0 ? 1 : (dx < 0 ? -1 : 0);
            } else {
                head.y += dy > 0 ? 1 : (dy < 0 ? -1 : 0);
            }
        }
        
        return head;
    }

    setupMagneticField() {
        this.magneticFieldActive = true;
        this.magneticPoles = [];
        
        // Create 2 magnetic poles (positive and negative)
        this.magneticPoles.push({
            x: Math.floor(Math.random() * this.game.gridWidth),
            y: Math.floor(Math.random() * this.game.gridHeight),
            type: 'positive',
            strength: 0.5 + Math.random() * 0.5
        });
        
        this.magneticPoles.push({
            x: Math.floor(Math.random() * this.game.gridWidth),
            y: Math.floor(Math.random() * this.game.gridHeight),
            type: 'negative',
            strength: 0.5 + Math.random() * 0.5
        });
        
        setTimeout(() => {
            this.magneticFieldActive = false;
            this.magneticPoles = [];
        }, config.powerUpDuration);
    }

    applyMagneticFieldEffect() {
        if (!this.magneticFieldActive) return;
        
        // Apply magnetic field effects to all food items
        for (const food of this.game.foods) {
            for (const pole of this.magneticPoles) {
                const dx = pole.x - food.x;
                const dy = pole.y - food.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 6) { // Only affect food within range
                    const force = pole.strength / Math.max(1, distance);
                    
                    if (Math.random() < force) {
                        // Positive pole attracts, negative pole repels
                        const direction = pole.type === 'positive' ? 1 : -1;
                        
                        // Move food based on magnetic field
                        if (Math.abs(dx) > Math.abs(dy)) {
                            food.x += direction * (dx > 0 ? 1 : -1);
                        } else {
                            food.y += direction * (dy > 0 ? 1 : -1);
                        }
                        
                        // Ensure food stays within boundaries
                        food.x = Math.max(0, Math.min(this.game.gridWidth - 1, food.x));
                        food.y = Math.max(0, Math.min(this.game.gridHeight - 1, food.y));
                    }
                }
            }
        }
    }

    setupLightSpeed() {
        this.lightSpeedActive = true;
        this.lightSpeedTrail = [];
        
        // Temporarily slow down game
        this.originalSpeed = this.game.speed;
        this.game.speed = this.game.speed * 1.5;
        
        // After brief pause, go extremely fast
        setTimeout(() => {
            // Hyperspace effect
            document.body.classList.add('light-speed-effect');
            
            // Extremely fast speed
            this.game.speed = this.game.speed * 0.2;
            
            // After light speed duration, return to normal
            setTimeout(() => {
                this.lightSpeedActive = false;
                this.lightSpeedTrail = [];
                this.game.speed = this.originalSpeed;
                document.body.classList.remove('light-speed-effect');
            }, config.powerUpDuration * 0.8);
        }, config.powerUpDuration * 0.2);
    }

    updateLightSpeedTrail() {
        if (!this.lightSpeedActive) return;
        
        // Add current snake position to trail
        if (this.game.snake.length > 0) {
            for (const segment of this.game.snake) {
                // Add light speed particle
                this.lightSpeedTrail.push({
                    x: segment.x,
                    y: segment.y,
                    life: 5 // Frames to live
                });
            }
            
            // Update trail particles
            for (let i = this.lightSpeedTrail.length - 1; i >= 0; i--) {
                this.lightSpeedTrail[i].life--;
                if (this.lightSpeedTrail[i].life <= 0) {
                    this.lightSpeedTrail.splice(i, 1);
                }
            }
        }
    }

    setupTimeRift() {
        this.timeRiftActive = true;
        this.timeRiftZones = [];
        
        // Create 2-3 time rift zones
        const numRifts = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < numRifts; i++) {
            this.timeRiftZones.push({
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: Math.floor(Math.random() * this.game.gridHeight),
                radius: Math.floor(Math.random() * 3) + 2,
                timeEffect: Math.random() < 0.5 ? 'slow' : 'fast',
                intensity: 0.5 + Math.random() * 0.5
            });
        }
        
        setTimeout(() => {
            this.timeRiftActive = false;
            this.timeRiftZones = [];
        }, config.powerUpDuration);
    }

    updateTimeRiftZones() {
        if (!this.timeRiftActive) return;
        
        // Check if snake head is in any time rift zone
        if (this.game.snake.length > 0) {
            const head = this.game.snake[0];
            
            for (const rift of this.timeRiftZones) {
                const dx = head.x - rift.x;
                const dy = head.y - rift.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= rift.radius) {
                    // Apply time effect
                    if (rift.timeEffect === 'slow') {
                        // Temporarily slow down
                        this.game.speed = this.game.speed * (1 + rift.intensity);
                        
                        // Add visual indicator
                        document.getElementById('game-canvas').classList.add('time-slow');
                        setTimeout(() => {
                            document.getElementById('game-canvas').classList.remove('time-slow');
                            // Return to normal speed gradually
                            this.game.speed = this.game.speed / (1 + rift.intensity);
                        }, 1000);
                    } else {
                        // Temporarily speed up
                        this.game.speed = this.game.speed * (1 - rift.intensity * 0.5);
                        
                        // Add visual indicator
                        document.getElementById('game-canvas').classList.add('time-fast');
                        setTimeout(() => {
                            document.getElementById('game-canvas').classList.remove('time-fast');
                            // Return to normal speed gradually
                            this.game.speed = this.game.speed / (1 - rift.intensity * 0.5);
                        }, 1000);
                    }
                    break;
                }
            }
        }
    }

    setupWormholeField() {
        this.wormholeActive = true;
        this.wormholes = [];
        
        // Create a network of interconnected wormholes
        const numWormholes = Math.floor(Math.random() * 3) + 3; // 3-5 wormholes
        
        // Create wormhole entrances
        for (let i = 0; i < numWormholes; i++) {
            let pos;
            do {
                pos = {
                    x: Math.floor(Math.random() * this.game.gridWidth),
                    y: Math.floor(Math.random() * this.game.gridHeight)
                };
            } while (this.game.isPositionOccupied(pos));
            
            this.wormholes.push({
                x: pos.x,
                y: pos.y,
                targetIndex: (i + 1) % numWormholes, // Connect in a loop
                color: `hsl(${(i * 360 / numWormholes) % 360}, 80%, 60%)`
            });
        }
        
        setTimeout(() => {
            this.wormholeActive = false;
            this.wormholes = [];
        }, config.powerUpDuration);
    }

    checkWormholeTransport(head) {
        if (!this.wormholeActive) return null;
        
        for (const wormhole of this.wormholes) {
            if (head.x === wormhole.x && head.y === wormhole.y) {
                // Transport to the target wormhole
                const target = this.wormholes[wormhole.targetIndex];
                return { x: target.x, y: target.y };
            }
        }
        
        return null;
    }

    setupMultiDimensional() {
        this.multiDimensionalActive = true;
        this.dimensions = [];
        this.currentDimension = 0;
        
        // Create 2-3 alternate dimensions with different properties
        const numDimensions = 3;
        
        for (let i = 0; i < numDimensions; i++) {
            this.dimensions.push({
                id: i,
                foodPositions: [], // Unique food positions for this dimension
                wallPositions: [], // Wall positions that only exist in this dimension
                color: `hsl(${(i * 120) % 360}, 70%, 50%)`
            });
            
            // Generate food for this dimension
            for (let j = 0; j < this.game.foods.length; j++) {
                this.dimensions[i].foodPositions.push(this.game.generateFood());
            }
            
            // Generate walls for non-primary dimensions
            if (i > 0) {
                const numWalls = 10 + Math.floor(Math.random() * 10);
                for (let j = 0; j < numWalls; j++) {
                    let wall;
                    do {
                        wall = {
                            x: Math.floor(Math.random() * this.game.gridWidth),
                            y: Math.floor(Math.random() * this.game.gridHeight)
                        };
                    } while (this.game.isPositionOccupied(wall));
                    this.dimensions[i].wallPositions.push(wall);
                }
            }
        }
        
        // Set up dimension switching interval
        this.dimensionInterval = setInterval(() => {
            this.switchDimension();
        }, 3000);
        
        setTimeout(() => {
            clearInterval(this.dimensionInterval);
            this.multiDimensionalActive = false;
            this.dimensions = [];
            this.currentDimension = 0;
        }, config.powerUpDuration);
    }

    switchDimension() {
        if (!this.multiDimensionalActive) return;
        
        // Save current dimension's food positions
        if (this.dimensions[this.currentDimension]) {
            this.dimensions[this.currentDimension].foodPositions = [...this.game.foods];
        }
        
        // Switch to next dimension
        this.currentDimension = (this.currentDimension + 1) % this.dimensions.length;
        
        // Load food positions from this dimension
        if (this.dimensions[this.currentDimension]) {
            this.game.foods = [...this.dimensions[this.currentDimension].foodPositions];
        }
        
        // Add visual cue for dimension change
        document.getElementById('game-canvas').style.border = `3px solid ${this.dimensions[this.currentDimension].color}`;
        document.getElementById('game-canvas').classList.add('dimension-shift-effect');
        
        setTimeout(() => {
            document.getElementById('game-canvas').classList.remove('dimension-shift-effect');
        }, 500);
    }

    checkDimensionWallCollision(head) {
        if (!this.multiDimensionalActive || this.currentDimension === 0) return false;
        
        // Check if position collides with a wall in the current dimension
        for (const wall of this.dimensions[this.currentDimension].wallPositions) {
            if (head.x === wall.x && head.y === wall.y) {
                return true;
            }
        }
        
        return false;
    }

    update() {
        if (this.magneticFieldActive) {
            this.applyMagneticFieldEffect();
        }
        
        if (this.lightSpeedActive) {
            this.updateLightSpeedTrail();
        }
        
        if (this.timeRiftActive) {
            this.updateTimeRiftZones();
        }
    }

    draw(ctx, gridSize) {
        this.drawMagneticPoles(ctx, gridSize);
        this.drawLightSpeedTrail(ctx, gridSize);
        this.drawTimeRiftZones(ctx, gridSize);
        this.drawWormholes(ctx, gridSize);
        this.drawDimensionWalls(ctx, gridSize);
    }

    drawMagneticPoles(ctx, gridSize) {
        if (!this.magneticFieldActive) return;
        
        for (const pole of this.magneticPoles) {
            const x = pole.x * gridSize + gridSize / 2;
            const y = pole.y * gridSize + gridSize / 2;
            
            // Create magnetic field gradient
            const gradient = ctx.createRadialGradient(
                x, y, gridSize / 4,
                x, y, gridSize * 2
            );
            
            if (pole.type === 'positive') {
                gradient.addColorStop(0, 'rgba(255, 64, 64, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 64, 64, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(64, 64, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(64, 64, 255, 0)');
            }
            
            // Draw magnetic field
            ctx.beginPath();
            ctx.arc(x, y, gridSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw center of pole
            ctx.beginPath();
            ctx.arc(x, y, gridSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = pole.type === 'positive' ? '#ff4040' : '#4040ff';
            ctx.fill();
            
            // Draw symbol on pole
            ctx.fillStyle = 'white';
            ctx.font = `${gridSize * 0.7}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pole.type === 'positive' ? '+' : '-', x, y);
        }
    }

    drawLightSpeedTrail(ctx, gridSize) {
        if (!this.lightSpeedActive) return;
        
        for (const particle of this.lightSpeedTrail) {
            // Calculate opacity based on life
            const opacity = particle.life / 5;
            
            // Draw trail particle
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fillRect(
                particle.x * gridSize,
                particle.y * gridSize,
                gridSize,
                gridSize
            );
        }
    }

    drawTimeRiftZones(ctx, gridSize) {
        if (!this.timeRiftActive) return;
        
        for (const rift of this.timeRiftZones) {
            const x = rift.x * gridSize + gridSize / 2;
            const y = rift.y * gridSize + gridSize / 2;
            const radius = rift.radius * gridSize;
            
            // Create gradient based on time effect
            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, radius
            );
            
            if (rift.timeEffect === 'slow') {
                gradient.addColorStop(0, 'rgba(0, 128, 255, 0.7)');
                gradient.addColorStop(1, 'rgba(0, 128, 255, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(255, 128, 0, 0.7)');
                gradient.addColorStop(1, 'rgba(255, 128, 0, 0)');
            }
            
            // Draw rift zone
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw clock symbols
            ctx.strokeStyle = rift.timeEffect === 'slow' ? 'rgba(0, 64, 128, 0.9)' : 'rgba(128, 64, 0, 0.9)';
            ctx.lineWidth = 2;
            
            // Clock circle
            ctx.beginPath();
            ctx.arc(x, y, gridSize / 2, 0, Math.PI * 2);
            ctx.stroke();
            
            // Clock hands
            const angle = Date.now() / (rift.timeEffect === 'slow' ? 2000 : 500);
            
            // Hour hand
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(angle) * (gridSize / 3),
                y + Math.sin(angle) * (gridSize / 3)
            );
            ctx.stroke();
            
            // Minute hand
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(angle * 12) * (gridSize / 2.2),
                y + Math.sin(angle * 12) * (gridSize / 2.2)
            );
            ctx.stroke();
        }
    }

    drawWormholes(ctx, gridSize) {
        if (!this.wormholeActive) return;
        
        for (const wormhole of this.wormholes) {
            const x = wormhole.x * gridSize + gridSize / 2;
            const y = wormhole.y * gridSize + gridSize / 2;
            
            // Draw wormhole
            const pulseSize = 1 + 0.2 * Math.sin(Date.now() / 200);
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, gridSize * pulseSize
            );
            
            gradient.addColorStop(0, wormhole.color);
            gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(x, y, gridSize * pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Inner swirl
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Date.now() / 500);
            
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + Date.now() / 1000;
                ctx.fillStyle = wormhole.color;
                ctx.beginPath();
                ctx.arc(
                    gridSize / 3 * Math.cos(angle),
                    gridSize / 3 * Math.sin(angle),
                    gridSize / 6,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
            
            ctx.restore();
            
            // Draw connection line to target
            const target = this.wormholes[wormhole.targetIndex];
            const tx = target.x * gridSize + gridSize / 2;
            const ty = target.y * gridSize + gridSize / 2;
            
            ctx.strokeStyle = wormhole.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
        }
    }

    drawDimensionWalls(ctx, gridSize) {
        if (!this.multiDimensionalActive || this.currentDimension === 0) return;
        
        // Draw walls for current dimension
        const walls = this.dimensions[this.currentDimension].wallPositions;
        const color = this.dimensions[this.currentDimension].color;
        
        for (const wall of walls) {
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.7;
            ctx.fillRect(
                wall.x * gridSize,
                wall.y * gridSize,
                gridSize,
                gridSize
            );
            
            // Draw wall texture
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            
            // Horizontal lines
            for (let i = 1; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(wall.x * gridSize, wall.y * gridSize + i * gridSize / 3);
                ctx.lineTo(wall.x * gridSize + gridSize, wall.y * gridSize + i * gridSize / 3);
                ctx.stroke();
            }
            
            // Vertical lines
            for (let i = 1; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(wall.x * gridSize + i * gridSize / 3, wall.y * gridSize);
                ctx.lineTo(wall.x * gridSize + i * gridSize / 3, wall.y * gridSize + gridSize);
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
        }
    }
}