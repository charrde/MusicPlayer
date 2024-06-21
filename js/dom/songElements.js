import { createMediaCenter } from "../dom/mediaCenterElements.js";

export function createSongCard(song) {
	const songCard = document.createElement('li');
	songCard.className = "song-list";
	songCard.innerHTML = `
        <div class="song-card">
            <div class="song-card-details">
                <h3>${song.songTitle}</h3>
                <h4>${song.artistName}</h4>
            </div>
            <div id="controls">
                <button class="play-song-button">
                    <svg class="play-icon" version="1.1" viewBox="-3 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(-419 -571)" fill="#000">
                        <path d="m440.42 583.55-18.997-12.243c-1.127-0.607-2.418-0.544-2.418 1.635v24.108c0 1.992 1.385 2.306 2.418 1.635l18.997-12.243c0.782-0.799 0.782-2.093 0-2.892"></path>
                        </g>
                    </svg>
                </button>
            </div>
        </div>  
	`;

	const playSong = songCard.querySelector('.play-song-button');
	const audio = document.querySelector('audio');

	playSong.addEventListener('click', function() {

		let volumeLevelTag = document.querySelector('.volume-level')
		let volume = document.querySelector('.volume-slider')
		audio.src = "../data/audio/" + song.songTitle + ".mp3"

		audio.addEventListener('loadedmetadata', function() {
			createMediaCenter(song);
			pauseAllAudio();
			audio.currentTime = 0;
			resetAllSliders();
			audio.play();
			audio.volume = (volume.value / 100)
			volumeLevelTag = volume.value;
		});
	});

	return songCard;
}

function pauseAllAudio() {
	const audioPlayers = document.querySelectorAll("audio");
	audioPlayers.forEach(audio => audio.pause());
}

function resetAllSliders() {
	const sliders = document.querySelectorAll(".seek-slider");
	sliders.forEach(slider => slider.value = 0);
}
