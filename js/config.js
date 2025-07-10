// ===== GAME CONFIGURATION =====

const CONFIG = {
    canvas: {
        width: 800,
        height: 600
    },
    
    lander: {
        size: 15,
        startX: 400,
        startY: 50,
        maxFuel: 100,
        rotationSpeed: 0.05
    },
    
    physics: {
        maxLandingSpeed: 2,
        maxLandingAngle: 0.3,
        drag: 0.999,
        bounceReduction: 0.5,
        initialVelocityRange: 0.6
    },
    
    scoring: {
        baseScore: 1000,
        fuelBonus: 10,
        speedBonus: 500,
        precisionBonus: 1000,
        timeBonus: 2,
        maxTimeForBonus: 60
    },
    
    audio: {
        masterVolume: 0.3,
        musicVolume: 0.02,
        sfxVolume: 0.1
    },
    
    visual: {
        starCount: 100,
        thrustFlameVariation: 10
    }
};

// Difficulty settings
const DIFFICULTIES = {
    easy: {
        gravity: 0.015,
        thrustPower: 0.15,
        fuelConsumptionMain: 0.05,
        fuelConsumptionRotation: 0.02,
        landingPadSize: 120,
        terrainRoughness: 10,
        landingPads: [
            { start: 100, end: 220, height: CONFIG.canvas.height - 80 },
            { start: 580, end: 700, height: CONFIG.canvas.height - 60 }
        ]
    },
    medium: {
        gravity: 0.03,
        thrustPower: 0.12,
        fuelConsumptionMain: 0.08,
        fuelConsumptionRotation: 0.03,
        landingPadSize: 80,
        terrainRoughness: 20,
        landingPads: [
            { start: 160, end: 240, height: CONFIG.canvas.height - 80 },
            { start: 660, end: 740, height: CONFIG.canvas.height - 60 }
        ]
    },
    hard: {
        gravity: 0.05,
        thrustPower: 0.1,
        fuelConsumptionMain: 0.12,
        fuelConsumptionRotation: 0.05,
        landingPadSize: 60,
        terrainRoughness: 35,
        landingPads: [
            { start: 180, end: 240, height: CONFIG.canvas.height - 90 },
            { start: 620, end: 680, height: CONFIG.canvas.height - 70 }
        ]
    },
    nightmare: {
        gravity: 0.07,
        thrustPower: 0.08,
        fuelConsumptionMain: 0.15,
        fuelConsumptionRotation: 0.08,
        landingPadSize: 40,
        terrainRoughness: 50,
        landingPads: [
            { start: 200, end: 240, height: CONFIG.canvas.height - 100 },
            { start: 600, end: 640, height: CONFIG.canvas.height - 80 }
        ]
    }
};
