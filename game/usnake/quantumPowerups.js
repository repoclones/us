// New file for quantum and advanced physics-based power-ups
import config from 'config';

export class QuantumPowerUpManager {
    constructor(game) {
        this.game = game;
        this.quantumEntanglementActive = false;
        this.entangledFood = [];
        this.schrodingerStateActive = false;
        this.particleAcceleratorActive = false;
        this.acceleratedParticles = [];
        this.quantumDecoherenceActive = false;
        this.decoherencePoints = [];
        this.stringTheoryActive = false;
        this.strings = [];
        this.heisenbergActive = false;
        this.uncertaintyField = null;
        this.telekinesisActive = false;
        this.telekinesisCooldown = 0;
    }

    applyQuantumPowerUp(powerUpName) {
        switch(powerUpName) {
            case 'Quantum Entanglement':
                this.setupQuantumEntanglement();
                break;
            case 'Schrodinger State':
                this.setupSchrodingerState();
                break;
            case 'Particle Accelerator':
                this.setupParticleAccelerator();
                break;
            case 'Quantum Decoherence':
                this.setupQuantumDecoherence();
                break;
            case 'String Theory':
                this.setupStringTheory();
                break;
            case 'Heisenberg Uncertainty':
                this.setupHeisenbergUncertainty();
                break;
            case 'Telekinesis':
                this.setupTelekinesis();
                break;
        }
    }

    setupQuantumEntanglement() {
        this.quantumEntanglementActive = true;
        this.entangledFood = [];
        
        // Create entangled pairs of food
        if (this.game.foods.length >= 2) {
            // Group foods into entangled pairs
            for (let i = 0; i < this.game.foods.length; i += 2) {
                if (i + 1 < this.game.foods.length) {
                    this.entangledFood.push({
                        id: i / 2,
                        food1: this.game.foods[i],
                        food2: this.game.foods[i + 1],
                        entangled: true
                    });
                }
            }
        }
        
        setTimeout(() => {
            this.quantumEntanglementActive = false;
            this.entangledFood = [];
        }, config.powerUpDuration);
    }

    checkEntanglementEffect(eatenFoodIndex) {
        if (!this.quantumEntanglementActive) return null;
        
        // Find if the eaten food is part of an entangled pair
        for (const pair of this.entangledFood) {
            // Check which food of the pair was eaten
            let entangledIndex = null;
            
            if (this.game.foods[eatenFoodIndex] === pair.food1) {
                // Find the index of food2 in the game.foods array
                entangledIndex = this.game.foods.indexOf(pair.food2);
            } else if (this.game.foods[eatenFoodIndex] === pair.food2) {
                // Find the index of food1 in the game.foods array
                entangledIndex = this.game.foods.indexOf(pair.food1);
            }
            
            if (entangledIndex !== null && entangledIndex !== -1) {
                // Return the index of the entangled food to also be consumed
                return entangledIndex;
            }
        }
        
        return null;
    }

    setupSchrodingerState() {
        this.schrodingerStateActive = true;
        
        // Create a superposition state where food exists in multiple states
        // Half visible, half invisible - but all valid for collection
        for (let i = 0; i < this.game.foods.length; i++) {
            this.game.foods[i].schrodingerState = Math.random() < 0.5 ? 'visible' : 'invisible';
        }
        
        // Add visual effect
        document.getElementById('game-canvas').classList.add('schrodinger-effect');
        
        setTimeout(() => {
            this.schrodingerStateActive = false;
            
            // Reset food states
            for (let i = 0; i < this.game.foods.length; i++) {
                delete this.game.foods[i].schrodingerState;
            }
            
            document.getElementById('game-canvas').classList.remove('schrodinger-effect');
        }, config.powerUpDuration);
    }

    setupParticleAccelerator() {
        this.particleAcceleratorActive = true;
        this.acceleratedParticles = [];
        
        // Create particle beams that move across the grid
        this.particleInterval = setInterval(() => {
            this.createParticleBeam();
        }, 2000); // New beam every 2 seconds
        
        setTimeout(() => {
            clearInterval(this.particleInterval);
            this.particleAcceleratorActive = false;
            this.acceleratedParticles = [];
        }, config.powerUpDuration);
    }

    createParticleBeam() {
        // Determine random beam direction and starting position
        const isHorizontal = Math.random() < 0.5;
        
        let beam;
        if (isHorizontal) {
            // Start from left or right edge
            const fromLeft = Math.random() < 0.5;
            beam = {
                x: fromLeft ? 0 : this.game.gridWidth - 1,
                y: Math.floor(Math.random() * this.game.gridHeight),
                vx: fromLeft ? 1 : -1,
                vy: 0,
                width: 1,
                height: 1,
                colorIndex: Math.floor(Math.random() * 360),
                lifetime: this.game.gridWidth * 2,
                type: 'beam'
            };
        } else {
            // Start from top or bottom edge
            const fromTop = Math.random() < 0.5;
            beam = {
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: fromTop ? 0 : this.game.gridHeight - 1,
                vx: 0,
                vy: fromTop ? 1 : -1,
                width: 1,
                height: 1,
                colorIndex: Math.floor(Math.random() * 360),
                lifetime: this.game.gridHeight * 2,
                type: 'beam'
            };
        }
        
        this.acceleratedParticles.push(beam);
    }

    updateParticleBeams() {
        if (!this.particleAcceleratorActive) return;
        
        // Update each particle beam
        for (let i = this.acceleratedParticles.length - 1; i >= 0; i--) {
            const particle = this.acceleratedParticles[i];
            
            // Move the particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.lifetime--;
            
            // Remove if out of bounds or lifetime expired
            if (particle.lifetime <= 0 ||
                particle.x < 0 || particle.x >= this.game.gridWidth ||
                particle.y < 0 || particle.y >= this.game.gridHeight) {
                this.acceleratedParticles.splice(i, 1);
                continue;
            }
            
            // Check for collisions with food
            this.game.foods.forEach((food, index) => {
                if (food.x === Math.floor(particle.x) && food.y === Math.floor(particle.y)) {
                    // Transform food (change its type)
                    const foodTypes = config.foodTypes.filter(type => type.name !== 'Regular');
                    const randomType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
                    this.game.foods[index] = {
                        ...food,
                        type: randomType
                    };
                    
                    // Create particle explosion
                    this.createParticleExplosion(particle.x, particle.y, particle.colorIndex);
                    
                    // Remove the beam
                    this.acceleratedParticles.splice(i, 1);
                }
            });
        }
    }

    createParticleExplosion(x, y, baseColor) {
        // Create particle explosion at the given coordinates
        const numParticles = 10 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.1 + Math.random() * 0.2;
            
            this.acceleratedParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                width: 0.5,
                height: 0.5,
                colorIndex: (baseColor + Math.floor(Math.random() * 60) - 30 + 360) % 360,
                lifetime: 10 + Math.floor(Math.random() * 20),
                type: 'particle'
            });
        }
    }

    setupQuantumDecoherence() {
        this.quantumDecoherenceActive = true;
        this.decoherencePoints = [];
        
        // Create decoherence points that cause quantum collapse
        const numPoints = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < numPoints; i++) {
            this.decoherencePoints.push({
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: Math.floor(Math.random() * this.game.gridHeight),
                radius: 2 + Math.random() * 2,
                strength: 0.5 + Math.random() * 0.5
            });
        }
        
        setTimeout(() => {
            this.quantumDecoherenceActive = false;
            this.decoherencePoints = [];
        }, config.powerUpDuration);
    }

    checkDecoherenceEffect(head) {
        if (!this.quantumDecoherenceActive) return;
        
        for (const point of this.decoherencePoints) {
            const dx = head.x - point.x;
            const dy = head.y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < point.radius) {
                // Apply decoherence - randomly relocate some food
                for (let i = 0; i < this.game.foods.length; i++) {
                    if (Math.random() < point.strength) {
                        this.game.foods[i] = this.game.generateFood();
                    }
                }
                
                // Cause a visual distortion effect
                document.getElementById('game-canvas').classList.add('decoherence-flash');
                setTimeout(() => {
                    document.getElementById('game-canvas').classList.remove('decoherence-flash');
                }, 500);
                
                break;
            }
        }
    }

    setupStringTheory() {
        this.stringTheoryActive = true;
        this.strings = [];
        
        // Create interconnected "strings" between food items
        if (this.game.foods.length >= 2) {
            for (let i = 0; i < this.game.foods.length; i++) {
                for (let j = i + 1; j < this.game.foods.length; j++) {
                    // Only connect some pairs
                    if (Math.random() < 0.7) {
                        this.strings.push({
                            food1: i,
                            food2: j,
                            vibration: Math.random() * Math.PI * 2, // Random phase
                            frequency: 0.05 + Math.random() * 0.1,
                            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
                        });
                    }
                }
            }
        }
        
        setTimeout(() => {
            this.stringTheoryActive = false;
            this.strings = [];
        }, config.powerUpDuration);
    }

    updateStringVibrations() {
        if (!this.stringTheoryActive) return;
        
        // Update string vibrations
        for (const string of this.strings) {
            string.vibration += string.frequency;
            if (string.vibration > Math.PI * 2) {
                string.vibration -= Math.PI * 2;
            }
        }
    }

    setupHeisenbergUncertainty() {
        this.heisenbergActive = true;
        
        // Create an uncertainty field that randomly moves food
        this.uncertaintyField = {
            strength: 0.2 + Math.random() * 0.3,
            frequency: 0.5 + Math.random() * 0.5
        };
        
        // Set up interval to apply uncertainty effects
        this.uncertaintyInterval = setInterval(() => {
            this.applyUncertaintyEffect();
        }, 1000 / this.uncertaintyField.frequency);
        
        setTimeout(() => {
            clearInterval(this.uncertaintyInterval);
            this.heisenbergActive = false;
            this.uncertaintyField = null;
        }, config.powerUpDuration);
    }

    applyUncertaintyEffect() {
        if (!this.heisenbergActive || !this.uncertaintyField) return;
        
        // Apply random small movements to food items
        for (let i = 0; i < this.game.foods.length; i++) {
            if (Math.random() < this.uncertaintyField.strength) {
                const food = this.game.foods[i];
                
                // Generate random movement
                const dx = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                const dy = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                
                // Apply movement while keeping within bounds
                food.x = Math.max(0, Math.min(this.game.gridWidth - 1, food.x + dx));
                food.y = Math.max(0, Math.min(this.game.gridHeight - 1, food.y + dy));
            }
        }
    }

    setupTelekinesis() {
        this.telekinesisActive = true;
        this.telekinesisCooldown = 0;
        
        // Add keydown listener to trigger telekinesis with F key
        this.telekinesisHandler = (e) => {
            if (e.code === 'KeyF' && this.telekinesisActive && this.telekinesisCooldown <= 0) {
                this.moveFoodTelekinetically();
            }
        };
        
        document.addEventListener('keydown', this.telekinesisHandler);
        
        // Display instructions
        const instructionElement = document.createElement('div');
        instructionElement.className = 'power-up-instruction';
        instructionElement.textContent = 'Press F to move food telekinetically!';
        document.querySelector('.game-container').appendChild(instructionElement);
        
        setTimeout(() => {
            document.removeEventListener('keydown', this.telekinesisHandler);
            this.telekinesisActive = false;
            document.querySelector('.power-up-instruction')?.remove();
        }, config.powerUpDuration);
    }

    moveFoodTelekinetically() {
        // Add implementation for moving food telekinetically
        this.telekinesisCooldown = 10; // Add cooldown
        // TO DO: implement food movement logic
    }

    update() {
        if (this.particleAcceleratorActive) {
            this.updateParticleBeams();
        }
        
        if (this.stringTheoryActive) {
            this.updateStringVibrations();
        }
        
        if (this.telekinesisActive) {
            this.telekinesisCooldown -= 1;
        }
    }

    draw(ctx, gridSize) {
        if (this.quantumEntanglementActive) {
            this.drawEntangledFood(ctx, gridSize);
        }
        
        if (this.schrodingerStateActive) {
            this.drawSchrodingerFood(ctx, gridSize);
        }
        
        if (this.particleAcceleratorActive) {
            this.drawParticleBeams(ctx, gridSize);
        }
        
        if (this.quantumDecoherenceActive) {
            this.drawDecoherencePoints(ctx, gridSize);
        }
        
        if (this.stringTheoryActive) {
            this.drawStrings(ctx, gridSize);
        }
        
        if (this.heisenbergActive) {
            this.drawUncertaintyField(ctx, gridSize);
        }
    }

    drawEntangledFood(ctx, gridSize) {
        // Draw connection lines between entangled food pairs
        ctx.save();
        
        for (const pair of this.entangledFood) {
            if (!pair.entangled) continue;
            
            const x1 = pair.food1.x * gridSize + gridSize / 2;
            const y1 = pair.food1.y * gridSize + gridSize / 2;
            const x2 = pair.food2.x * gridSize + gridSize / 2;
            const y2 = pair.food2.y * gridSize + gridSize / 2;
            
            // Draw pulsing connection line
            const pulseIntensity = (Math.sin(Date.now() / 300) + 1) / 2; // 0 to 1
            
            ctx.strokeStyle = `rgba(128, 0, 255, ${0.3 + 0.4 * pulseIntensity})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Draw glow around entangled food
            ctx.fillStyle = `rgba(128, 0, 255, ${0.2 + 0.3 * pulseIntensity})`;
            ctx.beginPath();
            ctx.arc(x1, y1, gridSize / 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x2, y2, gridSize / 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.setLineDash([]);
        ctx.restore();
    }

    drawSchrodingerFood(ctx, gridSize) {
        // This method doesn't need to draw anything special since the
        // invisible state is handled by not drawing the food in the food renderer
    }

    drawParticleBeams(ctx, gridSize) {
        for (const particle of this.acceleratedParticles) {
            // Draw based on particle type
            if (particle.type === 'beam') {
                // Draw particle beam
                ctx.fillStyle = `hsl(${particle.colorIndex}, 100%, 60%)`;
                ctx.fillRect(
                    particle.x * gridSize,
                    particle.y * gridSize,
                    particle.width * gridSize,
                    particle.height * gridSize
                );
                
                // Add glow effect
                ctx.save();
                ctx.shadowColor = `hsl(${particle.colorIndex}, 100%, 60%)`;
                ctx.shadowBlur = 10;
                ctx.fillRect(
                    particle.x * gridSize + gridSize/4,
                    particle.y * gridSize + gridSize/4,
                    particle.width * gridSize/2,
                    particle.height * gridSize/2
                );
                ctx.restore();
            } else if (particle.type === 'particle') {
                // Draw explosion particle
                ctx.fillStyle = `hsl(${particle.colorIndex}, 100%, 60%)`;
                ctx.beginPath();
                ctx.arc(
                    particle.x * gridSize + gridSize/2,
                    particle.y * gridSize + gridSize/2,
                    particle.width * gridSize/2,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
        }
    }

    drawDecoherencePoints(ctx, gridSize) {
        for (const point of this.decoherencePoints) {
            const x = point.x * gridSize + gridSize / 2;
            const y = point.y * gridSize + gridSize / 2;
            const radius = point.radius * gridSize;
            
            // Draw decoherence field
            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, radius
            );
            
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.7)');
            gradient.addColorStop(0.6, 'rgba(0, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw interference pattern
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            
            const waveCount = 3;
            for (let i = 1; i <= waveCount; i++) {
                const waveRadius = radius * (i / waveCount);
                ctx.beginPath();
                ctx.arc(x, y, waveRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    drawStrings(ctx, gridSize) {
        // Draw vibrating strings between food items
        for (const string of this.strings) {
            if (string.food1 < this.game.foods.length && string.food2 < this.game.foods.length) {
                const food1 = this.game.foods[string.food1];
                const food2 = this.game.foods[string.food2];
                
                const x1 = food1.x * gridSize + gridSize / 2;
                const y1 = food1.y * gridSize + gridSize / 2;
                const x2 = food2.x * gridSize + gridSize / 2;
                const y2 = food2.y * gridSize + gridSize / 2;
                
                // Calculate control points for vibrating string
                const dx = x2 - x1;
                const dy = y2 - y1;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Perpendicular offset based on vibration
                const amplitude = Math.min(distance / 3, gridSize * 2);
                const offsetX = -dy / distance * amplitude * Math.sin(string.vibration);
                const offsetY = dx / distance * amplitude * Math.sin(string.vibration);
                
                const cpX = (x1 + x2) / 2 + offsetX;
                const cpY = (y1 + y2) / 2 + offsetY;
                
                // Draw the vibrating string
                ctx.strokeStyle = string.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.quadraticCurveTo(cpX, cpY, x2, y2);
                ctx.stroke();
                
                // Draw nodes at ends
                ctx.fillStyle = string.color;
                ctx.beginPath();
                ctx.arc(x1, y1, 3, 0, Math.PI * 2);
                ctx.arc(x2, y2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawUncertaintyField(ctx, gridSize) {
        if (!this.heisenbergActive || !this.uncertaintyField) return;
        
        // Draw subtle uncertainty field effect across the entire grid
        ctx.save();
        
        // Create a noise pattern
        const noiseScale = 0.1;
        const time = Date.now() / 1000;
        
        for (let x = 0; x < this.game.gridWidth; x += 2) {
            for (let y = 0; y < this.game.gridHeight; y += 2) {
                // Generate noise value
                const noise = Math.sin(x * noiseScale + time) * Math.cos(y * noiseScale + time * 1.5);
                const opacity = Math.abs(noise) * this.uncertaintyField.strength * 0.4;
                
                if (opacity > 0.05) {
                    ctx.fillStyle = `rgba(100, 200, 255, ${opacity})`;
                    ctx.fillRect(
                        x * gridSize, y * gridSize,
                        gridSize * 2, gridSize * 2
                    );
                }
            }
        }
        
        // Draw uncertainty warning near food
        ctx.font = `${gridSize/3}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        
        this.game.foods.forEach(food => {
            const x = food.x * gridSize + gridSize / 2;
            const y = food.y * gridSize + gridSize / 2;
            
            ctx.fillText('?', x, y + gridSize/4);
        });
        
        ctx.restore();
    }

    shouldRenderSchrodingerFood(food) {
        // Determine if a food in Schrodinger state should be visible or invisible
        if (!this.schrodingerStateActive || !food.schrodingerState) {
            return true; // Always render if power-up is not active
        }
        
        return food.schrodingerState === 'visible';
    }
}