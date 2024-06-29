import { fetchDatabase } from "./api/songs.js";
import { createSongCard } from "./dom/songElements.js";

const musicList = document.querySelector('.music');
const volume = document.querySelector('.volume-slider');
const audio = document.querySelector('audio');

function getCookie(name) {
	const value = `; ${document.cookie}`;
	console.log('Raw cookies:', value);
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

async function loadMusic() {
	try {
		const response = await fetchDatabase();
		const songs = response.songs;
		musicList.innerHTML = ``;

		songs.forEach(song => {
			const songCard = createSongCard(song);
			musicList.appendChild(songCard);
		});
		loadVolumeLevel();
	} 
	catch (error) {
		console.error("Error fetching songs:", error);
	}
}

function loadVolumeLevel() {
    const volume = document.querySelector('.volume-slider');
    let volumeLevelTag = document.querySelector('.volume-level');
    volumeLevelTag.textContent = volume.value + '%';
}

volume.addEventListener('input', function(event) { 
    let volumeLevelTag = document.querySelector('.volume-level');
    volumeLevelTag.textContent = volume.value + '%';
    if(audio) {
        audio.volume = (volume.value / 100);
    }
});

document.addEventListener('DOMContentLoaded', async function() {
	const token = getCookie('token');
	console.log('Token from cookies:', token);

	if (token) {
		await loadMusic();
		document.getElementById('web-content').style.display = 'unset';
	} else {
		window.location.href = 'login.html';
	}
});
