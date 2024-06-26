document.addEventListener('DOMContentLoaded', () => {
	const artistSelect = document.getElementById('artist_id');
	const albumSelect = document.getElementById('album_id');
	const existingSongSelect = document.getElementById('existing-song');
	const addArtistModal = document.getElementById('add-artist-modal');
	const addAlbumModal = document.getElementById('add-album-modal');

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
		return null;
	}

	const token = getCookie('token');


	const loadArtists = async () => {
		const response = await fetch('/api/artists', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		const data = await response.json();
		artistSelect.innerHTML = '';
		data.artists.forEach(artist => {
			const option = document.createElement('option');
			option.value = artist.id;
			option.textContent = artist.name;
			artistSelect.appendChild(option);
		});
	};

	const loadAlbums = async () => {
		const artistId = artistSelect.value;
		const response = await fetch(`/api/albums/${artistId}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		const data = await response.json();
		albumSelect.innerHTML = '<option value="0">Single</option>';
		data.albums.forEach(album => {
			const option = document.createElement('option');
			option.value = album.id;
			option.textContent = album.title;
			albumSelect.appendChild(option);
		});
	};

	const loadExistingSongs = async () => {
		const response = await fetch('/api/songs', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		const data = await response.json();
		existingSongSelect.innerHTML = '<option value="">Select a song to update</option>';
		data.songs.forEach(song => {
			const option = document.createElement('option');
			option.value = song.song_id;
			option.textContent = song.song_title;
			existingSongSelect.appendChild(option);
		});
	};

	artistSelect.addEventListener('change', loadAlbums);

	document.getElementById('add-artist-button').addEventListener('click', () => {
		addArtistModal.style.display = 'block';
	});

	document.getElementById('close-artist-modal').addEventListener('click', () => {
		addArtistModal.style.display = 'none';
	});

	document.getElementById('save-artist-button').addEventListener('click', async () => {
		const name = document.getElementById('new-artist-name').value;
		const response = await fetch('/api/artists', {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ name })
		});
		const data = await response.json();
		loadArtists();
		addArtistModal.style.display = 'none';
	});

	document.getElementById('add-album-button').addEventListener('click', () => {
		addAlbumModal.style.display = 'block';
	});

	document.getElementById('close-album-modal').addEventListener('click', () => {
		addAlbumModal.style.display = 'none';
	});

	document.getElementById('save-album-button').addEventListener('click', async () => {
		const title = document.getElementById('new-album-title').value;
		const artist_id = artistSelect.value;
		const release_year = document.getElementById('new-album-release-year').value;
		const genres = document.getElementById('new-album-genres').value;
		const response = await fetch('/api/albums', {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ title, artist_id, release_year, genres })
		});
		const data = await response.json();
		loadAlbums();
		addAlbumModal.style.display = 'none';
	});

	document.getElementById('add-song-form').addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		try {
			const response = await fetch('/api/add-song', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				alert(result.message);
			} else {
				alert(result.error);
				console.error('Error details:', result.error, result.stack);
			}
		} catch (err) {
			console.error('Fetch error:', err);
		}
	});

	document.getElementById('update-song-file-form').addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const existingSongId = existingSongSelect.value;

		try {
			const response = await fetch(`/api/update-song-file/${existingSongId}`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				alert(result.message);
			} else {
				alert(result.error);
				console.error('Error details:', result.error, result.stack);
			}
		} catch (err) {
			console.error('Fetch error:', err);
		}
	});

	loadArtists();
	loadExistingSongs();
});
