var config;

try {
	config = require('./private.config');
} catch(e) {
	config = {
		//secret which is used to hash json-web-token
		'secret': 'supersecret-json-web',

		//mongoDB Connection
		'database': 'mongodb://USERNAME:PASSWORD@DATABASE',

		'mailConfig': {

			//SMTP Host
			host: 'SMTP-HOST',

			//SSL Port
			port: 465,

			//use SSL (recommended)
			secure: true,

			//mail credentials
			auth: {
				user: 'SMTP-USER',
				pass: 'SMTP-PASSWORD'
			}
		}
	}
}

module.exports = config;