const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const roarsElement = document.querySelector('.roars');
const API_URL = '/api';

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
			'Content-Type': 'application/json'
		}
	}).then(response => response.json())
	  .then(createdRoar => {
	  	form.reset();
	  	form.style.display = '';
	  	listAllRoars();
	  });
});

function listAllRoars() {
	roarsElement.innerHTML = '';
	fetch(API_URL)
		.then(response => response.json())
		.then(roars => {
			// roars.reverse();
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