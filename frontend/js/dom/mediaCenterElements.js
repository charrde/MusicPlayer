const songTitle = document.querySelector('.song-title')
const songArtist = document.querySelector('.song-artist')
const audioDurationTag = document.querySelector('.audio-duration')
const currentTimeTag = document.querySelector('.current-time')
const slider = document.querySelector('.seek-slider');
const audio = document.querySelector('audio');
const playButton = document.querySelector('.play-button');
const mediaCenter = document.querySelector('.media-center');

export function createMediaCenter(song) {
    mediaCenter.classList.remove('hidden');
    songTitle.textContent = song.songTitle;
    songArtist.textContent = song.artistName;
    audioDurationTag.textContent = formatTime(audio.duration);
    slider.max = audio.duration;
    console.log(audio.duration)
    console.log(slider.max)

    if (audio) {
        let pauseIcon = playButton.querySelector('.pause-icon');
        let playIcon = playButton.querySelector('.play-icon');
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }
}

audio.addEventListener('timeupdate', function() {
	slider.value = audio.currentTime;
	currentTimeTag.textContent = formatTime(audio.currentTime);
    let progress = (slider.value / slider.max) * 100;
    slider.style.background = `linear-gradient(to right, #583cc5 ${progress}%, #3d2b88 ${progress}%)`;
});

function formatTime(seconds) {
    var minutes;
    minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }

slider.addEventListener('input', function(event) {
	if (slider) {
		if (audio) {
            audio.play();
			audio.currentTime = slider.value;
		}
	}
});

playButton.addEventListener('click', function() {
    let pauseIcon = playButton.querySelector('.pause-icon');
    let playIcon = playButton.querySelector('.play-icon');
    if (audio.paused) {
        audio.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } 
    else {
        audio.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
});