let isOn = false;
let timer;
let seconds = 0;

const songs = [
    { title: "JANDA BODONG 18", tempo: 125 },
    { title: "TELOLET BASURI V3", tempo: 130 },
    { title: "MELODI WHZ 01", tempo: 118 }
];
let currentSongIndex = 0;

function togglePower() {
    isOn = !isOn;
    const lcd = document.getElementById('lcd-content');
    const btn = document.getElementById('powerBtn');
    
    if (isOn) {
        lcd.classList.remove('off');
        btn.style.background = "#00ff00";
        btn.style.boxShadow = "0 0 10px #00ff00";
    } else {
        lcd.classList.add('off');
        btn.style.background = "red";
        btn.style.boxShadow = "0 0 5px red";
        stopTimer();
    }
}

function updateLCD() {
    if(!isOn) return;
    document.getElementById('trackTitle').innerText = songs[currentSongIndex].title;
    document.getElementById('tempo').innerText = songs[currentSongIndex].tempo;
    document.getElementById('trackNum').innerText = (currentSongIndex + 1);
}

function prevTrack() {
    if(!isOn) return;
    currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songs.length - 1;
    updateLCD();
}

function nextTrack() {
    if(!isOn) return;
    currentSongIndex = (currentSongIndex < songs.length - 1) ? currentSongIndex + 1 : 0;
    updateLCD();
}

function playTrack() {
    if(!isOn) return;
    stopTimer();
    timer = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        let secs = (seconds % 60).toString().padStart(2, '0');
        document.getElementById('duration').innerText = `${mins}:${secs}`;
    }, 1000);
}

function pauseTrack() {
    stopTimer();
}

function stopTimer() {
    clearInterval(timer);
}

function addTrack() {
    if(!isOn) return;
    alert("Fitur Tambah Lagu Aktif!");
}

function changeBackground() {
    const colors = ['#333', '#1e3c72', '#2c3e50', '#000'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('bg-container').style.backgroundColor = randomColor;
    document.getElementById('bg-container').style.backgroundImage = 'none';
}
