document.getElementById('login-form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	document.getElementById('error.message').textContent = "";

	const response = await fetch('https://shmoovin.adaptable.app/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	});

	const data = await response.json();
	if (data.token) {
		document.getElementById('web-content').style.display = 'none';
		document.getElementById('loading').style.display = 'flex';
		window.location.href = 'index.html';
	} 
	else {
		document.getElementById('error.message').textContent = "Incorrect username or password.";
	}
});
