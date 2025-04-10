// New file for autoplay functionality
import config from 'config';

export class AutoplayManager {
    constructor(game) {
        this.game = game;
        this.isAutoplaying = false;
        this.thinkingInterval = 100; // ms between AI decisions
        this.thinkingTimer = null;
    }
    
    toggleAutoplay() {
        this.isAutoplaying = !this.isAutoplaying;
        
        if (this.isAutoplaying) {
            this.startAutoplay();
        } else {
            this.stopAutoplay();
        }
        
        return this.isAutoplaying;
    }
    
    startAutoplay() {
        // Start the game if it's paused
        if (this.game.paused && !this.game.gameOver) {
            this.game.togglePause();
        } else if (this.game.gameOver) {
            this.game.reset();
            this.game.togglePause();
        }
        
        // Start the AI thinking process
        this.thinkingTimer = setInterval(() => this.makeDecision(), this.thinkingInterval);
    }
    
    stopAutoplay() {
        if (this.thinkingTimer) {
            clearInterval(this.thinkingTimer);
            this.thinkingTimer = null;
        }
    }
    
    makeDecision() {
        if (this.game.paused || this.game.gameOver) {
            if (this.game.gameOver) {
                // Restart the game if it's game over
                this.game.reset();
                this.game.togglePause();
            }
            return;
        }
        
        const head = this.game.snake[0];
        const nextMove = this.calculateBestMove(head);
        
        if (nextMove) {
            this.game.changeDirection(nextMove);
        }
    }
    
    calculateBestMove(head) {
        // Find the closest food
        let closestFood = null;
        let minDistance = Infinity;
        
        for (const food of this.game.foods) {
            const distance = Math.abs(food.x - head.x) + Math.abs(food.y - head.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestFood = food;
            }
        }
        
        if (!closestFood) return null;
        
        // Calculate possible moves and their safety
        const possibleMoves = this.getSafeMoves(head);
        if (possibleMoves.length === 0) return null;
        
        // Find the best move to get closer to food
        let bestMove = null;
        let bestScore = Infinity;
        
        for (const move of possibleMoves) {
            const nextPos = this.getNextPosition(head, move);
            const distance = Math.abs(closestFood.x - nextPos.x) + Math.abs(closestFood.y - nextPos.y);
            
            // Avoid getting too close to walls unless necessary
            const wallPenalty = this.calculateWallPenalty(nextPos);
            const score = distance + wallPenalty;
            
            if (score < bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
    
    getSafeMoves(head) {
        const moves = ['up', 'down', 'left', 'right'];
        const safeMoves = [];
        
        // Filter out the opposite of current direction
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        const currentDirection = this.game.direction;
        
        for (const move of moves) {
            // Skip the opposite direction
            if (move === opposites[currentDirection]) continue;
            
            const nextPos = this.getNextPosition(head, move);
            
            // Check if the move is safe
            if (this.isSafeMove(nextPos)) {
                safeMoves.push(move);
            }
        }
        
        return safeMoves;
    }
    
    getNextPosition(head, direction) {
        const nextPos = { x: head.x, y: head.y };
        
        switch (direction) {
            case 'up':
                nextPos.y--;
                break;
            case 'down':
                nextPos.y++;
                break;
            case 'left':
                nextPos.x--;
                break;
            case 'right':
                nextPos.x++;
                break;
        }
        
        return nextPos;
    }
    
    isSafeMove(pos) {
        const ghostMode = this.game.powerUpManager.getActivePowerUps().includes('Ghost Mode');
        const phasingActive = this.game.advancedPowerUpManager.phasingActive;
        
        // Check for wall collisions if not in ghost mode or phasing
        if (!ghostMode && !phasingActive) {
            if (pos.x < 0 || pos.x >= this.game.gridWidth || 
                pos.y < 0 || pos.y >= this.game.gridHeight) {
                return false;
            }
        }
        
        // Check for snake body collisions
        for (let i = 1; i < this.game.snake.length; i++) {
            if (pos.x === this.game.snake[i].x && pos.y === this.game.snake[i].y) {
                // If ghost mode or phasing, we can pass through the snake
                if (ghostMode || phasingActive) return true;
                return false;
            }
        }
        
        return true;
    }
    
    calculateWallPenalty(pos) {
        // Add a small penalty for positions near walls
        let penalty = 0;
        
        if (pos.x <= 1 || pos.x >= this.game.gridWidth - 2) {
            penalty += 1;
        }
        
        if (pos.y <= 1 || pos.y >= this.game.gridHeight - 2) {
            penalty += 1;
        }
        
        return penalty;
    }
}