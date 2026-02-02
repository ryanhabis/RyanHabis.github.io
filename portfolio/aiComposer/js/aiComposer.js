// script.js
// Complete JavaScript for AI Music Fusion Blog with Music Player

// Theme Toggle Functionality
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme or prefer-color-scheme
const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    enableDarkTheme();
}

themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        disableDarkTheme();
    } else {
        enableDarkTheme();
    }
});

function enableDarkTheme() {
    body.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    localStorage.setItem('theme', 'dark');
}

function disableDarkTheme() {
    body.removeAttribute('data-theme');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    localStorage.setItem('theme', 'light');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Music Player Functionality
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const downloadBtn = document.getElementById('download-btn');
const playCountEl = document.getElementById('play-count');
const songTitle = document.querySelector('.song-title');
const artistName = document.querySelector('.artist-name');

// Initialize play count from localStorage
let playCount = parseInt(localStorage.getItem('songPlayCount')) || 0;
playCountEl.textContent = playCount;

// Simulate audio loading (we're using a placeholder MP3)
audioPlayer.addEventListener('loadedmetadata', function() {
    durationEl.textContent = formatTime(audioPlayer.duration);
    progressBar.max = Math.floor(audioPlayer.duration);
});

audioPlayer.addEventListener('timeupdate', function() {
    const currentTime = Math.floor(audioPlayer.currentTime);
    progressBar.value = currentTime;
    currentTimeEl.textContent = formatTime(currentTime);
    
    // Highlight current lyric based on time
    highlightLyricAtTime(currentTime);
});

// Play button
playBtn.addEventListener('click', function() {
    audioPlayer.play();
    playBtn.classList.add('active');
    pauseBtn.classList.remove('active');
    
    // Increment play count
    if (audioPlayer.currentTime === 0) {
        playCount++;
        playCountEl.textContent = playCount;
        localStorage.setItem('songPlayCount', playCount);
    }
});

// Pause button
pauseBtn.addEventListener('click', function() {
    audioPlayer.pause();
    pauseBtn.classList.add('active');
    playBtn.classList.remove('active');
});

// Stop button
stopBtn.addEventListener('click', function() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    pauseBtn.classList.remove('active');
    playBtn.classList.remove('active');
    progressBar.value = 0;
    currentTimeEl.textContent = '0:00';
});

// Progress bar seeking
progressBar.addEventListener('input', function() {
    audioPlayer.currentTime = progressBar.value;
});

// Volume control
volumeSlider.addEventListener('input', function() {
    audioPlayer.volume = volumeSlider.value / 100;
    // Update volume icon
    const volumeIcon = document.querySelector('.volume-icon');
    if (volumeSlider.value == 0) {
        volumeIcon.className = 'volume-icon fas fa-volume-mute';
    } else if (volumeSlider.value < 50) {
        volumeIcon.className = 'volume-icon fas fa-volume-down';
    } else {
        volumeIcon.className = 'volume-icon fas fa-volume-up';
    }
});

// Download functionality
downloadBtn.addEventListener('click', function() {
    // Get download count from localStorage
    let downloadCount = parseInt(localStorage.getItem('songDownloadCount')) || 0;
    downloadCount++;
    localStorage.setItem('songDownloadCount', downloadCount);
    
    // Update UI
    const downloadCountEl = document.getElementById('download-count');
    if (downloadCountEl) {
        downloadCountEl.textContent = downloadCount;
    }
    
    // Create and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3'; // Placeholder music file
    downloadLink.download = 'Where_The_Lilacs_Grow_AI_Fusion.mp3';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Show download confirmation
    showNotification('Song downloaded successfully! Thank you for listening.');
});

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Lyric highlighting based on time
const lyricTimes = [
    {time: 0, text: "[Instrumental intro]"},
    {time: 15, text: "The clockhand froze on a Sunday smile"},
    {time: 20, text: "Dust now dances in a sunbeam aisle"},
    {time: 25, text: "Your jacket hangs on its wooden throne"},
    {time: 30, text: "A silent king in a silent home"},
    {time: 40, text: "Oh, it was a beautiful crime"},
    {time: 45, text: "To love a soul born for a different time"},
    {time: 50, text: "You wore your duty like a crown of snow"},
    {time: 55, text: "That melted where the lilacs grow"}
];

function highlightLyricAtTime(currentTime) {
    const lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer) return;
    
    // Find the current lyric based on time
    let currentLyricIndex = 0;
    for (let i = lyricTimes.length - 1; i >= 0; i--) {
        if (currentTime >= lyricTimes[i].time) {
            currentLyricIndex = i;
            break;
        }
    }
    
    // Update displayed lyrics
    lyricsContainer.innerHTML = lyricTimes.map((lyric, index) => {
        const isActive = index === currentLyricIndex;
        return `<div class="lyric-line ${isActive ? 'active' : ''}">
                    <span class="lyric-time">${formatTime(lyric.time)}</span>
                    <span class="lyric-text">${lyric.text}</span>
                </div>`;
    }).join('');
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize audio when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Load download count
    const downloadCount = parseInt(localStorage.getItem('songDownloadCount')) || 0;
    const downloadCountEl = document.getElementById('download-count');
    if (downloadCountEl) {
        downloadCountEl.textContent = downloadCount;
    }
    
    // Initialize lyric display
    highlightLyricAtTime(0);
    
    // Add animation to process steps
    const steps = document.querySelectorAll('.step, .workflow-step');
    steps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.2}s`;
        step.classList.add('fade-in');
    });
});

// Share functionality
const shareBtn = document.getElementById('share-btn');
if (shareBtn) {
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Where The Lilacs Grow - AI Fusion Song',
                text: 'Listen to this song created by combining DeepSeek AI and MusicGPT!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('Link copied to clipboard!');
            });
        }
    });
}

// Add some CSS for the fade-in animation dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.8s ease forwards;
        opacity: 0;
    }
    
    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
    
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .lyric-line {
        padding: 10px;
        margin: 5px 0;
        border-radius: 5px;
        transition: all 0.3s ease;
        display: flex;
        gap: 15px;
    }
    
    .lyric-line.active {
        background: rgba(67, 97, 238, 0.1);
        transform: translateX(5px);
    }
    
    .lyric-time {
        color: var(--primary-color);
        font-weight: 600;
        min-width: 45px;
    }
    
    .player-btn.active {
        background: var(--primary-color) !important;
        color: white !important;
    }
`;
document.head.appendChild(style);