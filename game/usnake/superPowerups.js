// New file for super power-up functionality
import config from 'config';

export class SuperPowerUpManager {
    constructor(game) {
        this.game = game;
        this.timeRewindActive = false;
        this.timeRewindSnapshots = [];
        this.spectralVisionActive = false;
        this.hiddenFoods = [];
        this.natureTouchActive = false;
        this.growthPoints = [];
        this.elementalMasteryActive = false;
        this.currentElement = null;
        this.elementalTimer = null;
        this.shadowCloneActive = false;
        this.shadowClones = [];
    }
    
    applySuperPowerUp(powerUpName) {
        switch (powerUpName) {
            case 'Time Rewind':
                this.setupTimeRewind();
                break;
            case 'Spectral Vision':
                this.setupSpectralVision();
                break;
            case 'Nature\'s Touch':
                this.setupNaturesTouch();
                break;
            case 'Elemental Mastery':
                this.setupElementalMastery();
                break;
            case 'Shadow Clone':
                this.setupShadowClone();
                break;
        }
    }
    
    setupTimeRewind() {
        this.timeRewindActive = true;
        this.timeRewindSnapshots = [];
        
        // Add visual effect to canvas
        document.getElementById('game-canvas').classList.add('time-rewind');
        
        // Store game state snapshots for rewinding
        this.storeSnapshot();
        
        // Capture snapshots every 500ms
        this.snapshotInterval = setInterval(() => {
            this.storeSnapshot();
        }, 500);
        
        setTimeout(() => {
            clearInterval(this.snapshotInterval);
            
            // Rewind time by applying stored snapshots in reverse
            this.rewindTime();
            
            document.getElementById('game-canvas').classList.remove('time-rewind');
            this.timeRewindActive = false;
        }, config.timeRewindDuration);
    }
    
    storeSnapshot() {
        if (this.timeRewindSnapshots.length >= 10) {
            this.timeRewindSnapshots.shift(); // Remove oldest snapshot
        }
        
        // Clone current snake and other important game state
        const snakeClone = this.game.snake.map(segment => ({...segment}));
        
        this.timeRewindSnapshots.push({
            snake: snakeClone,
            score: this.game.score
        });
    }
    
    rewindTime() {
        if (this.timeRewindSnapshots.length === 0) return;
        
        // Get the most recent snapshot
        const snapshot = this.timeRewindSnapshots.pop();
        
        // Apply the snapshot
        this.game.snake = snapshot.snake;
    }
    
    setupSpectralVision() {
        this.spectralVisionActive = true;
        
        // Add visual effect
        const spectralElement = document.createElement('div');
        spectralElement.className = 'spectral-vision';
        document.body.appendChild(spectralElement);
        
        // Generate hidden treasures/foods that only spectral vision can see
        for (let i = 0; i < 3; i++) {
            const hiddenFood = this.game.generateFood();
            hiddenFood.isHidden = true;
            hiddenFood.value = Math.floor(Math.random() * 5) + 3; // 3-7 points
            this.hiddenFoods.push(hiddenFood);
        }
        
        setTimeout(() => {
            document.querySelector('.spectral-vision')?.remove();
            this.spectralVisionActive = false;
            this.hiddenFoods = [];
        }, config.powerUpDuration);
    }
    
    setupNaturesTouch() {
        this.natureTouchActive = true;
        this.growthPoints = [];
        
        // Every move, spawn a growth point that provides benefits if touched
        this.natureTouchInterval = setInterval(() => {
            this.spawnGrowthPoint();
        }, 1000);
        
        setTimeout(() => {
            clearInterval(this.natureTouchInterval);
            this.natureTouchActive = false;
            this.growthPoints = [];
        }, config.powerUpDuration);
    }
    
    spawnGrowthPoint() {
        if (this.growthPoints.length >= 5) {
            this.growthPoints.shift(); // Remove oldest growth point
        }
        
        let newPoint;
        do {
            newPoint = {
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: Math.floor(Math.random() * this.game.gridHeight),
                size: Math.floor(Math.random() * 3) + 1, // Size 1-3
                age: 0
            };
        } while (this.game.isPositionOccupied(newPoint));
        
        this.growthPoints.push(newPoint);
    }
    
    checkGrowthPointCollision(head) {
        for (let i = this.growthPoints.length - 1; i >= 0; i--) {
            const point = this.growthPoints[i];
            if (head.x === point.x && head.y === point.y) {
                // Apply benefit based on size
                if (point.size === 1) {
                    // Small boost: 1 point
                    this.game.score += 1;
                } else if (point.size === 2) {
                    // Medium boost: Temporary speed increase
                    this.game.speed = Math.max(this.game.speed * 0.9, config.minSpeed);
                    setTimeout(() => {
                        this.game.speed = Math.min(this.game.speed / 0.9, config.initialSpeed);
                    }, 3000);
                } else {
                    // Large boost: Grow snake
                    const tail = this.game.snake[this.game.snake.length - 1];
                    this.game.snake.push({...tail});
                    this.game.score += 2;
                }
                
                // Remove the growth point
                this.growthPoints.splice(i, 1);
                this.game.updateScore();
                break;
            }
        }
    }
    
    setupElementalMastery() {
        this.elementalMasteryActive = true;
        this.elementalCycle = ['fire', 'water', 'earth', 'air'];
        this.currentElementIndex = 0;
        this.currentElement = this.elementalCycle[0];
        
        // Apply visual effect to snake based on current element
        this.updateElementalEffect();
        
        // Cycle through elements
        this.elementalTimer = setInterval(() => {
            this.currentElementIndex = (this.currentElementIndex + 1) % this.elementalCycle.length;
            this.currentElement = this.elementalCycle[this.currentElementIndex];
            this.updateElementalEffect();
        }, config.elementalCycleDuration);
        
        setTimeout(() => {
            clearInterval(this.elementalTimer);
            this.elementalMasteryActive = false;
            this.currentElement = null;
            
            // Remove elemental classes
            this.elementalCycle.forEach(element => {
                document.getElementById('game-canvas').classList.remove(`elemental-${element}`);
            });
        }, config.powerUpDuration);
    }
    
    updateElementalEffect() {
        // Remove previous elemental classes
        this.elementalCycle.forEach(element => {
            document.getElementById('game-canvas').classList.remove(`elemental-${element}`);
        });
        
        // Add current elemental class
        document.getElementById('game-canvas').classList.add(`elemental-${this.currentElement}`);
    }
    
    applyElementalEffect() {
        if (!this.elementalMasteryActive || !this.currentElement) return;
        
        // Apply special effect based on current element
        switch (this.currentElement) {
            case 'fire':
                // Fire burns through obstacles
                this.fireBurnEffect();
                break;
            case 'water':
                // Water flows faster
                this.waterFlowEffect();
                break;
            case 'earth':
                // Earth provides stability and protection
                this.earthStabilityEffect();
                break;
            case 'air':
                // Air allows temporary phasing
                this.airPhaseEffect();
                break;
        }
    }
    
    fireBurnEffect() {
        // Burn through food (convert any food touched to points without growing)
        const head = this.game.snake[0];
        
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            const distance = Math.abs(food.x - head.x) + Math.abs(food.y - head.y);
            
            if (distance <= 2) { // Within 2 cells
                // Convert to points without eating
                this.game.score += 1;
                this.game.updateScore();
                
                // Replace the food
                this.game.foods[i] = this.game.generateFood();
            }
        }
    }
    
    waterFlowEffect() {
        // Temporarily boost speed when active
        this.game.speed = Math.max(this.game.speed * 0.7, config.minSpeed);
    }
    
    earthStabilityEffect() {
        // Provide temporary immunity to self-collisions
        // This is handled in the collision detection logic
    }
    
    airPhaseEffect() {
        // Allow temporary phasing through walls
        // This is handled in the collision detection logic
    }
    
    setupShadowClone() {
        this.shadowCloneActive = true;
        this.shadowClones = [];
        
        // Create shadow clones that follow the player's previous positions
        for (let i = 0; i < config.shadowCloneCount; i++) {
            this.shadowClones.push({
                positions: [...this.game.snake.map(segment => ({...segment}))],
                delay: (i + 1) * 5 // Frames of delay
            });
        }
        
        setTimeout(() => {
            this.shadowCloneActive = false;
            this.shadowClones = [];
        }, config.powerUpDuration);
    }
    
    updateShadowClones() {
        if (!this.shadowCloneActive) return;
        
        // Update each clone's position based on main snake's history
        for (const clone of this.shadowClones) {
            // Store current snake position
            const currentSnake = this.game.snake.map(segment => ({...segment}));
            
            // Add current position to a temporary history
            clone.history = clone.history || [];
            clone.history.push(currentSnake);
            
            // Keep history at appropriate length for delay
            while (clone.history.length > clone.delay) {
                clone.history.shift();
            }
            
            // Update clone position from history
            if (clone.history.length >= clone.delay) {
                clone.positions = clone.history[0];
            }
            
            // Check for food collisions with clones
            this.checkCloneFoodCollision(clone);
        }
    }
    
    checkCloneFoodCollision(clone) {
        if (!clone.positions || clone.positions.length === 0) return;
        
        const head = clone.positions[0];
        
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            if (head.x === food.x && head.y === food.y) {
                // Clone collected food - give half points and replace food
                this.game.score += 0.5;
                this.game.updateScore();
                this.game.foods[i] = this.game.generateFood();
                break;
            }
        }
    }
    
    drawHiddenFoods(ctx, gridSize) {
        if (!this.spectralVisionActive) return;
        
        ctx.globalAlpha = 0.6; // Make hidden foods semi-transparent
        
        for (const food of this.hiddenFoods) {
            // Draw with a spectral effect
            ctx.fillStyle = '#7C4DFF';
            ctx.beginPath();
            ctx.arc(
                food.x * gridSize + gridSize / 2,
                food.y * gridSize + gridSize / 2,
                gridSize / 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Add glow effect
            ctx.shadowColor = '#7C4DFF';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Draw point value
            ctx.fillStyle = 'white';
            ctx.font = `${gridSize/2}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(
                food.value,
                food.x * gridSize + gridSize/2,
                food.y * gridSize + gridSize/2 + 4
            );
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    drawGrowthPoints(ctx, gridSize) {
        if (!this.natureTouchActive) return;
        
        for (const point of this.growthPoints) {
            const size = point.size * (gridSize / 4);
            
            // Draw with a nature effect
            ctx.fillStyle = '#43A047';
            ctx.globalAlpha = 0.7;
            
            ctx.beginPath();
            ctx.arc(
                point.x * gridSize + gridSize / 2,
                point.y * gridSize + gridSize / 2,
                size,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Draw leaves or details based on size
            if (point.size > 1) {
                ctx.fillStyle = '#81C784';
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI / 2) * i;
                    const leafX = point.x * gridSize + gridSize / 2 + Math.cos(angle) * size;
                    const leafY = point.y * gridSize + gridSize / 2 + Math.sin(angle) * size;
                    
                    ctx.beginPath();
                    ctx.ellipse(
                        leafX, leafY,
                        size/2, size,
                        angle, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    drawShadowClones(ctx, gridSize) {
        if (!this.shadowCloneActive) return;
        
        ctx.globalAlpha = 0.3;
        
        for (const clone of this.shadowClones) {
            if (!clone.positions || clone.positions.length === 0) continue;
            
            // Draw each shadow clone with a ghostly effect
            for (const segment of clone.positions) {
                ctx.fillStyle = '#424242';
                
                ctx.beginPath();
                ctx.arc(
                    segment.x * gridSize + gridSize / 2,
                    segment.y * gridSize + gridSize / 2,
                    gridSize / 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    checkHiddenFoodCollision(head) {
        if (!this.spectralVisionActive) return false;
        
        for (let i = this.hiddenFoods.length - 1; i >= 0; i--) {
            const food = this.hiddenFoods[i];
            if (head.x === food.x && head.y === food.y) {
                // Add points based on value
                this.game.score += food.value;
                this.game.updateScore();
                
                // Remove the hidden food
                this.hiddenFoods.splice(i, 1);
                return true;
            }
        }
        
        return false;
    }
    
    update() {
        if (this.shadowCloneActive) {
            this.updateShadowClones();
        }
        
        if (this.elementalMasteryActive) {
            this.applyElementalEffect();
        }
        
        if (this.natureTouchActive && this.game.snake.length > 0) {
            this.checkGrowthPointCollision(this.game.snake[0]);
        }
    }
    
    // Check if elemental mastery should affect collision detection
    checkElementalCollision(head) {
        if (!this.elementalMasteryActive) return false;
        
        if (this.currentElement === 'earth') {
            // Earth provides immunity to self-collisions
            return true;
        }
        
        if (this.currentElement === 'air') {
            // Air allows phasing through walls
            if (head.x < 0) head.x = this.game.gridWidth - 1;
            if (head.y < 0) head.y = this.game.gridHeight - 1;
            if (head.x >= this.game.gridWidth) head.x = 0;
            if (head.y >= this.game.gridHeight) head.y = 0;
            return true;
        }
        
        return false;
    }
    
    draw(ctx, gridSize) {
        this.drawHiddenFoods(ctx, gridSize);
        this.drawGrowthPoints(ctx, gridSize);
        this.drawShadowClones(ctx, gridSize);
    }
}