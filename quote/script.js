class CharacterCreator {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.images = {};
        this.thumbnails = {};
        this.overlaysData = [
        {
            "file": "back-front-ov/lavalamp-ov.png",
            "name": "Lavalamp",
            "thumb": "thumb/back-front-ov/lavalamp-ov.png"
        },
        {
            "file": "back-front-ov/neuro-mic-ov.png",
            "name": "Neuro's Microphone",
            "thumb": "thumb/back-front-ov/neuro-mic-ov.png"
        },
        {
            "file": "back-front-ov/evilfumo-ov.png",
            "name": "Evil Fumo",
            "thumb": "thumb/back-front-ov/evilfumo-ov.png"
        },
        {
            "file": "back-front-ov/horn-ov.png",
            "name": "Abber Horn",
            "thumb": "thumb/back-front-ov/horn-ov.png"
        },
        {
            "file": "back-front-ov/mcneuros-ov.png",
            "name": "McNeuros Hat",
            "thumb": "thumb/back-front-ov/mcneuros-ov.png"
        },
        {
            "file": "back-front-ov/mic-ov.png",
            "name": "Evil's Microphone",
            "thumb": "thumb/back-front-ov/mic-ov.png"
        },
        {
            "file": "back-front-ov/plasma-globe-ov1.png",
            "name": "Plasma Globe 1",
            "thumb": "thumb/back-front-ov/plasma-globe-ov1.png"
        },
        {
            "file": "back-front-ov/plasma-globe-ov2.png",
            "name": "Plasma Globe 2",
            "thumb": "thumb/back-front-ov/plasma-globe-ov2.png"
        },
        {
            "file": "back-front-ov/tail-ov.png",
            "name": "Abber Tail",
            "thumb": "thumb/back-front-ov/tail-ov.png"
        },
        {
            "file": "back-front-ov/tail2-ov.png",
            "name": "Abber Tail 2",
            "thumb": "thumb/back-front-ov/tail2-ov.png"
        },
        {
            "file": "back-front-ov/wahh-ov.png",
            "name": "Wahh",
            "thumb": "thumb/back-front-ov/wahh-ov.png"
        }
    ];
        // Define image configuration with thumbnails
        this.imageConfig = {
    "background": [
        {
            "file": "background/room.png",
            "name": "Neuro's Room",
            "thumb": "thumb/background/room.png"
        },
        {
            "file": "background/room2.png",
            "name": "Evil's Room",
            "thumb": "thumb/background/room2.png"
        },
        {
            "file": "background/mc-bed.png",
            "name": "Minecraft Bed",
            "thumb": "thumb/background/mc-bed.png"
        },
        {
            "file": "background/mc-server.png",
            "name": "Minecraft Server",
            "thumb": "thumb/background/mc-server.png"
        },
        {
            "file": "background/room-flames.png",
            "name": "Evil's Room on Fire",
            "thumb": "thumb/background/room-flames.png"
        },
        {
            "file": "background/room-oddfilm.png",
            "name": "Evil's Room Oddfilm",
            "thumb": "thumb/background/room-oddfilm.png"
        },
        {
            "file": "background/room-oddfilmflames.png",
            "name": "Evil's Room Oddfilm Fire",
            "thumb": "thumb/background/room-oddfilmflames.png"
        },
        {
            "file": "background/room-og.png",
            "name": "Evil's Room (OG)",
            "thumb": "thumb/background/room-og.png"
        },
        {
            "file": "background/splatter.png",
            "name": "Splatter",
            "thumb": "thumb/background/splatter.png"
        }
    ],
    "backOverlay": this.overlaysData,
    "body": [
        {
            "file": "body/neuro-blushing.png",
            "name": "Neuro Blushing",
            "thumb": "thumb/body/neuro-blushing.png"
        },
        {
            "file": "body/neuro-happyeyesclosed.png",
            "name": "Neuro Happy Eyes Closed",
            "thumb": "thumb/body/neuro-happyeyesclosed.png"
        },
        {
            "file": "body/neuro-smallsmile.png",
            "name": "Neuro Small Smile",
            "thumb": "thumb/body/neuro-smallsmile.png"
        },
    {
        "file": "body/neuro-afraid.png",
        "name": "Neuro Afraid",
        "thumb": "thumb/body/neuro-afraid.png"
    },
    {
        "file": "body/neuro-angryglare.png",
        "name": "Neuro Angry Glare",
        "thumb": "thumb/body/neuro-angryglare.png"
    },
    {
        "file": "body/neuro-angryglare2.png",
        "name": "Neuro Angry Glare 2",
        "thumb": "thumb/body/neuro-angryglare2.png"
    },
    {
        "file": "body/neuro-annoyed.png",
        "name": "Neuro Annoyed",
        "thumb": "thumb/body/neuro-annoyed.png"
    },
    {
        "file": "body/neuro-blushing2.png",
        "name": "Neuro Blushing 2",
        "thumb": "thumb/body/neuro-blushing2.png"
    },
    {
        "file": "body/neuro-bored.png",
        "name": "Neuro Bored",
        "thumb": "thumb/body/neuro-bored.png"
    },
    {
        "file": "body/neuro-boredlookingup.png",
        "name": "Neuro Bored Looking Up",
        "thumb": "thumb/body/neuro-boredlookingup.png"
    },
    {
        "file": "body/neuro-cathappy.png",
        "name": "Neuro Cat Happy",
        "thumb": "thumb/body/neuro-cathappy.png"
    },
    {
        "file": "body/neuro-catquestionmarkducky.png",
        "name": "Neuro Cat Question Mark with Ducky",
        "thumb": "thumb/body/neuro-catquestionmarkducky.png"
    },
        {
            "file": "body/evil-aloof.png",
            "name": "Evil Aloof",
            "thumb": "thumb/body/evil-aloof.png"
        },
        {
            "file": "body/evil-aloofsmile.png",
            "name": "Evil Happy Aloof",
            "thumb": "thumb/body/evil-aloofsmile.png"
        },
        {
            "file": "body/evil-blushing.png",
            "name": "Evil Blushing",
            "thumb": "thumb/body/evil-blushing.png"
        },
        {
            "file": "body/evil-crying.png",
            "name": "Evil Crying",
            "thumb": "thumb/body/evil-crying.png"
        },
        {
            "file": "body/evil-disappointed.png",
            "name": "Evil Disappointed",
            "thumb": "thumb/body/evil-disappointed.png"
        },
        {
            "file": "body/evil-disgusted.png",
            "name": "Evil Disgusted",
            "thumb": "thumb/body/evil-disgusted.png"
        },
        {
            "file": "body/evil-dread.png",
            "name": "Evil Dread",
            "thumb": "thumb/body/evil-dread.png"
        },
        {
            "file": "body/evil-fear.png",
            "name": "Evil Fear",
            "thumb": "thumb/body/evil-fear.png"
        },
        {
            "file": "body/evil-happyhiyorihandsneko.png",
            "name": "Evil Neko with Happy Hiyori Hands",
            "thumb": "thumb/body/evil-happyhiyorihandsneko.png"
        },
        {
            "file": "body/evil-hearteyes.png",
            "name": "Evil Heart Eyes",
            "thumb": "thumb/body/evil-hearteyes.png"
        },
        {
            "file": "body/evil-hiyoriarms.png",
            "name": "Evil Hiyori Arms",
            "thumb": "thumb/body/evil-hiyoriarms.png"
        },
        {
            "file": "body/evil-inquisitive.png",
            "name": "Evil Inquisitive",
            "thumb": "thumb/body/evil-inquisitive.png"
        },
        {
            "file": "body/evil-inquisitivesmile.png",
            "name": "Evil Happy Inquisitive",
            "thumb": "thumb/body/evil-inquisitivesmile.png"
        },
        {
            "file": "body/evil-openmouth.png",
            "name": "Evil Open Mouth",
            "thumb": "thumb/body/evil-openmouth.png"
        },
        {
            "file": "body/evil-openmouthhappy.png",
            "name": "Evil Open Mouth Happy",
            "thumb": "thumb/body/evil-openmouthhappy.png"
        },
        {
            "file": "body/evil-pensive.png",
            "name": "Evil Pensive",
            "thumb": "thumb/body/evil-pensive.png"
        },
        {
            "file": "body/evil-question.png",
            "name": "Evil Question",
            "thumb": "thumb/body/evil-question.png"
        },
        {
            "file": "body/evil-starryeyes.png",
            "name": "Evil Starry Eyes 1",
            "thumb": "thumb/body/evil-starryeyes.png"
        },
        {
            "file": "body/evil-starryeyes2.png",
            "name": "Evil Starry Eyes 2",
            "thumb": "thumb/body/evil-starryeyes2.png"
        },
        {
            "file": "body/evil-starryeyes3.png",
            "name": "Evil Starry Eyes 3",
            "thumb": "thumb/body/evil-starryeyes3.png"
        },
        {
            "file": "body/evil-talking.png",
            "name": "Evil Talking",
            "thumb": "thumb/body/evil-talking.png"
        },
        {
            "file": "body/evil-unamused.png",
            "name": "Evil Unamused",
            "thumb": "thumb/body/evil-unamused.png"
        },
        {
            "file": "body/evil-unamusedhearteyesneko.png",
            "name": "Evil Neko with Unamused Heart Eyes",
            "thumb": "thumb/body/evil-unamusedhearteyesneko.png"
        },
        {
            "file": "body/evil-yandere.png",
            "name": "Evil Yandere",
            "thumb": "thumb/body/evil-yandere.png"
        },
        {
            "file": "body/evil-yandereish.png",
            "name": "Evil Yandere-ish",
            "thumb": "thumb/body/evil-yandereish.png"
        },
        {
            "file": "body/full-body-2.png",
            "name": "Evil Full Body 2",
            "thumb": "thumb/body/full-body-2.png"
        },
        {
            "file": "body/full-body-smile.png",
            "name": "Evil Happy Full Body",
            "thumb": "thumb/body/full-body-smile.png"
        },
        {
            "file": "body/full-body.png",
            "name": "Evil Full Body",
            "thumb": "thumb/body/full-body.png"
        }
    ],
    "frontOverlay": this.overlaysData,
    "logo": [
        {
            "file": "logo/neuro.png",
            "name": "Neuro Logo",
            "thumb": null
        },
        {
            "file": "logo/evilneuro.png",
            "name": "Evil Logo 1",
            "thumb": null
        },
        {
            "file": "logo/evilneuro2.png",
            "name": "Evil Logo 2",
            "thumb": null
        }
    ]
};

        // Define text borders for different logos
        this.textBorders = {
            'logo/evilneuro.png': { start: { x: 38, y: 252 }, end: { x: 1012, y: 880 } },
            'logo/neuro.png': { start: { x: 38, y: 252 }, end: { x: 1012, y: 880 } },
            'default': { start: { x: 100, y: 100 }, end: { x: 1500, y: 800 } }
        };
        
        this.currentLayers = {
            background: 'background/room.png',
            backOverlay: '',
            body: 'body/neuro-happyeyesclosed.png',
            frontOverlay: '',
            logo: 'logo/neuro.png'
        };
        
        // Transform states for each layer
        this.transforms = {
            backOverlay: { x: 0, y: 0, scale: 1, rotation: 0 },
            frontOverlay: { x: 0, y: 0, scale: 1, rotation: 0 }
        };
        
        // Interaction state
        this.selectedLayer = null;
        this.isDragging = false;
        this.isScaling = false;
        this.isRotating = false;
        this.dragStart = { x: 0, y: 0 };
        this.initialTransform = null;
        
        // Loading state
        this.isLoadingPreview = false;
        
        this.textSettings = {
            text: 'Neuro',
            strokeType: 'neuro',
            strokeColor: '#370038',
            size: 100,
            bold: true
        };

        // Define stroke color presets
        this.strokeColors = {
            default: '#4e1912',
            evil: '#4e1912',
            neuro: '#370038'
        };

        // Preset configurations
        this.presets = {
            neuro: {
                background: 'background/room.png',
                backOverlay: '',
                body: 'body/neuro-happyeyesclosed.png',
                frontOverlay: '',
                logo: 'logo/neuro.png'
            },
            evil: {
                background: 'background/room2.png',
                backOverlay: '',
                body: 'body/evil-question.png',
                frontOverlay: '',
                logo: 'logo/evilneuro.png'
            },
            classic: {
                background: '',
                backOverlay: '',
                body: '',
                frontOverlay: '',
                logo: ''
            }
        };

        this.init();
    }

    async init() {
        this.showPreloader();
        await this.preloadAllAssets();
        this.hidePreloader();
        this.setupTabs();
        this.generateImageOptions();
        this.setupEventListeners();
        this.setupCanvasInteraction();
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

    updatePreloadStatus(message, progress = 0) {
        const loadingText = document.querySelector('.loading-text');
        const progressBar = document.querySelector('.progress-bar');
        const progressFill = document.querySelector('.progress-fill');
        
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    async preloadAllAssets() {
        // Collect default images and all thumbnails
        const preloadImages = new Set();
        
        // Add background image
        preloadImages.add('nertwin_bday_timesqr_bg_v1.png');
        
        // Add default images (currently selected)
        Object.entries(this.currentLayers).forEach(([layer, imageName]) => {
            if (imageName) {
                preloadImages.add(imageName);
            }
        });
        
        // Add all thumbnails
        Object.values(this.imageConfig).forEach(category => {
            category.forEach(item => {
                if (item.thumb) {
                    preloadImages.add(item.thumb);
                }
            });
        });
        
        const imageArray = Array.from(preloadImages);
        const totalImages = imageArray.length;
        let loadedImages = 0;
        
        this.updatePreloadStatus('Loading thumbnails and defaults...', 0);
        
        // Load images in parallel
        const loadPromises = imageArray.map(async (imageName) => {
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        loadedImages++;
                        const progress = (loadedImages / totalImages) * 90; // 90% for preload
                        this.updatePreloadStatus(`Loading ${imageName}...`, progress);
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = imageName;
                });
                this.images[imageName] = img;
            } catch (error) {
                console.warn(`Failed to load image: ${imageName}`, error);
                loadedImages++;
            }
        });
        
        await Promise.all(loadPromises);
        
        this.updatePreloadStatus('Finalizing...', 95);
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        this.updatePreloadStatus('Ready!', 100);
        
        // Final delay before hiding preloader
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    async generateThumbnail(img, size = 60) {
        // Remove this method as we're using pre-made thumbnails
        return null;
    }

    hidePreloader() {
        const overlay = document.getElementById('preload-overlay');
        clearInterval(this.preloadAnimationInterval);
        
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }

    showPreviewLoading() {
        this.isLoadingPreview = true;
        this.render();
    }

    hidePreviewLoading() {
        this.isLoadingPreview = false;
        this.render();
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

            // Add configured images with thumbnails
            this.imageConfig[layerType].forEach(imageData => {
                const isActive = this.currentLayers[layerType] === imageData.file;
                const option = this.createImageOption(imageData.file, imageData.name, layerType, false, isActive, imageData.thumb);
                container.appendChild(option);
            });
        });

        // Generate preset options
        const presetContainer = document.querySelector('.preset-grid');
        if (presetContainer) {
            // Set evil preset as default active
            const selectedPreset = presetContainer.querySelector('[data-preset="neuro"]');
            if (selectedPreset) {
                selectedPreset.classList.add('active');
            }
        }
    }

    createImageOption(file, name, layer, isNone = false, isActive = false, thumbFile = null) {
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
            // Use thumbnail file if available
            const imageSrc = thumbFile || file;
            option.innerHTML = `
                <img src="${imageSrc}" alt="${name}" loading="lazy">
                <span>${name}</span>
            `;
        }

        // Use touchstart for better mobile responsiveness
        const handleSelection = async () => {
            // Remove active class from siblings
            option.parentNode.querySelectorAll('.image-option').forEach(opt => 
                opt.classList.remove('active')
            );
            // Add active class to clicked option
            option.classList.add('active');
            
            // Show loading overlay if switching to a different image
            if (this.currentLayers[layer] !== file && file !== '') {
                this.showPreviewLoading();
                
                // Load the full image if not already loaded
                if (!this.images[file]) {
                    await this.loadImage(file);
                }
                
                // Small delay to show loading animation
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Update layer
            this.currentLayers[layer] = file;
            this.render();
            
            // Hide loading overlay
            this.hidePreviewLoading();
        };

        option.addEventListener('click', handleSelection);
        option.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleSelection();
        });

        return option;
    }

    async loadImage(imageName) {
        if (this.images[imageName]) return; // Already loaded
        
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

    setupEventListeners() {
        // Text controls
        document.getElementById('text-input').addEventListener('input', (e) => {
            this.textSettings.text = e.target.value;
            this.render();
        });

        document.getElementById('stroke-type').addEventListener('change', (e) => {
            this.textSettings.strokeType = e.target.value;
            const colorInput = document.getElementById('stroke-color');
            
            if (e.target.value === 'custom') {
                colorInput.style.display = 'inline-block';
                this.textSettings.strokeColor = colorInput.value;
            } else {
                colorInput.style.display = 'none';
                this.textSettings.strokeColor = this.strokeColors[e.target.value];
            }
            this.render();
        });

        document.getElementById('stroke-color').addEventListener('change', (e) => {
            if (this.textSettings.strokeType === 'custom') {
                this.textSettings.strokeColor = e.target.value;
                this.render();
            }
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

        // Keyboard shortcuts for transform controls
        document.addEventListener('keydown', (e) => {
            if (this.selectedLayer && e.key === 'Delete') {
                this.currentLayers[this.selectedLayer] = '';
                this.selectedLayer = null;
                this.render();
            }
            if (this.selectedLayer && e.key === 'Escape') {
                this.selectedLayer = null;
                this.render();
            }
        });

        // Preset controls
        document.querySelectorAll('.preset-option').forEach(option => {
            option.addEventListener('click', () => {
                this.applyPreset(option.dataset.preset);
                
                // Update active state
                document.querySelectorAll('.preset-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    setupCanvasInteraction() {
        const getMousePos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        };

        const getTouchPos = (e) => {
            if (e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                
                return {
                    x: (e.touches[0].clientX - rect.left) * scaleX,
                    y: (e.touches[0].clientY - rect.top) * scaleY
                };
            }
            return { x: 0, y: 0 };
        };

        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            const pos = getMousePos(e);
            this.handleInteractionStart(pos);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const pos = getMousePos(e);
            this.handleInteractionMove(pos);
        });

        this.canvas.addEventListener('mouseup', () => {
            this.handleInteractionEnd();
        });

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const pos = getTouchPos(e);
            this.handleInteractionStart(pos);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const pos = getTouchPos(e);
            this.handleInteractionMove(pos);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleInteractionEnd();
        });
    }

    handleInteractionStart(pos) {
        // Check if clicking on transform handles first
        if (this.selectedLayer && this.checkTransformHandles(pos)) {
            return;
        }

        // Check overlay layers for selection
        const overlayLayers = ['frontOverlay', 'backOverlay'];
        let layerClicked = null;

        // Check from front to back
        for (const layer of overlayLayers) {
            if (this.currentLayers[layer] && this.isPointInLayer(pos, layer)) {
                layerClicked = layer;
                break;
            }
        }

        if (layerClicked) {
            this.selectedLayer = layerClicked;
            this.isDragging = true;
            this.dragStart = pos;
            this.initialTransform = { ...this.transforms[layerClicked] };
        } else {
            this.selectedLayer = null;
        }
        this.render();
    }

    handleInteractionMove(pos) {
        if (this.isDragging && this.selectedLayer && !this.isScaling && !this.isRotating) {
            const dx = pos.x - this.dragStart.x;
            const dy = pos.y - this.dragStart.y;
            
            this.transforms[this.selectedLayer].x = this.initialTransform.x + dx;
            this.transforms[this.selectedLayer].y = this.initialTransform.y + dy;
            this.render();
        } else if (this.isScaling && this.selectedLayer) {
            const centerX = 800 + this.transforms[this.selectedLayer].x;
            const centerY = 450 + this.transforms[this.selectedLayer].y;
            
            const initialDist = Math.sqrt(
                Math.pow(this.dragStart.x - centerX, 2) + 
                Math.pow(this.dragStart.y - centerY, 2)
            );
            const currentDist = Math.sqrt(
                Math.pow(pos.x - centerX, 2) + 
                Math.pow(pos.y - centerY, 2)
            );
            
            if (initialDist > 0) {
                const scaleFactor = currentDist / initialDist;
                this.transforms[this.selectedLayer].scale = Math.max(0.1, this.initialTransform.scale * scaleFactor);
                this.render();
            }
        } else if (this.isRotating && this.selectedLayer) {
            const centerX = 800 + this.transforms[this.selectedLayer].x;
            const centerY = 450 + this.transforms[this.selectedLayer].y;
            
            const initialAngle = Math.atan2(this.dragStart.y - centerY, this.dragStart.x - centerX);
            const currentAngle = Math.atan2(pos.y - centerY, pos.x - centerX);
            
            this.transforms[this.selectedLayer].rotation = this.initialTransform.rotation + (currentAngle - initialAngle);
            this.render();
        }
    }

    handleInteractionEnd() {
        this.isDragging = false;
        this.isScaling = false;
        this.isRotating = false;
        this.dragStart = { x: 0, y: 0 };
        this.initialTransform = null;
    }

    checkTransformHandles(pos) {
        if (!this.selectedLayer) return false;

        const transform = this.transforms[this.selectedLayer];
        const centerX = 800 + transform.x;
        const centerY = 450 + transform.y;
        
        // Calculate rotated corner positions
        const corners = [
            { x: -800, y: -450 }, // top-left
            { x: 800, y: -450 },  // top-right
            { x: 800, y: 450 },   // bottom-right
            { x: -800, y: 450 }   // bottom-left
        ];
        
        // Check corner scale handles
        for (let i = 0; i < corners.length; i++) {
            const corner = corners[i];
            const rotatedX = centerX + (corner.x * Math.cos(transform.rotation) - corner.y * Math.sin(transform.rotation)) * transform.scale;
            const rotatedY = centerY + (corner.x * Math.sin(transform.rotation) + corner.y * Math.cos(transform.rotation)) * transform.scale;
            
            const cornerDist = Math.sqrt(Math.pow(pos.x - rotatedX, 2) + Math.pow(pos.y - rotatedY, 2));
            
            if (cornerDist < 20) {
                this.isScaling = true;
                this.dragStart = pos;
                this.initialTransform = { ...transform };
                return true;
            }
        }
        
        // Rotation handle (outside the box, top-center)
        const rotHandleX = centerX + (0 * Math.cos(transform.rotation) - (-500) * Math.sin(transform.rotation)) * transform.scale;
        const rotHandleY = centerY + (0 * Math.sin(transform.rotation) + (-500) * Math.cos(transform.rotation)) * transform.scale;
        const rotHandleDist = Math.sqrt(Math.pow(pos.x - rotHandleX, 2) + Math.pow(pos.y - rotHandleY, 2));
        
        if (rotHandleDist < 20) {
            this.isRotating = true;
            this.dragStart = pos;
            this.initialTransform = { ...transform };
            return true;
        }

        return false;
    }

    isPointInLayer(pos, layer) {
        if (!this.currentLayers[layer] || !this.images[this.currentLayers[layer]]) return false;

        const transform = this.transforms[layer];
        const centerX = 800 + transform.x;
        const centerY = 450 + transform.y;
        
        // Simple bounding box check (can be improved with actual image bounds)
        const halfWidth = 200 * transform.scale;
        const halfHeight = 200 * transform.scale;
        
        return pos.x >= centerX - halfWidth && pos.x <= centerX + halfWidth &&
               pos.y >= centerY - halfHeight && pos.y <= centerY + halfHeight;
    }

    drawImage(imageName, layer = 'normal') {
        if (!imageName || !this.images[imageName]) return;
        
        const img = this.images[imageName];
        
        if (layer === 'backOverlay' || layer === 'frontOverlay') {
            const transform = this.transforms[layer];
            
            this.ctx.save();
            this.ctx.translate(800 + transform.x, 450 + transform.y);
            this.ctx.rotate(transform.rotation);
            this.ctx.scale(transform.scale, transform.scale);
            this.ctx.drawImage(img, -800, -450, 1600, 900);
            this.ctx.restore();
        } else {
            // All other images are drawn at the same size and position (full canvas)
            this.ctx.drawImage(img, 0, 0, 1600, 900);
        }
    }

    drawTransformBox() {
        if (!this.selectedLayer || !this.currentLayers[this.selectedLayer]) return;

        const transform = this.transforms[this.selectedLayer];
        const centerX = 800 + transform.x;
        const centerY = 450 + transform.y;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.scale, transform.scale);
        
        // Draw bounding box
        this.ctx.strokeStyle = '#ff4757';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10, 5]);
        this.ctx.strokeRect(-800, -450, 1600, 900);
        
        // Draw corner scale handles
        this.ctx.fillStyle = '#ff4757';
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        
        const corners = [
            { x: -800, y: -450 }, // top-left
            { x: 800, y: -450 },  // top-right
            { x: 800, y: 450 },   // bottom-right
            { x: -800, y: 450 }   // bottom-left
        ];
        
        corners.forEach(corner => {
            this.ctx.beginPath();
            this.ctx.rect(corner.x - 10, corner.y - 10, 20, 20);
            this.ctx.fill();
            this.ctx.stroke();
        });
        
        this.ctx.restore();
        
        // Draw rotation handle (outside the box, top-center)
        const rotHandleX = centerX + (0 * Math.cos(transform.rotation) - (-500) * Math.sin(transform.rotation)) * transform.scale;
        const rotHandleY = centerY + (0 * Math.sin(transform.rotation) + (-500) * Math.cos(transform.rotation)) * transform.scale;
        
        // Draw connection line from box to rotation handle
        this.ctx.strokeStyle = '#ff4757';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        const topCenterX = centerX + (0 * Math.cos(transform.rotation) - (-450) * Math.sin(transform.rotation)) * transform.scale;
        const topCenterY = centerY + (0 * Math.sin(transform.rotation) + (-450) * Math.cos(transform.rotation)) * transform.scale;
        this.ctx.moveTo(topCenterX, topCenterY);
        this.ctx.lineTo(rotHandleX, rotHandleY);
        this.ctx.stroke();
        
        // Draw rotation handle as a circle with rotation icon
        this.ctx.fillStyle = '#ff4757';
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.arc(rotHandleX, rotHandleY, 12, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw rotation icon inside the circle
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(rotHandleX, rotHandleY, 8, 0, Math.PI * 1.5);
        this.ctx.stroke();
        // Arrow for rotation icon
        this.ctx.beginPath();
        this.ctx.moveTo(rotHandleX + 6, rotHandleY - 6);
        this.ctx.lineTo(rotHandleX + 9, rotHandleY - 3);
        this.ctx.lineTo(rotHandleX + 6, rotHandleY - 9);
        this.ctx.stroke();
        
        // Add text labels for clarity
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Label for rotation handle
        this.ctx.strokeText('ROTATE', rotHandleX, rotHandleY + 25);
        this.ctx.fillText('ROTATE', rotHandleX, rotHandleY + 25);
        
        // Label for corner handles (show on one corner to avoid clutter)
        const bottomRightCornerX = centerX + (800 * Math.cos(transform.rotation) - 450 * Math.sin(transform.rotation)) * transform.scale;
        const bottomRightCornerY = centerY + (800 * Math.sin(transform.rotation) + 450 * Math.cos(transform.rotation)) * transform.scale;
        this.ctx.strokeText('SCALE', bottomRightCornerX + 30, bottomRightCornerY);
        this.ctx.fillText('SCALE', bottomRightCornerX + 30, bottomRightCornerY);
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
                
                // Draw main text with stroke and fill using selected stroke color
                this.ctx.strokeStyle = this.textSettings.strokeColor;
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
        
        // Show loading overlay if needed
        if (this.isLoadingPreview) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, 1600, 900);
            
            // Draw loading spinner
            this.ctx.save();
            this.ctx.translate(800, 450);
            this.ctx.strokeStyle = '#ff4757';
            this.ctx.lineWidth = 8;
            this.ctx.lineCap = 'round';
            
            const time = Date.now() * 0.005;
            for (let i = 0; i < 8; i++) {
                this.ctx.save();
                this.ctx.rotate((i * Math.PI) / 4);
                this.ctx.globalAlpha = Math.max(0.1, Math.sin(time + i * 0.5));
                this.ctx.beginPath();
                this.ctx.moveTo(0, -60);
                this.ctx.lineTo(0, -40);
                this.ctx.stroke();
                this.ctx.restore();
            }
            
            // Draw loading text
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Loading...', 0, 20);
            
            this.ctx.restore();
            
            // Continue animation
            requestAnimationFrame(() => this.render());
            return;
        }
        
        // Draw layers in order
        this.drawImage(this.currentLayers.background);
        this.drawImage(this.currentLayers.backOverlay, 'backOverlay');
        this.drawImage(this.currentLayers.body);
        this.drawImage(this.currentLayers.frontOverlay, 'frontOverlay');
        this.drawImage(this.currentLayers.logo);
        
        // Draw text
        this.drawText();
        
        // Draw transform box if layer is selected
        this.drawTransformBox();
    }

    async applyPreset(presetName) {
        if (!this.presets[presetName]) return;
        
        this.showPreviewLoading();
        
        const preset = this.presets[presetName];
        
        // Load any new images that aren't already loaded
        for (const [layer, imageName] of Object.entries(preset)) {
            if (imageName && !this.images[imageName]) {
                await this.loadImage(imageName);
            }
        }
        
        // Apply the preset
        this.currentLayers = { ...preset };
        
        // Reset transforms for overlay layers
        this.transforms.backOverlay = { x: 0, y: 0, scale: 1, rotation: 0 };
        this.transforms.frontOverlay = { x: 0, y: 0, scale: 1, rotation: 0 };
        
        // Update UI to reflect the changes
        this.updateImageSelections();
        
        // Small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.hidePreviewLoading();
        this.render();
    }

    updateImageSelections() {
        // Update active states for all image options
        Object.keys(this.imageConfig).forEach(layerType => {
            const container = document.getElementById(`${layerType}-images`);
            if (!container) return;
            
            container.querySelectorAll('.image-option').forEach(option => {
                option.classList.remove('active');
                if (option.dataset.value === this.currentLayers[layerType]) {
                    option.classList.add('active');
                }
            });
        });
    }

    downloadImage() {
        // Store current selection state
        const previousSelection = this.selectedLayer;
        
        // Temporarily deselect layer to hide transform box
        this.selectedLayer = null;
        
        // Re-render without transform box
        this.render();
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'character.png';
        link.href = this.canvas.toDataURL();
        link.click();
        
        // Restore previous selection state after a brief delay
        setTimeout(() => {
            this.selectedLayer = previousSelection;
            this.render();
        }, 100);
    }
}

// Initialize the character creator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CharacterCreator();
});