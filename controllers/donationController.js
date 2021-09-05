const express = require('express');
const emailer = require('../emailer/emailer');

const router = express.Router();

const Donation = require('../models/donationSchema');

router.post('/uploadBatch', (req, res) => {
	console.log('POST /donation/uploadBatch');

	const items = req.body.map((item) => {
		return {
			'id': item['donor_id'],
			'name': item['donor_name'],
			'email': item['donor_email'],
			'gender': item['donor_gender'],
			'address': item['donor_address'],
			'amount': item['donation_amount']
		};
	});

	Donation.create(items, (err, createdItems) => {
		if (err) {console.log(err); res.status(500).send(); return;}

		const totalValue = createdItems.reduce((total, current) => {
			return total + current.amount;
		}, 0);

		const totalAnon = createdItems.reduce((total, current) => {
			return total + (!current.name || current.name == '' ? 1 : 0);
		}, 0);

		const percentageAnon = (totalAnon / createdItems.length) * 100;

		emailer.sendMail({
			from: process.env.EMAIL_ADDR,
			replyTo: process.env.EMAIL_REPLY_ADDR,
			to: req.session.email,
			subject: 'Donor Dashboard: New CSV Uploaded',
			html: `
				<html>
					<body>
						<h1>New CSV Uploaded</h1><br>
						<h2>CSV Stats</h2>
						<p>
							Total Items: ${createdItems.length}<br>
							Total Value: ${totalValue}<br>
							Percentage Anonymous Donors: ${percentageAnon}%<br>
						</p>
					</body>
				</html>
			`
		}, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log('Email sent: ' + info);
			}
		});

		res.json({
			totalItems: createdItems.length,
			totalValue: totalValue,
			percentageAnon: percentageAnon
		});
	});
});

router.get('/all', (req, res) => {
	console.log('GET /donation/all');
	Donation.find((err, foundItems) => {
		if (err) {console.log(err); res.status(500).send(); return;}
		res.json(foundItems);
	});
});

router.post('/deleteAll', (req, res) => {
	console.log('POST /donation/deleteAll');
	Donation.collection.drop((err) => {
		if (err) {console.log(err); res.status(500).send(); return;}
		res.status(200).send();
	});
});




module.exports = router;