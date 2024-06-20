let currentAudio = null;
let volumeLevel = 0.6;

export function createSongCard(song) {
	const songCard = document.createElement('li');
	songCard.className = "song-list";
	songCard.innerHTML = `
		<div id="song-card" class="song-card">
			<h3>${song.songTitle}</h3>
			<audio>
				<source src="../data/audio/${song.songTitle}.mp3">
			</audio>
			<div id="controls">
				<button class="play-button">
					<svg fill="#000000" height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 60 60" xml:space="preserve">
					<g>
					<path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30
						c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15
						C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"/>
					<path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
						S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"/>
					</g>
					</svg>
				</button>
                <p class="current-time"></p>
				<input type="range" class="seek-slider" value="0" min="0" max="100">
                <p class="audio-duration"></p>
			</div>
		</div>  
	`;

    const audio = songCard.querySelector('audio');
	const slider = songCard.querySelector('.seek-slider');
	const playButton = songCard.querySelector('.play-button');
    const audioDurationTag = songCard.querySelector('.audio-duration')

	audio.addEventListener('loadedmetadata', function() {
		slider.max = audio.duration
	});

	audio.addEventListener('timeupdate', function() {
		slider.value = currentAudio.currentTime;
        const currentTimeTag = songCard.querySelector('.current-time')
        currentTimeTag.textContent = formatTime(currentAudio.currentTime)

	});

	playButton.addEventListener('click', function() {
		handlePlayButtonClick(audio, audioDurationTag);
	});

	return songCard;
}

const volume = document.querySelector('.volume-slider')

function formatTime(seconds) {
    var minutes;
    minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }

function handlePlayButtonClick(audio, audioDurationTag) {
	if (audio === currentAudio) {
		if (audio.paused) {
			audio.play();
		} 
        else {
			audio.pause();
		}
	} 
    else {
		pauseAllAudio();
		currentAudio = audio;
		audio.currentTime = 0;
        resetAllSliders();
		audio.play();
        audioDurationTag.textContent = formatTime(audio.duration);
        audio.volume = (volume.value / 100)
        volumeLevelTag = volume.value;
	}
}

document.addEventListener('input', function(event) {
	const slider = event.target.closest('.seek-slider');
	if (slider) {
		const songCard = slider.closest('.song-card');
		const audio = songCard.querySelector('audio');
		if (audio) {
			audio.currentTime = slider.value;
		}
	}
});

volume.addEventListener('input', function(event) { 
    let volumeLevelTag = document.querySelector('.volume-level')
    volumeLevelTag.textContent = volume.value + '%';
    if(currentAudio) {
        currentAudio.volume = (volume.value / 100)
    }
});

function pauseAllAudio() {
	const audioPlayers = document.querySelectorAll("audio");
	audioPlayers.forEach(audio => audio.pause());
}

function resetAllSliders() {
	const sliders = document.querySelectorAll(".seek-slider");
	sliders.forEach(slider => slider.value = 0);
}
