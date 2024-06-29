document.getElementById('login-form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	document.getElementById('error-message').textContent = "";

	try {
		const response = await fetch('https://shmoovin.adaptable.app/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
			credentials: 'include'
		});

		const data = await response.json();
		if (response.ok) {
			window.location.href = 'index.html';
		} 
		else {
			console.error('Login failed:', data.error);
			document.getElementById('error-message').textContent = "Incorrect username or password.";
		}
	} catch (error) {
		console.error('Error during login fetch:', error);
		document.getElementById('error-message').textContent = "An error occurred. Please try again.";
	}
});
