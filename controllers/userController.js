const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/userSchema');


router.post('/', (req, res) => {
	console.log('POST /user');
	if (req.body.password !== req.body.password2) {
		// passwords do not match
		res.json({
			success: false,
			message: 'Error: passwords do not match'
		});
	}
	else {

		const password = req.body.password;
		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

		const userDbEntry = {
			email: req.body.email,
			password: passwordHash
		};

		User.findOne({email: req.body.email}, (err, foundUser) => {
			if (err) {console.log(err);}
			else {
				if (!foundUser) {
					User.create(userDbEntry, (err, createdUser) => {
						if (err) {console.log(err);}
						else {
							console.log('Created a new user ' + req.body.email);
							res.json({
								success: true
							});
						}
					});
				}
				else {
					console.log("User create failed: email already exists in system");
					res.json({
						success: false,
						message: 'A user already exists with this email'
					});
				}
			}
		});
	}
});

router.get('/:id', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) {console.log(err);}
		else {
			console.log(`GET /users/${req.params.id}`);
			res.json({
				_id: foundUser._id,
				email: foundUser.email
			});
		}
	});
});


module.exports = router;
