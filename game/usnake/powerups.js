// New file to handle power-up functionality
import config from 'config';

export class PowerUpManager {
    constructor(game) {
        this.game = game;
        this.activePowerUps = [];
        this.powerUpTimers = [];
        this.rainbowInterval = null;
        this.portalPairs = [];
    }
    
    getActivePowerUps() {
        return this.activePowerUps;
    }
    
    clearAllPowerUps() {
        this.activePowerUps = [];
        this.powerUpTimers.forEach(timer => clearTimeout(timer));
        this.powerUpTimers = [];
        
        if (this.rainbowInterval) {
            clearInterval(this.rainbowInterval);
            this.rainbowInterval = null;
        }
        
        this.portalPairs = [];
    }
    
    applyPowerUp(powerUpName) {
        // Add to active power-ups
        if (!this.activePowerUps.includes(powerUpName)) {
            this.activePowerUps.push(powerUpName);
            
            // Show power-up message
            this.showPowerUpMessage(powerUpName);
            
            // Handle special power-up initialization
            this.handleSpecialPowerUp(powerUpName);
            
            // Set a timer to remove the power-up after duration
            const timer = setTimeout(() => {
                this.removePowerUp(powerUpName);
            }, config.powerUpDuration);
            
            this.powerUpTimers.push(timer);
            
            // Mark the power-up as discovered
            const powerUpType = config.foodTypes.find(type => type.name === powerUpName);
            if (powerUpType && !powerUpType.discovered) {
                powerUpType.discovered = true;
                this.game.updatePowerUpLegend();
                this.game.saveDiscoveredPowerUps();
            }
        }
    }
    
    removePowerUp(powerUpName) {
        this.activePowerUps = this.activePowerUps.filter(p => p !== powerUpName);
        
        // Clean up special power-up effects
        if (powerUpName === 'Rainbow Snake' && this.rainbowInterval) {
            clearInterval(this.rainbowInterval);
            this.rainbowInterval = null;
            this.game.customSnakeColors = null;
        }
        
        if (powerUpName === 'Portal Snake') {
            this.portalPairs = [];
        }
    }
    
    handleSpecialPowerUp(powerUpName) {
        switch (powerUpName) {
            case 'Rainbow Snake':
                this.setupRainbowSnake();
                break;
            case 'Portal Snake':
                this.setupPortals();
                break;
            case 'Teleportation':
                // Will be handled on next move
                break;
        }
    }
    
    setupRainbowSnake() {
        const colors = [
            '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', 
            '#0000FF', '#4B0082', '#9400D3'
        ];
        let colorIndex = 0;
        
        this.game.customSnakeColors = [];
        
        this.rainbowInterval = setInterval(() => {
            this.game.customSnakeColors = [];
            for (let i = 0; i < this.game.snake.length; i++) {
                const currentIndex = (colorIndex + i) % colors.length;
                this.game.customSnakeColors.push(colors[currentIndex]);
            }
            colorIndex = (colorIndex + 1) % colors.length;
        }, config.rainbowInterval);
    }
    
    setupPortals() {
        // Create two random portal pairs
        this.portalPairs = [];
        
        for (let i = 0; i < 2; i++) {
            // Create entry portal
            let entryPortal;
            do {
                entryPortal = {
                    x: Math.floor(Math.random() * this.game.gridWidth),
                    y: Math.floor(Math.random() * this.game.gridHeight)
                };
            } while (this.game.isPositionOccupied(entryPortal));
            
            // Create exit portal
            let exitPortal;
            do {
                exitPortal = {
                    x: Math.floor(Math.random() * this.game.gridWidth),
                    y: Math.floor(Math.random() * this.game.gridHeight)
                };
            } while (
                this.game.isPositionOccupied(exitPortal) || 
                (entryPortal.x === exitPortal.x && entryPortal.y === exitPortal.y)
            );
            
            this.portalPairs.push({
                entry: entryPortal,
                exit: exitPortal,
                color: i === 0 ? '#E91E63' : '#9C27B0'
            });
        }
        
        // Set timeout to remove portals
        setTimeout(() => {
            this.portalPairs = [];
        }, config.portalDuration);
    }
    
    checkPortalCollision(head) {
        for (const portal of this.portalPairs) {
            if (head.x === portal.entry.x && head.y === portal.entry.y) {
                // Teleport to exit portal
                return { x: portal.exit.x, y: portal.exit.y };
            }
        }
        return null;
    }
    
    magnetAttractFood() {
        if (!this.activePowerUps.includes('Magnet Food')) return;
        
        const head = this.game.snake[0];
        
        for (let i = 0; i < this.game.foods.length; i++) {
            const food = this.game.foods[i];
            const dx = head.x - food.x;
            const dy = head.y - food.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= config.magnetRadius) {
                // Move food one cell closer to snake
                if (Math.abs(dx) > Math.abs(dy)) {
                    food.x += dx > 0 ? 1 : -1;
                } else {
                    food.y += dy > 0 ? 1 : -1;
                }
                
                // Ensure food remains within bounds
                food.x = Math.max(0, Math.min(this.game.gridWidth - 1, food.x));
                food.y = Math.max(0, Math.min(this.game.gridHeight - 1, food.y));
            }
        }
    }
    
    executeTeleportation() {
        if (!this.activePowerUps.includes('Teleportation')) return null;
        
        // Random teleportation in a safe spot within a certain distance
        const head = this.game.snake[0];
        const distance = config.teleportDistance;
        
        // Try to find a safe spot for teleportation
        for (let attempts = 0; attempts < 20; attempts++) {
            const newX = head.x + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
            const newY = head.y + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
            
            // Ensure within grid bounds
            if (newX >= 0 && newX < this.game.gridWidth && 
                newY >= 0 && newY < this.game.gridHeight) {
                
                // Check if position is safe (not on snake)
                let safe = true;
                for (let i = 1; i < this.game.snake.length; i++) {
                    if (this.game.snake[i].x === newX && this.game.snake[i].y === newY) {
                        safe = false;
                        break;
                    }
                }
                
                if (safe) {
                    return { x: newX, y: newY };
                }
            }
        }
        
        return null; // Failed to find a safe spot
    }
    
    showPowerUpMessage(powerUpName) {
        const messageElement = document.createElement('div');
        messageElement.className = 'power-up-message';
        messageElement.textContent = `Power-up: ${powerUpName}`;
        
        // Add styles based on power-up
        const colorMap = {
            'Speed Boost': '#2196F3',
            'Double Points': '#FFC107',
            'Ghost Mode': '#9C27B0',
            'Size Reduce': '#00BCD4',
            'Reverse Controls': '#795548',
            'Slow Motion': '#FF9800',
            'Portal Snake': '#E91E63',
            'Magnet Food': '#4CAF50',
            'Invisible Snake': '#9E9E9E',
            'Rainbow Snake': '#FFEB3B',
            'Teleportation': '#607D8B',
            'Laser Snake': '#FF5722',
            'Bomb Time': '#FF1744',
            'Mirror World': '#6495ED',
            'Target Lock': '#F44336',
            'Growth Boost': '#76FF03',
            'Time Warp': '#18FFFF',
            'Gravity Well': '#9C27B0'
        };
        
        messageElement.style.backgroundColor = colorMap[powerUpName] || '#333';
        
        document.querySelector('.game-container').appendChild(messageElement);
        
        // Update the active power-ups in the sidebar
        this.game.updatePowerUpLegend();
        
        // Remove after animation
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, 2000);
        
        // Flash the power-up in the legend if it's newly discovered
        if (config.flashingEnabled) {
            this.flashPowerUpInLegend(powerUpName);
        }
    }
    
    flashPowerUpInLegend(powerUpName) {
        const legendItems = document.querySelectorAll('.legend ul li');
        const powerUpIndex = config.foodTypes.findIndex(type => type.name === powerUpName);
        
        if (powerUpIndex >= 0 && powerUpIndex < legendItems.length) {
            const item = legendItems[powerUpIndex];
            
            // Add flashing class
            item.classList.add('power-up-flash');
            
            // Remove flashing after duration
            setTimeout(() => {
                item.classList.remove('power-up-flash');
            }, config.flashDuration);
        }
    }
}