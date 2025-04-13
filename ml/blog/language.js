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
                element.innerHTML = translations[lang][key];
            }
        });
        
        
        
        // Update theme toggle text

    }
});