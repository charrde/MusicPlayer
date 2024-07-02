import { createMediaCenter } from './mediaCenterElements.js';

const mainElement = document.querySelector('main');

export function createTopPlayed() {
	const topPlayed = document.createElement('div');
	topPlayed.className = 'hot-now-section';
	topPlayed.innerHTML = `
		<section class="center-container">
			<div class="padding-container">
				<div class="section-heading">
					<h2 class="section-heading-text">Hot right now.</h2>
					<div class="scroll-buttons">
						<button id="hot-now-scroll-back-button">
							<p>B</p>
						</button>
						<button id="hot-now-scroll-forward-button">
							<p>F</p>
						</button>
					</div>
				</div>
				<div class="volume">
					<h3>Volume</h3>
					<input type="range" class="volume-slider" value="50" min="0" max="100">
					<p class="volume-level"></p>
				</div>
				<div id="hot-now-songs" class="hot-now-songs">
					<!-- Song cards will be dynamically inserted here -->
				</div>
			</div>
		</section>
	`;

	mainElement.appendChild(topPlayed);

	const hotSongsScrollForward = document.getElementById('hot-now-scroll-forward-button');
	const hotSongsScrollBack = document.getElementById('hot-now-scroll-back-button');
	const hotSongsScrollingElement = document.getElementById('hot-now-songs');

    hotSongsScrollBack.addEventListener('click', function () {
        const desiredElement = document.querySelector('.song-card');
        let scrollDistance = desiredElement.offsetWidth;

        hotSongsScrollingElement.scrollLeft -= scrollDistance;
        hotSongsScrollingElement.addEventListener('scrollend', function () {
			hotSongsScrollForward.disabled = false;

			if (hotSongsScrollingElement.scrollLeft <= 0) {
				hotSongsScrollBack.disabled = true;
			}
        });
    });

    hotSongsScrollForward.addEventListener('click', function () {
        const desiredElement = document.querySelector('.song-card');
        let scrollDistance = desiredElement.offsetWidth;

        hotSongsScrollingElement.scrollLeft += scrollDistance;
        hotSongsScrollBack.disabled = false;

        if (hotSongsScrollingElement.scrollLeft + hotSongsScrollingElement.clientWidth >= hotSongsScrollingElement.scrollWidth) {
            hotSongsScrollForward.disabled = true;
        }
    });

    hotSongsScrollingElement.addEventListener('scroll', function () {
        if (hotSongsScrollingElement.scrollLeft <= 0) {
            hotSongsScrollBack.disabled = true;
        } else {
            hotSongsScrollBack.disabled = false;
        }

        if (hotSongsScrollingElement.scrollLeft + hotSongsScrollingElement.clientWidth >= hotSongsScrollingElement.scrollWidth) {
            hotSongsScrollForward.disabled = true;
        } else {
            hotSongsScrollForward.disabled = false;
        }
    });
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
    	<div class="song-card-album-image">
            <img src="../img/Album-Cover.jpg">
		</div>
		<div class="song-card-details">
			<h3>${song.song_title}</h3>
			<h4>${song.artist_name}</h4>
		</div>
		<div id="controls" class="song-card-controls">
			<button class="play-song-button">
				<svg class="play-icon" version="1.1" width="40px" height="40px" viewBox="-3 0 28 28" xmlns="http://www.w3.org/2000/svg">
					<g transform="translate(-419 -571)" fill="#000">
						<path d="m440.42 583.55-18.997-12.243c-1.127-0.607-2.418-0.544-2.418 1.635v24.108c0 1.992 1.385 2.306 2.418 1.635l18.997-12.243c0.782-0.799 0.782-2.093 0-2.892"></path>
					</g>
				</svg>
			</button>
		</div>
	`;

	const playSong = songCard.querySelector('.play-song-button');
	const audio = document.querySelector('audio');
    

    songCard.addEventListener('mouseenter', function() {
        const controls = document.querySelector('.song-card-controls');
        controls.style.display = 'block';
    });

    songCard.addEventListener('mouseleave', function() {
        const controls = document.querySelector('.song-card-controls');
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
