const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	password: {type: String, required: true},
	email: String
});

const User = new mongoose.model('User', userSchema);

module.exports = User;