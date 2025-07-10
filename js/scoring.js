// ===== SCORING SYSTEM =====

const SCORING = {
    difficultyMultipliers: { easy: 1, medium: 2, hard: 3, nightmare: 5 }
};

function calculateScore() {
    if (!game.won) return { total: 0, breakdown: {}, stats: {} };
    
    const timeTaken = (game.endTime - game.startTime) / 1000;
    const fuelRemaining = Math.max(0, game.lander.fuel);
    const landingSpeed = getVelocityMagnitude(game.lander.vx, game.lander.vy);
    const diffMultiplier = SCORING.difficultyMultipliers[game.difficulty];
    
    let score = CONFIG.scoring.baseScore;
    
    // Calculate bonuses
    const fuelBonus = Math.round(fuelRemaining * CONFIG.scoring.fuelBonus);
    score += fuelBonus;
    
    // Speed bonus for gentle landing
    const speedBonus = landingSpeed < 1 ? CONFIG.scoring.speedBonus : 0;
    score += speedBonus;
    
    // Time bonus if under max time
    let timeBonus = 0;
    if (timeTaken < CONFIG.scoring.maxTimeForBonus) {
        timeBonus = Math.round((CONFIG.scoring.maxTimeForBonus - timeTaken) * CONFIG.scoring.timeBonus);
        score += timeBonus;
    }
    
    // Precision bonus
    score += CONFIG.scoring.precisionBonus;
    
    // Apply difficulty multiplier
    score = Math.round(score * diffMultiplier);
    
    return {
        total: score,
        breakdown: {
            base: Math.round(CONFIG.scoring.baseScore * diffMultiplier),
            fuel: Math.round(fuelBonus * diffMultiplier),
            speed: Math.round(speedBonus * diffMultiplier),
            time: Math.round(timeBonus * diffMultiplier),
            precision: Math.round(CONFIG.scoring.precisionBonus * diffMultiplier),
            multiplier: diffMultiplier
        },
        stats: {
            time: timeTaken,
            fuel: fuelRemaining,
            speed: landingSpeed
        }
    };
}

function addHighscore(difficulty, score, stats) {
    const entry = {
        score: score,
        date: new Date().toLocaleDateString(),
        time: stats.time.toFixed(1),
        fuel: stats.fuel.toFixed(1),
        speed: stats.speed.toFixed(2)
    };
    
    highscores[difficulty].push(entry);
    highscores[difficulty].sort((a, b) => b.score - a.score);
    highscores[difficulty] = highscores[difficulty].slice(0, 10); // Keep top 10
    
    localStorage.setItem('lunarLanderHighscores', JSON.stringify(highscores));
}

function createScoreBreakdownHTML(scoreData) {
    return `
        <h3>🎉 MISSION SUCCESS! 🎉</h3>
        <div style="background: #333; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h4>Score Breakdown:</h4>
            <div>Base Landing: ${scoreData.breakdown.base}</div>
            <div>Fuel Bonus: ${scoreData.breakdown.fuel}</div>
            <div>Speed Bonus: ${scoreData.breakdown.speed}</div>
            <div>Time Bonus: ${scoreData.breakdown.time}</div>
            <div>Precision Bonus: ${scoreData.breakdown.precision}</div>
            <div style="border-top: 1px solid #666; margin-top: 10px; padding-top: 10px;">
                <strong>Total Score: ${scoreData.total}</strong>
            </div>
            <div style="font-size: 12px; color: #ccc; margin-top: 5px;">
                Difficulty Multiplier: x${scoreData.breakdown.multiplier}
            </div>
        </div>
    `;
}
