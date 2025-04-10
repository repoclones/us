const config = {
    // Canvas dimensions
    //canvasWidth: 600, 1200
    //canvasHeight: 500, 900
    canvasWidth: 1200,
    canvasHeight: 900,
    // Game settings
    //gridSize: 20,
    gridSize: 20,
    initialSpeed: 150,  // milliseconds between moves (lower = faster)
    speedIncrease: 5,   // how much to decrease interval after eating food
    minSpeed: 50,       // fastest possible speed
    
    // Colors
    snakeColor: "#4CAF50",
    snakeHeadColor: "#2E7D32",
    foodColor: "#F44336",
    gridColor: "#E0E0E0",
    
    // Power-up color gradients
    powerUpGradients: {
        "Regular": { colors: ["#F44336", "#D32F2F"], type: "linear" },
        "Speed Boost": { colors: ["#2196F3", "#1565C0"], type: "radial" },
        "Double Points": { colors: ["#FFC107", "#FF8F00"], type: "sparkle" },
        "Ghost Mode": { colors: ["#9C27B0", "#6A1B9A"], type: "pulse" },
        "Size Reduce": { colors: ["#00BCD4", "#00838F"], type: "linear" },
        "Reverse Controls": { colors: ["#795548", "#4E342E"], type: "spiral" },
        "Slow Motion": { colors: ["#FF9800", "#EF6C00"], type: "pulse" },
        "Portal Snake": { colors: ["#E91E63", "#AD1457"], type: "portal" },
        "Magnet Food": { colors: ["#4CAF50", "#2E7D32"], type: "radial" },
        "Invisible Snake": { colors: ["#9E9E9E", "#616161"], type: "fade" },
        "Rainbow Snake": { colors: ["#FFEB3B", "#FBC02D"], type: "rainbow" },
        "Teleportation": { colors: ["#607D8B", "#455A64"], type: "teleport" },
        "Laser Snake": { colors: ["#FF5722", "#BF360C"], type: "beam" },
        "Bomb Time": { colors: ["#FF1744", "#D50000"], type: "explosive" },
        "Mirror World": { colors: ["#6495ED", "#1A237E"], type: "mirror" },
        "Target Lock": { colors: ["#F44336", "#B71C1C"], type: "target" },
        "Growth Boost": { colors: ["#76FF03", "#558B2F"], type: "grow" },
        "Time Warp": { colors: ["#18FFFF", "#006064"], type: "ripple" },
        "Gravity Well": { colors: ["#9C27B0", "#4A148C"], type: "gravity" },
        "Phasing Snake": { colors: ["#3A1B75", "#1A0033"], type: "phase" },
        "Shape Shifter": { colors: ["#33691E", "#003300"], type: "morph" },
        "Treasure Hunter": { colors: ["#FFD700", "#B7950B"], type: "glitter" },
        "Neon Trail": { colors: ["#00E5FF", "#00B8D4"], type: "neon" },
        "Time Freeze": { colors: ["#AEEA00", "#64DD17"], type: "ice" },
        "Reality Bend": { colors: ["#BA68C8", "#7B1FA2"], type: "warp" },
        "Snake Fusion": { colors: ["#7986CB", "#3949AB"], type: "fusion" },
        "Echo Trail": { colors: ["#4A148C", "#26004D"], type: "echo" },
        "Quantum Tunneling": { colors: ["#3F51B5", "#1A237E"], type: "quantum" },
        "Dimension Shift": { colors: ["#00BFA5", "#00695C"], type: "dimension" },
        "Time Rewind": { colors: ["#FF4081", "#C2185B"], type: "rewind" },
        "Spectral Vision": { colors: ["#7C4DFF", "#4527A0"], type: "spectral" },
        "Nature's Touch": { colors: ["#43A047", "#1B5E20"], type: "nature" },
        "Elemental Mastery": { colors: ["#FF6F00", "#E65100"], type: "elemental" },
        "Shadow Clone": { colors: ["#424242", "#212121"], type: "shadow" },
        "Starfield": { colors: ["#1E88E5", "#0D47A1"], type: "sparkle" },
        "Black Hole": { colors: ["#311B92", "#7C4DFF"], type: "gravity" },
        "Cosmic Wave": { colors: ["#5E35B1", "#D1C4E9"], type: "ripple" },
        "Celestial Shield": { colors: ["#64B5F6", "#0D47A1"], type: "pulse" },
        "Asteroid Field": { colors: ["#795548", "#4E342E"], type: "explosive" },
        "Nova Blast": { colors: ["#FF5722", "#FFAB91"], type: "beam" },
        "Supermassive": { colors: ["#880E4F", "#F8BBD0"], type: "grow" },
        "Mirror Dimension": { colors: ["#8884FF", "#5151FF"], type: "mirror" },
        "Time Loop": { colors: ["#FF7730", "#FF5722"], type: "pulse" },
        "Void Zones": { colors: ["#1B0033", "#210044"], type: "gravity" },
        "Spatial Fold": { colors: ["#00ACC1", "#006064"], type: "portal" },
        "Reality Fragments": { colors: ["#FF80AB", "#C51162"], type: "warp" },
        "Infinity Loop": { colors: ["#1B5E20", "#43A047"], type: "spiral" },
        "Quantum State": { colors: ["#1A237E", "#3949AB"], type: "quantum" },
        "Anti Gravity": { colors: ["#00BFFF", "#1E90FF"], type: "pulse" },
        "Magnetic Field": { colors: ["#FF4500", "#FF8C00"], type: "radial" },
        "Light Speed": { colors: ["#87CEFA", "#1E90FF"], type: "beam" },
        "Time Rift": { colors: ["#FF6347", "#FF7F50"], type: "ripple" },
        "Wormhole Field": { colors: ["#4169E1", "#000080"], type: "portal" },
        "Multi Dimensional": { colors: ["#8A2BE2", "#9400D3"], type: "dimension" },
        "Quantum Entanglement": { colors: ["#9932CC", "#8B008B"], type: "quantum" },
        "Schrodinger State": { colors: ["#708090", "#2F4F4F"], type: "fade" },
        "Particle Accelerator": { colors: ["#40E0D0", "#48D1CC"], type: "beam" },
        "Quantum Decoherence": { colors: ["#6495ED", "#4169E1"], type: "ripple" },
        "String Theory": { colors: ["#20B2AA", "#008B8B"], type: "spiral" },
        "Heisenberg Uncertainty": { colors: ["#4682B4", "#4169E1"], type: "quantum" },
        "Dragon Breath": { colors: ["#FF4500", "#FF8C00"], type: "explosive" },
        "Wizard Spells": { colors: ["#9370DB", "#8A2BE2"], type: "sparkle" },
        "Fairy Dust": { colors: ["#FFD700", "#FFA07A"], type: "glitter" },
        "Necromancy": { colors: ["#39FF14", "#00FF00"], type: "pulse" },
        "Shapeshifting": { colors: ["#8B4513", "#A0522D"], type: "morph" },
        "Time Manipulation": { colors: ["#00FFFF", "#00CED1"], type: "ripple" },
        "Telepathy": { colors: ["#EE82EE", "#DA70D6"], type: "pulse" },
        "Telekinesis": { colors: ["#FF69B4", "#FF1493"], type: "target" },
        "Astral Projection": { colors: ["#6495ED", "#4169E1"], type: "fade" },
        "Mind Control": { colors: ["#9B59B6", "#8E44AD"], type: "spiral" },
        "Precognition": { colors: ["#27AE60", "#2ECC71"], type: "pulse" },
        "Psychokinesis": { colors: ["#7D3C98", "#6C3483"], type: "wave" }
    },
    
    // Food types and powers
    foodTypes: [
        { color: "#F44336", name: "Regular", chance: 40, discovered: true },
        { color: "#2196F3", name: "Speed Boost", chance: 10, discovered: false },
        { color: "#FFC107", name: "Double Points", chance: 10, discovered: false },
        { color: "#9C27B0", name: "Ghost Mode", chance: 5, discovered: false },
        { color: "#00BCD4", name: "Size Reduce", chance: 5, discovered: false },
        { color: "#795548", name: "Reverse Controls", chance: 5, discovered: false },
        { color: "#FF9800", name: "Slow Motion", chance: 5, discovered: false },
        { color: "#E91E63", name: "Portal Snake", chance: 5, discovered: false },
        { color: "#4CAF50", name: "Magnet Food", chance: 5, discovered: false },
        { color: "#9E9E9E", name: "Invisible Snake", chance: 5, discovered: false },
        { color: "#FFEB3B", name: "Rainbow Snake", chance: 3, discovered: false },
        { color: "#607D8B", name: "Teleportation", chance: 2, discovered: false },
        // New power-ups
        { color: "#FF5722", name: "Laser Snake", chance: 3, discovered: false },
        { color: "#FF1744", name: "Bomb Time", chance: 2, discovered: false },
        { color: "#6495ED", name: "Mirror World", chance: 3, discovered: false },
        { color: "#F44336", name: "Target Lock", chance: 4, discovered: false },
        { color: "#76FF03", name: "Growth Boost", chance: 3, discovered: false },
        { color: "#18FFFF", name: "Time Warp", chance: 0, discovered: true },
        { color: "#9C27B0", name: "Gravity Well", chance: 2, discovered: false },
        // Newer power-ups
        { color: "#3A1B75", name: "Phasing Snake", chance: 3, discovered: false },
        { color: "#33691E", name: "Shape Shifter", chance: 2, discovered: false },
        { color: "#FFD700", name: "Treasure Hunter", chance: 4, discovered: false },
        { color: "#00E5FF", name: "Neon Trail", chance: 3, discovered: false },
        { color: "#AEEA00", name: "Time Freeze", chance: 2, discovered: false },
        // Advanced extension power-ups
        { color: "#BA68C8", name: "Reality Bend", chance: 2, discovered: false },
        { color: "#7986CB", name: "Snake Fusion", chance: 3, discovered: false },
        { color: "#4A148C", name: "Echo Trail", chance: 3, discovered: false },
        { color: "#3F51B5", name: "Quantum Tunneling", chance: 2, discovered: false },
        { color: "#00BFA5", name: "Dimension Shift", chance: 2, discovered: false },
        // New super power-ups
        { color: "#FF4081", name: "Time Rewind", chance: 1, discovered: false },
        { color: "#7C4DFF", name: "Spectral Vision", chance: 2, discovered: false },
        { color: "#43A047", name: "Nature's Touch", chance: 2, discovered: false },
        { color: "#FF6F00", name: "Elemental Mastery", chance: 2, discovered: false },
        { color: "#424242", name: "Shadow Clone", chance: 2, discovered: false },
        { color: "#1E88E5", name: "Starfield", chance: 2, discovered: false },
        { color: "#311B92", name: "Black Hole", chance: 1, discovered: false },
        { color: "#5E35B1", name: "Cosmic Wave", chance: 2, discovered: false },
        { color: "#64B5F6", name: "Celestial Shield", chance: 3, discovered: false },
        { color: "#795548", name: "Asteroid Field", chance: 2, discovered: false },
        { color: "#FF5722", name: "Nova Blast", chance: 1, discovered: false },
        { color: "#880E4F", name: "Supermassive", chance: 1, discovered: false },
        { color: "#8884FF", name: "Mirror Dimension", chance: 2, discovered: false },
        { color: "#FF7730", name: "Time Loop", chance: 2, discovered: false },
        { color: "#1B0033", name: "Void Zones", chance: 2, discovered: false },
        { color: "#00ACC1", name: "Spatial Fold", chance: 2, discovered: false },
        { color: "#FF80AB", name: "Reality Fragments", chance: 2, discovered: false },
        { color: "#1B5E20", name: "Infinity Loop", chance: 1, discovered: false },
        { color: "#1A237E", name: "Quantum State", chance: 2, discovered: false },
        // Physical power-ups
        { color: "#00BFFF", name: "Anti Gravity", chance: 2, discovered: false },
        { color: "#FF4500", name: "Magnetic Field", chance: 2, discovered: false },
        { color: "#87CEFA", name: "Light Speed", chance: 2, discovered: false },
        { color: "#FF6347", name: "Time Rift", chance: 2, discovered: false },
        { color: "#4169E1", name: "Wormhole Field", chance: 2, discovered: false },
        { color: "#8A2BE2", name: "Multi Dimensional", chance: 1, discovered: false },
        // Quantum power-ups
        { color: "#9932CC", name: "Quantum Entanglement", chance: 2, discovered: false },
        { color: "#708090", name: "Schrodinger State", chance: 2, discovered: false },
        { color: "#40E0D0", name: "Particle Accelerator", chance: 0, discovered: true },
        { color: "#6495ED", name: "Quantum Decoherence", chance: 2, discovered: false },
        { color: "#20B2AA", name: "String Theory", chance: 2, discovered: false },
        { color: "#4682B4", name: "Heisenberg Uncertainty", chance: 2, discovered: false },
        // Fantasy power-ups
        { color: "#FF4500", name: "Dragon Breath", chance: 2, discovered: false },
        { color: "#9370DB", name: "Wizard Spells", chance: 2, discovered: false },
        { color: "#FFD700", name: "Fairy Dust", chance: 2, discovered: false },
        { color: "#39FF14", name: "Necromancy", chance: 2, discovered: false },
        { color: "#8B4513", name: "Shapeshifting", chance: 2, discovered: false },
        { color: "#00FFFF", name: "Time Manipulation", chance: 2, discovered: false },
        // Psychic power-ups
        { color: "#EE82EE", name: "Telepathy", chance: 2, discovered: false },
        { color: "#FF69B4", name: "Telekinesis", chance: 2, discovered: false },
        { color: "#6495ED", name: "Astral Projection", chance: 2, discovered: false },
        { color: "#9B59B6", name: "Mind Control", chance: 2, discovered: false },
        { color: "#27AE60", name: "Precognition", chance: 2, discovered: false },
        { color: "#7D3C98", name: "Psychokinesis", chance: 2, discovered: false }
    ],
    
    // Power-up durations (in milliseconds)
    powerUpDuration: 10000,
    
    // Number of food items
    foodCount: 300,
    
    // New configurations for enhanced features
    magnetRadius: 3,            // Grid cells radius for magnet attraction
    teleportDistance: 5,        // Distance for teleportation
    rainbowInterval: 200,       // Milliseconds between color changes
    portalDuration: 3000,       // Duration for portal pairs in ms
    timeRewindDuration: 5000,    // Duration for time rewind effect in ms
    natureTouchSpeed: 0.5,       // Growth speed for nature's touch
    elementalCycleDuration: 1000, // Duration between elemental cycles
    shadowCloneCount: 3,         // Number of shadow clones created
    
    // Advanced power-up configurations
    growthBoostAmount: 3,       // Extra segments added with Growth Boost
    flashDuration: 500,         // Duration of power-up flash in ms
    flashingEnabled: true       // Enable flashing for newly discovered power-ups
};

export default config;