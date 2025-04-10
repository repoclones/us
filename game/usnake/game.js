import config from 'config';
import { PowerUpManager } from './powerups.js';
import { AdvancedPowerUpManager } from './advancedPowerups.js';
import { AdvancedPowerUpExtensions } from './advancedPowerupsExtension.js';
import { GameRenderer } from './renderer.js';
import { AutoplayManager } from './autoplay.js';
import { SuperPowerUpManager } from './superPowerups.js';
import { PowerUpVisuals } from './powerup-visuals.js';
import { CosmicPowerUpManager } from './cosmicPowerups.js';
import { DimensionPowerUpManager } from './dimensionPowerups.js';
import { PhysicalPowerUpManager } from './physicalPowerups.js';
import { QuantumPowerUpManager } from './quantumPowerups.js';
import { FantasticPowerUpManager } from './fantasticPowerups.js';
import { PsychicPowerUpManager } from './psychicPowerups.js';

class SnakeGame {
    constructor() {
        try {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            this.canvas.width = config.canvasWidth;
            this.canvas.height = config.canvasHeight;
            
            this.gridSize = config.gridSize;
            this.gridWidth = this.canvas.width / this.gridSize;
            this.gridHeight = this.canvas.height / this.gridSize;
            
            this.startBtn = document.getElementById('start-btn');
            this.scoreElement = document.getElementById('score');
            this.highScoreElement = document.getElementById('high-score');
            
            this.foods = [];
            
            // Initialize managers
            this.powerUpManager = new PowerUpManager(this);
            this.advancedPowerUpManager = new AdvancedPowerUpManager(this);
            this.advancedPowerUpExtensions = new AdvancedPowerUpExtensions(this, this.advancedPowerUpManager);
            this.renderer = new GameRenderer(this, this.canvas, this.ctx);
            this.autoplayManager = new AutoplayManager(this);
            this.superPowerUpManager = new SuperPowerUpManager(this);
            this.powerUpVisuals = new PowerUpVisuals(this.ctx);
            this.cosmicPowerUpManager = new CosmicPowerUpManager(this);
            this.dimensionPowerUpManager = new DimensionPowerUpManager(this);
            this.physicalPowerUpManager = new PhysicalPowerUpManager(this);
            this.quantumPowerUpManager = new QuantumPowerUpManager(this);
            this.fantasticPowerUpManager = new FantasticPowerUpManager(this);
            this.psychicPowerUpManager = new PsychicPowerUpManager(this);
            
            // Track custom snake colors for Rainbow effect
            this.customSnakeColors = null;
            
            this.setupEventListeners();
            this.loadHighScore();
            this.updatePowerUpLegend();
            this.reset();
            this.renderer.drawGame();
        } catch (error) {
            this.showErrorWindow(error);
        }
    }
    
    reset() {
        this.snake = [
            { x: Math.floor(this.gridWidth / 2), y: Math.floor(this.gridHeight / 2) }
        ];
        this.foods = [];
        for (let i = 0; i < config.foodCount; i++) {
            this.foods.push(this.generateFood());
        }
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameOver = false;
        this.paused = true;
        this.speed = config.initialSpeed;
        
        // Clear any active power-ups
        this.powerUpManager.clearAllPowerUps();
        
        // Stop autoplay if it's running
        if (this.autoplayManager.isAutoplaying) {
            this.autoplayManager.toggleAutoplay();
            const autoplayBtn = document.getElementById('autoplay-btn');
            autoplayBtn.textContent = 'Autoplay';
            autoplayBtn.classList.remove('active');
        }
        
        this.updateScore();
        this.startBtn.textContent = 'Start Game';
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e.key);
        });
        
        // Start/Restart button
        this.startBtn.addEventListener('click', () => {
            if (this.gameOver) {
                this.reset();
            }
            this.togglePause();
        });
        
        // Mobile controls
        document.getElementById('up-btn').addEventListener('click', () => this.changeDirection('up'));
        document.getElementById('down-btn').addEventListener('click', () => this.changeDirection('down'));
        document.getElementById('left-btn').addEventListener('click', () => this.changeDirection('left'));
        document.getElementById('right-btn').addEventListener('click', () => this.changeDirection('right'));
        
        // Add autoplay button listener
        document.getElementById('autoplay-btn').addEventListener('click', () => {
            const isAutoplaying = this.autoplayManager.toggleAutoplay();
            const autoplayBtn = document.getElementById('autoplay-btn');
            
            if (isAutoplaying) {
                autoplayBtn.textContent = 'Stop Autoplay';
                autoplayBtn.classList.add('active');
            } else {
                autoplayBtn.textContent = 'Autoplay';
                autoplayBtn.classList.remove('active');
            }
        });
    }
    
    handleKeyPress(key) {
        switch (key) {
            case 'ArrowUp':
            case 'w':
                this.changeDirection('up');
                break;
            case 'ArrowDown':
            case 's':
                this.changeDirection('down');
                break;
            case 'ArrowLeft':
            case 'a':
                this.changeDirection('left');
                break;
            case 'ArrowRight':
            case 'd':
                this.changeDirection('right');
                break;
            case ' ':
                if (!this.gameOver) {
                    this.togglePause();
                }
                break;
        }
    }
    
    changeDirection(newDirection) {
        // If reverse controls is active, reverse the direction
        const activePowerUps = this.powerUpManager.getActivePowerUps();
        if (activePowerUps.includes('Reverse Controls')) {
            switch (newDirection) {
                case 'up': newDirection = 'down'; break;
                case 'down': newDirection = 'up'; break;
                case 'left': newDirection = 'right'; break;
                case 'right': newDirection = 'left'; break;
            }
        }
        
        // Don't allow reversing direction
        if (
            (this.direction === 'up' && newDirection === 'down') ||
            (this.direction === 'down' && newDirection === 'up') ||
            (this.direction === 'left' && newDirection === 'right') ||
            (this.direction === 'right' && newDirection === 'left')
        ) {
            return;
        }
        
        this.nextDirection = newDirection;
        
        // If the game is paused, start it when the player changes direction
        if (this.paused && !this.gameOver) {
            this.togglePause();
        }
    }
    
    togglePause() {
        this.paused = !this.paused;
        
        if (!this.paused) {
            this.startBtn.textContent = 'Pause';
            this.gameLoop();
        } else {
            this.startBtn.textContent = 'Resume';
        }
    }
    
    gameLoop() {
        if (this.paused || this.gameOver) return;
        
        try {
            this.update();
            this.renderer.drawGame();
            
            let currentSpeed = this.speed;
            
            // Apply slow motion power-up if active
            const activePowerUps = this.powerUpManager.getActivePowerUps();
            if (activePowerUps.includes('Slow Motion')) {
                currentSpeed = this.speed * 1.5;
            }
            
            // Apply speed boost power-up if active
            if (activePowerUps.includes('Speed Boost')) {
                currentSpeed = Math.max(this.speed * 0.7, config.minSpeed);
            }
            
            // Apply time warp effect (temporary extreme speed boost)
            if (this.advancedPowerUpManager.timeWarpActive) {
                currentSpeed = this.speed * 0.5;
            }
            
            setTimeout(() => this.gameLoop(), currentSpeed);
        } catch (error) {
            this.showErrorWindow(error);
        }
    }
    
    update() {
        try {
            // Update direction
            this.direction = this.nextDirection;
            
            // Update food expiration status
            this.updateFoodExpiration();
            
            // Check if magnet power-up should attract food
            this.powerUpManager.magnetAttractFood();
            
            // Check if gravity well should affect food
            if (this.advancedPowerUpManager.gravityWellPos) {
                this.advancedPowerUpManager.applyGravityEffect();
            }
            
            // Check bomb timer
            if (this.advancedPowerUpManager.bombTime) {
                this.advancedPowerUpManager.checkBombDetonation();
            }
            
            // Get suggested direction from target lock if active
            if (this.advancedPowerUpManager.targetedFood) {
                const suggestedDirection = this.advancedPowerUpManager.getTargetDirection();
                if (suggestedDirection && this.isValidDirectionChange(this.direction, suggestedDirection)) {
                    this.direction = suggestedDirection;
                }
            }
            
            // Update advanced power-up extensions if any are active
            this.advancedPowerUpExtensions.update();
            
            // Update super power-up manager if initialized
            this.superPowerUpManager.update();
            
            // Update cosmic power-up manager if initialized
            this.cosmicPowerUpManager.update();
            
            // Update dimension power-up manager
            this.dimensionPowerUpManager.update();
            
            // Update new power-up managers
            this.physicalPowerUpManager.update();
            this.quantumPowerUpManager.update();
            this.fantasticPowerUpManager.update();
            this.psychicPowerUpManager.update();
            
            // Calculate new head position
            const head = { ...this.snake[0] };
            
            // Check for teleportation first
            const teleportPos = this.powerUpManager.executeTeleportation();
            if (teleportPos) {
                head.x = teleportPos.x;
                head.y = teleportPos.y;
            } else {
                // Normal movement
                switch (this.direction) {
                    case 'up': head.y--; break;
                    case 'down': head.y++; break;
                    case 'left': head.x--; break;
                    case 'right': head.x++; break;
                }
            }
            
            // Apply spatial fold effect
            const foldExit = this.dimensionPowerUpManager.checkSpatialFold(head);
            if (foldExit) {
                head.x = foldExit.x;
                head.y = foldExit.y;
            }
            
            // Check for portal collisions
            const portalExit = this.powerUpManager.checkPortalCollision(head);
            if (portalExit) {
                head.x = portalExit.x;
                head.y = portalExit.y;
            }
            
            const activePowerUps = this.powerUpManager.getActivePowerUps();
            
            // Check for collisions (skip if Ghost Mode is active)
            if (!activePowerUps.includes('Ghost Mode') && this.checkCollision(head)) {
                this.handleGameOver();
                return;
            }
            
            // Wrap around if in Ghost Mode and hitting a wall
            if (activePowerUps.includes('Ghost Mode')) {
                if (head.x < 0) head.x = this.gridWidth - 1;
                if (head.y < 0) head.y = this.gridHeight - 1;
                if (head.x >= this.gridWidth) head.x = 0;
                if (head.y >= this.gridHeight) head.y = 0;
            }
            
            // Add mirrored head if in mirror mode
            if (this.advancedPowerUpManager.mirrorMode) {
                const mirroredHead = this.advancedPowerUpManager.getMirroredPosition(head);
                if (mirroredHead) {
                    this.checkMirroredFoodCollision(mirroredHead);
                }
            }
            
            // Add new head
            this.snake.unshift(head);
            
            // Check if any food was eaten
            let foodEaten = false;
            for (let i = 0; i < this.foods.length; i++) {
                if (head.x === this.foods[i].x && head.y === this.foods[i].y) {
                    this.eatFood(i);
                    foodEaten = true;
                    break;
                }
            }
            
            if (!foodEaten) {
                // Apply growth boost if active
                if (this.advancedPowerUpManager.growthBoostActive) {
                    // Don't remove tail when growth boost is active
                } else if (activePowerUps.includes('Size Reduce') && this.snake.length > 3) {
                    // Remove two segments when Size Reduce is active
                    this.snake.pop();
                    this.snake.pop();
                } else {
                    this.snake.pop();
                }
            }
        } catch (error) {
            this.showErrorWindow(error);
            this.paused = true;
        }
    }
    
    isValidDirectionChange(currentDir, newDir) {
        return !((currentDir === 'up' && newDir === 'down') ||
                (currentDir === 'down' && newDir === 'up') ||
                (currentDir === 'left' && newDir === 'right') ||
                (currentDir === 'right' && newDir === 'left'));
    }
    
    checkMirroredFoodCollision(mirroredHead) {
        for (let i = 0; i < this.foods.length; i++) {
            if (mirroredHead.x === this.foods[i].x && mirroredHead.y === this.foods[i].y) {
                // Give points but don't grow the snake
                this.score++;
                this.updateScore();
                
                // Generate new food
                this.foods[i] = this.generateFood();
                return true;
            }
        }
        return false;
    }
    
    eatFood(index) {
        try {
            const food = this.foods[index];
            
            // Add points (double if Double Points is active)
            const activePowerUps = this.powerUpManager.getActivePowerUps();
            const pointsToAdd = activePowerUps.includes('Double Points') ? 2 : 1;
            
            // Add treasure value if applicable
            if (food.isTreasure) {
                this.score += food.value;
            } else {
                this.score += pointsToAdd;
            }
            
            this.updateScore();
            
            // Apply power-up effect if not a regular food
            if (food.type.name !== 'Regular') {
                // Check if it's a basic, advanced, extension, super, cosmic, dimension,
                // physical, quantum, fantastic, or psychic power-up
                const isPhysicalPowerUp = [
                    'Anti Gravity', 'Magnetic Field', 'Light Speed', 
                    'Time Rift', 'Wormhole Field', 'Multi Dimensional'
                ].includes(food.type.name);
                
                const isQuantumPowerUp = [
                    'Quantum Entanglement', 'Schrodinger State', 'Particle Accelerator',
                    'Quantum Decoherence', 'String Theory', 'Heisenberg Uncertainty'
                ].includes(food.type.name);
                
                const isFantasticPowerUp = [
                    'Dragon Breath', 'Wizard Spells', 'Fairy Dust',
                    'Necromancy', 'Shapeshifting', 'Time Manipulation'
                ].includes(food.type.name);
                
                const isPsychicPowerUp = [
                    'Telepathy', 'Telekinesis', 'Astral Projection',
                    'Mind Control', 'Precognition', 'Psychokinesis'
                ].includes(food.type.name);
                
                const isDimensionPowerUp = [
                    'Mirror Dimension', 'Time Loop', 'Void Zones', 
                    'Spatial Fold', 'Reality Fragments', 'Infinity Loop', 'Quantum State'
                ].includes(food.type.name);
                
                const isCosmicPowerUp = [
                    'Starfield', 'Black Hole', 'Cosmic Wave', 
                    'Celestial Shield', 'Asteroid Field', 'Nova Blast', 'Supermassive'
                ].includes(food.type.name);
                
                const isSuperPowerUp = [
                    'Time Rewind', 'Spectral Vision', 'Nature\'s Touch', 
                    'Elemental Mastery', 'Shadow Clone'
                ].includes(food.type.name);
                
                const isAdvancedPowerUpExtension = [
                    'Reality Bend', 'Snake Fusion', 'Echo Trail', 
                    'Quantum Tunneling', 'Dimension Shift'
                ].includes(food.type.name);
                
                const isAdvancedPowerUp = [
                    'Laser Snake', 'Bomb Time', 'Mirror World', 'Target Lock', 
                    'Growth Boost', 'Time Warp', 'Gravity Well',
                    'Phasing Snake', 'Shape Shifter', 'Treasure Hunter',
                    'Neon Trail', 'Time Freeze'
                ].includes(food.type.name);
                
                if (isPhysicalPowerUp) {
                    this.physicalPowerUpManager.applyPhysicalPowerUp(food.type.name);
                } else if (isQuantumPowerUp) {
                    this.quantumPowerUpManager.applyQuantumPowerUp(food.type.name);
                } else if (isFantasticPowerUp) {
                    this.fantasticPowerUpManager.applyFantasticPowerUp(food.type.name);
                } else if (isPsychicPowerUp) {
                    this.psychicPowerUpManager.applyPsychicPowerUp(food.type.name);
                } else if (isDimensionPowerUp) {
                    this.dimensionPowerUpManager.applyDimensionPowerUp(food.type.name);
                } else if (isCosmicPowerUp) {
                    this.cosmicPowerUpManager.applyCosmicPowerUp(food.type.name);
                } else if (isSuperPowerUp) {
                    this.superPowerUpManager.applySuperPowerUp(food.type.name);
                } else if (isAdvancedPowerUpExtension) {
                    this.advancedPowerUpExtensions.applyExtendedPowerUp(food.type.name);
                } else if (isAdvancedPowerUp) {
                    this.advancedPowerUpManager.applyAdvancedPowerUp(food.type.name);
                }
                
                this.powerUpManager.applyPowerUp(food.type.name);
            }
            
            // Add extra segments for growth boost
            if (this.advancedPowerUpManager.growthBoostActive) {
                for (let i = 0; i < config.growthBoostAmount; i++) {
                    const tail = this.snake[this.snake.length - 1];
                    this.snake.push({ ...tail });
                }
            }
            
            // Generate new food to replace the eaten one
            this.foods[index] = this.generateFood();
            
            // Increase speed (decrease interval)
            if (this.speed > config.minSpeed) {
                this.speed -= config.speedIncrease;
            }
        } catch (error) {
            this.showErrorWindow(error);
        }
    }
    
    checkCollision(head) {
        // Check for hidden food collisions with spectral vision
        if (this.superPowerUpManager.spectralVisionActive) {
            if (this.superPowerUpManager.checkHiddenFoodCollision(head)) {
                return false;
            }
        }
        
        // Check if elemental mastery affects collision
        if (this.superPowerUpManager.elementalMasteryActive && 
            this.superPowerUpManager.checkElementalCollision(head)) {
            return false;
        }
        
        // Check wall collision (skip if phasing is active)
        if (!this.advancedPowerUpManager.phasingActive &&
            (head.x < 0 ||
            head.y < 0 ||
            head.x >= this.gridWidth ||
            head.y >= this.gridHeight)
        ) {
            return true;
        }
        
        // Wrap around if phasing is active
        if (this.advancedPowerUpManager.phasingActive) {
            if (head.x < 0) head.x = this.gridWidth - 1;
            if (head.y < 0) head.y = this.gridHeight - 1;
            if (head.x >= this.gridWidth) head.x = 0;
            if (head.y >= this.gridHeight) head.y = 0;
        }
        
        // Check void zone collision
        if (this.dimensionPowerUpManager.voidZonesActive && 
            this.dimensionPowerUpManager.isInVoidZone(head)) {
            return true;
        }
        
        // Apply infinity loop (prevents wall collisions)
        if (this.dimensionPowerUpManager.infinityLoopActive) {
            const loopedPosition = this.dimensionPowerUpManager.applyInfinityLoop(head);
            head.x = loopedPosition.x;
            head.y = loopedPosition.y;
            return false;
        }
        
        // Apply reality fragment transformation
        if (this.dimensionPowerUpManager.realityFragmentsActive) {
            const transformedPosition = this.dimensionPowerUpManager.transformFragmentPosition(head);
            head.x = transformedPosition.x;
            head.y = transformedPosition.y;
        }
        
        // Check self collision (skip head)
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                // If phasing active, allow passing through self
                if (this.advancedPowerUpManager.phasingActive) {
                    return false;
                }
                return true;
            }
        }
        
        return false;
    }
    
    handleGameOver() {
        // Store the current snake before game over
        this.previousSnake = [...this.snake];
        
        this.gameOver = true;
        this.paused = true;
        this.startBtn.textContent = 'Restart Game';
        
        // Clear all power-ups when game over
        this.powerUpManager.clearAllPowerUps();
        this.advancedPowerUpManager = new AdvancedPowerUpManager(this);
        this.advancedPowerUpExtensions = new AdvancedPowerUpExtensions(this, this.advancedPowerUpManager);
        this.superPowerUpManager = new SuperPowerUpManager(this);
        this.cosmicPowerUpManager = new CosmicPowerUpManager(this);
        this.dimensionPowerUpManager = new DimensionPowerUpManager(this);
        this.physicalPowerUpManager = new PhysicalPowerUpManager(this);
        this.quantumPowerUpManager = new QuantumPowerUpManager(this);
        this.fantasticPowerUpManager = new FantasticPowerUpManager(this);
        this.psychicPowerUpManager = new PsychicPowerUpManager(this);
        
        // Update high score if needed
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.highScoreElement.textContent = this.highScore;
        }
    }
    
    generateFood() {
        // Generate food at random position (not on snake or other food)
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };
        } while (this.isPositionOccupied(food));
        
        // Determine the type of food using weighted random selection
        food.type = this.getRandomFoodType();
        
        // Add expiration time (30 seconds from now)
        food.expiresAt = Date.now() + 30000;
        food.freshness = 1.0; // Start at 100% freshness
        
        return food;
    }
    
    isPositionOccupied(pos) {
        // Check if position is on snake
        for (const segment of this.snake) {
            if (segment.x === pos.x && segment.y === pos.y) {
                return true;
            }
        }
        
        // Check if position is on other food
        for (const food of this.foods) {
            if (food && food.x === pos.x && food.y === pos.y) {
                return true;
            }
        }
        
        // Check if position is on a portal
        for (const portal of this.powerUpManager.portalPairs) {
            if ((portal.entry.x === pos.x && portal.entry.y === pos.y) ||
                (portal.exit.x === pos.x && portal.exit.y === pos.y)) {
                return true;
            }
        }
        
        return false;
    }
    
    getRandomFoodType() {
        const totalChance = config.foodTypes.reduce((sum, type) => sum + type.chance, 0);
        let random = Math.random() * totalChance;
        
        for (const type of config.foodTypes) {
            if (random < type.chance) {
                return type;
            }
            random -= type.chance;
        }
        
        // Default to regular
        return config.foodTypes[0];
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.highScoreElement.textContent = this.highScore;
        
        // Load discovered power-ups from localStorage
        this.loadDiscoveredPowerUps();
        this.updatePowerUpLegend();
    }
    
    saveDiscoveredPowerUps() {
        const discoveredStates = config.foodTypes.map(type => type.discovered);
        localStorage.setItem('snakeDiscoveredPowerUps', JSON.stringify(discoveredStates));
    }
    
    loadDiscoveredPowerUps() {
        const savedStates = localStorage.getItem('snakeDiscoveredPowerUps');
        if (savedStates) {
            const discoveredStates = JSON.parse(savedStates);
            discoveredStates.forEach((discovered, index) => {
                if (index < config.foodTypes.length) {
                    config.foodTypes[index].discovered = discovered;
                }
            });
        }
    }
    
    updatePowerUpLegend() {
        const legendContainer = document.getElementById('power-up-list');
        legendContainer.innerHTML = ''; // Clear existing items
        
        const activePowersList = document.getElementById('active-powers-list');
        activePowersList.innerHTML = ''; // Clear active powers
        
        // Add discovered power-ups to the legend
        config.foodTypes.forEach(foodType => {
            const item = document.createElement('li');
            
            if (foodType.discovered) {
                item.classList.remove('undiscovered');
                const span = document.createElement('span');
                span.className = 'food-dot';
                span.style.backgroundColor = foodType.color;
                item.appendChild(span);
                item.appendChild(document.createTextNode(' ' + foodType.name));
            } else {
                item.classList.add('undiscovered');
                const span = document.createElement('span');
                span.className = 'food-dot';
                span.style.backgroundColor = '#777';
                item.appendChild(span);
                item.appendChild(document.createTextNode(' Power-up'));
            }
            
            legendContainer.appendChild(item);
        });
        
        // Add active power-ups to the active list
        const activePowerUps = this.powerUpManager.getActivePowerUps();
        activePowerUps.forEach(powerUp => {
            const item = document.createElement('li');
            const foodType = config.foodTypes.find(type => type.name === powerUp);
            
            if (foodType) {
                const span = document.createElement('span');
                span.className = 'food-dot';
                span.style.backgroundColor = foodType.color;
                item.appendChild(span);
                item.appendChild(document.createTextNode(' ' + powerUp));
                activePowersList.appendChild(item);
            }
        });
    }
    
    updateFoodExpiration() {
        const currentTime = Date.now();
        
        for (let i = 0; i < this.foods.length; i++) {
            const food = this.foods[i];
            if (food.expiresAt) {
                // Calculate remaining time and freshness
                const timeRemaining = food.expiresAt - currentTime;
                food.freshness = Math.max(0, timeRemaining / 30000);
                
                // Replace expired food
                if (timeRemaining <= 0) {
                    this.foods[i] = this.generateFood();
                }
            }
        }
    }
    
    draw() {
        this.renderer.drawGame();
        this.physicalPowerUpManager.draw(this.ctx, this.gridSize);
        this.quantumPowerUpManager.draw(this.ctx, this.gridSize);
        this.fantasticPowerUpManager.draw(this.ctx, this.gridSize);
        this.psychicPowerUpManager.draw(this.ctx, this.gridSize);
        if (this.cosmicPowerUpManager) {
            this.cosmicPowerUpManager.draw(this.ctx, config.gridSize);
        }
    }
    
    showErrorWindow(error) {
        console.error("Game Error:", error);
        
        // Create error overlay
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'error-overlay';
        
        const errorBox = document.createElement('div');
        errorBox.className = 'error-box';
        
        // Error header
        const errorHeader = document.createElement('div');
        errorHeader.className = 'error-header';
        errorHeader.textContent = 'Game Error Detected';
        
        // Error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = error.message || 'Unknown error occurred';
        
        // Stack trace
        const stackTrace = document.createElement('div');
        stackTrace.className = 'stack-trace';
        
        // Format stack trace for readability
        if (error.stack) {
            const formattedStack = error.stack
                .split('\n')
                .map(line => `<div>${line}</div>`)
                .join('');
            stackTrace.innerHTML = formattedStack;
        } else {
            stackTrace.textContent = 'No stack trace available';
        }
        
        // Debug info
        const debugInfo = document.createElement('div');
        debugInfo.className = 'debug-info';
        
        // Add game state information
        let gameStateInfo = '';
        try {
            gameStateInfo = `
                <p><strong>Game State:</strong></p>
                <p>Score: ${this.score}</p>
                <p>Snake Length: ${this.snake ? this.snake.length : 'N/A'}</p>
                <p>Direction: ${this.direction}</p>
                <p>Active Power-ups: ${this.powerUpManager ? JSON.stringify(this.powerUpManager.getActivePowerUps()) : 'N/A'}</p>
                <p>Foods: ${this.foods ? this.foods.length : 'N/A'}</p>
                <p>Game Paused: ${this.paused}</p>
                <p>Game Over: ${this.gameOver}</p>
                <p>Browser: ${navigator.userAgent}</p>
            `;
        } catch (e) {
            gameStateInfo = `<p>Unable to collect game state: ${e.message}</p>`;
        }
        
        debugInfo.innerHTML = gameStateInfo;
        
        // Restart button
        const restartButton = document.createElement('button');
        restartButton.className = 'restart-button';
        restartButton.textContent = 'Restart Game';
        restartButton.addEventListener('click', () => {
            document.body.removeChild(errorOverlay);
            this.reset();
            this.togglePause();
        });
        
        // Close button 
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(errorOverlay);
        });
        
        // Assemble the error box
        errorBox.appendChild(closeButton);
        errorBox.appendChild(errorHeader);
        errorBox.appendChild(errorMessage);
        
        const collapsibleDebug = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = 'Debug Information';
        collapsibleDebug.appendChild(summary);
        collapsibleDebug.appendChild(stackTrace);
        collapsibleDebug.appendChild(debugInfo);
        
        errorBox.appendChild(collapsibleDebug);
        errorBox.appendChild(restartButton);
        
        errorOverlay.appendChild(errorBox);
        document.body.appendChild(errorOverlay);
    }
}

// Initialize the game with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        new SnakeGame();
    } catch (error) {
        console.error("Failed to initialize game:", error);
        
        const errorBox = document.createElement('div');
        errorBox.className = 'error-box critical-error';
        errorBox.innerHTML = `
            <h2>Critical Error</h2>
            <p>Failed to initialize the game: ${error.message}</p>
            <pre>${error.stack}</pre>
            <button onclick="location.reload()">Reload Page</button>
        `;
        
        document.body.innerHTML = '';
        document.body.appendChild(errorBox);
    }
});

// Add global error handler for uncaught errors
window.addEventListener('error', (event) => {
    if (window.gameInstance) {
        window.gameInstance.showErrorWindow(event.error || new Error(event.message));
        event.preventDefault();
    }
});