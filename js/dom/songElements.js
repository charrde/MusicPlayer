import { createMediaCenter } from "./mediaCenterElements.js";

export function createSongCard(song) {
	const songCard = document.querySelector('.song-list');
	songCard.innerHTML = ``;
	songCard.innerHTML = `
        <div class="song-card">
            <div class="song-card-details">
                <h3>${song.song_title}</h3>
                <h4>${song.artist_name}</h4>
            </div>
            <div id="controls">
                <button class="play-song-button">
                    <svg class="play-icon" version="1.1" width="40px" height="40px" viewBox="-3 0 28 28" xmlns="http://www.w3.org/2000/svg">
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

	playSong.addEventListener('click', async function() {
		let volumeLevelTag = document.querySelector('.volume-level')
		let volume = document.querySelector('.volume-slider')

		try {
			const decodedFilePath = decodeURIComponent(song.file_path.split('/').pop());
			const response = await fetch(`https://shmoovin.adaptable.app/presigned-url/${encodeURIComponent(decodedFilePath)}`);
			const data = await response.json();
			if (data.url) {
				audio.src = data.url;

				audio.addEventListener('loadedmetadata', function() {
					createMediaCenter(song);
					pauseAllAudio();
					audio.currentTime = 0;
					resetAllSliders();
					audio.play();
					audio.volume = (volume.value / 100);
					volumeLevelTag = volume.value;
				});
			} 
			else {
				console.error('Pre-signed URL not returned in response:', data);
			}
		} 
		catch (error) {
			console.error('Error fetching pre-signed URL:', error);
		}
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
