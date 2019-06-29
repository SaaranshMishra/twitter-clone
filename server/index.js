const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/roarer');
const roars = db.get('roars');
const filter = new Filter();

app.use(cors());
app.use(express.json());


// app.get('/', (req, res) => {
// 	res.json({
// 		message: 'ROAR!!'
// 	});
// });

app.get('/', (req, res) => {
	roars
		.find()
		.then(roars => {
			res.json(roars);
		});
});

function isValidRoar(roar) {
	return roar.name && roar.name.toString().trim() !== '' &&
			roar.content && roar.content.toString().trim() !== ''
}

app.use(rateLimit({
	windows: 15 * 60 * 1000, // 15 minutes
	max: 100 // upto 100 requests for every 15 minutes
}));

app.post('/', (req, res) => {
	if(isValidRoar(req.body)) {
		// Enter into DB
		const roar = {
			name: filter.clean(req.body.name.toString()),
			content: filter.clean(req.body.content.toString()),
			created: new Date()
		};

		roars
			.insert(roar)
			.then(createdRoar => {
				res.json(createdRoar);
			});

	} else {
		res.status(422);
		res.json({
			message: 'Hey! Name and Content are required'
		});
	}
});

port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Listening on PORT {port}`);
});