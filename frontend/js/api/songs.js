export function fetchDatabase() {
	const endpoint = "https://shmoovin-music-3ad94c4568ff.herokuapp.com/random-songs";
	return fetch(endpoint)
		.then(response => {
			if (!response.ok) {
				throw new Error('Failed to fetch song database.');
			}
			return response.json();
		});
}