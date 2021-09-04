const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const db = require('./db/db');


// Retrieve environment variables
dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors(
{
	origin: process.env.REACT_ADDRESS,
	optionsSuccessStatus: 200,
	credentials: true
}));

app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(bodyParser.json({limit: '10mb'}));

app.use(methodOverride('_method'));

app.use(express.static('./public'));

const sessionStore = new mongoStore(
{
	mongooseConnection: dbConnection,
	secret: process.env.STORE_SECRET
});

app.use(session(
{
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	logged: false,
	cookie: {httpOnly: false},
	unset: 'keep'
}));

app.get('/status', (req, res) => {
	res.json(
	{
		status: 'online'
	});
});

app.use(express.static(path.join(__dirname, '/react-frontend/build')));

app.get('/', function(req, res)
{
	//SEND REACT STUFF
	res.sendFile(path.join(__dirname+'/react-frontend/build/index.html'));
});

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server is listening on port ${port}`);
	}
});