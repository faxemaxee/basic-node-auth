var config;

try {
	config = require('./private.config');
} catch(e) {
	config = {

		'secret': 'supersecret-json-web',						//secret which is used to hash json-web-token
		'database': 'mongodb://USERNAME:PASSWORD@DATABASE',		//mongoDB Connection
		'mailConfig': {
			host: 'SMTP-HOST',									//SMTP Host
			port: 465,											//SSL Port
			secure: true, 										//use SSL (recommended)
			auth: {
				user: 'SMTP-USER',								//Mailusername (yourmail@example.com)
				pass: 'SMTP-PASSWORD'							//Mailpassword
			}
		}
	}
}

module.exports = config;