import { createTopPlayed, createSongCard, createSongCardColumn } from './homePageElements.js';
import { fetchDatabase } from './api/songs.js';

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

function loadVolumeLevel() {
	const volume = document.querySelector('.volume-slider');
	let volumeLevelTag = document.querySelector('.volume-level');
	volumeLevelTag.textContent = volume.value + '%';
}
document.addEventListener('DOMContentLoaded', async function () {
	headerAuthDisplay();
	createTopPlayed();
	await loadMusic();
});
