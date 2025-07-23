class CharacterCreator {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.images = {};
        this.currentLayers = {
            background: 'background/room.png',
            backOverlay: '',
            body: 'body/evil-question.png',
            frontOverlay: '',
            logo: 'logo/evilneuro.png'
        };
        
        this.textSettings = {
            text: 'Evil Neuro',
            color: '#ff4757',
            size: 100,
            bold: true
        };

        // Text borders for different logos
        this.textBorders = {
            'logo/evilneuro.png': { start: { x: 37, y: 251 }, end: { x: 1011, y: 879 } },
            // Add more logo borders here as needed
            'default': { start: { x: 100, y: 100 }, end: { x: 1500, y: 800 } }
        };

        // Image configuration - easily add new images here
        this.imageConfig = {
            background: [
                { file: 'background/room.png', name: "Evil's Room" },
                { file: 'background/mc-bed.png', name: "Minecraft Bed" },
                { file: 'background/mc-server.png', name: "Minecraft Server" },
                { file: 'background/room-flames.png', name: "Evil's Room on Fire" },
                { file: 'background/room-oddfilm.png', name: "Evil's Room Oddfilm" },
                { file: 'background/room-oddfilmflames.png', name: "Evil's Room Oddfilm Fire" },
                { file: 'background/room-og.png', name: "Evil's Room (OG)" },
                { file: 'background/splatter.png', name: "Splatter" }
            ],
            backOverlay: [
                { file: 'back-front-ov/evilfumo-ov.png', name: "Evil Fumo" },
                { file: 'back-front-ov/horn-ov.png', name: "Abber Horn" },
                { file: 'back-front-ov/mcneuros-ov.png', name: "McNeuros Hat" },
                { file: 'back-front-ov/mic-ov.png', name: "Microphone" },
                { file: 'back-front-ov/plasma-globe-ov1.png', name: "Plasma Globe 1" },
                { file: 'back-front-ov/plasma-globe-ov2.png', name: "Plasma Globe 2" },
                { file: 'back-front-ov/tail-ov.png', name: "Abber Tail" },
                { file: 'back-front-ov/tail2-ov.png', name: "Abber Tail 2" },
                { file: 'back-front-ov/wahh-ov.png', name: "Wahh" }
            ],
            body: [
                { file: 'body/evil-aloof.png', name: "Evil Aloof" },
                { file: 'body/evil-aloofsmile.png', name: "Evil Happy Aloof" },
                { file: 'body/evil-crying.png', name: "Evil Crying" },
                { file: 'body/evil-disappointed.png', name: "Evil Disappointed" },
                { file: 'body/evil-disgusted.png', name: "Evil Disgusted" },
                { file: 'body/evil-dread.png', name: "Evil Dread" },
                { file: 'body/evil-fear.png', name: "Evil Fear" },
                { file: 'body/evil-happyhiyorihandsneko.png', name: "Evil Neko with Happy Hiyori Hands" },
                { file: 'body/evil-hearteyes.png', name: "Evil Heart Eyes" },
                { file: 'body/evil-hiyoriarms.png', name: "Evil Hiyori Arms" },
                { file: 'body/evil-inquisitive.png', name: "Evil Inquisitive" },
                { file: 'body/evil-inquisitivesmile.png', name: "Evil Happy Inquisitive" },
                { file: 'body/evil-openmouth.png', name: "Evil Open Mouth" },
                { file: 'body/evil-pensive.png', name: "Evil Pensive" },
                { file: 'body/evil-question.png', name: "Evil Question" },
                { file: 'body/evil-starryeyes.png', name: "Evil Starry Eyes 1" },
                { file: 'body/evil-starryeyes2.png', name: "Evil Starry Eyes 2" },
                { file: 'body/evil-starryeyes3.png', name: "Evil Starry Eyes 3" },
                { file: 'body/evil-talking.png', name: "Evil Talking" },
                { file: 'body/evil-unamused.png', name: "Evil Unamused" },
                { file: 'body/evil-unamusedhearteyesneko.png', name: "Evil Neko with Unamused Heart Eyes" },
                { file: 'body/evil-yandere.png', name: "Evil Yandere" },
                { file: 'body/evil-yandereish.png', name: "Evil Yandere-ish" },
                { file: 'body/full-body-2.png', name: "Evil Full Body 2" },
                { file: 'body/full-body-smile.png', name: "Evil Happy Full Body" },
                { file: 'body/full-body.png', name: "Evil Full Body" }
            ],
            frontOverlay: [
                { file: 'back-front-ov/evilfumo-ov.png', name: "Evil Fumo" },
                { file: 'back-front-ov/horn-ov.png', name: "Abber Horn" },
                { file: 'back-front-ov/mcneuros-ov.png', name: "McNeuros Hat" },
                { file: 'back-front-ov/mic-ov.png', name: "Microphone" },
                { file: 'back-front-ov/plasma-globe-ov1.png', name: "Plasma Globe 1" },
                { file: 'back-front-ov/plasma-globe-ov2.png', name: "Plasma Globe 2" },
                { file: 'back-front-ov/tail-ov.png', name: "Abber Tail" },
                { file: 'back-front-ov/tail2-ov.png', name: "Abber Tail 2" },
                { file: 'back-front-ov/wahh-ov.png', name: "Wahh" }
            ],
            logo: [
                { file: 'logo/evilneuro.png', name: "Logo 1" },
                { file: 'logo/evilneuro2.png', name: "Logo 2" }
            ]
        };

        this.init();
    }

    async init() {
        this.showPreloader();
        await this.preloadImages();
        this.hidePreloader();
        this.setupTabs();
        this.generateImageOptions();
        this.setupEventListeners();
        this.render();
    }

    showPreloader() {
        const overlay = document.getElementById('preload-overlay');
        const character = document.getElementById('loading-character');
        
        // Animate character jumping and switching between images
        let isJumping = false;
        const animationInterval = setInterval(() => {
            if (isJumping) {
                character.src = 'nur2.png'; // Happy face while jumping
            } else {
                character.src = 'nur1.png'; // Normal face while idle
            }
            isJumping = !isJumping;
        }, 750); // Switch every 750ms to match bounce animation
        
        this.preloadAnimationInterval = animationInterval;
    }

    hidePreloader() {
        const overlay = document.getElementById('preload-overlay');
        clearInterval(this.preloadAnimationInterval);
        
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }

    async preloadImages() {
        // Collect all unique image files from config
        const allImages = new Set();
        // Add background image
        allImages.add('nertwin_bday_timesqr_bg_v1.png');
        
        Object.values(this.imageConfig).forEach(category => {
            category.forEach(item => allImages.add(item.file));
        });
        
        for (const imageName of allImages) {
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

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));

                // Add active class to clicked tab and corresponding panel
                button.classList.add('active');
                const tabName = button.dataset.tab;
                const panel = document.querySelector(`[data-panel="${tabName}"]`);
                if (panel) panel.classList.add('active');
            });
        });
    }

    generateImageOptions() {
        Object.keys(this.imageConfig).forEach(layerType => {
            const container = document.getElementById(`${layerType}-images`);
            if (!container) return;

            // Add image-grid class to container
            container.className = 'image-grid';

            // Add "None" option first
            const noneOption = this.createImageOption('', 'None', layerType, true);
            container.appendChild(noneOption);

            // Add configured images
            this.imageConfig[layerType].forEach(imageData => {
                const isActive = this.currentLayers[layerType] === imageData.file;
                const option = this.createImageOption(imageData.file, imageData.name, layerType, false, isActive);
                container.appendChild(option);
            });
        });
    }

    createImageOption(file, name, layer, isNone = false, isActive = false) {
        const option = document.createElement('div');
        option.className = `image-option ${isActive ? 'active' : ''}`;
        option.dataset.value = file;
        option.dataset.layer = layer;

        if (isNone) {
            option.innerHTML = `
                <div class="no-image">None</div>
                <span>${name}</span>
            `;
        } else {
            option.innerHTML = `
                <img src="${file}" alt="${name}">
                <span>${name}</span>
            `;
        }

        // Use touchstart for better mobile responsiveness
        const handleSelection = () => {
            // Remove active class from siblings
            option.parentNode.querySelectorAll('.image-option').forEach(opt => 
                opt.classList.remove('active')
            );
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update layer
            this.currentLayers[layer] = file;
            this.render();
        };

        option.addEventListener('click', handleSelection);
        option.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleSelection();
        });

        return option;
    }

    setupEventListeners() {
        // Text controls
        document.getElementById('text-input').addEventListener('input', (e) => {
            this.textSettings.text = e.target.value;
            this.render();
        });

        document.getElementById('text-color').addEventListener('change', (e) => {
            this.textSettings.color = e.target.value;
            this.render();
        });

        document.getElementById('text-size').addEventListener('input', (e) => {
            this.textSettings.size = parseInt(e.target.value);
            document.getElementById('size-value').textContent = `${e.target.value}px`;
            this.render();
        });

        document.getElementById('text-bold').addEventListener('change', (e) => {
            this.textSettings.bold = e.target.checked;
            this.render();
        });

        // Download button
        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadImage();
        });
    }

    drawImage(imageName, layer = 'normal') {
        if (!imageName || !this.images[imageName]) return;
        
        const img = this.images[imageName];
        
        // All images are drawn at the same size and position (full canvas)
        this.ctx.drawImage(img, 0, 0, 1600, 900);
    }

    getTextBorder() {
        const logo = this.currentLayers.logo;
        return this.textBorders[logo] || this.textBorders['default'];
    }

    wrapText(text, maxWidth, fontSize) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        // Handle explicit line breaks
        const paragraphs = text.split('\n');
        
        for (let p = 0; p < paragraphs.length; p++) {
            const paragraph = paragraphs[p];
            const words = paragraph.split(' ');
            currentLine = '';
            
            for (let i = 0; i < words.length; i++) {
                const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
                this.ctx.font = `${this.textSettings.bold ? 'bold' : 'normal'} ${fontSize}px Inter, sans-serif`;
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
            
            // Add empty line for paragraph breaks (except for the last paragraph)
            if (p < paragraphs.length - 1) {
                // lines.push('');
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
        
        let fontSize = this.textSettings.size; // Start with user-specified size
        let lines = [];
        let totalHeight = 0;
        
        // Keep reducing font size until text fits both horizontally and vertically
        do {
            this.ctx.font = `${fontSize}px 'First Coffee', monospace`;
            lines = this.wrapText(this.textSettings.text, maxWidth, fontSize);
            
            const lineHeight = fontSize * 1.2;
            totalHeight = lines.length * lineHeight;
            
            // Check if any line exceeds width or total height exceeds border
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
        } while ((totalHeight > maxHeight || lines.some(line => line && this.ctx.measureText(line).width > maxWidth)) && fontSize > 8);
        
        // Text styling with First Coffee font
        this.ctx.font = `${fontSize}px 'First Coffee', monospace`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        const lineHeight = fontSize * 1.2;
        const startY = border.start.y + (maxHeight - totalHeight) / 2; // Center vertically
        
        // Draw each line with shadow effect first, then main text
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const y = startY + (i * lineHeight);
            
            if (line) { // Don't draw empty lines
                // Calculate shadow offset (5px at 154 degrees)
                const shadowDistance = 5;
                const shadowAngle = 154 * Math.PI / 180; // Convert to radians
                const shadowX = border.start.x + Math.cos(shadowAngle) * shadowDistance;
                const shadowY = y + Math.sin(shadowAngle) * shadowDistance;
                
                // Draw shadow with spread effect
                const spreadFactor = 0.41;
                const spreadWidth = 2 * spreadFactor;
                
                this.ctx.strokeStyle = '#4b161e'; // Deep burgundy shadow
                this.ctx.lineWidth = 20 + spreadWidth; // Increased stroke width
                this.ctx.fillStyle = '#4b161e';
                this.ctx.strokeText(line, shadowX, shadowY);
                this.ctx.fillText(line, shadowX, shadowY);
                
                // Draw main text with stroke and fill
                this.ctx.strokeStyle = '#4e1912'; // Dark reddish-brown stroke
                this.ctx.lineWidth = 20; // Increased stroke width
                this.ctx.fillStyle = '#ffffff'; // White fill
                
                // Draw stroke first, then fill
                this.ctx.strokeText(line, border.start.x, y);
                this.ctx.fillText(line, border.start.x, y);
            }
        }
        
        this.ctx.restore();
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, 1600, 900);
        
        // Draw layers in order - all at same size and position
        this.drawImage(this.currentLayers.background);
        this.drawImage(this.currentLayers.backOverlay);
        this.drawImage(this.currentLayers.body);
        this.drawImage(this.currentLayers.frontOverlay);
        this.drawImage(this.currentLayers.logo);
        
        // Draw text
        this.drawText();
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'character.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Initialize the character creator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CharacterCreator();
});