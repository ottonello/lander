// ===== AUDIO SYSTEM =====

let audioContext;
let musicEnabled = true;

const sounds = {
    thrust: null,
    rotationThrust: null,
    music: {
        oscillators: [],
        gainNodes: [],
        playing: false
    }
};

// Initialize audio context
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return true;
    } catch (e) {
        console.log('Web Audio API not supported');
        return false;
    }
}

// ===== SOUND EFFECTS =====

function createThrustSound() {
    if (!audioContext) return null;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(CONFIG.audio.sfxVolume, audioContext.currentTime);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return { oscillator, gainNode };
}

function createRotationThrustSound() {
    if (!audioContext) return null;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    gainNode.gain.setValueAtTime(CONFIG.audio.sfxVolume * 0.5, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return { oscillator, gainNode };
}

function startThrustSound() {
    if (sounds.thrust) return;
    sounds.thrust = createThrustSound();
    if (sounds.thrust) {
        sounds.thrust.oscillator.start();
    }
}

function stopThrustSound() {
    if (sounds.thrust) {
        sounds.thrust.oscillator.stop();
        sounds.thrust = null;
    }
}

function startRotationThrustSound() {
    if (sounds.rotationThrust) return;
    sounds.rotationThrust = createRotationThrustSound();
    if (sounds.rotationThrust) {
        sounds.rotationThrust.oscillator.start();
    }
}

function stopRotationThrustSound() {
    if (sounds.rotationThrust) {
        sounds.rotationThrust.oscillator.stop();
        sounds.rotationThrust = null;
    }
}

function playLandingSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(CONFIG.audio.sfxVolume * 2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

function playCrashSound() {
    if (!audioContext) return;
    
    const bufferSize = audioContext.sampleRate * 0.5;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(CONFIG.audio.sfxVolume * 3, audioContext.currentTime);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    source.start();
}

function playButtonSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(CONFIG.audio.sfxVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// ===== BACKGROUND MUSIC =====

function startBackgroundMusic() {
    if (!audioContext || sounds.music.playing) return;
    
    sounds.music.playing = true;
    
    // Dynamic ambient music system
    function playAmbientPhrase() {
        if (!sounds.music.playing) return;
        
        const notes = [220, 246.94, 293.66, 329.63, 369.99, 415.30, 466.16];
        const melody = [];
        const phraseLength = 4 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < phraseLength; i++) {
            melody.push(notes[Math.floor(Math.random() * notes.length)]);
        }
        
        melody.forEach((freq, index) => {
            setTimeout(() => {
                if (!sounds.music.playing) return;
                
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                
                osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1200 + Math.random() * 800, audioContext.currentTime);
                
                gain.gain.setValueAtTime(0, audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(CONFIG.audio.musicVolume, audioContext.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.start();
                osc.stop(audioContext.currentTime + 2);
                
            }, index * 800 + Math.random() * 400);
        });
        
        const nextPhraseDelay = (phraseLength * 800) + 3000 + Math.random() * 5000;
        setTimeout(playAmbientPhrase, nextPhraseDelay);
    }
    
    setTimeout(playAmbientPhrase, 1000);
}

function stopBackgroundMusic() {
    if (!sounds.music.playing) return;
    
    sounds.music.playing = false;
    sounds.music.oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
    });
    sounds.music.oscillators = [];
    sounds.music.gainNodes = [];
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    const button = document.getElementById('musicToggle');
    
    if (musicEnabled) {
        button.textContent = '🎵 Music: ON';
        if (game.gameStarted && !game.gameOver) {
            startBackgroundMusic();
        }
    } else {
        button.textContent = '🔇 Music: OFF';
        stopBackgroundMusic();
    }
    
    playButtonSound();
}
