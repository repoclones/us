// New file for psychic and mental power-ups
import config from 'config';

export class PsychicPowerUpManager {
    constructor(game) {
        this.game = game;
        this.telepathyActive = false;
        this.targetFoodIndex = null;
        this.telekinesisActive = false;
        this.telekinesisCooldown = 0;
        this.astralProjectionActive = false;
        this.astralSnake = [];
        this.mindControlActive = false;
        this.controlledFoodIndices = [];
        this.precognitionActive = false;
        this.futurePathNodes = [];
        this.psychokinesisActive = false;
        this.psychoWaves = [];
    }

    applyPsychicPowerUp(powerUpName) {
        switch(powerUpName) {
            case 'Telepathy':
                this.setupTelepathy();
                break;
            case 'Telekinesis':
                this.setupTelekinesis();
                break;
            case 'Astral Projection':
                this.setupAstralProjection();
                break;
            case 'Mind Control':
                this.setupMindControl();
                break;
            case 'Precognition':
                this.setupPrecognition();
                break;
            case 'Psychokinesis':
                this.setupPsychokinesis();
                break;
        }
    }

    setupTelepathy() {
        this.telepathyActive = true;
        
        // Find the "best" food to target (power-ups preferred)
        let bestFoodIndex = 0;
        let bestValue = 0;
        
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            let value = 0;
            
            // Prioritize power-up food
            if (food.type.name !== 'Regular') {
                value += 10;
            }
            
            // Add randomness to not always pick the same one
            value += Math.random() * 3;
            
            if (value > bestValue) {
                bestValue = value;
                bestFoodIndex = i;
            }
        }
        
        this.targetFoodIndex = bestFoodIndex;
        
        setTimeout(() => {
            this.telepathyActive = false;
            this.targetFoodIndex = null;
        }, config.powerUpDuration);
    }

    setupTelekinesis() {
        this.telekinesisActive = true;
        this.telekinesisCooldown = 0;
        
        // Add keydown listener to trigger telekinesis
        this.telekinesisHandler = (e) => {
            if (e.code === 'Space' && this.telekinesisActive && this.telekinesisCooldown <= 0) {
                this.moveFoodTelekinetically();
            }
        };
        
        document.addEventListener('keydown', this.telekinesisHandler);
        
        // Display instructions
        const instructionElement = document.createElement('div');
        instructionElement.className = 'power-up-instruction';
        instructionElement.textContent = 'Press SPACE to move food telekinetically!';
        document.querySelector('.game-container').appendChild(instructionElement);
        
        setTimeout(() => {
            document.removeEventListener('keydown', this.telekinesisHandler);
            this.telekinesisActive = false;
            document.querySelector('.power-up-instruction')?.remove();
        }, config.powerUpDuration);
    }

    moveFoodTelekinetically() {
        if (this.telekinesisCooldown > 0 || this.game.snake.length === 0) return;
        
        // Find closest food to snake head
        const head = this.game.snake[0];
        let closestFoodIndex = -1;
        let minDistance = Infinity;
        
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            const dx = food.x - head.x;
            const dy = food.y - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestFoodIndex = i;
            }
        }
        
        if (closestFoodIndex === -1) return;
        
        // Move the closest food one step closer to snake
        const food = this.game.foods[closestFoodIndex];
        const dx = head.x - food.x;
        const dy = head.y - food.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            food.x += dx > 0 ? 1 : -1;
        } else {
            food.y += dy > 0 ? 1 : -1;
        }
        
        // Create telekinesis effect
        this.createTelekinesisEffect(food.x, food.y);
        
        // Set cooldown
        this.telekinesisCooldown = 15; // 15 frames cooldown
    }

    createTelekinesisEffect(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create telekinesis effect
        const tkEffect = document.createElement('div');
        tkEffect.className = 'telekinesis-effect';
        tkEffect.style.left = `${x * gridSize}px`;
        tkEffect.style.top = `${y * gridSize}px`;
        
        gameContainer.appendChild(tkEffect);
        
        // Remove after animation
        setTimeout(() => {
            tkEffect.remove();
        }, 1000);
    }

    setupAstralProjection() {
        this.astralProjectionActive = true;
        
        // Create astral projection of snake that can explore without risk
        if (this.game.snake.length > 0) {
            // Clone the snake for astral form
            this.astralSnake = this.game.snake.map(segment => ({...segment}));
            
            // Add blue ghostly glow to canvas
            document.getElementById('game-canvas').classList.add('astral-projection');
        }
        
        setTimeout(() => {
            this.astralProjectionActive = false;
            this.astralSnake = [];
            document.getElementById('game-canvas').classList.remove('astral-projection');
        }, config.powerUpDuration);
    }

    updateAstralSnake() {
        if (!this.astralProjectionActive || this.astralSnake.length === 0) return;
        
        // Move astral snake in the same direction as the regular snake
        for (let i = this.astralSnake.length - 1; i > 0; i--) {
            this.astralSnake[i].x = this.astralSnake[i-1].x;
            this.astralSnake[i].y = this.astralSnake[i-1].y;
        }
        
        // Move head based on direction
        const head = this.astralSnake[0];
        switch (this.game.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Wrap around edges for astral snake
        if (head.x < 0) head.x = this.game.gridWidth - 1;
        if (head.y < 0) head.y = this.game.gridHeight - 1;
        if (head.x >= this.game.gridWidth) head.x = 0;
        if (head.y >= this.game.gridHeight) head.y = 0;
        
        // Check for food collection with astral snake
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            
            if (head.x === food.x && head.y === food.y) {
                // Astral snake collects psychic imprint of food
                // Create visualization effect but don't actually collect
                this.createAstralFoodEffect(food.x, food.y);
                
                // Give a hint about this food type
                if (food.type.name !== 'Regular') {
                    this.showAstralVision(food.type.name);
                }
            }
        }
    }

    createAstralFoodEffect(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create astral effect
        const astralEffect = document.createElement('div');
        astralEffect.className = 'astral-food-effect';
        astralEffect.style.left = `${x * gridSize}px`;
        astralEffect.style.top = `${y * gridSize}px`;
        
        gameContainer.appendChild(astralEffect);
        
        // Remove after animation
        setTimeout(() => {
            astralEffect.remove();
        }, 1000);
    }

    showAstralVision(powerUpName) {
        const vision = document.createElement('div');
        vision.className = 'astral-vision';
        vision.textContent = `Astral vision: ${powerUpName}`;
        
        document.querySelector('.game-container').appendChild(vision);
        
        // Remove after display
        setTimeout(() => {
            vision.classList.add('fade-out');
            setTimeout(() => {
                vision.remove();
            }, 500);
        }, 2000);
    }

    setupMindControl() {
        this.mindControlActive = true;
        this.controlledFoodIndices = [];
        
        // Select 2-3 random food items to control
        const numControlled = 2 + Math.floor(Math.random());
        
        for (let i = 0; i < numControlled && i < this.game.foods.length; i++) {
            // Select a food that isn't already controlled
            let foodIndex;
            do {
                foodIndex = Math.floor(Math.random() * this.game.foods.length);
            } while (this.controlledFoodIndices.includes(foodIndex));
            
            this.controlledFoodIndices.push(foodIndex);
            
            // Add mind control visual to the food
            const food = this.game.foods[foodIndex];
            this.createMindControlEffect(food.x, food.y);
        }
        
        setTimeout(() => {
            this.mindControlActive = false;
            this.controlledFoodIndices = [];
        }, config.powerUpDuration);
    }

    createMindControlEffect(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create mind control visual
        const controlEffect = document.createElement('div');
        controlEffect.className = 'mind-control-effect';
        controlEffect.style.left = `${x * gridSize}px`;
        controlEffect.style.top = `${y * gridSize}px`;
        
        gameContainer.appendChild(controlEffect);
        
        // Keep reference to remove later
        setTimeout(() => {
            controlEffect.remove();
        }, config.powerUpDuration);
    }

    updateControlledFood() {
        if (!this.mindControlActive || this.game.snake.length === 0) return;
        
        const head = this.game.snake[0];
        
        // Move controlled food toward the snake
        for (const foodIndex of this.controlledFoodIndices) {
            if (foodIndex < this.game.foods.length) {
                const food = this.game.foods[foodIndex];
                
                // Only move occasionally to make it look more natural
                if (Math.random() < 0.2) {
                    const dx = head.x - food.x;
                    const dy = head.y - food.y;
                    
                    if (Math.abs(dx) > Math.abs(dy)) {
                        food.x += dx > 0 ? 1 : -1;
                    } else {
                        food.y += dy > 0 ? 1 : -1;
                    }
                    
                    // Create subtle mind control pulse
                    if (Math.random() < 0.5) {
                        this.createMindControlPulse(food.x, food.y);
                    }
                }
            }
        }
    }

    createMindControlPulse(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create pulse effect
        const pulse = document.createElement('div');
        pulse.className = 'mind-control-pulse';
        pulse.style.left = `${x * gridSize + gridSize/2}px`;
        pulse.style.top = `${y * gridSize + gridSize/2}px`;
        
        gameContainer.appendChild(pulse);
        
        // Remove after animation
        setTimeout(() => {
            pulse.remove();
        }, 800);
    }

    setupPrecognition() {
        this.precognitionActive = true;
        this.futurePathNodes = [];
        
        // Calculate potential future path based on AI prediction
        this.calculateFuturePath();
        
        setTimeout(() => {
            this.precognitionActive = false;
            this.futurePathNodes = [];
        }, config.powerUpDuration);
    }

    calculateFuturePath() {
        if (!this.precognitionActive || this.game.snake.length === 0) return;
        
        // Clone current snake to predict future
        const snakeClone = this.game.snake.map(segment => ({...segment}));
        let direction = this.game.direction;
        this.futurePathNodes = [];
        
        // Predict next 15 steps
        for (let step = 0; step < 15; step++) {
            // Determine best move direction using simple AI logic
            const head = snakeClone[0];
            const possibleDirections = ['up', 'down', 'left', 'right'].filter(
                dir => this.isValidDirection(direction, dir)
            );
            
            let bestDir = direction;
            let bestScore = -Infinity;
            
            for (const dir of possibleDirections) {
                const nextPos = this.getNextPosition(head, dir);
                
                // Skip if would collide with snake body
                let collision = false;
                for (let i = 1; i < snakeClone.length; i++) {
                    if (nextPos.x === snakeClone[i].x && nextPos.y === snakeClone[i].y) {
                        collision = true;
                        break;
                    }
                }
                
                if (collision) continue;
                
                // Calculate score based on food proximity
                let score = 0;
                for (const food of this.game.foods) {
                    const distance = Math.abs(food.x - nextPos.x) + Math.abs(food.y - nextPos.y);
                    score -= distance; // Negative distance, so closer is better
                }
                
                // Prefer not going near walls
                if (nextPos.x <= 1 || nextPos.x >= this.game.gridWidth - 2) score -= 5;
                if (nextPos.y <= 1 || nextPos.y >= this.game.gridHeight - 2) score -= 5;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestDir = dir;
                }
            }
            
            // Update direction for next step
            direction = bestDir;
            
            // Move snake clone one step
            const nextHead = this.getNextPosition(snakeClone[0], direction);
            
            // Check for wall collision
            if (nextHead.x < 0 || nextHead.x >= this.game.gridWidth ||
                nextHead.y < 0 || nextHead.y >= this.game.gridHeight) {
                break; // Stop prediction if wall collision
            }
            
            // Add to path
            this.futurePathNodes.push({...nextHead, step: step + 1});
            
            // Move snake clone
            snakeClone.unshift(nextHead);
            snakeClone.pop();
        }
    }

    isValidDirection(current, next) {
        return !((current === 'up' && next === 'down') ||
                (current === 'down' && next === 'up') ||
                (current === 'left' && next === 'right') ||
                (current === 'right' && next === 'left'));
    }

    getNextPosition(pos, direction) {
        const next = {...pos};
        
        switch (direction) {
            case 'up': next.y--; break;
            case 'down': next.y++; break;
            case 'left': next.x--; break;
            case 'right': next.x++; break;
        }
        
        return next;
    }

    setupPsychokinesis() {
        this.psychokinesisActive = true;
        this.psychoWaves = [];
        
        // Create psychic wave interval
        this.psychoInterval = setInterval(() => {
            this.createPsychoWave();
        }, 1000);
        
        setTimeout(() => {
            clearInterval(this.psychoInterval);
            this.psychokinesisActive = false;
            this.psychoWaves = [];
        }, config.powerUpDuration);
    }

    createPsychoWave() {
        if (!this.psychokinesisActive || this.game.snake.length === 0) return;
        
        const head = this.game.snake[0];
        
        // Create a psychic wave emanating from snake head
        this.psychoWaves.push({
            x: head.x,
            y: head.y,
            radius: 0,
            maxRadius: 8,
            growth: 0.5,
            strength: 0.8,
            color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`
        });
    }

    updatePsychoWaves() {
        if (!this.psychokinesisActive) return;
        
        // Update each psychic wave
        for (let i = this.psychoWaves.length - 1; i >= 0; i--) {
            const wave = this.psychoWaves[i];
            
            // Grow the wave
            wave.radius += wave.growth;
            
            // Remove if reached max size
            if (wave.radius >= wave.maxRadius) {
                this.psychoWaves.splice(i, 1);
                continue;
            }
            
            // Check if wave affects any food
            for (const food of this.game.foods) {
                const dx = food.x - wave.x;
                const dy = food.y - wave.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If food is at the edge of the wave, it gets pushed
                if (Math.abs(distance - wave.radius) < 1) {
                    // Calculate push direction (away from center)
                    const pushForce = wave.strength;
                    const angle = Math.atan2(dy, dx);
                    
                    // Apply push with probability based on strength
                    if (Math.random() < pushForce) {
                        food.x += Math.round(Math.cos(angle));
                        food.y += Math.round(Math.sin(angle));
                        
                        // Keep within bounds
                        food.x = Math.max(0, Math.min(this.game.gridWidth - 1, food.x));
                        food.y = Math.max(0, Math.min(this.game.gridHeight - 1, food.y));
                    }
                }
            }
        }
    }

    update() {
        // Update telekinesis cooldown
        if (this.telekinesisActive && this.telekinesisCooldown > 0) {
            this.telekinesisCooldown--;
        }
        
        if (this.astralProjectionActive) {
            this.updateAstralSnake();
        }
        
        if (this.mindControlActive) {
            this.updateControlledFood();
        }
        
        if (this.precognitionActive && Math.random() < 0.1) {
            this.calculateFuturePath();
        }
        
        if (this.psychokinesisActive) {
            this.updatePsychoWaves();
        }
    }

    draw(ctx, gridSize) {
        if (this.telepathyActive) {
            this.drawTelepathyPath(ctx, gridSize);
        }
        
        if (this.astralProjectionActive) {
            this.drawAstralSnake(ctx, gridSize);
        }
        
        if (this.precognitionActive) {
            this.drawFuturePath(ctx, gridSize);
        }
        
        if (this.psychokinesisActive) {
            this.drawPsychoWaves(ctx, gridSize);
        }
    }

    drawTelepathyPath(ctx, gridSize) {
        if (!this.telepathyActive || this.targetFoodIndex === null || 
            this.targetFoodIndex >= this.game.foods.length || 
            this.game.snake.length === 0) return;
        
        const head = this.game.snake[0];
        const targetFood = this.game.foods[this.targetFoodIndex];
        
        // Draw glowing path to target food
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        
        // Pulsating effect
        const pulseIntensity = (Math.sin(Date.now() / 300) + 1) / 2; // 0 to 1
        ctx.globalAlpha = 0.3 + 0.4 * pulseIntensity;
        
        ctx.beginPath();
        ctx.moveTo(
            head.x * gridSize + gridSize / 2,
            head.y * gridSize + gridSize / 2
        );
        ctx.lineTo(
            targetFood.x * gridSize + gridSize / 2,
            targetFood.y * gridSize + gridSize / 2
        );
        ctx.stroke();
        
        // Draw target indicator around food
        ctx.beginPath();
        ctx.arc(
            targetFood.x * gridSize + gridSize / 2,
            targetFood.y * gridSize + gridSize / 2,
            gridSize / 1.5 * (0.8 + 0.2 * pulseIntensity),
            0, Math.PI * 2
        );
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.7)';
        ctx.stroke();
        
        // Reset
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;
    }

    drawAstralSnake(ctx, gridSize) {
        if (!this.astralProjectionActive || this.astralSnake.length === 0) return;
        
        // Draw transparent blue astral snake
        ctx.fillStyle = 'rgba(100, 149, 237, 0.5)';
        ctx.globalAlpha = 0.6;
        
        for (const segment of this.astralSnake) {
            ctx.beginPath();
            ctx.rect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize,
                gridSize
            );
            ctx.fill();
        }
        
        // Add glow effect to astral snake head
        ctx.shadowColor = 'rgba(100, 149, 237, 0.8)';
        ctx.shadowBlur = 15;
        
        ctx.beginPath();
        ctx.rect(
            this.astralSnake[0].x * gridSize,
            this.astralSnake[0].y * gridSize,
            gridSize,
            gridSize
        );
        ctx.fill();
        
        // Reset
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    }

    drawFuturePath(ctx, gridSize) {
        if (!this.precognitionActive || this.futurePathNodes.length === 0) return;
        
        // Draw predicted path nodes with fading opacity
        ctx.globalAlpha = 0.3;
        
        for (const node of this.futurePathNodes) {
            // Calculate opacity based on step (further = more transparent)
            const opacity = 1 - (node.step / 15);
            
            // Calculate color hue based on step
            const hue = 180 + (node.step * 10) % 180; // blue to purple gradient
            
            ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${opacity})`;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(
                node.x * gridSize + gridSize / 2,
                node.y * gridSize + gridSize / 2,
                gridSize / 3 * opacity,
                0, Math.PI * 2
            );
            ctx.fill();
            
            // Connect nodes with lines
            if (node.step > 1) {
                const prevNode = this.futurePathNodes.find(n => n.step === node.step - 1);
                if (prevNode) {
                    ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${opacity * 0.5})`;
                    ctx.lineWidth = 2 * opacity;
                    ctx.beginPath();
                    ctx.moveTo(
                        prevNode.x * gridSize + gridSize / 2,
                        prevNode.y * gridSize + gridSize / 2
                    );
                    ctx.lineTo(
                        node.x * gridSize + gridSize / 2,
                        node.y * gridSize + gridSize / 2
                    );
                    ctx.stroke();
                }
            }
        }
        
        ctx.globalAlpha = 1.0;
    }

    drawPsychoWaves(ctx, gridSize) {
        if (!this.psychokinesisActive) return;
        
        // Draw each psychic wave
        for (const wave of this.psychoWaves) {
            const centerX = wave.x * gridSize + gridSize / 2;
            const centerY = wave.y * gridSize + gridSize / 2;
            const radius = wave.radius * gridSize;
            
            // Create gradient for wave
            const gradient = ctx.createRadialGradient(
                centerX, centerY, radius - gridSize / 2,
                centerX, centerY, radius + gridSize / 2
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.5, wave.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            // Draw wave circle
            ctx.strokeStyle = gradient;
            ctx.lineWidth = gridSize / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}