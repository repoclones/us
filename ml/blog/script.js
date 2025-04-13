document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use default (light)
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"></path></svg> Light Mode';
        }
    }
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (isDark) {
                themeToggle.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"></path></svg>';
            } else {
                themeToggle.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path></svg>';
            }
        });
    }

    // Update visitor counter with random increasing numbers
    const visitorCount = document.getElementById('visitor-count');
    if (visitorCount) {
        let count = parseInt(visitorCount.textContent.replace(/,/g, ''));
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                count += Math.floor(Math.random() * 3) + 1;
                visitorCount.textContent = count.toLocaleString();
            }
        }, 5000);
    }
    
    // Add a "back to top" functionality that appears as you scroll
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '↑ Top';
        button.classList.add('back-to-top');
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.display = 'none';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#ff6b6b';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '100';
        button.style.fontFamily = '"MS PGothic", "Hiragino Kaku Gothic Pro", "Meiryo", sans-serif';
        
        document.body.appendChild(button);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    createBackToTopButton();
    
    // Add a "last updated" timestamp to the footer
    const addLastUpdatedInfo = () => {
        const footerCopyright = document.querySelector('.copyright');
        if (footerCopyright) {
            const lastUpdated = document.createElement('div');
            lastUpdated.classList.add('last-updated');
            lastUpdated.style.marginTop = '0.5rem';
            lastUpdated.style.fontSize = '0.8rem';
            lastUpdated.style.color = '#999';
            
            // Use a fixed date for the 2010s authentic feel
            lastUpdated.textContent = 'Last updated: April 11, 2025';
            
            footerCopyright.parentNode.insertBefore(lastUpdated, footerCopyright.nextSibling);
        }
    };
    
    addLastUpdatedInfo();
    
    // Check if images in gallery are missing and add fallback
    const galleryImages = document.querySelectorAll('.gallery-image img');
    galleryImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('fallback-text')) {
                const fallback = document.createElement('div');
                fallback.classList.add('fallback-text');
                fallback.textContent = "Image unavailable";
                this.parentNode.appendChild(fallback);
            }
        });
    });
    
    // Handle browser history for photo gallery
    const photoDetailContainer = document.querySelector('.photo-detail-container');
    if (photoDetailContainer && window.history.pushState) {
        const backLink = document.querySelector('.back-link a');
        if (backLink) {
            backLink.addEventListener('click', function(e) {
                if (document.referrer.includes(window.location.hostname)) {
                    e.preventDefault();
                    window.history.back();
                }
            });
        }
    }
});