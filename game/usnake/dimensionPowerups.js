// New file for dimension-based power-up functionality
import config from 'config';

export class DimensionPowerUpManager {
    constructor(game) {
        this.game = game;
        this.mirrorDimensionActive = false;
        this.mirrorAxis = null;
        this.timeLoopActive = false;
        this.timeLoopSnapshots = [];
        this.voidZonesActive = false;
        this.voidZones = [];
        this.spatialFoldActive = false;
        this.foldPortals = [];
        this.realityFragmentsActive = false;
        this.fragments = [];
        this.infinityLoopActive = false;
        this.quantumStateActive = false;
        this.quantumStates = [];
    }
    
    applyDimensionPowerUp(powerUpName) {
        switch (powerUpName) {
            case 'Mirror Dimension':
                this.setupMirrorDimension();
                break;
            case 'Time Loop':
                this.setupTimeLoop();
                break;
            case 'Void Zones':
                this.setupVoidZones();
                break;
            case 'Spatial Fold':
                this.setupSpatialFold();
                break;
            case 'Reality Fragments':
                this.setupRealityFragments();
                break;
            case 'Infinity Loop':
                this.setupInfinityLoop();
                break;
            case 'Quantum State':
                this.setupQuantumState();
                break;
        }
    }
    
    setupMirrorDimension() {
        this.mirrorDimensionActive = true;
        // Choose random axis (horizontal or vertical)
        this.mirrorAxis = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        
        // Apply visual effect
        document.getElementById('game-canvas').classList.add('mirror-dimension');
        
        setTimeout(() => {
            this.mirrorDimensionActive = false;
            this.mirrorAxis = null;
            document.getElementById('game-canvas').classList.remove('mirror-dimension');
        }, config.powerUpDuration);
    }
    
    getMirroredPosition(position) {
        if (!this.mirrorDimensionActive || !this.mirrorAxis) return null;
        
        const mirroredPos = {...position};
        
        if (this.mirrorAxis === 'horizontal') {
            // Mirror across the horizontal middle line
            const middleY = Math.floor(this.game.gridHeight / 2);
            mirroredPos.y = 2 * middleY - position.y;
        } else {
            // Mirror across the vertical middle line
            const middleX = Math.floor(this.game.gridWidth / 2);
            mirroredPos.x = 2 * middleX - position.x;
        }
        
        return mirroredPos;
    }
    
    setupTimeLoop() {
        this.timeLoopActive = true;
        this.timeLoopSnapshots = [];
        
        // Store current snake state
        this.storeTimeSnapshot();
        
        // Set interval to store snapshots
        this.timeLoopInterval = setInterval(() => {
            this.storeTimeSnapshot();
        }, 1000);
        
        setTimeout(() => {
            clearInterval(this.timeLoopInterval);
            this.timeLoopActive = false;
            
            // Apply the time loop effect (return to previous position)
            if (this.timeLoopSnapshots.length > 0) {
                const oldestSnapshot = this.timeLoopSnapshots[0];
                this.game.snake = [...oldestSnapshot.snake];
            }
            
            this.timeLoopSnapshots = [];
        }, config.powerUpDuration);
    }
    
    storeTimeSnapshot() {
        // Clone the current snake
        const snakeClone = this.game.snake.map(segment => ({...segment}));
        
        // Store snapshot
        this.timeLoopSnapshots.push({
            snake: snakeClone,
            time: Date.now()
        });
        
        // Keep only the last 10 snapshots
        if (this.timeLoopSnapshots.length > 10) {
            this.timeLoopSnapshots.shift();
        }
    }
    
    setupVoidZones() {
        this.voidZonesActive = true;
        this.voidZones = [];
        
        // Create 3-5 void zones
        const numberOfZones = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < numberOfZones; i++) {
            const zone = {
                x: Math.floor(Math.random() * this.game.gridWidth),
                y: Math.floor(Math.random() * this.game.gridHeight),
                radius: Math.floor(Math.random() * 2) + 2, // 2-3 cell radius
                pulseRate: 0.5 + Math.random(), // Different pulse rates for each zone
                opacity: 0.7
            };
            
            this.voidZones.push(zone);
        }
        
        setTimeout(() => {
            this.voidZonesActive = false;
            this.voidZones = [];
        }, config.powerUpDuration);
    }
    
    isInVoidZone(position) {
        if (!this.voidZonesActive) return false;
        
        for (const zone of this.voidZones) {
            const dx = position.x - zone.x;
            const dy = position.y - zone.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= zone.radius) {
                return true;
            }
        }
        
        return false;
    }
    
    setupSpatialFold() {
        this.spatialFoldActive = true;
        this.foldPortals = [];
        
        // Create connected "fold pairs" across the grid
        const numFolds = Math.floor(Math.random() * 2) + 2; // 2-3 fold pairs
        
        for (let i = 0; i < numFolds; i++) {
            // Create two connected points
            let point1, point2;
            
            do {
                point1 = {
                    x: Math.floor(Math.random() * this.game.gridWidth),
                    y: Math.floor(Math.random() * this.game.gridHeight)
                };
                
                // Choose second point at least 5 cells away
                do {
                    point2 = {
                        x: Math.floor(Math.random() * this.game.gridWidth),
                        y: Math.floor(Math.random() * this.game.gridHeight)
                    };
                    
                    const dx = point1.x - point2.x;
                    const dy = point1.y - point2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance >= 5) break;
                } while (true);
                
            } while (
                this.game.isPositionOccupied(point1) || 
                this.game.isPositionOccupied(point2)
            );
            
            // Add fold pair to list
            this.foldPortals.push({
                point1,
                point2,
                color: `hsl(${i * 120}, 70%, 60%)`
            });
        }
        
        setTimeout(() => {
            this.spatialFoldActive = false;
            this.foldPortals = [];
        }, config.powerUpDuration);
    }
    
    checkSpatialFold(position) {
        if (!this.spatialFoldActive) return null;
        
        for (const fold of this.foldPortals) {
            // Check if position matches either end of the fold
            if (position.x === fold.point1.x && position.y === fold.point1.y) {
                return {...fold.point2};
            }
            
            if (position.x === fold.point2.x && position.y === fold.point2.y) {
                return {...fold.point1};
            }
        }
        
        return null;
    }
    
    setupRealityFragments() {
        this.realityFragmentsActive = true;
        this.fragments = [];
        
        // Create reality fragments (pieces of grid that shift)
        const numFragments = Math.floor(Math.random() * 3) + 2; // 2-4 fragments
        
        for (let i = 0; i < numFragments; i++) {
            // Define fragment properties
            const fragment = {
                x: Math.floor(Math.random() * (this.game.gridWidth - 4)),
                y: Math.floor(Math.random() * (this.game.gridHeight - 4)),
                width: Math.floor(Math.random() * 3) + 2, // 2-4 cells wide
                height: Math.floor(Math.random() * 3) + 2, // 2-4 cells high
                shiftX: (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 2), // -2 to 2 cell shift
                shiftY: (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 2), // -2 to 2 cell shift
                color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`
            };
            
            this.fragments.push(fragment);
        }
        
        setTimeout(() => {
            this.realityFragmentsActive = false;
            this.fragments = [];
        }, config.powerUpDuration);
    }
    
    transformFragmentPosition(position) {
        if (!this.realityFragmentsActive) return position;
        
        // Check if position is within any fragment
        for (const fragment of this.fragments) {
            if (position.x >= fragment.x && 
                position.x < fragment.x + fragment.width && 
                position.y >= fragment.y && 
                position.y < fragment.y + fragment.height) {
                
                // Apply fragment transformation
                return {
                    x: Math.max(0, Math.min(this.game.gridWidth - 1, position.x + fragment.shiftX)),
                    y: Math.max(0, Math.min(this.game.gridHeight - 1, position.y + fragment.shiftY))
                };
            }
        }
        
        return position;
    }
    
    setupInfinityLoop() {
        this.infinityLoopActive = true;
        
        // Modify canvas appearance
        document.getElementById('game-canvas').classList.add('infinity-loop');
        
        setTimeout(() => {
            this.infinityLoopActive = false;
            document.getElementById('game-canvas').classList.remove('infinity-loop');
        }, config.powerUpDuration);
    }
    
    applyInfinityLoop(position) {
        if (!this.infinityLoopActive) return position;
        
        // Create looping effect in all directions
        const loopedPosition = {...position};
        
        // Apply wraparound in all directions
        if (loopedPosition.x < 0) loopedPosition.x = this.game.gridWidth - 1;
        if (loopedPosition.y < 0) loopedPosition.y = this.game.gridHeight - 1;
        if (loopedPosition.x >= this.game.gridWidth) loopedPosition.x = 0;
        if (loopedPosition.y >= this.game.gridHeight) loopedPosition.y = 0;
        
        return loopedPosition;
    }
    
    setupQuantumState() {
        this.quantumStateActive = true;
        this.quantumStates = [];
        
        // Generate 2-3 "quantum states" for the snake
        const numStates = Math.floor(Math.random() * 2) + 2;
        
        // Start with current snake as first state
        this.quantumStates.push(this.game.snake.map(segment => ({...segment})));
        
        // Generate additional quantum states with slight variations
        for (let i = 1; i < numStates; i++) {
            const newState = this.game.snake.map(segment => ({
                x: segment.x + (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 2),
                y: segment.y + (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 2)
            }));
            
            // Ensure states are within bounds
            newState.forEach(segment => {
                segment.x = Math.max(0, Math.min(this.game.gridWidth - 1, segment.x));
                segment.y = Math.max(0, Math.min(this.game.gridHeight - 1, segment.y));
            });
            
            this.quantumStates.push(newState);
        }
        
        setTimeout(() => {
            this.quantumStateActive = false;
            this.quantumStates = [];
        }, config.powerUpDuration);
    }
    
    drawMirrorDimension(ctx, gridSize) {
        if (!this.mirrorDimensionActive || !this.mirrorAxis) return;
        
        // Draw mirror line
        ctx.strokeStyle = 'rgba(200, 200, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        
        if (this.mirrorAxis === 'horizontal') {
            // Horizontal middle line
            const y = Math.floor(this.game.gridHeight / 2) * gridSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
        } else {
            // Vertical middle line
            const x = Math.floor(this.game.gridWidth / 2) * gridSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
    }
    
    drawVoidZones(ctx, gridSize) {
        if (!this.voidZonesActive) return;
        
        // Draw each void zone
        this.voidZones.forEach(zone => {
            // Calculate pulse effect
            const pulseEffect = 1 + 0.2 * Math.sin(Date.now() / 200 * zone.pulseRate);
            const radius = zone.radius * gridSize * pulseEffect;
            
            // Create void zone gradient
            const gradient = ctx.createRadialGradient(
                zone.x * gridSize + gridSize / 2,
                zone.y * gridSize + gridSize / 2,
                0,
                zone.x * gridSize + gridSize / 2,
                zone.y * gridSize + gridSize / 2,
                radius
            );
            
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
            gradient.addColorStop(0.7, 'rgba(30, 0, 60, 0.6)');
            gradient.addColorStop(1, 'rgba(60, 20, 120, 0)');
            
            // Draw void zone
            ctx.beginPath();
            ctx.arc(
                zone.x * gridSize + gridSize / 2,
                zone.y * gridSize + gridSize / 2,
                radius,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Add swirling effect lines
            ctx.strokeStyle = 'rgba(100, 50, 200, 0.4)';
            ctx.lineWidth = 1;
            
            const spiralOffset = Date.now() / 1000;
            for (let i = 0; i < 2; i++) {
                const angle = spiralOffset + Math.PI * i;
                ctx.beginPath();
                ctx.arc(
                    zone.x * gridSize + gridSize / 2,
                    zone.y * gridSize + gridSize / 2,
                    radius * 0.7,
                    angle,
                    angle + Math.PI,
                    false
                );
                ctx.stroke();
            }
        });
    }
    
    drawSpatialFold(ctx, gridSize) {
        if (!this.spatialFoldActive) return;
        
        // Draw each spatial fold connection
        this.foldPortals.forEach(fold => {
            const point1X = fold.point1.x * gridSize + gridSize / 2;
            const point1Y = fold.point1.y * gridSize + gridSize / 2;
            const point2X = fold.point2.x * gridSize + gridSize / 2;
            const point2Y = fold.point2.y * gridSize + gridSize / 2;
            
            // Draw portal points
            ctx.fillStyle = fold.color;
            
            // Point 1
            ctx.beginPath();
            ctx.arc(point1X, point1Y, gridSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Point 2
            ctx.beginPath();
            ctx.arc(point2X, point2Y, gridSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw connecting line (spatial fold visualization)
            ctx.strokeStyle = fold.color;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.globalAlpha = 0.6;
            
            // Calculate bezier control point
            const cpX = (point1X + point2X) / 2 + (Math.random() - 0.5) * 100;
            const cpY = (point1Y + point2Y) / 2 + (Math.random() - 0.5) * 100;
            
            // Draw curved line
            ctx.beginPath();
            ctx.moveTo(point1X, point1Y);
            ctx.quadraticCurveTo(cpX, cpY, point2X, point2Y);
            ctx.stroke();
            
            ctx.setLineDash([]);
            ctx.globalAlpha = 1.0;
        });
    }
    
    drawRealityFragments(ctx, gridSize) {
        if (!this.realityFragmentsActive) return;
        
        // Draw each reality fragment
        this.fragments.forEach(fragment => {
            // Draw fragment area
            ctx.fillStyle = fragment.color;
            ctx.fillRect(
                fragment.x * gridSize,
                fragment.y * gridSize,
                fragment.width * gridSize,
                fragment.height * gridSize
            );
            
            // Draw arrows to show direction of shift
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            
            const centerX = (fragment.x + fragment.width / 2) * gridSize;
            const centerY = (fragment.y + fragment.height / 2) * gridSize;
            
            // Draw arrow in direction of shift
            const arrowLength = gridSize * 0.8;
            const arrowX = centerX + fragment.shiftX * gridSize / 2;
            const arrowY = centerY + fragment.shiftY * gridSize / 2;
            
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(arrowX, arrowY);
            ctx.stroke();
            
            // Arrow head
            const angle = Math.atan2(fragment.shiftY, fragment.shiftX);
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(
                arrowX - Math.cos(angle - Math.PI/6) * 10,
                arrowY - Math.sin(angle - Math.PI/6) * 10
            );
            ctx.lineTo(
                arrowX - Math.cos(angle + Math.PI/6) * 10,
                arrowY - Math.sin(angle + Math.PI/6) * 10
            );
            ctx.closePath();
            ctx.fill();
        });
    }
    
    drawQuantumState(ctx, gridSize) {
        if (!this.quantumStateActive || this.quantumStates.length <= 1) return;
        
        // Draw each quantum state with reduced opacity
        this.quantumStates.forEach((state, stateIndex) => {
            if (stateIndex === 0) return; // Skip the main state
            
            ctx.globalAlpha = 0.3;
            const stateHue = stateIndex * 60; // Different hue for each state
            
            state.forEach((segment, segmentIndex) => {
                // Draw segment
                ctx.fillStyle = `hsla(${stateHue}, 70%, 60%, 0.5)`;
                ctx.fillRect(
                    segment.x * gridSize,
                    segment.y * gridSize,
                    gridSize,
                    gridSize
                );
                
                // Draw segment outline
                ctx.strokeStyle = `hsla(${stateHue}, 70%, 40%, 0.7)`;
                ctx.strokeRect(
                    segment.x * gridSize,
                    segment.y * gridSize,
                    gridSize,
                    gridSize
                );
            });
        });
        
        ctx.globalAlpha = 1.0;
    }
    
    update() {
        // No updates needed for most dimension power-ups
        // Their effects are applied in game collision and movement logic
    }
    
    draw(ctx, gridSize) {
        this.drawMirrorDimension(ctx, gridSize);
        this.drawVoidZones(ctx, gridSize);
        this.drawSpatialFold(ctx, gridSize);
        this.drawRealityFragments(ctx, gridSize);
        this.drawQuantumState(ctx, gridSize);
    }
}