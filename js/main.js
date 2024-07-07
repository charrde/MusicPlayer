import { loadMusic } from "./dom/homePageElements.js";

async function headerAuthDisplay() {
	try {
		const response = await fetch('/api/auth-check', {
			credentials: 'include'
		});
		const data = await response.json();

		const authDisplayDiv = document.getElementById('header-login-auth-display');
		authDisplayDiv.innerHTML = '';
		const pTag = document.createElement('p');

		if (data.authenticated) {
			const userInfoResponse = await fetch('/api/user-info', {
				credentials: 'include'
			});
			const userInfo = await userInfoResponse.json();
			pTag.textContent = `User ID: ${userInfo.user.id}`;
		} else {
			pTag.textContent = 'Login';
		}

		authDisplayDiv.appendChild(pTag);
	} catch (error) {
		const authDisplayDiv = document.getElementById('header-login-auth-display');
		authDisplayDiv.innerHTML = '';

		const pTag = document.createElement('p');
		pTag.textContent = 'Login';
		authDisplayDiv.appendChild(pTag);
	}
}

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

function loadVolumeLevel() {
	const volume = document.querySelector('.volume-slider');
	let volumeLevelTag = document.querySelector('.volume-level');
	volumeLevelTag.textContent = volume.value + '%';
}

document.addEventListener('DOMContentLoaded', async function () {
	headerAuthDisplay();
	await loadMusic();
});
