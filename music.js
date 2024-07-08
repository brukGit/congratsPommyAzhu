const audio = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');

function toggleIcon() {
    playIcon.classList.toggle('hidden');
    pauseIcon.classList.toggle('hidden');
}

musicToggle.addEventListener('click', function() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    toggleIcon();
});

// Autoplay music when the page loads (many browsers block this)
window.addEventListener('load', function() {
    audio.play().then(function() {
        toggleIcon();
    }).catch(function(error) {
        console.log('Autoplay prevented due to browser settings');
    });
});