// New file for additional advanced power-up functionality
import config from 'config';

export class AdvancedPowerUpExtensions {
    constructor(game, advancedPowerUpManager) {
        this.game = game;
        this.advancedPowerUpManager = advancedPowerUpManager;
        this.realityBendActive = false;
        this.realityBendTimer = null;
        this.snakeFusionActive = false;
        this.fusionSnake = [];
        this.echoTrailActive = false;
        this.echoTrailPositions = [];
        this.quantumTunnelingActive = false;
        this.quantumPortals = [];
        this.dimensionShiftActive = false;
        this.dimensionShiftTransform = { scale: 1, rotation: 0 };
    }
    
    applyExtendedPowerUp(powerUpName) {
        switch (powerUpName) {
            case 'Reality Bend':
                this.setupRealityBend();
                break;
            case 'Snake Fusion':
                this.setupSnakeFusion();
                break;
            case 'Echo Trail':
                this.setupEchoTrail();
                break;
            case 'Quantum Tunneling':
                this.setupQuantumTunneling();
                break;
            case 'Dimension Shift':
                this.setupDimensionShift();
                break;
        }
    }
    
    setupRealityBend() {
        this.realityBendActive = true;
        
        // Start warping the game canvas with CSS transforms
        const gameCanvas = document.getElementById('game-canvas');
        gameCanvas.classList.add('reality-bend');
        
        // Periodically change grid properties
        this.realityBendTimer = setInterval(() => {
            const distortAmount = Math.sin(Date.now() / 500) * 0.1;
            gameCanvas.style.transform = `skew(${distortAmount}rad, ${distortAmount}rad)`;
        }, 100);
        
        setTimeout(() => {
            this.realityBendActive = false;
            gameCanvas.classList.remove('reality-bend');
            gameCanvas.style.transform = '';
            clearInterval(this.realityBendTimer);
        }, config.powerUpDuration);
    }
    
    setupSnakeFusion() {
        this.snakeFusionActive = true;
        
        // Create a second AI-controlled snake that follows a path near the player
        const head = this.game.snake[0];
        this.fusionSnake = [
            {x: head.x - 3, y: head.y - 3}, 
            {x: head.x - 4, y: head.y - 3},
            {x: head.x - 5, y: head.y - 3}
        ];
        
        setTimeout(() => {
            this.snakeFusionActive = false;
            this.fusionSnake = [];
        }, config.powerUpDuration);
    }
    
    updateFusionSnake() {
        if (!this.snakeFusionActive || this.fusionSnake.length === 0) return;
        
        // Follow main snake with some delay and offset
        const targetX = this.game.snake[0].x - 2;
        const targetY = this.game.snake[0].y - 2;
        
        // Calculate direction for fusion snake head
        const fusionHead = this.fusionSnake[0];
        let dx = targetX - fusionHead.x;
        let dy = targetY - fusionHead.y;
        
        // Move fusion snake towards target
        const newHead = { ...fusionHead };
        
        // Prioritize the larger distance
        if (Math.abs(dx) > Math.abs(dy)) {
            newHead.x += dx > 0 ? 1 : (dx < 0 ? -1 : 0);
        } else {
            newHead.y += dy > 0 ? 1 : (dy < 0 ? -1 : 0);
        }
        
        // Add new head and remove tail to maintain length
        this.fusionSnake.unshift(newHead);
        this.fusionSnake.pop();
        
        // Check for food collisions
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            if (newHead.x === food.x && newHead.y === food.y) {
                // Give points but don't grow the fusion snake
                this.game.score++;
                this.game.updateScore();
                
                // Generate new food
                this.game.foods[i] = this.game.generateFood();
            }
        }
    }
    
    setupEchoTrail() {
        this.echoTrailActive = true;
        this.echoTrailPositions = [];
        
        // Store trail history for echo effect
        setTimeout(() => {
            this.echoTrailActive = false;
            this.echoTrailPositions = [];
        }, config.powerUpDuration);
    }
    
    updateEchoTrail() {
        if (!this.echoTrailActive) return;
        
        // Store current snake position
        if (this.game.snake.length > 0) {
            // Clone the snake state
            const trailState = this.game.snake.map(segment => ({
                x: segment.x,
                y: segment.y
            }));
            
            this.echoTrailPositions.push(trailState);
            
            // Keep only the last 5 trail states
            if (this.echoTrailPositions.length > 5) {
                this.echoTrailPositions.shift();
            }
        }
    }
    
    setupQuantumTunneling() {
        this.quantumTunnelingActive = true;
        this.quantumPortals = [];
        
        // Create temporary quantum tunnels between random positions
        this.createQuantumTunnels();
        
        setTimeout(() => {
            this.quantumTunnelingActive = false;
            this.quantumPortals = [];
        }, config.powerUpDuration);
    }
    
    createQuantumTunnels() {
        // Create 3 pairs of quantum tunnels
        for (let i = 0; i < 3; i++) {
            // Create entry and exit points
            let entryPoint, exitPoint;
            
            do {
                entryPoint = {
                    x: Math.floor(Math.random() * this.game.gridWidth),
                    y: Math.floor(Math.random() * this.game.gridHeight)
                };
                
                // Create exit point with minimum distance from entry
                do {
                    exitPoint = {
                        x: Math.floor(Math.random() * this.game.gridWidth),
                        y: Math.floor(Math.random() * this.game.gridHeight)
                    };
                    
                    const dx = exitPoint.x - entryPoint.x;
                    const dy = exitPoint.y - entryPoint.y;
                    const distance = Math.sqrt(
                        Math.pow(dx, 2) + 
                        Math.pow(dy, 2)
                    );
                    
                    if (distance >= 5) break; // Exit loop if we have sufficient distance
                } while (true); // Always loop until we break
                
            } while (this.game.isPositionOccupied(entryPoint) || 
                     this.game.isPositionOccupied(exitPoint));
            
            // Add portal pair with unique color
            const colors = ['#3F51B5', '#009688', '#FF5722'];
            this.quantumPortals.push({
                entry: entryPoint,
                exit: exitPoint,
                color: colors[i],
                lifespan: Math.random() * 3000 + 2000 // Random lifespan between 2-5s
            });
        }
    }
    
    updateQuantumTunnels() {
        if (!this.quantumTunnelingActive) return;
        
        // Update lifespans and remove expired tunnels
        for (let i = this.quantumPortals.length - 1; i >= 0; i--) {
            const portal = this.quantumPortals[i];
            portal.lifespan -= 100; // Decrease lifespan
            
            if (portal.lifespan <= 0) {
                // Remove expired portal
                this.quantumPortals.splice(i, 1);
                
                // Create a new portal to replace it
                if (this.quantumTunnelingActive) {
                    this.createQuantumTunnels();
                }
            }
        }
        
        // Check for snake head collision with quantum tunnels
        const head = this.game.snake[0];
        for (const portal of this.quantumPortals) {
            if (head.x === portal.entry.x && head.y === portal.entry.y) {
                // Teleport to exit
                this.game.snake[0] = { x: portal.exit.x, y: portal.exit.y };
                break;
            }
        }
    }
    
    setupDimensionShift() {
        this.dimensionShiftActive = true;
        
        // Create visual filter effect on game
        const gameCanvas = document.getElementById('game-canvas');
        gameCanvas.classList.add('dimension-shift');
        
        // Randomly change canvas transformations
        this.dimensionShiftTransform = { scale: 1, rotation: 0 };
        
        setTimeout(() => {
            this.dimensionShiftActive = false;
            gameCanvas.classList.remove('dimension-shift');
            gameCanvas.style.transform = '';
        }, config.powerUpDuration);
    }
    
    updateDimensionShift() {
        if (!this.dimensionShiftActive) return;
        
        // Gradually change scale and rotation
        this.dimensionShiftTransform.scale = 0.9 + 0.2 * Math.sin(Date.now() / 1000);
        this.dimensionShiftTransform.rotation = 5 * Math.sin(Date.now() / 2000);
        
        // Apply transformations
        const gameCanvas = document.getElementById('game-canvas');
        gameCanvas.style.transform = `scale(${this.dimensionShiftTransform.scale}) rotate(${this.dimensionShiftTransform.rotation}deg)`;
    }
    
    drawFusionSnake(ctx, gridSize) {
        if (!this.snakeFusionActive || this.fusionSnake.length === 0) return;
        
        // Draw fusion snake with gradient effect
        const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
        gradient.addColorStop(0, '#9C27B0');
        gradient.addColorStop(1, '#2196F3');
        
        this.fusionSnake.forEach((segment, index) => {
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.8;
            
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + gridSize/2,
                segment.y * gridSize + gridSize/2,
                gridSize/2 * (index === 0 ? 1 : 0.8),
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
        
        ctx.globalAlpha = 1.0;
    }
    
    drawEchoTrail(ctx, gridSize) {
        if (!this.echoTrailActive || this.echoTrailPositions.length === 0) return;
        
        // Draw echo trails with decreasing opacity
        this.echoTrailPositions.forEach((trail, trailIndex) => {
            const opacity = 0.2 + (trailIndex * 0.1); // Older trails are more opaque
            
            ctx.fillStyle = '#4A148C';
            ctx.globalAlpha = opacity;
            
            trail.forEach((segment, segmentIndex) => {
                if (segmentIndex % 2 === 0) { // Only draw every other segment for echo effect
                    ctx.fillRect(
                        segment.x * gridSize,
                        segment.y * gridSize,
                        gridSize,
                        gridSize
                    );
                }
            });
        });
        
        ctx.globalAlpha = 1.0;
    }
    
    drawQuantumTunnels(ctx, gridSize) {
        if (!this.quantumTunnelingActive || this.quantumPortals.length === 0) return;
        
        // Draw each quantum tunnel
        this.quantumPortals.forEach(portal => {
            // Calculate pulse effect based on lifespan
            const pulseScale = 1 + 0.3 * Math.sin(Date.now() / 200);
            const fadeOpacity = Math.min(1, portal.lifespan / 1000);
            
            // Draw entry portal
            ctx.globalAlpha = fadeOpacity;
            ctx.beginPath();
            ctx.arc(
                portal.entry.x * gridSize + gridSize/2,
                portal.entry.y * gridSize + gridSize/2,
                gridSize/2 * pulseScale,
                0,
                Math.PI * 2
            );
            
            // Create gradient for portal
            const gradient = ctx.createRadialGradient(
                portal.entry.x * gridSize + gridSize/2,
                portal.entry.y * gridSize + gridSize/2,
                gridSize/4,
                portal.entry.x * gridSize + gridSize/2,
                portal.entry.y * gridSize + gridSize/2,
                gridSize/2 * pulseScale
            );
            
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, portal.color);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw exit portal
            ctx.beginPath();
            ctx.arc(
                portal.exit.x * gridSize + gridSize/2,
                portal.exit.y * gridSize + gridSize/2,
                gridSize/2 * pulseScale,
                0,
                Math.PI * 2
            );
            
            const exitGradient = ctx.createRadialGradient(
                portal.exit.x * gridSize + gridSize/2,
                portal.exit.y * gridSize + gridSize/2,
                gridSize/4,
                portal.exit.x * gridSize + gridSize/2,
                portal.exit.y * gridSize + gridSize/2,
                gridSize/2 * pulseScale
            );
            
            exitGradient.addColorStop(0, portal.color);
            exitGradient.addColorStop(1, 'white');
            
            ctx.fillStyle = exitGradient;
            ctx.fill();
            
            // Draw connecting line between portals
            ctx.globalAlpha = fadeOpacity * 0.3;
            ctx.strokeStyle = portal.color;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(
                portal.entry.x * gridSize + gridSize/2,
                portal.entry.y * gridSize + gridSize/2
            );
            ctx.lineTo(
                portal.exit.x * gridSize + gridSize/2,
                portal.exit.y * gridSize + gridSize/2
            );
            ctx.stroke();
            ctx.setLineDash([]);
        });
        
        // Reset opacity
        ctx.globalAlpha = 1.0;
    }
    
    update() {
        if (this.snakeFusionActive) {
            this.updateFusionSnake();
        }
        
        if (this.echoTrailActive) {
            this.updateEchoTrail();
        }
        
        if (this.quantumTunnelingActive) {
            this.updateQuantumTunnels();
        }
        
        if (this.dimensionShiftActive) {
            this.updateDimensionShift();
        }
    }
    
    draw(ctx, gridSize) {
        // Draw all active effects
        if (this.snakeFusionActive) {
            this.drawFusionSnake(ctx, gridSize);
        }
        
        if (this.echoTrailActive) {
            this.drawEchoTrail(ctx, gridSize);
        }
        
        if (this.quantumTunnelingActive) {
            this.drawQuantumTunnels(ctx, gridSize);
        }
    }
}