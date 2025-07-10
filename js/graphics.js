// ===== GRAPHICS RENDERING =====

// Get canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function drawStars() {
    ctx.fillStyle = '#fff';
    for (let star of game.stars) {
        ctx.globalAlpha = star.brightness;
        ctx.fillRect(star.x, star.y, 1, 1);
    }
    ctx.globalAlpha = 1;
}

function drawTerrain() {
    ctx.strokeStyle = '#666';
    ctx.fillStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, CONFIG.canvas.height);
    
    for (let point of terrain) {
        ctx.lineTo(point.x, point.y);
    }
    
    ctx.lineTo(CONFIG.canvas.width, CONFIG.canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw landing pads in green
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 3;
    for (let i = 0; i < terrain.length - 1; i++) {
        if (terrain[i].isLandingPad) {
            ctx.beginPath();
            ctx.moveTo(terrain[i].x, terrain[i].y);
            ctx.lineTo(terrain[i + 1].x, terrain[i + 1].y);
            ctx.stroke();
        }
    }
}

function drawLander() {
    const { lander } = game;
    
    ctx.save();
    ctx.translate(lander.x, lander.y);
    ctx.rotate(lander.angle);
    
    // Draw lander body
    ctx.fillStyle = '#fff';
    ctx.fillRect(-8, -8, 16, 16);
    
    // Draw landing legs
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.lineTo(-12, 16);
    ctx.moveTo(8, 8);
    ctx.lineTo(12, 16);
    ctx.stroke();
    
    // Draw main thrust flame
    if (lander.thrust && lander.fuel > 0) {
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(-4, 8);
        ctx.lineTo(0, 20 + Math.random() * CONFIG.visual.thrustFlameVariation);
        ctx.lineTo(4, 8);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw rotation thrust flames
    if (lander.thrustLeft && lander.fuel > 0) {
        ctx.fillStyle = '#4444ff';
        ctx.fillRect(8, -2, 8, 4);
    }
    if (lander.thrustRight && lander.fuel > 0) {
        ctx.fillStyle = '#4444ff';
        ctx.fillRect(-16, -2, 8, 4);
    }
    
    ctx.restore();
}

function drawFuelGauge() {
    if (!game.gameStarted || game.gameOver) return;
    
    const gaugeX = CONFIG.canvas.width - 120;
    const gaugeY = 20;
    const gaugeWidth = 100;
    const gaugeHeight = 20;
    
    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);
    
    // Border
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);
    
    // Fuel level
    const fuelPercent = Math.max(0, game.lander.fuel / CONFIG.lander.maxFuel);
    const fuelWidth = (gaugeWidth - 4) * fuelPercent;
    
    // Color based on fuel level
    if (fuelPercent > 0.5) {
        ctx.fillStyle = '#0f0'; // Green
    } else if (fuelPercent > 0.25) {
        ctx.fillStyle = '#ff0'; // Yellow
    } else {
        ctx.fillStyle = '#f00'; // Red
    }
    
    ctx.fillRect(gaugeX + 2, gaugeY + 2, fuelWidth, gaugeHeight - 4);
    
    // Label and percentage
    ctx.fillStyle = '#fff';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'right';
    ctx.fillText('FUEL', gaugeX - 5, gaugeY + 15);
    
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(game.lander.fuel) + '%', gaugeX + gaugeWidth/2, gaugeY + 15);
    ctx.textAlign = 'left';
}

function drawPauseOverlay() {
    if (!game.paused) return;
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    
    // Pause text
    ctx.fillStyle = '#fff';
    ctx.font = '48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 - 40);
    
    ctx.font = '18px Courier New';
    ctx.fillText('Press ENTER to resume', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 20);
    
    // Show current stats
    ctx.font = '14px Courier New';
    ctx.fillStyle = '#ccc';
    ctx.fillText(`Fuel: ${Math.round(game.lander.fuel)}%`, CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 60);
    
    const altitude = Math.max(0, Math.round((CONFIG.canvas.height - game.lander.y) / 5));
    ctx.fillText(`Altitude: ${altitude}m`, CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 80);
    
    const velocity = getVelocityMagnitude(game.lander.vx, game.lander.vy);
    ctx.fillText(`Velocity: ${velocity.toFixed(1)} m/s`, CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 100);
    
    ctx.textAlign = 'left';
}
