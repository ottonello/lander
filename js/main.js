// ===== MAIN GAME LOOP AND INITIALIZATION =====

function startGame(difficulty) {
    console.log('Starting game with difficulty:', difficulty);
    
    // Initialize audio on first user interaction
    if (!audioContext) initAudio();
    
    playButtonSound();
    if (musicEnabled) startBackgroundMusic();
    
    // Set game state
    Object.assign(game, {
        difficulty,
        gameStarted: true,
        startTime: Date.now(),
        score: 0
    });
    
    elements.difficultyScreen.style.display = 'none';
    resetLander();
    generateTerrain();
    
    // Add random initial velocity
    game.lander.vx = getRandomInitialVelocity();
}

function restartGame() {
    playButtonSound();
    resetLander();
    generateTerrain();
    elements.gameOver.style.display = 'none';
    
    // Reset game state
    game.lander.vx = getRandomInitialVelocity();
    game.startTime = Date.now();
    game.score = 0;
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    
    if (game.gameStarted) {
        // Update game logic
        handleInput();
        updatePhysics();
        
        // Render everything
        drawStars();
        drawTerrain();
        drawLander();
        drawFuelGauge();
        drawPauseOverlay();
        
        // Update UI
        updateUI();
    } else {
        // Draw stars on menu screen
        drawStars();
        
        // Draw title screen message
        ctx.fillStyle = '#fff';
        ctx.font = '24px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('Select difficulty to begin mission', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2);
        ctx.textAlign = 'left';
    }
    
    requestAnimationFrame(gameLoop);
}

// ===== INITIALIZATION =====

function initializeGame() {
    console.log('🚀 Lunar Lander Game Initialized');
    
    // Generate initial stars
    generateStars();
    
    // Start the game loop
    gameLoop();
    
    // Focus canvas for input
    canvas.focus();
    canvas.addEventListener('click', () => canvas.focus());
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initializeGame);
