document.addEventListener('DOMContentLoaded', () => {
	const artistSelect = document.getElementById('artist_id');
	const albumSelect = document.getElementById('album_id');
	const addArtistModal = document.getElementById('add-artist-modal');
	const addAlbumModal = document.getElementById('add-album-modal');
	const token = localStorage.getItem('token');

	const loadArtists = async () => {
		const response = await fetch('https://shmoovin.adaptable.app/artists', {
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
		const response = await fetch(`https://shmoovin.adaptable.app/albums/${artistId}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		const data = await response.json();
		albumSelect.innerHTML = '<option value="">Single</option>';
		data.albums.forEach(album => {
			const option = document.createElement('option');
			option.value = album.id;
			option.textContent = album.title;
			albumSelect.appendChild(option);
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
		const response = await fetch('https://shmoovin.adaptable.app/artists', {
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
		const response = await fetch('https://shmoovin.adaptable.app/albums', {
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

	document.getElementById('song-form').addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		const response = await fetch('https://shmoovin.adaptable.app/add-song', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			body: formData,
		});

		const result = await response.json();

		if (response.ok) {
			alert(result.message);
		} 
        else {
			alert(result.error);
		}
	});

	loadArtists();
});
