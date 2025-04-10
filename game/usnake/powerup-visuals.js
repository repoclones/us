// New file for power-up visual effects and gradient rendering
import config from 'config';

export class PowerUpVisuals {
    constructor(ctx) {
        this.ctx = ctx;
        this.animationFrames = {};
        this.initializeAnimationFrames();
    }
    
    initializeAnimationFrames() {
        // Pre-compute animation frames for various effect types
        Object.keys(config.powerUpGradients).forEach(powerUpName => {
            this.animationFrames[powerUpName] = {
                currentFrame: 0,
                totalFrames: 60,
                angle: 0
            };
        });
    }
    
    drawPowerUpFood(food, x, y, size) {
        if (!food.type || !food.type.name) return false;
        
        // Get gradient configuration for this power-up
        const gradient = config.powerUpGradients[food.type.name];
        if (!gradient) {
            // Fallback to simple color if no gradient defined
            this.ctx.fillStyle = food.type.color;
            this.ctx.beginPath();
            this.ctx.arc(x + size / 2, y + size / 2, size / 2 - 2, 0, Math.PI * 2);
            this.ctx.fill();
            return true;
        }
        
        // Update animation frame
        const animation = this.animationFrames[food.type.name];
        animation.currentFrame = (animation.currentFrame + 1) % animation.totalFrames;
        animation.angle = (animation.angle + 0.05) % (Math.PI * 2);
        
        // Apply different drawing styles based on effect type
        switch (gradient.type) {
            case 'linear':
                this.drawLinearGradient(food, x, y, size, gradient);
                break;
            case 'radial':
                this.drawRadialGradient(food, x, y, size, gradient);
                break;
            case 'rainbow':
                this.drawRainbowGradient(food, x, y, size, gradient);
                break;
            case 'pulse':
                this.drawPulseEffect(food, x, y, size, gradient, animation);
                break;
            case 'sparkle':
                this.drawSparkleEffect(food, x, y, size, gradient, animation);
                break;
            case 'spiral':
                this.drawSpiralEffect(food, x, y, size, gradient, animation);
                break;
            case 'portal':
                this.drawPortalEffect(food, x, y, size, gradient, animation);
                break;
            case 'beam':
                this.drawBeamEffect(food, x, y, size, gradient, animation);
                break;
            case 'explosive':
                this.drawExplosiveEffect(food, x, y, size, gradient, animation);
                break;
            case 'target':
                this.drawTargetEffect(food, x, y, size, gradient, animation);
                break;
            case 'glitter':
                this.drawGlitterEffect(food, x, y, size, gradient, animation);
                break;
            case 'gravity':
                this.drawGravityEffect(food, x, y, size, gradient, animation);
                break;
            default:
                // Default to radial gradient for any unimplemented types
                this.drawRadialGradient(food, x, y, size, gradient);
        }
        
        return true;
    }
    
    drawLinearGradient(food, x, y, size, gradient) {
        const [color1, color2] = gradient.colors;
        const linearGradient = this.ctx.createLinearGradient(
            x, y, 
            x + size, y + size
        );
        
        linearGradient.addColorStop(0, color1);
        linearGradient.addColorStop(1, color2);
        
        this.ctx.fillStyle = linearGradient;
        this.ctx.beginPath();
        this.ctx.arc(x + size / 2, y + size / 2, size / 2 - 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawRadialGradient(food, x, y, size, gradient) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        const radialGradient = this.ctx.createRadialGradient(
            centerX, centerY, radius * 0.2,
            centerX, centerY, radius
        );
        
        radialGradient.addColorStop(0, color1);
        radialGradient.addColorStop(1, color2);
        
        this.ctx.fillStyle = radialGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawRainbowGradient(food, x, y, size, gradient) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Create rainbow effect with multiple color stops
        const rainbowGradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        const rainbowColors = [
            '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'
        ];
        
        const animation = this.animationFrames[food.type.name];
        const offset = animation.currentFrame / animation.totalFrames;
        
        rainbowColors.forEach((color, index) => {
            const stop = (index / rainbowColors.length + offset) % 1;
            rainbowGradient.addColorStop(stop, color);
        });
        
        this.ctx.fillStyle = rainbowGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPulseEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const baseRadius = size / 2 - 2;
        
        // Calculate pulse size based on animation frame
        const pulseRatio = 0.8 + 0.2 * Math.sin(animation.currentFrame / animation.totalFrames * Math.PI * 2);
        const radius = baseRadius * pulseRatio;
        
        // Inner circle
        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Outer ring
        this.ctx.strokeStyle = color2;
        this.ctx.lineWidth = 2 * pulseRatio;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawSparkleEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Base circle
        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add sparkles
        this.ctx.fillStyle = color2;
        for (let i = 0; i < 5; i++) {
            const angle = animation.angle + (i * Math.PI * 2 / 5);
            const sparkleX = centerX + Math.cos(angle) * radius * 0.7;
            const sparkleY = centerY + Math.sin(angle) * radius * 0.7;
            const sparkleSize = radius * 0.2 * (0.8 + 0.4 * Math.sin(animation.currentFrame / 10 + i));
            
            this.ctx.beginPath();
            this.ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawSpiralEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Base circle
        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw spiral
        this.ctx.strokeStyle = color2;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const spiralOffset = animation.angle;
        for (let i = 0; i < radius; i += 0.5) {
            const angle = spiralOffset + i / 2;
            const pointX = centerX + Math.cos(angle) * i / 2;
            const pointY = centerY + Math.sin(angle) * i / 2;
            
            if (i === 0) {
                this.ctx.moveTo(pointX, pointY);
            } else {
                this.ctx.lineTo(pointX, pointY);
            }
        }
        
        this.ctx.stroke();
    }
    
    drawPortalEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Outer ring
        this.ctx.strokeStyle = color1;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner swirl
        const innerRadius = radius * 0.7;
        const radialGradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, innerRadius
        );
        
        radialGradient.addColorStop(0, color2);
        radialGradient.addColorStop(1, color1);
        
        this.ctx.fillStyle = radialGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Swirl effect
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i < 2; i++) {
            const startAngle = animation.angle + i * Math.PI;
            const endAngle = startAngle + Math.PI;
            
            this.ctx.arc(centerX, centerY, innerRadius * 0.6, startAngle, endAngle);
        }
        
        this.ctx.stroke();
    }
    
    drawBeamEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Base circle
        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Beam effect
        this.ctx.strokeStyle = color2;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.8;
        
        const beamLength = size * 1.2;
        const angle = animation.angle;
        
        this.ctx.beginPath();
        this.ctx.moveTo(
            centerX + Math.cos(angle) * radius * 0.5,
            centerY + Math.sin(angle) * radius * 0.5
        );
        this.ctx.lineTo(
            centerX + Math.cos(angle) * beamLength,
            centerY + Math.sin(angle) * beamLength
        );
        this.ctx.stroke();
        
        // Opposite beam for balance
        this.ctx.beginPath();
        this.ctx.moveTo(
            centerX + Math.cos(angle + Math.PI) * radius * 0.5,
            centerY + Math.sin(angle + Math.PI) * radius * 0.5
        );
        this.ctx.lineTo(
            centerX + Math.cos(angle + Math.PI) * beamLength,
            centerY + Math.sin(angle + Math.PI) * beamLength
        );
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1.0;
    }
    
    drawExplosiveEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Base circle with bomb-like appearance
        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Fuse
        this.ctx.strokeStyle = '#FFA000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - radius);
        
        // Wiggly fuse line
        const fuseLength = radius * 1.5;
        const segments = 8;
        const amplitude = 3;
        
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const xOffset = centerX + amplitude * Math.sin(progress * 10 + animation.angle);
            const yOffset = centerY - radius - progress * fuseLength;
            
            this.ctx.lineTo(xOffset, yOffset);
        }
        
        this.ctx.stroke();
        
        // Fuse spark
        const sparkProgress = (animation.currentFrame % 20) / 20;
        const sparkX = centerX + amplitude * Math.sin(sparkProgress * 10 + animation.angle);
        const sparkY = centerY - radius - sparkProgress * fuseLength;
        
        this.ctx.fillStyle = '#FFEB3B';
        this.ctx.beginPath();
        this.ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Warning symbol
        this.ctx.fillStyle = color2;
        this.ctx.font = `${Math.floor(radius)}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('!', centerX, centerY);
    }
    
    drawTargetEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Outer ring
        this.ctx.strokeStyle = color1;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Middle ring
        this.ctx.strokeStyle = color2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner circle
        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Crosshair
        this.ctx.strokeStyle = color2;
        this.ctx.lineWidth = 1;
        
        // Horizontal line
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - radius, centerY);
        this.ctx.lineTo(centerX + radius, centerY);
        this.ctx.stroke();
        
        // Vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - radius);
        this.ctx.lineTo(centerX, centerY + radius);
        this.ctx.stroke();
    }
    
    drawGlitterEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Draw treasure-like appearance
        
        // Base circle
        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Shine effect
        this.ctx.fillStyle = color2;
        this.ctx.beginPath();
        this.ctx.arc(
            centerX - radius * 0.3, 
            centerY - radius * 0.3, 
            radius * 0.25, 
            0, Math.PI * 2
        );
        this.ctx.fill();
        
        // Glitter particles
        this.ctx.fillStyle = 'white';
        for (let i = 0; i < 5; i++) {
            const angle = animation.angle * 2 + (i * Math.PI * 2 / 5);
            const distance = radius * (0.5 + 0.4 * Math.random());
            const particleX = centerX + Math.cos(angle) * distance;
            const particleY = centerY + Math.sin(angle) * distance;
            const particleSize = 1 + Math.random() * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawGravityEffect(food, x, y, size, gradient, animation) {
        const [color1, color2] = gradient.colors;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2 - 2;
        
        // Base circle with dense center
        const gravityGradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        gravityGradient.addColorStop(0, color2);
        gravityGradient.addColorStop(0.7, color1);
        gravityGradient.addColorStop(1, 'rgba(75, 0, 130, 0.7)');
        
        this.ctx.fillStyle = gravityGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Orbiting particles
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < 3; i++) {
            const orbitRadius = radius * (0.6 + i * 0.2);
            const angle = animation.angle * (1 - i * 0.2);
            const particleX = centerX + Math.cos(angle) * orbitRadius;
            const particleY = centerY + Math.sin(angle) * orbitRadius;
            
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Gravity field lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI / 4) + animation.angle / 3;
            
            this.ctx.beginPath();
            this.ctx.moveTo(
                centerX + Math.cos(angle) * (radius * 0.3),
                centerY + Math.sin(angle) * (radius * 0.3)
            );
            this.ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            this.ctx.stroke();
        }
    }
}