let isOn = false;
let playlist = [];
let currentIdx = 0;
const audio = document.getElementById('audio-player');
const lcd = document.getElementById('lcd-content');
const timerDisplay = document.getElementById('duration');

// --- DATABASE LOGIC (Penyimpanan Permanen) ---
let db;
const request = indexedDB.open("WHZ_MusicDB", 1);
request.onupgradeneeded = e => {
    db = e.target.result;
    db.createObjectStore("songs", { keyPath: "name" });
};
request.onsuccess = e => {
    db = e.target.result;
    loadSavedSongs();
};

function loadSavedSongs() {
    const transaction = db.transaction(["songs"], "readonly");
    const store = transaction.objectStore("songs");
    store.getAll().onsuccess = e => {
        const savedSongs = e.target.result;
        savedSongs.forEach(s => {
            const blob = new Blob([s.data], { type: "audio/mp3" });
            playlist.push({ title: s.name, url: URL.createObjectURL(blob) });
        });
        if(isOn) updateLCD();
    };
}

function addMusic(event) {
    const files = event.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = e => {
            const songData = { name: file.name, data: e.target.result };
            const transaction = db.transaction(["songs"], "readwrite");
            transaction.objectStore("songs").put(songData);
            
            playlist.push({ title: file.name, url: URL.createObjectURL(file) });
            updateLCD();
        };
        reader.readAsArrayBuffer(file);
    }
}

// --- LOGIKA INSTALL APLIKASI ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                document.getElementById('installBtn').style.display = 'none';
            }
        });
    }
});

// --- FUNGSI PLAYER ---
function togglePower() {
    isOn = !isOn;
    const btn = document.getElementById('powerBtn');
    if (isOn) {
        lcd.classList.remove('off');
        btn.style.background = "#39ff14";
        btn.style.boxShadow = "0 0 20px #39ff14";
        updateLCD();
    } else {
        lcd.classList.add('off');
        btn.style.background = "#ff0000";
        btn.style.boxShadow = "0 0 10px #ff0000";
        audio.pause();
    }
}

function updateLCD() {
    if (!isOn) return;
    document.getElementById('playlist-stat').innerText = `${playlist.length} FILE`;
    if (playlist.length > 0) {
        document.getElementById('trackTitle').innerText = playlist[currentIdx].title;
    } else {
        document.getElementById('trackTitle').innerText = "UNGGAH LAGU...";
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

audio.ontimeupdate = () => {
    let mins = Math.floor(audio.currentTime / 60).toString().padStart(2, '0');
    let secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    timerDisplay.innerText = `${mins}:${secs}`;
};

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
