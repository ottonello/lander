// ===== GAME STATE MANAGEMENT =====

// Main game state object
const game = {
    // Lander properties
    lander: {
        x: CONFIG.lander.startX,
        y: CONFIG.lander.startY,
        vx: 0, vy: 0, angle: 0,
        fuel: CONFIG.lander.maxFuel,
        thrust: false, thrustLeft: false, thrustRight: false,
        size: CONFIG.lander.size
    },
    
    // Game state flags
    gameStarted: false,
    gameOver: false,
    won: false,
    paused: false,
    
    // Game settings
    difficulty: 'medium',
    rotationSpeed: CONFIG.lander.rotationSpeed,
    
    // Scoring
    score: 0,
    startTime: 0,
    endTime: 0,
    
    // Visual elements
    stars: []
};

// Terrain data
let terrain = [];

// Highscores storage
let highscores = JSON.parse(localStorage.getItem('lunarLanderHighscores')) || {
    easy: [],
    medium: [],
    hard: [],
    nightmare: []
};

// ===== GAME STATE FUNCTIONS =====

function resetLander() {
    // Stop any playing sounds
    if (typeof stopThrustSound === 'function') stopThrustSound();
    if (typeof stopRotationThrustSound === 'function') stopRotationThrustSound();
    
    // Reset lander to initial state
    Object.assign(game.lander, {
        x: CONFIG.lander.startX,
        y: CONFIG.lander.startY,
        vx: 0, vy: 0, angle: 0,
        fuel: CONFIG.lander.maxFuel,
        thrust: false, thrustLeft: false, thrustRight: false,
        size: CONFIG.lander.size
    });
    
    // Reset game flags
    game.gameOver = false;
    game.won = false;
    game.paused = false;
}

function generateStars() {
    game.stars = [];
    for (let i = 0; i < CONFIG.visual.starCount; i++) {
        game.stars.push({
            x: Math.random() * CONFIG.canvas.width,
            y: Math.random() * CONFIG.canvas.height * 0.7,
            brightness: Math.random()
        });
    }
}

function generateTerrain() {
    terrain.length = 0;
    let height = CONFIG.canvas.height - 100;
    
    const diffSettings = DIFFICULTIES[game.difficulty];
    const landingPads = diffSettings.landingPads;
    const roughness = diffSettings.terrainRoughness;
    
    for (let x = 0; x <= CONFIG.canvas.width; x += 10) {
        let isLandingPad = false;
        let padHeight = height;
        
        // Check if this x position is on a landing pad
        for (let pad of landingPads) {
            if (x >= pad.start && x <= pad.end) {
                isLandingPad = true;
                padHeight = pad.height;
                break;
            }
        }
        
        if (isLandingPad) {
            height = padHeight;
        } else {
            // Add randomness based on difficulty
            height += (Math.random() - 0.5) * roughness;
            height = Math.max(CONFIG.canvas.height - 250, Math.min(CONFIG.canvas.height - 40, height));
        }
        
        terrain.push({ x: x, y: height, isLandingPad: isLandingPad });
    }
}
