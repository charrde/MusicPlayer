export function fetchDatabase() {
    const database = "data/base/catalog.json"
    return fetch(database)
        .then(response => {
            if(!response.ok) {
                throw new Error('Failed to fetch song database.');
            }
            return response.json();
        });
}