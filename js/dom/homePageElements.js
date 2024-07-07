import { createMediaCenter } from './mediaCenterElements.js';
import { createSongCard, createSongCardColumn } from './dom/homePageElements.js';
import { fetchRandomSongs } from '../api/songs.js';

export async function loadMusic() {
	try {
		const response = await fetchRandomSongs();
		const songs = response.songs;
		const hotNowSongsContainer = document.getElementById('hot-now-songs');
		hotNowSongsContainer.innerHTML = '';

		let songCardColumn = createSongCardColumn();
		songs.forEach((song, index) => {
			const songCard = createSongCard(song);
			songCardColumn.appendChild(songCard);
			if ((index + 1) % 2 === 0) {
				hotNowSongsContainer.appendChild(songCardColumn);
				songCardColumn = createSongCardColumn();
			}
		});
		if (songCardColumn.children.length > 0) {
			hotNowSongsContainer.appendChild(songCardColumn);
		}

		loadVolumeLevel();
	} catch (error) {
		console.error('Error fetching songs:', error);
	}
}

export function createSongCardColumn() {
	const songCardColumn = document.createElement('div');
	songCardColumn.className = 'song-card-column';
	return songCardColumn;
}

export function createSongCard(song) {
	const songCard = document.createElement('div');
	songCard.className = 'song-card';
	songCard.innerHTML = `
    	<div class="song-card-details-wrapper">
            <div class="song-card-album-image">
                <img src="../img/Album-Cover.jpg">
            </div>
            <div class="song-card-details">
                <h3>${song.song_title}</h3>
                <h4>${song.artist_name}</h4>
            </div>
        </div>
		<div class="song-card-controls-wrapper">
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
    

    songCard.addEventListener('mouseenter', function() {
        const controls = songCard.querySelector('.song-card-controls-wrapper');
        controls.style.display = 'block';
    });

    songCard.addEventListener('mouseleave', function() {
        const controls = songCard.querySelector('.song-card-controls-wrapper');
        controls.style.display = 'none';
    });

	playSong.addEventListener('click', async function () {
		let volumeLevelTag = document.querySelector('.volume-level');
		let volume = document.querySelector('.volume-slider');

		try {
			const decodedFilePath = decodeURIComponent(song.file_path.split('/').pop());
			const response = await fetch(`https://shmoovin.adaptable.app/presigned-url/${encodeURIComponent(decodedFilePath)}`);
			const data = await response.json();
			if (data.url) {
				audio.src = data.url;

				audio.addEventListener('loadedmetadata', function () {
					createMediaCenter(song);
					pauseAllAudio();
					audio.currentTime = 0;
					resetAllSliders();
					audio.play();
					audio.volume = volume.value / 100;
					volumeLevelTag = volume.value;
				});
			} else {
				console.error('Pre-signed URL not returned in response:', data);
			}
		} catch (error) {
			console.error('Error fetching pre-signed URL:', error);
		}
	});

	return songCard;
}

function pauseAllAudio() {
	const audioPlayers = document.querySelectorAll('audio');
	audioPlayers.forEach(audio => audio.pause());
}

function resetAllSliders() {
	const sliders = document.querySelectorAll('.seek-slider');
	sliders.forEach(slider => (slider.value = 0));
}
