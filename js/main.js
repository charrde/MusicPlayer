import { fetchDatabase } from "./api/songs.js";
import { createSongCard } from "./dom/songElements.js";

const musicList = document.querySelector('.music');
const volume = document.querySelector('.volume-slider');
const audio = document.querySelector('audio');

async function headerAuthDisplay() {
	try {
		const response = await fetch('/api/auth-check', {
			credentials: 'include'
		});
		const data = await response.json();

		const authDisplayDiv = document.getElementById('header-login-auth-display');
		authDisplayDiv.innerHTML = '';
		const pTag = document.createElement('p');

		if (data.authenticated) {
			const userInfoResponse = await fetch('/api/user-info', {
				credentials: 'include'
			});
			const userInfo = await userInfoResponse.json();
			pTag.textContent = `User ID: ${userInfo.user.id}`;
		} else {
			pTag.textContent = 'Login';
		}

		authDisplayDiv.appendChild(pTag);
	} catch (error) {
		const authDisplayDiv = document.getElementById('header-login-auth-display');
		authDisplayDiv.innerHTML = '';

		const pTag = document.createElement('p');
		pTag.textContent = 'Login';
		authDisplayDiv.appendChild(pTag);
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
		headerAuthDisplay();
		await loadMusic();
});
