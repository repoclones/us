// New file to handle rendering logic
import config from 'config';
import { PowerUpVisuals } from './powerup-visuals.js';

export class GameRenderer {
    constructor(game, canvas, ctx) {
        this.game = game;
        this.canvas = canvas;
        this.ctx = ctx;
        this.powerUpVisuals = new PowerUpVisuals(ctx);
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw cosmic power-up effects if active
        if (this.game.cosmicPowerUpManager) {
            this.game.cosmicPowerUpManager.draw(this.ctx, config.gridSize);
        }
        
        // Draw gravity well if active
        if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.gravityWellPos) {
            this.game.advancedPowerUpManager.drawGravityWell(this.ctx, config.gridSize);
        }
        
        // Draw neon trail if active
        if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.neonTrailPositions.length > 0) {
            this.game.advancedPowerUpManager.drawNeonTrail(this.ctx, config.gridSize);
        }
        
        // Draw Advanced PowerUp Extensions
        if (this.game.advancedPowerUpExtensions) {
            this.game.advancedPowerUpExtensions.draw(this.ctx, config.gridSize);
        }
        
        // Draw portals if Portal Snake is active
        if (this.game.powerUpManager.getActivePowerUps().includes('Portal Snake')) {
            this.drawPortals();
        }
        
        // Draw dimension power-up effects
        if (this.game.dimensionPowerUpManager) {
            this.game.dimensionPowerUpManager.draw(this.ctx, config.gridSize);
        }
        
        // Draw snake
        if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.shapeShifterActive) {
            this.game.advancedPowerUpManager.drawShapeShifterSnake(
                this.ctx,
                this.game.snake,
                config.gridSize
            );
        } else if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.phasingActive) {
            this.game.advancedPowerUpManager.drawPhasingSnake(
                this.ctx,
                this.game.snake,
                config.gridSize
            );
        } else {
            this.drawSnake();
        }
        
        // Draw mirrored snake if in mirror mode
        if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.mirrorMode) {
            this.game.advancedPowerUpManager.drawMirroredSnake(
                this.ctx, 
                this.game.snake, 
                config.gridSize
            );
        }
        
        // Draw food items
        this.drawFood();
        
        // Draw frozen entities if time freeze is active
        if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.timeFrozen) {
            this.game.advancedPowerUpManager.drawFrozenEntities(this.ctx, config.gridSize);
        }
        
        // Draw target lock indicator
        if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.targetedFood) {
            this.game.advancedPowerUpManager.drawTargetLock(this.ctx, config.gridSize);
        }
        
        // Draw laser beams
        if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.laserBeams.length > 0) {
            this.game.advancedPowerUpManager.drawLasers(this.ctx, config.gridSize);
        }
        
        // Draw bomb timer if active
        if (this.game.advancedPowerUpManager && this.game.advancedPowerUpManager.bombTime) {
            this.game.advancedPowerUpManager.drawBombTimer(this.ctx);
        }
        
        // Draw super power-up elements if active
        if (this.game.superPowerUpManager) {
            this.game.superPowerUpManager.draw(this.ctx, config.gridSize);
        }
        
        // Draw game over text
        if (this.game.gameOver) {
            this.drawGameOverScreen();
        }
    }
    
    drawSnake() {
        const activePowerUps = this.game.powerUpManager.getActivePowerUps();
        const isInvisible = activePowerUps.includes('Invisible Snake');
        
        this.game.snake.forEach((segment, index) => {
            // Skip drawing if snake is invisible and not the head
            if (isInvisible && index > 0) return;
            
            // Set fill color
            if (this.game.customSnakeColors && this.game.customSnakeColors[index]) {
                this.ctx.fillStyle = this.game.customSnakeColors[index];
            } else {
                this.ctx.fillStyle = index === 0 ? config.snakeHeadColor : config.snakeColor;
            }
            
            // Make snake semi-transparent if Ghost Mode is active
            if (activePowerUps.includes('Ghost Mode')) {
                this.ctx.globalAlpha = 0.7;
            }
            
            // Make head more visible if invisible power-up is active
            if (isInvisible && index === 0) {
                this.ctx.globalAlpha = 0.5;
            }
            
            this.ctx.fillRect(
                segment.x * config.gridSize,
                segment.y * config.gridSize,
                config.gridSize,
                config.gridSize
            );
            
            // Reset transparency
            this.ctx.globalAlpha = 1;
            
            // Draw a small border to separate segments
            this.ctx.strokeStyle = '#e8e8e8';
            this.ctx.strokeRect(
                segment.x * config.gridSize,
                segment.y * config.gridSize,
                config.gridSize,
                config.gridSize
            );
        });
    }
    
    drawFood() {
        this.game.foods.forEach(food => {
            // Check if it's a treasure in treasure mode
            if (this.game.advancedPowerUpManager && 
                this.game.advancedPowerUpManager.treasureMode && 
                food.isTreasure) {
                
                const treasureDrawn = this.game.advancedPowerUpManager.drawTreasure(
                    this.ctx, food, config.gridSize
                );
                
                if (treasureDrawn) return;
            }
            
            // Draw with enhanced power-up visuals if it's not a regular food
            if (food.type.name !== 'Regular') {
                const x = food.x * config.gridSize;
                const y = food.y * config.gridSize;
                const effectDrawn = this.powerUpVisuals.drawPowerUpFood(food, x, y, config.gridSize);
                if (effectDrawn) return;
            }
            
            // Normal food drawing (fallback)
            this.ctx.fillStyle = food.type.color;
            this.ctx.beginPath();
            this.ctx.arc(
                food.x * config.gridSize + config.gridSize / 2,
                food.y * config.gridSize + config.gridSize / 2,
                config.gridSize / 2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Add a glow effect for power-up foods
            if (food.type.name !== 'Regular') {
                this.ctx.shadowColor = food.type.color;
                this.ctx.shadowBlur = 10;
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }
            
            // Draw expiration timer if food is expiring
            if (food.freshness !== undefined && food.freshness < 1.0) {
                this.drawExpirationTimer(food, config.gridSize);
            }
        });
    }
    
    drawExpirationTimer(food, gridSize) {
        const x = food.x * gridSize;
        const y = food.y * gridSize;
        const centerX = x + gridSize / 2;
        const centerY = y + gridSize / 2;
        const radius = gridSize / 2;
        
        // Draw countdown arc
        this.ctx.beginPath();
        this.ctx.arc(
            centerX, centerY, radius + 2,
            -Math.PI / 2, // Start at top
            -Math.PI / 2 + (1 - food.freshness) * 2 * Math.PI, // End based on remaining time
            false
        );
        
        // Color changes from green to yellow to red as food expires
        let timerColor;
        if (food.freshness > 0.6) {
            timerColor = 'rgba(0, 255, 0, 0.7)'; // Green
        } else if (food.freshness > 0.3) {
            timerColor = 'rgba(255, 255, 0, 0.7)'; // Yellow
        } else {
            timerColor = 'rgba(255, 0, 0, 0.7)'; // Red
        }
        
        this.ctx.strokeStyle = timerColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Add pulsing effect when nearly expired
        if (food.freshness < 0.2) {
            this.ctx.globalAlpha = 0.5 + (Math.sin(Date.now() / 100) * 0.5);
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
        }
    }
    
    drawPortals() {
        for (const portal of this.game.powerUpManager.portalPairs) {
            // Draw entry portal
            this.drawPortal(portal.entry, portal.color, true);
            
            // Draw exit portal
            this.drawPortal(portal.exit, portal.color, false);
        }
    }
    
    drawPortal(position, color, isEntry) {
        this.ctx.beginPath();
        this.ctx.arc(
            position.x * config.gridSize + config.gridSize / 2,
            position.y * config.gridSize + config.gridSize / 2,
            config.gridSize / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        // Inner ring for exit portal
        if (!isEntry) {
            this.ctx.beginPath();
            this.ctx.arc(
                position.x * config.gridSize + config.gridSize / 2,
                position.y * config.gridSize + config.gridSize / 2,
                config.gridSize / 4,
                0,
                Math.PI * 2
            );
            this.ctx.fillStyle = '#fff';
            this.ctx.fill();
        }
    }
    
    drawActivePowerUps() {
        // Function is no longer needed as we're using the sidebar
        // Active power-ups are now displayed in the sidebar
    }
    
    drawGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            'Game Over!',
            this.canvas.width / 2,
            this.canvas.height / 2 - 20
        );
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText(
            `Score: ${this.game.score}`,
            this.canvas.width / 2,
            this.canvas.height / 2 + 20
        );
    }
    
    drawGrid() {
        this.ctx.strokeStyle = config.gridColor;
        this.ctx.lineWidth = 0.5;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
}