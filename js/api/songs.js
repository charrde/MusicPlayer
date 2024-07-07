export function fetchRandomSongs() {
	const endpoint = "/api/random-songs";
	return fetch(endpoint)
		.then(response => {
			if (!response.ok) {
				throw new Error('Failed to fetch song database.');
			}
			return response.json();
		});
}