import { fetchDatabase } from "./api/songs.js";
import { createSongCard } from "./dom/songElements.js";

const musicList = document.querySelector('.music');
const volume = document.querySelector('.volume-slider');
const audio = document.querySelector('audio');

async function checkAuth() {
	try {
		const response = await fetch('/api/auth-check', {
			credentials: 'include'
		});
		const data = await response.json();
		console.log('Auth check response:', data);
		return data.authenticated;
	} catch (error) {
		console.error('Error during auth check:', error.message);
		return false;
	}
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
    const volume = document.querySelector('.volume-slider')
    let volumeLevelTag = document.querySelector('.volume-level')
    volumeLevelTag.textContent = volume.value + '%';
}

volume.addEventListener('input', function(event) { 
    let volumeLevelTag = document.querySelector('.volume-level')
    volumeLevelTag.textContent = volume.value + '%';
    if(audio) {
        audio.volume = (volume.value / 100)
    }
});

document.addEventListener('DOMContentLoaded', async function() {
	try {
		const isAuthenticated = await checkAuth();
		if (isAuthenticated) {
			await loadMusic();
			document.getElementById('loading-screen').style.display = 'none';
			document.getElementById('web-content').style.display = 'unset';
		} 
		else {
			console.log("check auth failed")
		}
	} catch (error) {
		console.log("error")
	}
});
