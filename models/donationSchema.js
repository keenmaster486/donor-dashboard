const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema(
{
	id: {type: Number, required: true},
	name: {type: String},
	email: {type: String},
	gender: {type: String},
	address: {type: String},
	amount: {type: Number, required: true}
});

const Donation = new mongoose.model('Donation', donationSchema);

module.exports = Donation;