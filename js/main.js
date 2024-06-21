console.log("Successfully loaded MAIN.JS");

import { fetchDatabase } from "../js/api/songs.js";
import { createSongCard } from "./dom/songElements.js";

const musicList = document.querySelector('.music');
const volume = document.querySelector('.volume-slider');
const audio = document.querySelector('audio');

async function loadMusic() {
	try {
		let displayedSongs = [];
		const songs = await fetchDatabase();
		console.log("Songs fetched:", songs);
		do {
			let max = songs.length;
			let min = 0;
			let num = Math.floor(Math.random() * (max - min) + min);
			let song = songs[num];
			let index = songs.indexOf(song);
			let songCard = createSongCard(song); 
			if (!displayedSongs.includes(index)) {
				displayedSongs.push(index);
				musicList.appendChild(songCard);
			}
		}
		while(musicList.childNodes.length != 6)
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

