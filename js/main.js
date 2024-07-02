import { createTopPlayed, createSongCard } from './homePageElements.js';
import { fetchDatabase } from './api/songs.js';

async function loadMusic() {
	try {
		const response = await fetchDatabase();
		const songs = response.songs;
		const hotNowSongsContainer = document.getElementById('hot-now-songs');
		hotNowSongsContainer.innerHTML = '';

		songs.forEach(song => {
			const songCard = createSongCard(song);
			hotNowSongsContainer.appendChild(songCard);
		});
		loadVolumeLevel();
	} catch (error) {
		console.error('Error fetching songs:', error);
	}
}

function loadVolumeLevel() {
	const volume = document.querySelector('.volume-slider');
	let volumeLevelTag = document.querySelector('.volume-level');
	volumeLevelTag.textContent = volume.value + '%';
}

const volume = document.querySelector('.volume-slider');
const audio = document.querySelector('audio');

volume.addEventListener('input', function (event) {
	let volumeLevelTag = document.querySelector('.volume-level');
	volumeLevelTag.textContent = volume.value + '%';
	if (audio) {
		audio.volume = volume.value / 100;
	}
});

document.addEventListener('DOMContentLoaded', async function () {
	createTopPlayed();
	await loadMusic();
});
