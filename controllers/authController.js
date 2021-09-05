const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/userSchema');


router.post('/login', (req, res) => {
	console.log(`POST /login for email ${req.body.email}`);
	User.findOne({email: req.body.email}, (err, foundUser) => {
		if (err) {
			console.log(err);
			res.json({
				success: false
			});
		}
		else if (!foundUser) {
			req.session.loginAttempt = false;
			res.json({
				success: false,
				message: 'No user found by that email'
			});
		}
		else {
			//Compare password hash to entered password using bcrypt:
			console.log(`Comparing bcrypt password hash.....`);
			if (bcrypt.compareSync(req.body.password, foundUser.password)) {
				//Passwords match
				req.session.logged = true;
				req.session.userId = foundUser._id;
				req.session.email = foundUser.email;
				req.session.loginAttempt = true;
				console.log('login attempt successful');
				//We'll go ahead and send the current user id to the client side:
				res.json({
					success: true,
					userId: foundUser._id,
					sessionId: req.sessionID
				});
			}
			else {
				//Passwords do not match
				req.session.loginAttempt = false;
				console.log('login attempt unsuccessful');
				res.json({
					success: false,
					message: 'Incorrect password'
				});
			}
		}
	});
});


router.post('/logout', (req, res) => {
	if (!req.session.userId) {
		res.json({
			success: false,
			message: 'Already logged out'
		});
	}
	else {
		//End the session:
		console.log('POST /logout');
		req.session.logged = false;
		req.session.userId = null;
		req.session.destroy();
		console.log('Logout successful');
		res.json({
			success: true
		});
	}
});


module.exports = router;