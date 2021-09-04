const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/userSchema');


router.post('/login', (req, res) => {
	//Change username to lowercase:
	req.body.username = req.body.username.toLowerCase();
	console.log(`POST /login: trying to login for ${req.body.username}`);
	//Find the user and take note of the password hash:
	User.findOne({username: req.body.username}, (err, foundUser) => {
		if (err) {
			console.log(err);
			res.json({
				success: false
			});
		}
		else if (!foundUser) {
			req.session.loginAttempt = false;
			res.json({
				success: false
			});
		}
		else {
			//Compare password hash to entered password using bcrypt:
			console.log(`Comparing bcrypt password hash.....`);
			if (bcrypt.compareSync(req.body.password, foundUser.password)) {
				//Passwords match
				req.session.username = req.body.username;
				req.session.logged = true;
				req.session.usertype = foundUser.usertype;
				console.log(`${req.body.username} login attempt: passwords match`);
				req.session.messages.userwelcome = `Welcome, ${req.session.username}!`;
				req.session.curuserid = foundUser._id;
				req.session.loginAttempt = true;
				console.log("login attempt successful");
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
				res.json({
					success: false
				});
			}
		}
	});
});


router.post('/logout', (req, res) => {
	if (!req.session.username) {
		res.json(
		{
			success: false,
			message: "Already logged out"
		});
	}
	else {
		//End the session:
		console.log("POST -- Attempting to log out for user " + req.session.username)
		const tempusername = req.session.username;
		req.session.logged = false;
		req.session.usertype = null;
		req.session.username = null;
		req.session.curuserid = null;
		req.session.destroy();
		console.log(`${tempusername} is now logged out`);
		res.json(
		{
			success: true
		});
	}
});


module.exports = router;