const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sgTransport({
	auth: {
		api_key: process.env.ADMIN_EMAIL_API_KEY
	}
}));

module.exports = transporter;