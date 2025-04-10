document.addEventListener('DOMContentLoaded', () => {
    const contentIframe = document.getElementById('content-iframe');
    const modeSelector = document.getElementById('mode-selector');
    const laptopModeBtn = document.getElementById('laptop-mode');
    const fullscreenModeBtn = document.getElementById('fullscreen-mode');
    const modeDescription = document.getElementById('mode-description');
    
    // The target URL
    const targetUrl = './blog/index.html';
    
    // Check if viewport is mobile-sized
    const isMobileViewport = () => window.innerWidth <= 768;
    
    // Setup button descriptions on hover
    laptopModeBtn.addEventListener('mouseover', () => {
        modeDescription.textContent = "View the site inside a laptop frame";
    });
    
    fullscreenModeBtn.addEventListener('mouseover', () => {
        modeDescription.textContent = "View the site in fullscreen mode";
    });
    
    laptopModeBtn.addEventListener('mouseout', () => {
        modeDescription.textContent = "Select a viewing mode";
    });
    
    fullscreenModeBtn.addEventListener('mouseout', () => {
        modeDescription.textContent = "Select a viewing mode";
    });
    
    // Button functionality
    laptopModeBtn.addEventListener('click', () => {
        if (!isMobileViewport()) {
            contentIframe.src = targetUrl;
            modeSelector.style.display = 'none';
        }
    });
    
    fullscreenModeBtn.addEventListener('click', () => {
        window.location.href = targetUrl;
    });
    
    // Disable laptop button on mobile
    if (isMobileViewport()) {
        laptopModeBtn.disabled = true;
    }
    
    // Ensure iframe and screen background are properly sized on window resize
    window.addEventListener('resize', () => {
        const laptopFrame = document.querySelector('.laptop-frame');
        const iframe = document.querySelector('.embedded-site');
        const screenBackground = document.querySelector('.screen-background');
        
        if (!isMobileViewport()) {
            // Recalculate iframe position and size based on image dimensions
            const imageWidth = laptopFrame.offsetWidth;
            const imageHeight = laptopFrame.offsetHeight;
            
            const originalWidth = 1920;
            const originalHeight = 1080;
            
            const scale = Math.min(imageWidth / originalWidth, imageHeight / originalHeight);
            
            iframe.style.top = `${99 * scale}px`;
            iframe.style.left = `${481 * scale}px`;
            iframe.style.width = `${957 * scale}px`;
            iframe.style.height = `${725 * scale}px`;
            
            // Also update the white background element
            screenBackground.style.top = `${99 * scale}px`;
            screenBackground.style.left = `${481 * scale}px`;
            screenBackground.style.width = `${957 * scale}px`;
            screenBackground.style.height = `${725 * scale}px`;
            
            // Update laptop button state
            laptopModeBtn.disabled = false;
        } else {
            // Mobile handling - ensure iframe is full screen
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            
            // Disable laptop button on mobile
            laptopModeBtn.disabled = true;
        }
    });
    
    // Trigger resize event to initialize iframe position
    window.dispatchEvent(new Event('resize'));
});