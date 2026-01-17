let isOn = false;
let playlist = [];
let currentIdx = 0;
const audio = document.getElementById('audio-player');
const lcd = document.getElementById('lcd-content');
const timerDisplay = document.getElementById('duration');

function togglePower() {
    isOn = !isOn;
    const btn = document.getElementById('powerBtn');
    if (isOn) {
        lcd.classList.remove('off');
        btn.style.background = "#00ff00";
        btn.style.boxShadow = "0 0 15px #00ff00";
        updateLCD();
    } else {
        lcd.classList.add('off');
        btn.style.background = "red";
        btn.style.boxShadow = "0 0 5px red";
        audio.pause();
    }
}

function addMusic(event) {
    const files = event.target.files;
    for (let file of files) {
        const url = URL.createObjectURL(file);
        playlist.push({ title: file.name, url: url });
    }
    document.getElementById('playlist-stat').innerText = `${playlist.length} LAGU`;
    if(isOn) updateLCD();
}

function updateLCD() {
    if (!isOn) return;
    if (playlist.length > 0) {
        document.getElementById('trackTitle').innerText = playlist[currentIdx].title;
    }
}

function playTrack() {
    if (!isOn || playlist.length === 0) return;
    if (audio.src !== playlist[currentIdx].url) {
        audio.src = playlist[currentIdx].url;
    }
    audio.play();
}

function pauseTrack() { audio.pause(); }

function nextTrack() {
    if (!isOn || playlist.length === 0) return;
    currentIdx = (currentIdx + 1) % playlist.length;
    audio.src = playlist[currentIdx].url;
    updateLCD();
    audio.play();
}

function prevTrack() {
    if (!isOn || playlist.length === 0) return;
    currentIdx = (currentIdx - 1 + playlist.length) % playlist.length;
    audio.src = playlist[currentIdx].url;
    updateLCD();
    audio.play();
}

// Update Durasi di dalam LCD
audio.ontimeupdate = () => {
    let mins = Math.floor(audio.currentTime / 60).toString().padStart(2, '0');
    let secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    timerDisplay.innerText = `${mins}:${secs}`;
};

// Fungsi Ganti Background
function changeBgColor(color) {
    const canvas = document.getElementById('app-canvas');
    canvas.style.backgroundImage = 'none';
    canvas.style.backgroundColor = color;
}

function loadCustomBg(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        document.getElementById('app-canvas').style.backgroundImage = `url(${url})`;
    }
}
