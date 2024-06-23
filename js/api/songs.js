export function fetchDatabase() {
	const endpoint = "https://shmoovin.adaptable.app/songs";
	return fetch(endpoint)
		.then(response => {
			if (!response.ok) {
				throw new Error('Failed to fetch song database.');
			}
			return response.json();
		});
}