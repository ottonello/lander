// ===== INPUT HANDLING =====

// Input state
const keys = {
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    Enter: false
};

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code in keys) {
        keys[e.code] = true;
        e.preventDefault();
    }
    
    // Handle restart
    if (e.code === 'Space' && game.gameOver) {
        restartGame();
        e.preventDefault();
    }
    
    // Handle pause toggle
    if (e.code === 'Enter' && game.gameStarted && !game.gameOver) {
        game.paused = !game.paused;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code in keys) {
        keys[e.code] = false;
        e.preventDefault();
    }
});

// Reset keys when window loses focus
window.addEventListener('blur', () => {
    Object.keys(keys).forEach(key => keys[key] = false);
});

// Handle input processing
function handleInput() {
    if (game.gameOver || !game.gameStarted || game.paused) return;
    
    const diffSettings = DIFFICULTIES[game.difficulty];
    
    // Reset thrust states
    game.lander.thrust = false;
    game.lander.thrustLeft = false;
    game.lander.thrustRight = false;
    
    // Handle main thrust
    if (keys.ArrowUp && game.lander.fuel > 0) {
        game.lander.thrust = true;
        game.lander.fuel -= diffSettings.fuelConsumptionMain;
        game.lander.fuel = Math.max(0, game.lander.fuel);
        if (typeof startThrustSound === 'function') startThrustSound();
    } else {
        if (typeof stopThrustSound === 'function') stopThrustSound();
    }
    
    // Handle rotation thrust
    let rotationActive = false;
    if (keys.ArrowLeft && game.lander.fuel > 0) {
        game.lander.thrustLeft = true;
        game.lander.fuel -= diffSettings.fuelConsumptionRotation;
        game.lander.fuel = Math.max(0, game.lander.fuel);
        rotationActive = true;
    }
    
    if (keys.ArrowRight && game.lander.fuel > 0) {
        game.lander.thrustRight = true;
        game.lander.fuel -= diffSettings.fuelConsumptionRotation;
        game.lander.fuel = Math.max(0, game.lander.fuel);
        rotationActive = true;
    }
    
    // Manage rotation thrust sound
    if (rotationActive) {
        if (typeof startRotationThrustSound === 'function') startRotationThrustSound();
    } else {
        if (typeof stopRotationThrustSound === 'function') stopRotationThrustSound();
    }
}
