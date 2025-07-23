class OptimizedCharacterCreator {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.images = {};
        this.currentLayers = {
            background: 'room.png',
            body: 'evil-question.png',
            logo: 'evilneuro.png'
        };
        
        this.textSettings = {
            text: 'Evil Neuro'
        };

        this.textBorders = {
            'evilneuro.png': { start: { x: 19, y: 126 }, end: { x: 506, y: 440 } },
            'default': { start: { x: 50, y: 50 }, end: { x: 750, y: 400 } }
        };

        this.init();
    }

    async init() {
        await this.preloadImages();
        this.setupEventListeners();
        this.render();
    }

    async preloadImages() {
        const imageList = ['room.png', 'evil-question.png', 'evilneuro.png'];
        
        for (const imageName of imageList) {
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = imageName;
                });
                this.images[imageName] = img;
            } catch (error) {
                console.warn(`Failed to load image: ${imageName}`, error);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('background-select').addEventListener('change', (e) => {
            this.currentLayers.background = e.target.value;
            this.render();
        });

        document.getElementById('body-select').addEventListener('change', (e) => {
            this.currentLayers.body = e.target.value;
            this.render();
        });

        document.getElementById('logo-select').addEventListener('change', (e) => {
            this.currentLayers.logo = e.target.value;
            this.render();
        });

        document.getElementById('text-input').addEventListener('input', (e) => {
            this.textSettings.text = e.target.value;
            this.render();
        });

        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadImage();
        });
    }

    drawImage(imageName) {
        if (!imageName || !this.images[imageName]) return;
        const img = this.images[imageName];
        this.ctx.drawImage(img, 0, 0, 800, 450);
    }

    getTextBorder() {
        const logo = this.currentLayers.logo;
        const border = this.textBorders[logo] || this.textBorders['default'];
        // Scale coordinates for smaller canvas
        return {
            start: { x: border.start.x * 0.5, y: border.start.y * 0.5 },
            end: { x: border.end.x * 0.5, y: border.end.y * 0.5 }
        };
    }

    wrapText(text, maxWidth, fontSize) {
        const paragraphs = text.split('\n');
        const lines = [];
        let currentLine = '';
        
        for (let p = 0; p < paragraphs.length; p++) {
            const paragraph = paragraphs[p];
            const words = paragraph.split(' ');
            currentLine = '';
            
            for (let i = 0; i < words.length; i++) {
                const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
                this.ctx.font = `${fontSize}px 'First Coffee', monospace`;
                const metrics = this.ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                lines.push(currentLine);
            }
            
            if (p < paragraphs.length - 1) {
                lines.push('');
            }
        }
        
        return lines;
    }

    drawText() {
        if (!this.textSettings.text.trim()) return;

        this.ctx.save();
        
        const border = this.getTextBorder();
        const maxWidth = border.end.x - border.start.x;
        const maxHeight = border.end.y - border.start.y;
        
        let fontSize = 50;
        let lines = [];
        let totalHeight = 0;
        
        do {
            this.ctx.font = `${fontSize}px 'First Coffee', monospace`;
            lines = this.wrapText(this.textSettings.text, maxWidth, fontSize);
            
            const lineHeight = fontSize * 1.2;
            totalHeight = lines.length * lineHeight;
            
            let exceedsWidth = false;
            for (let line of lines) {
                if (line && this.ctx.measureText(line).width > maxWidth) {
                    exceedsWidth = true;
                    break;
                }
            }
            
            if (totalHeight > maxHeight || exceedsWidth) {
                fontSize -= 1;
            }
        } while ((totalHeight > maxHeight || lines.some(line => line && this.ctx.measureText(line).width > maxWidth)) && fontSize > 4);
        
        this.ctx.font = `${fontSize}px 'First Coffee', monospace`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        const lineHeight = fontSize * 1.2;
        const startY = border.start.y + (maxHeight - totalHeight) / 2;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const y = startY + (i * lineHeight);
            
            if (line) {
                const shadowDistance = 2.5;
                const shadowAngle = 154 * Math.PI / 180;
                const shadowX = border.start.x + Math.cos(shadowAngle) * shadowDistance;
                const shadowY = y + Math.sin(shadowAngle) * shadowDistance;
                
                this.ctx.strokeStyle = '#4b161e';
                this.ctx.lineWidth = 8;
                this.ctx.fillStyle = '#4b161e';
                this.ctx.strokeText(line, shadowX, shadowY);
                this.ctx.fillText(line, shadowX, shadowY);
                
                this.ctx.strokeStyle = '#4e1912';
                this.ctx.lineWidth = 8;
                this.ctx.fillStyle = '#ffffff';
                
                this.ctx.strokeText(line, border.start.x, y);
                this.ctx.fillText(line, border.start.x, y);
            }
        }
        
        this.ctx.restore();
    }

    render() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, 800, 450);
        
        this.drawImage(this.currentLayers.background);
        this.drawImage(this.currentLayers.body);
        this.drawImage(this.currentLayers.logo);
        
        this.drawText();
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'character-optimized.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new OptimizedCharacterCreator();
});