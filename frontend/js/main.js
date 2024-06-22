console.log("Successfully loaded MAIN.JS");

import { fetchDatabase } from "../js/api/songs.js";
import { createSongCard } from "./dom/songElements.js";

const musicList = document.querySelector('.music');
const volume = document.querySelector('.volume-slider');
const audio = document.querySelector('audio');

async function loadMusic() {
	try {
		const musicList = document.getElementById('music-list');
		const response = await fetchDatabase();
		const songs = response.songs;
		console.log("Songs fetched:", songs);

		songs.forEach(song => {
			const songCard = createSongCard(song);
			musicList.appendChild(songCard);
		});
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

document.addEventListener('DOMContentLoaded', function() {
	loadMusic();
    loadVolumeLevel();
});

