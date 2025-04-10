import { config } from './config.js';
import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('language-toggle');
    
    // Check for saved language preference or use default (en)
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    
    // Language toggle click handler
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const currentLang = config.language.current;
            const newLang = currentLang === 'en' ? 'zh' : 'en';
            
            setLanguage(newLang);
            localStorage.setItem('language', newLang);
        });
    }
    
    function setLanguage(lang) {
        config.language.current = lang;
        
        // Update the button text
        if (languageToggle) {
            if (lang === 'en') {
                languageToggle.innerHTML = '<span class="active-lang">EN</span> / <span>中文</span>';
            } else {
                languageToggle.innerHTML = '<span>EN</span> / <span class="active-lang">中文</span>';
            }
        }
        
        // Update text content based on data-lang attributes
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update page title if on homepage
        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
            document.title = translations[lang].machineTitle;
        }
        
        // Update theme toggle text
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const isDark = document.body.classList.contains('dark-theme');
            const svgContent = themeToggle.querySelector('svg').outerHTML;
            if (isDark) {
                themeToggle.innerHTML = svgContent + ' ' + translations[lang].lightMode;
            } else {
                themeToggle.innerHTML = svgContent + ' ' + translations[lang].darkMode;
            }
        }
    }
});