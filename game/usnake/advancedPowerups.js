// New file for advanced power-up functionality
import config from 'config';

export class AdvancedPowerUpManager {
    constructor(game) {
        this.game = game;
        this.activePowerUps = [];
        this.laserBeams = [];
        this.bombTime = null;
        this.mirrorMode = false;
        this.targetedFood = null;
        this.growthBoostActive = false;
        this.timeWarpActive = false;
        this.gravityWellPos = null;
        this.phasingActive = false;
        this.shapeShifterActive = false;
        this.treasureMode = false;
        this.neonTrailPositions = [];
        this.timeFrozen = false;
        this.frozenEntities = [];
    }
    
    applyAdvancedPowerUp(powerUpName) {
        switch (powerUpName) {
            case 'Laser Snake':
                this.setupLaserSnake();
                break;
            case 'Bomb Time':
                this.setupBombTime();
                break;
            case 'Mirror World':
                this.setupMirrorWorld();
                break;
            case 'Target Lock':
                this.setupTargetLock();
                break;
            case 'Growth Boost':
                this.setupGrowthBoost();
                break;
            case 'Time Warp':
                this.setupTimeWarp();
                break;
            case 'Gravity Well':
                this.setupGravityWell();
                break;
            case 'Phasing Snake':
                this.setupPhasingSnake();
                break;
            case 'Shape Shifter':
                this.setupShapeShifter();
                break;
            case 'Treasure Hunter':
                this.setupTreasureHunter();
                break;
            case 'Neon Trail':
                this.setupNeonTrail();
                break;
            case 'Time Freeze':
                this.setupTimeFreeze();
                break;
        }
    }
    
    setupLaserSnake() {
        // Laser fires when player presses E key instead of spacebar
        this.laserHandler = (e) => {
            if (e.key === 'e' && this.activePowerUps.includes('Laser Snake')) {
                this.fireLaser();
            }
        };
        document.addEventListener('keydown', this.laserHandler);
        
        // Clean up after duration
        setTimeout(() => {
            document.removeEventListener('keydown', this.laserHandler);
            this.laserBeams = [];
        }, config.powerUpDuration);
    }
    
    fireLaser() {
        const head = this.game.snake[0];
        const direction = this.game.direction;
        
        const laser = {
            startX: head.x,
            startY: head.y,
            direction: direction,
            lifespan: 10 // Number of frames the laser will exist
        };
        
        this.laserBeams.push(laser);
        
        // Check for food hits
        this.checkLaserHits(laser);
    }
    
    checkLaserHits(laser) {
        let testX = laser.startX;
        let testY = laser.startY;
        
        // Project laser in the direction
        for (let i = 0; i < this.game.gridWidth; i++) {
            // Update position based on direction
            switch (laser.direction) {
                case 'up': testY--; break;
                case 'down': testY++; break;
                case 'left': testX--; break;
                case 'right': testX++; break;
            }
            
            // Stop if out of bounds
            if (testX < 0 || testX >= this.game.gridWidth || 
                testY < 0 || testY >= this.game.gridHeight) {
                break;
            }
            
            // Check food collision
            for (let j = 0; j < this.game.foods.length; j++) {
                if (this.game.foods[j].x === testX && this.game.foods[j].y === testY) {
                    // Create a new food at the same position but change to regular
                    const newFood = { ...this.game.foods[j], type: config.foodTypes[0] };
                    this.game.foods[j] = newFood;
                    
                    // Add a point
                    this.game.score++;
                    this.game.updateScore();
                    
                    return; // Stop after hitting one food
                }
            }
        }
    }
    
    setupBombTime() {
        this.bombTime = Date.now() + 5000; // 5 seconds to detonate
    }
    
    checkBombDetonation() {
        if (!this.bombTime) return;
        
        const timeLeft = this.bombTime - Date.now();
        if (timeLeft <= 0) {
            // Detonate - clear all foods and replace them
            this.game.foods = [];
            for (let i = 0; i < config.foodCount; i++) {
                this.game.foods.push(this.game.generateFood());
            }
            
            // Add bonus points
            this.game.score += 3;
            this.game.updateScore();
            
            this.bombTime = null;
        }
    }
    
    setupMirrorWorld() {
        this.mirrorMode = true;
        setTimeout(() => {
            this.mirrorMode = false;
        }, config.powerUpDuration);
    }
    
    getMirroredPosition(pos) {
        if (!this.mirrorMode) return null;
        
        return {
            x: this.game.gridWidth - 1 - pos.x,
            y: this.game.gridHeight - 1 - pos.y
        };
    }
    
    setupTargetLock() {
        // Find closest food to lock onto
        const head = this.game.snake[0];
        let closestFood = null;
        let minDistance = Infinity;
        
        for (const food of this.game.foods) {
            const dx = food.x - head.x;
            const dy = food.y - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestFood = food;
            }
        }
        
        this.targetedFood = closestFood;
        
        setTimeout(() => {
            this.targetedFood = null;
        }, config.powerUpDuration);
    }
    
    getTargetDirection() {
        if (!this.targetedFood) return null;
        
        const head = this.game.snake[0];
        const dx = this.targetedFood.x - head.x;
        const dy = this.targetedFood.y - head.y;
        
        // Determine which direction to go (horizontal or vertical priority)
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        } else {
            return dy > 0 ? 'down' : 'up';
        }
    }
    
    setupGrowthBoost() {
        this.growthBoostActive = true;
        setTimeout(() => {
            this.growthBoostActive = false;
        }, config.powerUpDuration);
    }
    
    setupTimeWarp() {
        this.timeWarpActive = true;
        
        // Freeze everything briefly
        this.game.paused = true;
        setTimeout(() => {
            this.game.paused = false;
            // Resume with boosted speed
            this.timeWarpActive = false;
        }, 1000); // 1 second freeze
    }
    
    setupGravityWell() {
        // Create a gravity well at a random position
        this.gravityWellPos = {
            x: Math.floor(Math.random() * this.game.gridWidth),
            y: Math.floor(Math.random() * this.game.gridHeight)
        };
        
        setTimeout(() => {
            this.gravityWellPos = null;
        }, config.powerUpDuration);
    }
    
    applyGravityEffect() {
        if (!this.gravityWellPos) return;
        
        // Move all food items toward the gravity well
        for (const food of this.game.foods) {
            const dx = this.gravityWellPos.x - food.x;
            const dy = this.gravityWellPos.y - food.y;
            
            if (Math.random() < 0.3) { // 30% chance to move each frame
                if (Math.abs(dx) > Math.abs(dy)) {
                    food.x += dx > 0 ? 1 : -1;
                } else {
                    food.y += dy > 0 ? 1 : -1;
                }
            }
        }
    }
    
    drawLasers(ctx, gridSize) {
        // Update laser beams and render them
        for (let i = this.laserBeams.length - 1; i >= 0; i--) {
            const laser = this.laserBeams[i];
            
            // Decrease lifespan
            laser.lifespan--;
            if (laser.lifespan <= 0) {
                this.laserBeams.splice(i, 1);
                continue;
            }
            
            // Draw the laser beam
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const startX = laser.startX * gridSize + gridSize / 2;
            const startY = laser.startY * gridSize + gridSize / 2;
            let endX = startX;
            let endY = startY;
            
            // Calculate end point
            switch (laser.direction) {
                case 'up':
                    endY = 0;
                    break;
                case 'down':
                    endY = ctx.canvas.height;
                    break;
                case 'left':
                    endX = 0;
                    break;
                case 'right':
                    endX = ctx.canvas.width;
                    break;
            }
            
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Reset line width
            ctx.lineWidth = 1;
        }
    }
    
    drawBombTimer(ctx) {
        if (!this.bombTime) return;
        
        const timeLeft = (this.bombTime - Date.now()) / 1000;
        if (timeLeft > 0) {
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = timeLeft < 2 ? '#FF0000' : '#FFC107';
            ctx.fillText(
                timeLeft.toFixed(1),
                ctx.canvas.width / 2,
                ctx.canvas.height / 2
            );
        }
    }
    
    drawGravityWell(ctx, gridSize) {
        if (!this.gravityWellPos) return;
        
        const centerX = this.gravityWellPos.x * gridSize + gridSize / 2;
        const centerY = this.gravityWellPos.y * gridSize + gridSize / 2;
        const radius = gridSize;
        
        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(75, 0, 130, 0.7)';
        ctx.fill();
        
        // Draw inner circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(218, 112, 214, 0.8)';
        ctx.fill();
        
        // Draw pulsing effect
        const pulseSize = radius * 1.5 * (0.8 + 0.2 * Math.sin(Date.now() / 200));
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.5)';
        ctx.stroke();
    }
    
    drawTargetLock(ctx, gridSize) {
        if (!this.targetedFood) return;
        
        const x = this.targetedFood.x * gridSize + gridSize / 2;
        const y = this.targetedFood.y * gridSize + gridSize / 2;
        const size = gridSize / 2;
        
        // Draw target indicator
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y + size);
        ctx.stroke();
        
        // Reset line width
        ctx.lineWidth = 1;
    }
    
    drawMirroredSnake(ctx, snake, gridSize) {
        if (!this.mirrorMode) return;
        
        ctx.fillStyle = 'rgba(100, 149, 237, 0.6)'; // Cornflower blue with transparency
        
        for (const segment of snake) {
            const mirroredPos = this.getMirroredPosition(segment);
            ctx.fillRect(
                mirroredPos.x * gridSize,
                mirroredPos.y * gridSize,
                gridSize,
                gridSize
            );
        }
    }
    
    setupPhasingSnake() {
        this.phasingActive = true;
        setTimeout(() => {
            this.phasingActive = false;
        }, config.powerUpDuration);
    }
    
    setupShapeShifter() {
        this.shapeShifterActive = true;
        this.originalSnakeLength = this.game.snake.length;
        
        // Randomly change the snake shape
        const shapes = ['circle', 'square', 'triangle', 'star'];
        this.currentShape = shapes[Math.floor(Math.random() * shapes.length)];
        
        setTimeout(() => {
            this.shapeShifterActive = false;
            this.currentShape = null;
        }, config.powerUpDuration);
    }
    
    setupTreasureHunter() {
        this.treasureMode = true;
        
        // Convert some food to treasure
        for (let i = 0; i < this.game.foods.length; i++) {
            if (Math.random() < 0.7) { // 70% chance to convert
                this.game.foods[i].isTreasure = true;
                this.game.foods[i].value = Math.floor(Math.random() * 5) + 2; // 2-6 points
            }
        }
        
        setTimeout(() => {
            this.treasureMode = false;
            // Clear treasure flags
            for (let i = 0; i < this.game.foods.length; i++) {
                this.game.foods[i].isTreasure = false;
            }
        }, config.powerUpDuration);
    }
    
    setupNeonTrail() {
        this.neonTrailPositions = [];
        
        // Add event listener to track and store snake trail
        this.neonTrailHandler = () => {
            if (this.neonTrailPositions.length > 15) {
                this.neonTrailPositions.shift(); // Remove oldest position
            }
            
            if (this.game.snake.length > 0) {
                const tail = this.game.snake[this.game.snake.length - 1];
                this.neonTrailPositions.push({
                    x: tail.x, 
                    y: tail.y,
                    color: this.getRandomNeonColor()
                });
            }
        };
        
        // Set interval to track trail
        this.neonInterval = setInterval(this.neonTrailHandler, 100);
        
        setTimeout(() => {
            clearInterval(this.neonInterval);
            this.neonTrailPositions = [];
        }, config.powerUpDuration);
    }
    
    getRandomNeonColor() {
        const neonColors = [
            '#ff00ff', // Magenta
            '#00ffff', // Cyan
            '#00ff00', // Lime
            '#ff9400', // Orange
            '#ffff00'  // Yellow
        ];
        return neonColors[Math.floor(Math.random() * neonColors.length)];
    }
    
    setupTimeFreeze() {
        this.timeFrozen = true;
        this.frozenEntities = [];
        
        // Take a snapshot of current food positions
        this.game.foods.forEach(food => {
            if (!food.isTreasure) {
                this.frozenEntities.push({
                    type: 'food',
                    x: food.x,
                    y: food.y,
                    foodObj: food
                });
            }
        });
        
        // Display freeze effect
        const freezeEffect = document.createElement('div');
        freezeEffect.className = 'time-freeze-effect';
        document.querySelector('.game-container').appendChild(freezeEffect);
        
        setTimeout(() => {
            this.timeFrozen = false;
            this.frozenEntities = [];
            
            // Remove freeze effect
            document.querySelector('.time-freeze-effect')?.remove();
        }, config.powerUpDuration / 2); // Half duration of normal power-ups
    }
    
    drawPhasingSnake(ctx, snake, gridSize) {
        if (!this.phasingActive) return;
        
        ctx.save();
        ctx.globalAlpha = 0.4 + 0.3 * Math.sin(Date.now() / 200); // Pulsing transparency
        
        // Draw snake with phasing effect
        snake.forEach((segment, index) => {
            ctx.fillStyle = '#3A1B75'; // Deep purple
            
            // Create shifted shadow effect
            const offset = 2 * Math.sin(Date.now() / 100 + index * 0.1);
            
            ctx.fillRect(
                segment.x * gridSize + offset,
                segment.y * gridSize + offset,
                gridSize,
                gridSize
            );
        });
        
        ctx.restore();
    }
    
    drawShapeShifterSnake(ctx, snake, gridSize) {
        if (!this.shapeShifterActive || !this.currentShape) return;
        
        snake.forEach((segment, index) => {
            const x = segment.x * gridSize;
            const y = segment.y * gridSize;
            const color = index === 0 ? '#2E7D32' : '#33691E';
            
            ctx.fillStyle = color;
            
            switch (this.currentShape) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(
                        x + gridSize/2,
                        y + gridSize/2,
                        gridSize/2 - 1,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                    break;
                    
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(x + gridSize/2, y);
                    ctx.lineTo(x + gridSize, y + gridSize);
                    ctx.lineTo(x, y + gridSize);
                    ctx.closePath();
                    ctx.fill();
                    break;
                    
                case 'star':
                    this.drawStar(
                        ctx, 
                        x + gridSize/2, 
                        y + gridSize/2, 
                        5, 
                        gridSize/2, 
                        gridSize/4
                    );
                    break;
                    
                case 'square':
                default:
                    ctx.fillRect(x, y, gridSize, gridSize);
            }
        });
    }
    
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
    
    drawTreasure(ctx, food, gridSize) {
        if (!food.isTreasure) return false;
        
        const x = food.x * gridSize;
        const y = food.y * gridSize;
        
        // Draw treasure chest
        ctx.fillStyle = '#8B4513'; // Brown for chest
        ctx.fillRect(x + 2, y + gridSize/2, gridSize - 4, gridSize/2 - 2);
        
        // Draw chest lid
        ctx.fillStyle = '#A0522D'; // Lighter brown for lid
        ctx.beginPath();
        ctx.moveTo(x, y + gridSize/2);
        ctx.lineTo(x + gridSize/2, y + gridSize/4);
        ctx.lineTo(x + gridSize, y + gridSize/2);
        ctx.closePath();
        ctx.fill();
        
        // Draw gold inside
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.beginPath();
        ctx.arc(x + gridSize/2, y + gridSize/2, gridSize/4, 0, Math.PI, true);
        ctx.fill();
        
        // Draw value
        ctx.fillStyle = 'white';
        ctx.font = `${gridSize/2}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(
            food.value,
            x + gridSize/2,
            y + gridSize - 2
        );
        
        return true;
    }
    
    drawNeonTrail(ctx, gridSize) {
        if (this.neonTrailPositions.length === 0) return;
        
        // Draw each position in the trail
        this.neonTrailPositions.forEach((pos, index) => {
            const alpha = 0.8 * (index / this.neonTrailPositions.length);
            
            // Draw glow
            ctx.shadowColor = pos.color;
            ctx.shadowBlur = 10;
            
            ctx.fillStyle = pos.color;
            ctx.globalAlpha = alpha;
            
            // Draw neon particle
            ctx.beginPath();
            ctx.arc(
                pos.x * gridSize + gridSize/2,
                pos.y * gridSize + gridSize/2,
                gridSize/3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
        
        // Reset
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
    
    drawFrozenEntities(ctx, gridSize) {
        if (!this.timeFrozen) return;
        
        ctx.save();
        
        // Draw frozen entities with ice effect
        this.frozenEntities.forEach(entity => {
            if (entity.type === 'food') {
                const x = entity.x * gridSize;
                const y = entity.y * gridSize;
                
                // Draw ice crystal around food
                ctx.strokeStyle = '#AEEA00';
                ctx.lineWidth = 2;
                
                // Spiky ice crystal
                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI * 2 / 8) * i;
                    const innerRadius = gridSize / 3;
                    const outerRadius = gridSize / 1.5;
                    
                    ctx.beginPath();
                    ctx.moveTo(
                        x + gridSize/2 + innerRadius * Math.cos(angle),
                        y + gridSize/2 + innerRadius * Math.sin(angle)
                    );
                    ctx.lineTo(
                        x + gridSize/2 + outerRadius * Math.cos(angle),
                        y + gridSize/2 + outerRadius * Math.sin(angle)
                    );
                    ctx.stroke();
                }
                
                // Frozen food
                ctx.fillStyle = '#E0F7FA';
                ctx.beginPath();
                ctx.arc(
                    x + gridSize/2,
                    y + gridSize/2,
                    gridSize/3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        });
        
        ctx.restore();
    }
}