document.addEventListener('DOMContentLoaded', () => {
    // Variables for position customization
    const root = document.documentElement;
    
    // These can be adjusted as needed
    root.style.setProperty('--left-pos', '5%');    // Left character position
    root.style.setProperty('--right-pos', '5%');   // Right character position
    root.style.setProperty('--bottom-pos', '15%'); // Characters bottom position

    // Scroll to top on page load/refresh
    window.onbeforeunload = function() {
        window.scrollTo(0, 0);
    }

    // Preload images
    const imagesToPreload = [
        './tig-evil.png',
        './tig-neuro.png',
        './tig-background.png',
        './tig-background_sig.png',
        './tig-plusieballon.png',
        './tig-plusieballon_s.png'
    ];

    let loadedImages = 0;
    const preloader = document.getElementById('preloader');
    const loadingText = document.getElementById('loading-text');
    const introContainer = document.getElementById('intro-container');
    const galleryContainer = document.getElementById('gallery-container');
    const background = document.getElementById('background');
    const backgroundSig = document.getElementById('background-sig');
    const neuro = document.getElementById('neuro');
    const evil = document.getElementById('evil');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const typewriterContainer = document.getElementById('typewriter-container');
    const titleElement = document.getElementById('typewriter-title');
    const subtitleElement = document.getElementById('typewriter-subtitle');

    // Preload images
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages++;
            loadingText.textContent = `Loading... ${Math.floor((loadedImages / imagesToPreload.length) * 100)}%`;
            
            if (loadedImages === imagesToPreload.length) {
                startIntro();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            loadedImages++;
            if (loadedImages === imagesToPreload.length) {
                startIntro();
            }
        };
    });

    // Create stars for the intro bottom border
    function createIntroBottomStars() {
        const starContainer = document.createElement('div');
        starContainer.classList.add('intro-bottom-stars');
        
        const windowWidth = window.innerWidth;
        const starCount = Math.floor(windowWidth / 30); // Adjust density as needed
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('intro-star');
            
            // Position horizontally across the bottom
            const left = Math.random() * 100;
            const bottom = Math.random() * 50;
            
            star.style.left = `${left}%`;
            star.style.bottom = `${bottom}px`;
            
            // Random star size
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Animation delay
            const delay = Math.random() * 3;
            star.style.animationDelay = `${delay}s`;
            
            starContainer.appendChild(star);
        }
        
        introContainer.appendChild(starContainer);
    }

    // Create floating space stars for the content page background
    function createSpaceStars() {
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('space-star');
            
            // Random position
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;
            
            // Random star size (smaller on average than intro stars)
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random animation properties
            const duration = Math.random() * 8 + 4;
            star.style.setProperty('--star-duration', `${duration}s`);
            
            const delay = Math.random() * 5;
            star.style.setProperty('--star-delay', `${delay}s`);
            
            const floatDistance = Math.random() * 50 + 10;
            star.style.setProperty('--float-distance', `${floatDistance}px`);
            
            galleryContainer.appendChild(star);
        }
    }

    // Start the intro sequence
    function startIntro() {
        setTimeout(() => {
            typewriterContainer.classList.add('visible');
            typeWriter(titleElement, "Neuro & Evil's", 0, 50, () => {
                setTimeout(() => {
                    typeWriter(subtitleElement, "Space Project 2025", 0, 50, () => {
                        // Show content page immediately after typewriter effect completes
                        galleryContainer.classList.remove('hidden');
                        galleryContainer.classList.add('visible');
                    });
                }, 500);
            });
            
            // Show scroll indicator
            setTimeout(() => {
                scrollIndicator.classList.remove('hidden');
                scrollIndicator.classList.add('visible');
            }, 1000);
        }, 3000);
        // Hide preloader and show intro
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                introContainer.classList.remove('hidden');
                introContainer.classList.add('visible');
                
                // Show characters
                setTimeout(() => {
                    neuro.classList.add('visible');
                    evil.classList.add('visible');
                    
                    // Background crossfade
                    setTimeout(() => {
                        background.classList.add('faded');
                        backgroundSig.classList.remove('hidden');
                        
                        // Create stars at the bottom of intro container
                        createIntroBottomStars();
                    }, 2000);
                }, 500);
            }, 500);
        }, 1000);
        
        // Create space stars for content page
        createSpaceStars();
    }

    // Typewriter effect function
    function typeWriter(element, text, index, speed, callback) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(() => typeWriter(element, text, index, speed, callback), speed);
        } else if (callback) {
            callback();
        }
    }

    // Handle scroll event
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // If user has scrolled at least 90% of the intro container height
        if (scrollPosition > windowHeight * 0.9) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollPosition < windowHeight * 0.5) {
            scrollIndicator.style.opacity = '1';
        }
        
        // Check if content sections are in view for fade-in animation
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < windowHeight * 0.85) {
                section.classList.add('fade-in');
            }
        });
    });

    // Add smooth scroll functionality for the scroll indicator
    scrollIndicator.addEventListener('click', () => {
        galleryContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // Handle touch swipe to scroll down
    let touchStart = 0;
    let touchEnd = 0;

    document.addEventListener('touchstart', e => {
        touchStart = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', e => {
        touchEnd = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        // If swiping up (touchEnd is higher in the screen, so lower value)
        if (touchStart - touchEnd > 50 && window.scrollY < window.innerHeight * 0.5) {
            galleryContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Video carousel functionality
    const videoItems = document.querySelectorAll('.video-item');
    const prevButton = document.getElementById('prev-video');
    const nextButton = document.getElementById('next-video');
    const videoIndicators = document.querySelectorAll('.video-indicator');
    let currentVideoIndex = 0;
    
    // Initialize videos - show first one
    function initializeVideos() {
        videoItems.forEach((item, index) => {
            if (index === 0) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        updateVideoIndicators();
        updateVideoButtons();
    }
    
    // Update video indicators
    function updateVideoIndicators() {
        videoIndicators.forEach((indicator, index) => {
            if (index === currentVideoIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Update video navigation buttons
    function updateVideoButtons() {
        prevButton.disabled = currentVideoIndex === 0;
        nextButton.disabled = currentVideoIndex === videoItems.length - 1;
    }
    
    // Show a specific video
    function showVideo(index) {
        if (index < 0 || index >= videoItems.length) return;
        
        // Hide all videos
        videoItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected video
        videoItems[index].classList.add('active');
        currentVideoIndex = index;
        
        updateVideoIndicators();
        updateVideoButtons();
    }
    
    // Event listeners for video navigation
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentVideoIndex > 0) {
                showVideo(currentVideoIndex - 1);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentVideoIndex < videoItems.length - 1) {
                showVideo(currentVideoIndex + 1);
            }
        });
    }
    
    // Video indicator click events
    videoIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showVideo(index);
        });
    });
    
    // Initialize videos when page loads
    initializeVideos();

    // Gallery modal functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.querySelector('.modal-image');
    const modalArtist = document.querySelector('.modal-artist');
    const modalCommissioner = document.querySelector('.modal-commissioner');
    const closeModal = document.querySelector('.close-modal');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const artist = item.querySelector('.artist-name').textContent;
            const commissionerElement = item.querySelector('.commissioner-name');
            const commissioner = commissionerElement ? commissionerElement.textContent : "";
            
            // Set modal content
            modalImage.src = imgSrc;
            modalArtist.textContent = artist;
            modalCommissioner.textContent = commissioner;
            
            // Show modal
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close modal when clicking close button
    closeModal.addEventListener('click', () => {
        imageModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
    
    // Close modal when clicking outside the image
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            imageModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});