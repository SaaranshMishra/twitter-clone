const express = require('express');
const cors = require('cors');
const Datastore = require('nedb');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const roars = new Datastore('database.db');
roars.loadDatabase();

const filter = new Filter();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api', (req, res) => {
	roars.find({}).sort({created: -1}).exec((err, roars) => {
		if (err) throw err;
		res.json(roars);
	});
	// roars.find({}, (err, roars) => {
	// 	if (err) throw err;
	// 	res.json(roars);
	// });
});

function isValidRoar(roar) {
	return roar.name && roar.name.toString().trim() !== '' &&
			roar.content && roar.content.toString().trim() !== ''
}

app.use(rateLimit({
	windows: 15 * 60 * 1000, // 15 minutes
	max: 100 // upto 100 requests for every 15 minutes
}));

app.post('/api', (req, res) => {
	if(isValidRoar(req.body)) {
		// Enter into DB
		const roar = {
			name: filter.clean(req.body.name.toString()),
			content: filter.clean(req.body.content.toString()),
			created: new Date()
		};

		roars
			.insert(roar, (err, createdRoar) => {
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
	console.log(`Listening on PORT ${port}`);
});