const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	type: {type: String, required: true},
	displayName: {type: String, required: true},
	email: String,
	description: String
});

const User = new mongoose.model('User', userSchema);

module.exports = User;