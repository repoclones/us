// New file for fantasy-themed power-ups
import config from 'config';

export class FantasticPowerUpManager {
    constructor(game) {
        this.game = game;
        this.dragonBreathActive = false;
        this.fireBreathCharges = 0;
        this.wizardSpellsActive = false;
        this.availableSpells = [];
        this.activeSpell = null;
        this.fairyDustActive = false;
        this.fairyDustParticles = [];
        this.necromancyActive = false;
        this.undeadSnake = [];
        this.shapeshiftingActive = false;
        this.currentForm = null;
        this.timeManipulationActive = false;
        this.timeEffects = [];
    }

    applyFantasticPowerUp(powerUpName) {
        switch(powerUpName) {
            case 'Dragon Breath':
                this.setupDragonBreath();
                break;
            case 'Wizard Spells':
                this.setupWizardSpells();
                break;
            case 'Fairy Dust':
                this.setupFairyDust();
                break;
            case 'Necromancy':
                this.setupNecromancy();
                break;
            case 'Shapeshifting':
                this.setupShapeshifting();
                break;
            case 'Time Manipulation':
                this.setupTimeManipulation();
                break;
        }
    }

    setupDragonBreath() {
        this.dragonBreathActive = true;
        this.fireBreathCharges = 3;
        
        // Add event listener for Q key to breathe fire
        this.fireBreathHandler = (e) => {
            if (e.code === 'KeyQ' && this.dragonBreathActive && this.fireBreathCharges > 0) {
                this.breatheFire();
            }
        };
        
        document.addEventListener('keydown', this.fireBreathHandler);
        
        // Display fire breath instructions
        const instructionElement = document.createElement('div');
        instructionElement.className = 'power-up-instruction';
        instructionElement.textContent = 'Press Q to breathe fire!';
        document.querySelector('.game-container').appendChild(instructionElement);
        
        setTimeout(() => {
            document.removeEventListener('keydown', this.fireBreathHandler);
            this.dragonBreathActive = false;
            this.fireBreathCharges = 0;
            document.querySelector('.power-up-instruction')?.remove();
        }, config.powerUpDuration);
    }

    breatheFire() {
        if (this.fireBreathCharges <= 0) return;
        
        this.fireBreathCharges--;
        
        // Create fire breath effect in the direction the snake is facing
        const head = this.game.snake[0];
        const direction = this.game.direction;
        
        // Calculate fire breath properties based on direction
        let fireBreath = {
            x: head.x,
            y: head.y,
            direction: direction,
            particles: []
        };
        
        // Create fire particles
        for (let i = 0; i < 20; i++) {
            let range = 5 + Math.floor(Math.random() * 5); // How far the fire reaches
            let spread = Math.floor(Math.random() * 3) - 1; // Spread perpendicular to direction
            
            // Calculate particle position based on direction
            let particleX = head.x;
            let particleY = head.y;
            
            switch (direction) {
                case 'up':
                    particleX += spread;
                    particleY -= 1 + Math.floor(Math.random() * range);
                    break;
                case 'down':
                    particleX += spread;
                    particleY += 1 + Math.floor(Math.random() * range);
                    break;
                case 'left':
                    particleX -= 1 + Math.floor(Math.random() * range);
                    particleY += spread;
                    break;
                case 'right':
                    particleX += 1 + Math.floor(Math.random() * range);
                    particleY += spread;
                    break;
            }
            
            fireBreath.particles.push({
                x: particleX,
                y: particleY,
                size: 0.5 + Math.random() * 0.5,
                life: 5 + Math.floor(Math.random() * 10),
                color: `hsl(${20 + Math.floor(Math.random() * 20)}, 100%, ${50 + Math.floor(Math.random() * 30)}%)`
            });
        }
        
        // Check for food in the path of fire
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            
            // Check if food is in fire breath path
            let isInPath = false;
            
            switch (direction) {
                case 'up':
                    isInPath = food.x >= head.x - 1 && food.x <= head.x + 1 && food.y < head.y && food.y >= head.y - 8;
                    break;
                case 'down':
                    isInPath = food.x >= head.x - 1 && food.x <= head.x + 1 && food.y > head.y && food.y <= head.y + 8;
                    break;
                case 'left':
                    isInPath = food.y >= head.y - 1 && food.y <= head.y + 1 && food.x < head.x && food.x >= head.x - 8;
                    break;
                case 'right':
                    isInPath = food.y >= head.y - 1 && food.y <= head.y + 1 && food.x > head.x && food.x <= head.x + 8;
                    break;
            }
            
            if (isInPath) {
                // Award points for burning food
                this.game.score++;
                this.game.updateScore();
                
                // Generate new food
                this.game.foods[i] = this.game.generateFood();
            }
        }
        
        // Render fire breath effect
        this.renderFireBreath(fireBreath);
    }

    renderFireBreath(fireBreath) {
        // Create visual effect for fire breath
        const gameContainer = document.querySelector('.game-container');
        const gridSize = config.gridSize;
        
        // Create container for fire particles
        const fireContainer = document.createElement('div');
        fireContainer.className = 'fire-breath-effect';
        gameContainer.appendChild(fireContainer);
        
        // Create each fire particle
        fireBreath.particles.forEach(particle => {
            const fireParticle = document.createElement('div');
            fireParticle.className = 'fire-particle';
            fireParticle.style.left = `${particle.x * gridSize}px`;
            fireParticle.style.top = `${particle.y * gridSize}px`;
            fireParticle.style.width = `${particle.size * gridSize}px`;
            fireParticle.style.height = `${particle.size * gridSize}px`;
            fireParticle.style.backgroundColor = particle.color;
            fireContainer.appendChild(fireParticle);
        });
        
        // Remove fire effect after animation
        setTimeout(() => {
            fireContainer.remove();
        }, 1000);
    }

    setupWizardSpells() {
        this.wizardSpellsActive = true;
        
        // Define available spells
        this.availableSpells = [
            {
                name: 'Teleport',
                key: '1',
                effect: () => this.castTeleportSpell(),
                description: 'Teleport to a random location'
            },
            {
                name: 'Freeze',
                key: '2',
                effect: () => this.castFreezeSpell(),
                description: 'Freeze all food in place'
            },
            {
                name: 'Transform',
                key: '3',
                effect: () => this.castTransformSpell(),
                description: 'Transform food into power-ups'
            }
        ];
        
        // Display spell menu
        this.showSpellMenu();
        
        // Set up key listener for spell casting
        this.spellCastHandler = (e) => {
            if (this.wizardSpellsActive) {
                const spell = this.availableSpells.find(s => s.key === e.key);
                if (spell) {
                    spell.effect();
                }
            }
        };
        
        document.addEventListener('keydown', this.spellCastHandler);
        
        setTimeout(() => {
            document.removeEventListener('keydown', this.spellCastHandler);
            this.wizardSpellsActive = false;
            this.availableSpells = [];
            this.activeSpell = null;
            document.querySelector('.spell-menu')?.remove();
        }, config.powerUpDuration);
    }

    showSpellMenu() {
        // Create spell menu UI
        const spellMenu = document.createElement('div');
        spellMenu.className = 'spell-menu';
        
        const menuTitle = document.createElement('div');
        menuTitle.className = 'spell-menu-title';
        menuTitle.textContent = 'Wizard Spells';
        spellMenu.appendChild(menuTitle);
        
        // Add each spell to the menu
        this.availableSpells.forEach(spell => {
            const spellItem = document.createElement('div');
            spellItem.className = 'spell-item';
            spellItem.innerHTML = `<span class="spell-key">${spell.key}</span> ${spell.name}: ${spell.description}`;
            spellMenu.appendChild(spellItem);
            
            // Add click handler
            spellItem.addEventListener('click', () => {
                spell.effect();
            });
        });
        
        document.querySelector('.game-container').appendChild(spellMenu);
    }

    castTeleportSpell() {
        // Teleport the snake to a random safe location
        if (!this.wizardSpellsActive || this.game.snake.length === 0) return;
        
        // Find a safe spot to teleport to
        for (let attempts = 0; attempts < 20; attempts++) {
            const x = Math.floor(Math.random() * this.game.gridWidth);
            const y = Math.floor(Math.random() * this.game.gridHeight);
            
            // Check if position is safe
            let safe = true;
            
            // Check collision with snake body
            for (let i = 1; i < this.game.snake.length; i++) {
                if (this.game.snake[i].x === x && this.game.snake[i].y === y) {
                    safe = false;
                    break;
                }
            }
            
            if (safe) {
                // Create teleport effect at current position
                this.createTeleportEffect(this.game.snake[0].x, this.game.snake[0].y);
                
                // Move snake head to new position
                this.game.snake[0].x = x;
                this.game.snake[0].y = y;
                
                // Create arrival teleport effect
                this.createTeleportEffect(x, y);
                
                // Show spell cast notification
                this.showSpellNotification('Teleport');
                break;
            }
        }
    }

    createTeleportEffect(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create teleport effect
        const teleportEffect = document.createElement('div');
        teleportEffect.className = 'teleport-effect';
        teleportEffect.style.left = `${x * gridSize}px`;
        teleportEffect.style.top = `${y * gridSize}px`;
        teleportEffect.style.width = `${gridSize * 2}px`;
        teleportEffect.style.height = `${gridSize * 2}px`;
        
        gameContainer.appendChild(teleportEffect);
        
        // Remove after animation
        setTimeout(() => {
            teleportEffect.remove();
        }, 1000);
    }

    castFreezeSpell() {
        // Freeze all food in place for a duration
        if (!this.wizardSpellsActive) return;
        
        // Mark all food as frozen
        this.game.foods.forEach(food => {
            food.frozen = true;
        });
        
        // Show freeze effect over the entire grid
        const gameCanvas = document.getElementById('game-canvas');
        gameCanvas.classList.add('freeze-spell-effect');
        
        // Show spell cast notification
        this.showSpellNotification('Freeze');
        
        // Unfreeze after a duration
        setTimeout(() => {
            this.game.foods.forEach(food => {
                food.frozen = false;
            });
            gameCanvas.classList.remove('freeze-spell-effect');
        }, 5000);
    }

    castTransformSpell() {
        // Transform regular food into power-up food
        if (!this.wizardSpellsActive) return;
        
        // Find regular food to transform
        let transformCount = 0;
        
        for (let i = 0; i < this.game.foods.length; i++) {
            if (this.game.foods[i].type.name === 'Regular') {
                // Get a random power-up type
                const powerUpTypes = config.foodTypes.filter(type => 
                    type.name !== 'Regular' && type.discovered
                );
                
                if (powerUpTypes.length > 0) {
                    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                    
                    // Transform food
                    this.game.foods[i].type = randomType;
                    
                    // Create transformation effect
                    this.createTransformEffect(this.game.foods[i].x, this.game.foods[i].y);
                    
                    transformCount++;
                }
            }
        }
        
        if (transformCount > 0) {
            // Show spell cast notification
            this.showSpellNotification(`Transform (${transformCount} food transformed)`);
        }
    }

    createTransformEffect(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create transform effect
        const transformEffect = document.createElement('div');
        transformEffect.className = 'transform-effect';
        transformEffect.style.left = `${x * gridSize}px`;
        transformEffect.style.top = `${y * gridSize}px`;
        transformEffect.style.width = `${gridSize * 2}px`;
        transformEffect.style.height = `${gridSize * 2}px`;
        
        gameContainer.appendChild(transformEffect);
        
        // Remove after animation completes
        setTimeout(() => {
            transformEffect.remove();
        }, 1000);
    }

    showSpellNotification(spellName) {
        const notification = document.createElement('div');
        notification.className = 'spell-notification';
        notification.textContent = `Cast: ${spellName}`;
        
        document.querySelector('.game-container').appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 1500);
    }

    setupFairyDust() {
        this.fairyDustActive = true;
        this.fairyDustParticles = [];
        
        // Create fairy dust that follows the snake and beautifies the game
        this.fairyDustInterval = setInterval(() => {
            this.spawnFairyDustParticles();
        }, 200);
        
        setTimeout(() => {
            clearInterval(this.fairyDustInterval);
            this.fairyDustActive = false;
            this.fairyDustParticles = [];
        }, config.powerUpDuration);
    }

    spawnFairyDustParticles() {
        if (!this.fairyDustActive || this.game.snake.length === 0) return;
        
        // Create dust around the snake's head
        const head = this.game.snake[0];
        
        // Add 5-10 new particles
        const numParticles = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numParticles; i++) {
            // Random position around head
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 3;
            
            const particle = {
                x: head.x + Math.cos(angle) * distance,
                y: head.y + Math.sin(angle) * distance,
                size: 0.2 + Math.random() * 0.3,
                color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`,
                vx: Math.cos(angle) * (0.05 + Math.random() * 0.05),
                vy: Math.sin(angle) * (0.05 + Math.random() * 0.05),
                life: 20 + Math.floor(Math.random() * 20)
            };
            
            this.fairyDustParticles.push(particle);
        }
        
        // Update existing particles
        for (let i = this.fairyDustParticles.length - 1; i >= 0; i--) {
            const particle = this.fairyDustParticles[i];
            
            // Move particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.fairyDustParticles.splice(i, 1);
            }
        }
        
        // Check if any food is touched by fairy dust
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            
            for (const particle of this.fairyDustParticles) {
                const dx = food.x - particle.x;
                const dy = food.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 0.5) {
                    // Transform food if it's regular
                    if (food.type.name === 'Regular' && Math.random() < 0.1) {
                        // Beautify into a power-up (10% chance)
                        const powerUpTypes = config.foodTypes.filter(type => 
                            type.name !== 'Regular' && type.discovered
                        );
                        
                        if (powerUpTypes.length > 0) {
                            const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                            this.game.foods[i].type = randomType;
                            
                            // Create sparkle effect
                            this.createSparkleEffect(food.x, food.y);
                        }
                    }
                    break;
                }
            }
        }
    }

    createSparkleEffect(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create sparkle effect
        const sparkleEffect = document.createElement('div');
        sparkleEffect.className = 'sparkle-effect';
        sparkleEffect.style.left = `${x * gridSize}px`;
        sparkleEffect.style.top = `${y * gridSize}px`;
        
        gameContainer.appendChild(sparkleEffect);
        
        // Remove after animation completes
        setTimeout(() => {
            sparkleEffect.remove();
        }, 1000);
    }

    setupNecromancy() {
        this.necromancyActive = true;
        this.undeadSnake = [];
        
        // If snake has died previously in this session, resurrect it
        if (this.game.previousSnake && this.game.previousSnake.length > 0) {
            // Create undead copy of previous snake
            this.undeadSnake = this.game.previousSnake.map(segment => ({...segment}));
            
            // Visualize resurrection
            this.visualizeResurrection();
        } else {
            // If no previous snake, create skeletal companions
            const numCompanions = 1 + Math.floor(Math.random() * 2);
            
            for (let i = 0; i < numCompanions; i++) {
                // Create a small skeletal snake near the player
                const head = this.game.snake[0];
                const companion = [
                    { 
                        x: head.x + (Math.random() < 0.5 ? -3 : 3), 
                        y: head.y + (Math.random() < 0.5 ? -3 : 3)
                    }
                ];
                
                // Add 2-3 body segments
                for (let j = 0; j < 2 + Math.floor(Math.random() * 2); j++) {
                    companion.push({...companion[j]});
                }
                
                this.undeadSnake.push(...companion);
            }
        }
        
        setTimeout(() => {
            this.necromancyActive = false;
            this.undeadSnake = [];
        }, config.powerUpDuration);
    }

    visualizeResurrection() {
        // Create visual effect for resurrection
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Add dark fog effect to the game
        const fogEffect = document.createElement('div');
        fogEffect.className = 'necromancy-fog';
        gameContainer.appendChild(fogEffect);
        
        // For each segment of the undead snake, create a resurrection particle
        this.undeadSnake.forEach((segment, index) => {
            setTimeout(() => {
                const resurrectionParticle = document.createElement('div');
                resurrectionParticle.className = 'resurrection-particle';
                resurrectionParticle.style.left = `${segment.x * gridSize}px`;
                resurrectionParticle.style.top = `${segment.y * gridSize}px`;
                resurrectionParticle.style.width = `${gridSize}px`;
                resurrectionParticle.style.height = `${gridSize}px`;
                
                gameContainer.appendChild(resurrectionParticle);
                
                // Remove after animation
                setTimeout(() => {
                    resurrectionParticle.remove();
                }, 1000);
            }, index * 50); // Staggered effect
        });
        
        // Remove fog after animation
        setTimeout(() => {
            fogEffect.classList.add('fade-out');
            setTimeout(() => {
                fogEffect.remove();
            }, 1000);
        }, this.undeadSnake.length * 50 + 500);
    }

    updateUndeadSnake() {
        if (!this.necromancyActive || this.undeadSnake.length === 0) return;
        
        // Move undead snake
        if (this.game.previousSnake && this.game.previousSnake.length > 0) {
            // Resurrection mode - move like a ghost version of the previous snake
            // The undead snake follows a predefined path
            if (this.undeadSnake.length > 0) {
                // Remove tail and add new head to follow the same pattern
                this.undeadSnake.pop();
                
                // Get a position slightly different from the original to create a trailing effect
                const ghostPosition = {
                    x: this.undeadSnake[0].x,
                    y: this.undeadSnake[0].y
                };
                
                // Move toward player's snake head with some randomness
                const head = this.game.snake && this.game.snake.length > 0 ? this.game.snake[0] : ghostPosition;
                const dx = head.x - ghostPosition.x;
                const dy = head.y - ghostPosition.y;
                
                if (Math.abs(dx) > Math.abs(dy)) {
                    ghostPosition.x += dx > 0 ? 1 : -1;
                } else {
                    ghostPosition.y += dy > 0 ? 1 : -1;
                }
                
                this.undeadSnake.unshift(ghostPosition);
            }
        } else {
            // Companion mode - move companions to assist the player
            // Group segments into individual companions
            const companions = [];
            let currentCompanion = [];
            for (const segment of this.undeadSnake) {
                currentCompanion.push(segment);
                
                // End of a companion if we've collected enough segments
                if (currentCompanion.length >= 3) {
                    companions.push(currentCompanion);
                    currentCompanion = [];
                }
            }
            
            if (currentCompanion.length > 0) {
                companions.push(currentCompanion);
            }
            
            // Update each companion
            for (const companion of companions) {
                // Move like a mini-snake
                for (let i = companion.length - 1; i > 0; i--) {
                    companion[i].x = companion[i-1].x;
                    companion[i].y = companion[i-1].y;
                }
                
                // Move head toward closest food if there's food and a companion head
                if (companion.length > 0 && this.game.foods && this.game.foods.length > 0) {
                    let closestFood = null;
                    let minDistance = Infinity;
                    
                    for (const food of this.game.foods) {
                        const dx = food.x - companion[0].x;
                        const dy = food.y - companion[0].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestFood = food;
                        }
                    }
                    
                    if (closestFood) {
                        // Move toward food
                        const dx = closestFood.x - companion[0].x;
                        const dy = closestFood.y - companion[0].y;
                        
                        if (Math.abs(dx) > Math.abs(dy)) {
                            companion[0].x += dx > 0 ? 1 : -1;
                        } else {
                            companion[0].y += dy > 0 ? 1 : -1;
                        }
                        
                        // Check if companion reached food
                        if (companion[0].x === closestFood.x && companion[0].y === closestFood.y) {
                            // Give points to player
                            this.game.score++;
                            this.game.updateScore();
                            
                            // Replace food
                            const foodIndex = this.game.foods.indexOf(closestFood);
                            if (foodIndex !== -1) {
                                this.game.foods[foodIndex] = this.game.generateFood();
                            }
                        }
                    }
                }
            }
            
            // Flatten companions back to undead snake
            this.undeadSnake = [].concat(...companions);
        }
    }

    setupShapeshifting() {
        this.shapeshiftingActive = true;
        
        // Define possible forms
        const forms = [
            {
                name: 'Wolf',
                speed: 0.7, // Faster
                size: 1.0,  // Normal size
                ability: 'Heightened senses - can see all food on the board',
                color: '#8B4513'
            },
            {
                name: 'Bear',
                speed: 1.2, // Slower
                size: 1.5,  // Larger
                ability: 'Strength - can break through snake body once',
                color: '#654321'
            },
            {
                name: 'Eagle',
                speed: 0.8, // Faster
                size: 0.8,  // Smaller
                ability: 'Flight - can pass through walls once',
                color: '#704214'
            }
        ];
        
        // Select random form
        this.currentForm = forms[Math.floor(Math.random() * forms.length)];
        
        // Apply form effects
        this.applyShapeshiftingEffects();
        
        // Show transformation effect
        this.showTransformationEffect();
        
        setTimeout(() => {
            this.revertShapeshifting();
        }, config.powerUpDuration);
    }

    applyShapeshiftingEffects() {
        if (!this.currentForm) return;
        
        // Store original speed
        this.originalSpeed = this.game.speed;
        
        // Apply speed modifier
        this.game.speed = this.originalSpeed * this.currentForm.speed;
        
        // Apply visual changes to snake
        const gameCanvas = document.getElementById('game-canvas');
        gameCanvas.classList.add('shapeshifted');
        gameCanvas.style.setProperty('--shapeshifted-color', this.currentForm.color);
        
        // Show ability notification
        this.showAbilityNotification(this.currentForm.name, this.currentForm.ability);
    }

    revertShapeshifting() {
        if (!this.shapeshiftingActive) return;
        
        // Revert speed
        if (this.originalSpeed) {
            this.game.speed = this.originalSpeed;
        }
        
        // Revert visual changes
        const gameCanvas = document.getElementById('game-canvas');
        gameCanvas.classList.remove('shapeshifted');
        gameCanvas.style.removeProperty('--shapeshifted-color');
        
        this.shapeshiftingActive = false;
        this.currentForm = null;
    }

    showTransformationEffect() {
        if (!this.currentForm) return;
        
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create transformation flash
        const transformFlash = document.createElement('div');
        transformFlash.className = 'transform-flash';
        gameContainer.appendChild(transformFlash);
        
        // Remove after animation
        setTimeout(() => {
            transformFlash.remove();
        }, 1000);
        
        // Create animal silhouette near snake head
        if (this.game.snake.length > 0) {
            const head = this.game.snake[0];
            
            const silhouette = document.createElement('div');
            silhouette.className = 'animal-silhouette';
            silhouette.style.left = `${head.x * gridSize - gridSize}px`;
            silhouette.style.top = `${head.y * gridSize - gridSize}px`;
            silhouette.style.backgroundColor = this.currentForm.color;
            
            // Add animal icon based on form
            silhouette.textContent = this.currentForm.name === 'Wolf' ? '🐺' : 
                                    this.currentForm.name === 'Bear' ? '🐻' : '🦅';
            
            gameContainer.appendChild(silhouette);
            
            // Remove silhouette after animation
            setTimeout(() => {
                silhouette.classList.add('fade-out');
                setTimeout(() => {
                    silhouette.remove();
                }, 500);
            }, 2000);
        }
    }

    showAbilityNotification(formName, ability) {
        const notification = document.createElement('div');
        notification.className = 'form-notification';
        notification.innerHTML = `<strong>Transformed into ${formName}!</strong><br>${ability}`;
        
        document.querySelector('.game-container').appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    handleShapeshiftingCollision(head) {
        if (!this.shapeshiftingActive || !this.currentForm) return false;
        
        // Handle special collision abilities based on form
        if (this.currentForm.name === 'Bear') {
            // Bear can break through snake body once
            for (let i = 1; i < this.game.snake.length; i++) {
                if (head.x === this.game.snake[i].x && head.y === this.game.snake[i].y) {
                    // Remove this form ability after use
                    this.currentForm.ability = 'Strength - already used';
                    
                    // Create visual break effect
                    this.createBreakEffect(head.x, head.y);
                    
                    return true; // Prevent collision
                }
            }
        } else if (this.currentForm.name === 'Eagle') {
            // Eagle can pass through walls once
            if (head.x < 0 || head.x >= this.game.gridWidth || 
                head.y < 0 || head.y >= this.game.gridHeight) {
                
                // Wrap around
                if (head.x < 0) head.x = this.game.gridWidth - 1;
                if (head.y < 0) head.y = this.game.gridHeight - 1;
                if (head.x >= this.game.gridWidth) head.x = 0;
                if (head.y >= this.game.gridHeight) head.y = 0;
                
                // Remove this form ability after use
                this.currentForm.ability = 'Flight - already used';
                
                // Create flight effect
                this.createFlightEffect(head.x, head.y);
                
                return true; // Prevent collision
            }
        }
        
        return false;
    }

    createBreakEffect(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create crack effect
        const crackEffect = document.createElement('div');
        crackEffect.className = 'crack-effect';
        crackEffect.style.left = `${x * gridSize}px`;
        crackEffect.style.top = `${y * gridSize}px`;
        
        gameContainer.appendChild(crackEffect);
        
        // Remove after animation
        setTimeout(() => {
            crackEffect.remove();
        }, 1000);
    }

    createFlightEffect(x, y) {
        const gridSize = config.gridSize;
        const gameContainer = document.querySelector('.game-container');
        
        // Create flight effect
        const flightEffect = document.createElement('div');
        flightEffect.className = 'flight-effect';
        flightEffect.style.left = `${x * gridSize}px`;
        flightEffect.style.top = `${y * gridSize}px`;
        flightEffect.textContent = '✈️';
        
        gameContainer.appendChild(flightEffect);
        
        // Remove after animation
        setTimeout(() => {
            flightEffect.remove();
        }, 1000);
    }

    setupTimeManipulation() {
        this.timeManipulationActive = true;
        this.timeEffects = [];
        
        // Create various time manipulation effects
        // 1. Fast forward zones
        // 2. Time reversal zones
        // 3. Frozen moments
        
        // Add 1-2 of each effect type
        for (let i = 0; i < 2; i++) {
            // Fast forward
            this.timeEffects.push({
                type: 'fast-forward',
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: Math.floor(Math.random() * this.game.gridHeight),
                radius: 2 + Math.floor(Math.random() * 2),
                timeScale: 2.0, // 2x speed
                duration: 3000 + Math.floor(Math.random() * 2000)
            });
            
            // Time reversal
            this.timeEffects.push({
                type: 'reversal',
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: Math.floor(Math.random() * this.game.gridHeight),
                radius: 2 + Math.floor(Math.random() * 2),
                snapshots: [],
                maxSnapshots: 10,
                active: false,
                duration: 3000 + Math.floor(Math.random() * 2000)
            });
            
            // Frozen moment
            this.timeEffects.push({
                type: 'frozen',
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: Math.floor(Math.random() * this.game.gridHeight),
                radius: 2 + Math.floor(Math.random() * 2),
                active: false,
                duration: 2000 + Math.floor(Math.random() * 1000)
            });
        }
        
        setTimeout(() => {
            this.timeManipulationActive = false;
            this.timeEffects = [];
        }, config.powerUpDuration);
    }

    updateTimeEffects() {
        if (!this.timeManipulationActive) return;
        
        // Check if snake is in any time effect zone
        if (this.game.snake.length > 0) {
            const head = this.game.snake[0];
            
            for (const effect of this.timeEffects) {
                const dx = head.x - effect.x;
                const dy = head.y - effect.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= effect.radius) {
                    // Apply effect based on type
                    switch (effect.type) {
                        case 'fast-forward':
                            this.applyFastForwardEffect(effect);
                            break;
                        case 'reversal':
                            this.applyTimeReversalEffect(effect);
                            break;
                        case 'frozen':
                            this.applyFrozenMomentEffect(effect);
                            break;
                    }
                    break;
                }
            }
        }
        
        // Store snapshots for reversal zones
        for (const effect of this.timeEffects) {
            if (effect.type === 'reversal' && !effect.active) {
                // Store current game state
                if (effect.snapshots.length >= effect.maxSnapshots) {
                    effect.snapshots.shift(); // Remove oldest
                }
                
                // Clone current snake
                const snakeClone = this.game.snake.map(segment => ({...segment}));
                
                effect.snapshots.push({
                    snake: snakeClone,
                    time: Date.now()
                });
            }
        }
    }

    applyFastForwardEffect(effect) {
        // Temporarily speed up the game
        const originalSpeed = this.game.speed;
        this.game.speed = originalSpeed / effect.timeScale;
        
        // Add visual indicator
        document.getElementById('game-canvas').classList.add('fast-forward-effect');
        
        // Schedule return to normal speed
        setTimeout(() => {
            this.game.speed = originalSpeed;
            document.getElementById('game-canvas').classList.remove('fast-forward-effect');
        }, 1000);
    }

    applyTimeReversalEffect(effect) {
        if (effect.active || effect.snapshots.length === 0) return;
        
        effect.active = true;
        
        // Add visual indicator
        document.getElementById('game-canvas').classList.add('time-reversal-effect');
        
        // Schedule time reversal playback
        setTimeout(() => {
            // Play snapshots in reverse order
            const playReverseInterval = setInterval(() => {
                if (effect.snapshots.length > 0) {
                    const snapshot = effect.snapshots.pop();
                    this.game.snake = snapshot.snake;
                } else {
                    clearInterval(playReverseInterval);
                    document.getElementById('game-canvas').classList.remove('time-reversal-effect');
                    effect.active = false;
                }
            }, 100);
            
            // Ensure cleanup if snapshots are exhausted
            setTimeout(() => {
                clearInterval(playReverseInterval);
                document.getElementById('game-canvas').classList.remove('time-reversal-effect');
                effect.active = false;
            }, effect.duration);
            
        }, 500);
    }

    applyFrozenMomentEffect(effect) {
        if (effect.active) return;
        
        effect.active = true;
        
        // Pause the game temporarily
        const wasPaused = this.game.paused;
        this.game.paused = true;
        
        // Add visual indicator
        document.getElementById('game-canvas').classList.add('time-frozen-effect');
        
        // Show frozen time indicator
        const frozenIndicator = document.createElement('div');
        frozenIndicator.className = 'frozen-time-indicator';
        frozenIndicator.textContent = 'TIME FROZEN';
        document.querySelector('.game-container').appendChild(frozenIndicator);
        
        // Resume after duration
        setTimeout(() => {
            this.game.paused = wasPaused;
            document.getElementById('game-canvas').classList.remove('time-frozen-effect');
            frozenIndicator.remove();
            effect.active = false;
        }, effect.duration);
    }

    update() {
        if (this.fairyDustActive) {
            this.spawnFairyDustParticles();
        }
        
        if (this.necromancyActive) {
            this.updateUndeadSnake();
        }
        
        if (this.timeManipulationActive) {
            this.updateTimeEffects();
        }
    }

    draw(ctx, gridSize) {
        this.drawFairyDust(ctx, gridSize);
        this.drawUndeadSnake(ctx, gridSize);
        this.drawShapeshiftedSnake(ctx, gridSize);
        this.drawTimeEffects(ctx, gridSize);
    }

    drawFairyDust(ctx, gridSize) {
        if (!this.fairyDustActive) return;
        
        // Draw fairy dust particles
        for (const particle of this.fairyDustParticles) {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / 40; // Fade out over time
            
            ctx.beginPath();
            ctx.arc(
                particle.x * gridSize + gridSize / 2,
                particle.y * gridSize + gridSize / 2,
                particle.size * gridSize / 2,
                0, Math.PI * 2
            );
            ctx.fill();
        }
        
        ctx.globalAlpha = 1.0;
    }

    drawUndeadSnake(ctx, gridSize) {
        if (!this.necromancyActive || this.undeadSnake.length === 0) return;
        
        // Draw undead snake with skeletal appearance
        this.undeadSnake.forEach((segment, index) => {
            // Base color - pale/bone white with blue glow
            ctx.fillStyle = index === 0 ? '#add8e6' : '#f0f0f0';
            ctx.globalAlpha = 0.7;
            
            // Draw base segment
            ctx.fillRect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize,
                gridSize
            );
            
            // Draw skull pattern for head or bone pattern for body
            ctx.fillStyle = '#000000';
            ctx.globalAlpha = 0.4;
            
            if (index === 0) {
                // Skull eyes for head
                const eyeSize = gridSize / 5;
                const offset = gridSize / 3;
                
                ctx.beginPath();
                ctx.arc(
                    segment.x * gridSize + offset,
                    segment.y * gridSize + offset,
                    eyeSize, 0, Math.PI * 2
                );
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(
                    segment.x * gridSize + gridSize - offset,
                    segment.y * gridSize + offset,
                    eyeSize, 0, Math.PI * 2
                );
                ctx.fill();
                
                // Jaw line
                ctx.beginPath();
                ctx.moveTo(segment.x * gridSize + offset, segment.y * gridSize + gridSize * 0.7);
                ctx.lineTo(segment.x * gridSize + gridSize - offset, segment.y * gridSize + gridSize * 0.7);
                ctx.lineWidth = 1;
                ctx.stroke();
            } else {
                // Bone pattern for body
                ctx.beginPath();
                ctx.moveTo(segment.x * gridSize, segment.y * gridSize + gridSize / 2);
                ctx.lineTo(segment.x * gridSize + gridSize, segment.y * gridSize + gridSize / 2);
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(segment.x * gridSize + gridSize / 2, segment.y * gridSize);
                ctx.lineTo(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize);
                ctx.stroke();
            }
        });
        
        ctx.globalAlpha = 1.0;
    }

    drawShapeshiftedSnake(ctx, gridSize) {
        if (!this.shapeshiftingActive || !this.currentForm || this.game.snake.length === 0) return;
        
        // The actual rendering of shapeshifted snake is handled through CSS
        // This function adds extra visual effects
        
        const head = this.game.snake[0];
        
        // Draw animal features on the snake head
        ctx.save();
        
        // Draw based on current form
        if (this.currentForm.name === 'Wolf') {
            // Wolf ears
            ctx.fillStyle = this.currentForm.color;
            
            // Left ear
            ctx.beginPath();
            ctx.moveTo(head.x * gridSize, head.y * gridSize);
            ctx.lineTo(head.x * gridSize + gridSize/3, head.y * gridSize - gridSize/2);
            ctx.lineTo(head.x * gridSize + gridSize/2, head.y * gridSize);
            ctx.fill();
            
            // Right ear
            ctx.beginPath();
            ctx.moveTo(head.x * gridSize + gridSize, head.y * gridSize);
            ctx.lineTo(head.x * gridSize + gridSize - gridSize/3, head.y * gridSize - gridSize/2);
            ctx.lineTo(head.x * gridSize + gridSize/2, head.y * gridSize);
            ctx.fill();
            
        } else if (this.currentForm.name === 'Bear') {
            // Bear ears (rounder)
            ctx.fillStyle = this.currentForm.color;
            
            // Left ear
            ctx.beginPath();
            ctx.arc(
                head.x * gridSize + gridSize/4,
                head.y * gridSize - gridSize/4,
                gridSize/4,
                0, Math.PI * 2
            );
            ctx.fill();
            
            // Right ear
            ctx.beginPath();
            ctx.arc(
                head.x * gridSize + gridSize - gridSize/4,
                head.y * gridSize - gridSize/4,
                gridSize/4,
                0, Math.PI * 2
            );
            ctx.fill();
            
        } else if (this.currentForm.name === 'Eagle') {
            // Eagle beak
            ctx.fillStyle = '#FFD700'; // Gold
            
            // Direction-based beak
            const direction = this.game.direction;
            let beakX = head.x * gridSize + gridSize/2;
            let beakY = head.y * gridSize + gridSize/2;
            
            ctx.beginPath();
            if (direction === 'up') {
                ctx.moveTo(beakX - gridSize/4, beakY - gridSize/4);
                ctx.lineTo(beakX, beakY - gridSize/2);
                ctx.lineTo(beakX + gridSize/4, beakY - gridSize/4);
            } else if (direction === 'down') {
                ctx.moveTo(beakX - gridSize/4, beakY + gridSize/4);
                ctx.lineTo(beakX, beakY + gridSize/2);
                ctx.lineTo(beakX + gridSize/4, beakY + gridSize/4);
            } else if (direction === 'left') {
                ctx.moveTo(beakX - gridSize/4, beakY - gridSize/4);
                ctx.lineTo(beakX - gridSize/2, beakY);
                ctx.lineTo(beakX - gridSize/4, beakY + gridSize/4);
            } else { // right
                ctx.moveTo(beakX + gridSize/4, beakY - gridSize/4);
                ctx.lineTo(beakX + gridSize/2, beakY);
                ctx.lineTo(beakX + gridSize/4, beakY + gridSize/4);
            }
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawTimeEffects(ctx, gridSize) {
        if (!this.timeManipulationActive) return;
        
        // Draw each time effect zone
        for (const effect of this.timeEffects) {
            const x = effect.x * gridSize + gridSize / 2;
            const y = effect.y * gridSize + gridSize / 2;
            const radius = effect.radius * gridSize;
            
            // Draw based on effect type
            if (effect.type === 'fast-forward') {
                // Fast forward zone
                const gradient = ctx.createRadialGradient(
                    x, y, 0,
                    x, y, radius
                );
                
                gradient.addColorStop(0, 'rgba(255, 128, 0, 0.7)');
                gradient.addColorStop(0.7, 'rgba(255, 128, 0, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 128, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw fast forward symbol
                ctx.fillStyle = 'white';
                ctx.font = `${gridSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('»', x, y);
                
            } else if (effect.type === 'reversal') {
                // Time reversal zone
                const gradient = ctx.createRadialGradient(
                    x, y, 0,
                    x, y, radius
                );
                
                gradient.addColorStop(0, 'rgba(0, 128, 255, 0.7)');
                gradient.addColorStop(0.7, 'rgba(0, 128, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(0, 128, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw clockwise arrow
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, radius * 0.5, 0, 1.5 * Math.PI);
                ctx.stroke();
                
                // Draw arrowhead
                ctx.beginPath();
                ctx.moveTo(x, y - radius * 0.5);
                ctx.lineTo(x - radius * 0.2, y - radius * 0.3);
                ctx.lineTo(x, y - radius * 0.7);
                ctx.closePath();
                ctx.fillStyle = 'white';
                ctx.fill();
                
            } else if (effect.type === 'frozen') {
                // Frozen moment zone
                const gradient = ctx.createRadialGradient(
                    x, y, 0,
                    x, y, radius
                );
                
                gradient.addColorStop(0, 'rgba(0, 255, 255, 0.7)');
                gradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw snowflake symbol
                ctx.fillStyle = 'white';
                ctx.font = `${gridSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('❄', x, y);
            }
        }
    }
}