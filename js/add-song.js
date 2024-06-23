document.getElementById('song-form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);

	const response = await fetch('https://shmoovin.adaptable.app/add-song', {
		method: 'POST',
		body: formData,
	});

	const result = await response.json();
	alert(result.message);
});