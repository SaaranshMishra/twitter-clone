const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const roarsElement = document.querySelector('.roars');
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/' : 'https://roar-twitter-api.herokuapp.com/';

loadingElement.style.display = '';

listAllRoars();

form.addEventListener('submit', (event) => {
	event.preventDefault();

	const formData = new FormData(form);
	const name = formData.get('name');
	const content = formData.get('content');

	const roar = {
		name,
		content
	};
	form.style.display = 'none';
	loadingElement.style.display = '';
	
	fetch(API_URL, {
		method: 'POST',
		body: JSON.stringify(roar),
		headers: {
			'content-type': 'application/json'
		}
	}).then(response => response.json())
	  .then(createdRoar => {
	  	console.log(createdRoar);
	  	form.reset();
	  	form.style.display = '';
	  	listAllRoars();
	  	// loadingElement.style.display = 'none';
	  });
});

function listAllRoars() {
	roarsElement.innerHTML = '';
	fetch(API_URL)
		.then(response => response.json())
		.then(roars => {
			// console.log(roars);
			roars.reverse();
			roars.forEach(roar => {
				const div = document.createElement('div');

				const header = document.createElement('h3');
				header.textContent = roar.name;

				const contents = document.createElement('p');
				contents.textContent = roar.content;

				const date = document.createElement('small');
				date.textContent = new Date(roar.created);


				div.appendChild(header);
				div.appendChild(contents);
				div.appendChild(date);

				roarsElement.appendChild(div);
			});
			loadingElement.style.display = 'none';
		});
}