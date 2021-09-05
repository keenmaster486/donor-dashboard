const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const session = require('express-session');
const db = require('./db/db');
const mongoStore = require('connect-mongo');
const path = require('path');

const donationController = require('./controllers/donationController');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');

const app = express();

// Retrieve environment variables
const port = process.env.PORT || 3001;

app.use(cors(
{
	origin: '*',
	optionsSuccessStatus: 200
}));

app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(bodyParser.json({limit: '10mb'}));

app.use(methodOverride('_method'));

app.use(express.static('./public'));

const sessionStore = mongoStore.create(
{
	mongoUrl: process.env.MONGODB_URI,
	secret: process.env.STORE_SECRET
});

app.use(session(
{
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: true,
	logged: false,
	cookie: {httpOnly: false},
	unset: 'keep'
}));

app.get('/status', (req, res) => {
	console.log('GET /status');
	res.json({
		status: 'online'
	});
});

app.use(express.static(path.join(__dirname, '/react-frontend/build')));

app.get('/', function(req, res)
{
	//SEND REACT STUFF
	res.sendFile(path.join(__dirname+'/react-frontend/build/index.html'));
});

// Session restoration middleware
app.use((req, res, next) =>
{
	if (req.url == '/auth/login' || req.url == '/user') {
		next();
		return;
	}
	if (req.headers.authentication) {
		sessionStore.get(req.headers.authentication, (err, foundSession) => {
			if (err) {
				console.log(err);
			}
			else {
				console.log("Authenticated Request");
				req.session.logged = foundSession.logged;
				req.session.userId = foundSession.userId;
				req.session.email = foundSession.email;
				next();
			}
		});
	}
	else
	{
		console.log("UNAUTHENTICATED REQUEST")
		if (req.session.logged) {
			console.log("But session is logged so it's OK");
			next();
			return;
		}
		if (!req.session.logged) {
			req.session.userId = null;
			req.session.email = null;

			// deny unauthenticated:
			res.status(403).send();
		}
	}
});

app.use('/donation', donationController);
app.use('/auth', authController);
app.use('/user', userController);

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server is listening on port ${port}`);
	}
});