// You can customize your timer by changing the targetDate
// Set the target date in Unix timestamp (seconds since Jan 1, 1970)
export const config = {
    // Example: December 31, 2023 at midnight UTC
    targetDate: 1742929200, // Change this to your desired timestamp
    
    // Customize gear appearance
    gears: {
        count: 30,         // Number of gears to display
        minSize: 50,       // Minimum size in pixels
        maxSize: 150,      // Maximum size in pixels
        minSpeed: 2,       // Minimum rotation speed (seconds per rotation)
        maxSpeed: 15,      // Maximum rotation speed (seconds per rotation)
        outlineChance: 0.5 // Chance (0-1) that a gear will be outline-only
    }
};