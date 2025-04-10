// Configuration settings for Machine Love Blog
export const config = {
    // Blog settings
    blog: {
        title: "Machine Love",
        subtitle: "A digital heart's journey",
        authorName: "J. Turing",
        startYear: 2013,
        postsPerPage: 3
    },
    
    // Visual settings
    visuals: {
        primaryColor: "#ff6b6b",
        secondaryColor: "#333333",
        enableAnimations: true,
        enableSounds: false, // Set to true to enable hover sounds
        pixelArt: true
    },
    
    // Content settings
    content: {
        // Number of machine thoughts in the rotation
        thoughtCount: 10,
        
        // Enable or disable features
        enableGuestbook: true,
        enableComments: true,
        enableVisitorCounter: true
    },
    
    // Language settings
    language: {
        current: 'en',
        available: ['en', 'zh']
    },
    
    // Social media links (add your own URLs)
    social: {
        twitter: "https://twitter.com/machinelove",
        linkedin: "https://linkedin.com/in/jturing",
        rss: "/rss.xml"
    }
};

export default config;