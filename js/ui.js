// ===== UI MANAGEMENT =====

// Cache DOM elements
const elements = {
    score: document.getElementById('score'),
    fuel: document.getElementById('fuel'),
    altitude: document.getElementById('altitude'),
    velocity: document.getElementById('velocity'),
    difficultyScreen: document.getElementById('difficultyScreen'),
    gameOver: document.getElementById('gameOver'),
    highscoreScreen: document.getElementById('highscoreScreen'),
    musicToggle: document.getElementById('musicToggle')
};

function updateUI() {
    const { lander } = game;
    const altitude = Math.max(0, Math.round((CONFIG.canvas.height - lander.y) / 5));
    const velocity = getVelocityMagnitude(lander.vx, lander.vy);
    
    elements.score.textContent = game.score;
    elements.fuel.textContent = Math.max(0, Math.round(lander.fuel));
    elements.altitude.textContent = altitude;
    elements.velocity.textContent = velocity.toFixed(1);
}

function showGameOver(title, message, scoreBreakdown = "") {
    document.getElementById('gameOverTitle').textContent = title;
    document.getElementById('gameOverMessage').textContent = message;
    document.getElementById('scoreBreakdown').innerHTML = scoreBreakdown;
    elements.gameOver.style.display = 'block';
}

function showDifficultyScreen() {
    playButtonSound();
    stopBackgroundMusic();
    game.gameStarted = false;
    game.gameOver = false;
    elements.gameOver.style.display = 'none';
    elements.difficultyScreen.style.display = 'block';
}

function showHighscores() {
    playButtonSound();
    elements.difficultyScreen.style.display = 'none';
    elements.gameOver.style.display = 'none';
    elements.highscoreScreen.style.display = 'block';
    showHighscoreTab('medium');
}

function hideHighscores() {
    playButtonSound();
    elements.highscoreScreen.style.display = 'none';
    if (game.gameStarted) {
        elements.gameOver.style.display = 'block';
    } else {
        elements.difficultyScreen.style.display = 'block';
    }
}

function showHighscoreTab(difficulty) {
    playButtonSound();
    
    // Update button styles
    document.querySelectorAll('#highscoreScreen .highscore-tabs button').forEach(btn => {
        btn.style.background = '#333';
    });
    document.getElementById('hs' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1)).style.background = '#555';
    
    const list = document.getElementById('highscoreList');
    const scores = highscores[difficulty];
    
    if (scores.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666;">No scores yet for ' + difficulty + ' difficulty</p>';
        return;
    }
    
    let html = '<h3>' + difficulty.toUpperCase() + ' DIFFICULTY</h3>';
    html += '<table>';
    html += '<tr><th>Rank</th><th>Score</th><th>Time</th><th>Fuel</th><th>Speed</th><th>Date</th></tr>';
    
    scores.forEach((entry, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td style="font-weight: bold;">${entry.score}</td>
            <td>${entry.time}s</td>
            <td>${entry.fuel}%</td>
            <td>${entry.speed} m/s</td>
            <td>${entry.date}</td>
        </tr>`;
    });
    
    html += '</table>';
    list.innerHTML = html;
}

function clearHighscores() {
    if (confirm('Are you sure you want to clear all highscores?')) {
        playButtonSound();
        highscores = { easy: [], medium: [], hard: [], nightmare: [] };
        localStorage.removeItem('lunarLanderHighscores');
        showHighscoreTab('medium');
    }
}
