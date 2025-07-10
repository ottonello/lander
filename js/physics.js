// ===== PHYSICS ENGINE =====

function updatePhysics() {
    if (game.gameOver || !game.gameStarted || game.paused) return;
    
    const { lander } = game;
    const diffSettings = DIFFICULTIES[game.difficulty];
    
    // Apply thrust forces
    if (lander.thrust) {
        const thrustX = Math.sin(lander.angle) * diffSettings.thrustPower;
        const thrustY = -Math.cos(lander.angle) * diffSettings.thrustPower;
        lander.vx += thrustX;
        lander.vy += thrustY;
    }
    
    // Apply rotation thrust
    if (lander.thrustLeft) lander.angle -= game.rotationSpeed;
    if (lander.thrustRight) lander.angle += game.rotationSpeed;
    
    // Apply gravity and update position
    lander.vy += diffSettings.gravity;
    lander.x += lander.vx;
    lander.y += lander.vy;
    
    // Apply drag
    lander.vx *= CONFIG.physics.drag;
    lander.vy *= CONFIG.physics.drag;
    
    // Boundary checks with bounce
    if (lander.x < 0) {
        lander.x = 0;
        lander.vx = Math.abs(lander.vx) * CONFIG.physics.bounceReduction;
    }
    if (lander.x > CONFIG.canvas.width) {
        lander.x = CONFIG.canvas.width;
        lander.vx = -Math.abs(lander.vx) * CONFIG.physics.bounceReduction;
    }
    if (lander.y < 0) {
        lander.y = 0;
        lander.vy = Math.abs(lander.vy) * CONFIG.physics.bounceReduction;
    }
    
    checkCollision();
}

function checkCollision() {
    const { lander } = game;
    const landerBottom = lander.y + lander.size;
    
    // Find terrain height at lander position
    let terrainHeight = CONFIG.canvas.height;
    let isOnLandingPad = false;
    
    for (let i = 0; i < terrain.length - 1; i++) {
        if (lander.x >= terrain[i].x && lander.x <= terrain[i + 1].x) {
            terrainHeight = terrain[i].y;
            isOnLandingPad = terrain[i].isLandingPad;
            break;
        }
    }
    
    if (landerBottom >= terrainHeight) {
        game.endTime = Date.now();
        const speed = getVelocityMagnitude(lander.vx, lander.vy);
        const angle = Math.abs(lander.angle);
        
        // Stop all thrust sounds
        if (typeof stopThrustSound === 'function') stopThrustSound();
        if (typeof stopRotationThrustSound === 'function') stopRotationThrustSound();
        
        // Check landing conditions
        const isSuccessfulLanding = isOnLandingPad && 
                                  speed < CONFIG.physics.maxLandingSpeed && 
                                  angle < CONFIG.physics.maxLandingAngle;
        
        if (isSuccessfulLanding) {
            handleSuccessfulLanding();
        } else {
            handleCrash(isOnLandingPad, speed, angle);
        }
        
        // Stop lander movement
        lander.vx = 0;
        lander.vy = 0;
        lander.y = terrainHeight - lander.size;
    }
}

function handleSuccessfulLanding() {
    game.won = true;
    game.gameOver = true;
    
    if (typeof playLandingSound === 'function') playLandingSound();
    
    // Calculate and save score
    const scoreData = calculateScore();
    game.score = scoreData.total;
    addHighscore(game.difficulty, scoreData.total, scoreData.stats);
    
    // Show success screen
    const breakdown = createScoreBreakdownHTML(scoreData);
    showGameOver("Mission Accomplished!", "Perfect landing! You're a true pilot.", breakdown);
}

function handleCrash(isOnLandingPad, speed, angle) {
    game.gameOver = true;
    game.score = 0;
    
    if (typeof playCrashSound === 'function') playCrashSound();
    
    let message = "Crashed! ";
    if (!isOnLandingPad) message += "You must land on the flat surfaces.";
    else if (speed >= CONFIG.physics.maxLandingSpeed) message += "Landing speed too high!";
    else if (angle >= CONFIG.physics.maxLandingAngle) message += "Landing angle too steep!";
    
    showGameOver("Mission Failed", message, "");
}

// Utility functions
function getVelocityMagnitude(vx, vy) {
    return Math.sqrt(vx * vx + vy * vy);
}

function getRandomInitialVelocity() {
    return (Math.random() - 0.5) * CONFIG.physics.initialVelocityRange;
}
