console.log("Successfully loaded MAIN.JS");

import { fetchDatabase } from "../js/api/songs.js";
import { createSongCard } from "./dom/songElements.js";

const musicList = document.querySelector('.music');

async function loadMusic() {
	try {
		const songs = await fetchDatabase();
		console.log("Songs fetched:", songs);
		for (let i = 0; i < 6; i++) {
			let max = songs.length;
			let min = 0;
			let num = Math.floor(Math.random() * (max - min) + min);
			let song = songs[num];
			let songCard = createSongCard(song);
			musicList.appendChild(songCard);
		}
	} catch (error) {
		console.error("Error fetching songs:", error);
	}
}

function loadVolumeLevel() {
    const volume = document.querySelector('.volume-slider')
    let volumeLevelTag = document.querySelector('.volume-level')
    volumeLevelTag.textContent = volume.value + '%';
}

document.addEventListener('DOMContentLoaded', function() {
	loadMusic();
    loadVolumeLevel();
});