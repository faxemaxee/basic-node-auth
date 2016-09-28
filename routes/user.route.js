//REQUIRES
const config = require('../config.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const emailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const nodemailer = require('nodemailer');
const Promise = require('promise');

//GLOBALS
var transporter = nodemailer.createTransport(config.mailConfig);

//LOGIN
exports.login = function (req, res) {
	if (!req.body.password || (!req.body.email && !req.body.username)) {
		res.status(400).json({
			msg: 'Missing data.'
		});
		return;
	}
	getUserBy((req.body.email ? {email: req.body.email} : {username: req.body.username}))
		.then(
			function (resp) {
				var user = resp.data;
				confirmPassword(user, req.body.password)
					.then(
						function () {
							var token = jwt.sign(
								{
									user: {
										username: user.username,
										email: user.email,
										userUUID: user.userUUID
									}
								},
								config.secret, {
									expiresIn: '30d'
								}
							);
							res.status(200).json({
								error: false,
								msg: 'Login Successfull',
								data: {
									token: token,
									userData: {
										username: user.username,
										email: user.email
									}
								}
							})
						},
						function (error) {
							console.error(error);
							res
								.status(error.status)
								.json(error);
						}
					);
			},
			function (error) {
				console.error(error);
				res
					.status(error.status)
					.json(error);
			}
		);
};

//USER C(R)UD
exports.create = function (req, res) {
	if (!req.body.email || !req.body.username || !req.body.password) {
		res.status(400).json({
			error: true,
			msg: 'Missing data!'
		});
		return;
	}

	var tempUser = new User({
		userUUID: uuid.v4(),
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		confirmationCode: uuid.v1()
	});

	//TODO: check for duplicate email or username seperatly to provide more detailed error msg wait for latest mongoDB
	tempUser.save(function (err) {
		if (err) {
			console.log(err.errmsg);
			res.status(500).json({
				error: true,
				msg: 'Failed to create user.'
			});
			return;
		}

		var link = "http://" + req.get('host') + "/api/verify/" + tempUser.username + "/" + tempUser.confirmationCode;
		var templateDir = path.join(__dirname, '../tpls', 'confirm');

		var sendConfirmation = transporter.templateSender(new emailTemplate(templateDir), {
			from: '"WoTick Service" <mail@in2web-design.de>'
		});
		sendConfirmation({
			to: tempUser.email,
			subject: "Welcome to BasicAuth - Complete your registration."
		}, {
			username: tempUser.username,
			link: link
		}, function (err, info) {
			if (err) {
				console.log('Error', err);
				res.status(200).json({
					error: false,
					msg: 'User Created. Failed to send verification email.'
				})
			} else {
				res.status(200).json({
					error: false,
					msg: 'User Created.'
				})
			}
		});
	})
};
exports.verify = function (req, res) {
	var staticDir = path.join(__dirname, '../tpls', 'static');

	if (!req.params.username || !req.params.code) {
		res
			.status(400)
			.sendFile(staticDir + '/error.html');
	}

	getUserBy({username: req.params.username})
		.then(
			function (resp) {
				var user = resp.data;
				if (!user.confirmed) {
					if (user.confirmationCode != req.params.code) {
						res
							.status(400)
							.sendFile(staticDir + '/error.html');
						return;
					} else {
						user.confirmationCode = "";
						user.confirmed = true;
					}

					user.save(function (err) {
						if (err) {
							res
								.status(500)
								.sendFile(staticDir + '/error.html');
							return;
						}

					});
				}
				res
					.status(200)
					.sendFile(staticDir + '/confirmed.html');
			},
			function (error) {
				console.error(error);
				res
					.status(error.status)
					.sendFile(staticDir + '/error.html');
			}
		);
};
exports.update = function (req, res) {
	getUserBy({userUUID: req.decoded.user.userUUID})
		.then(
			function (resp) {
				var user = resp.data;

				if (req.body.username) user.username = req.body.username;
				if (req.body.email) user.email = req.body.email;

				user.save(function (err) {
					if (err) {
						res.status(500).json({
							error: true,
							msg: 'Internal Server Error'
						});
						return;
					}
					res.status(200).json({
						error: false,
						msg: 'User Successfully Updated',
						userData: {
							username: user.username,
							email: user.email
						}
					})
				});
			},
			function (error) {
				console.error(error);
				res
					.status(error.status)
					.json(error);
			}
		);
};
exports.updatePassword = function (req, res) {
	if (!req.body.oldPassword || !req.body.newPassword) {
		res
			.status(400)
			.json({
				error: true,
				msg: 'Missing Data'
			});
		return;
	}

	getUserBy({userUUID: req.decoded.user.userUUID})
		.then(
			function (resp) {
				var user = resp.data;
				confirmPassword(user, req.body.oldPassword)
					.then(
						function (resp) {
							user.password = req.body.newPassword;

							user.save(function (err) {
								if (err) {
									res
										.status(500)
										.json({
											error: true,
											msg: 'Internal Server Error'
										});
									return;
								}
								res
									.status(200)
									.json({
										error: false,
										msg: 'Password Successfully Changed'
									})
							})
						},
						function (error) {
							console.error(error);
							res
								.status(error.status)
								.json(error);
						}
					);
			},
			function (error) {
				console.error(error);
				res
					.status(error.status)
					.json(error);
			}
		);

};
exports.delete = function (req, res) {
	if (!req.body.password) {
		res
			.status(401)
			.json({
				error: true,
				msg: 'Missing Data'
			})
	}
	getUserBy({userUUID: req.decoded.user.userUUID})
		.then(
			function (resp) {
				var user = resp.data;
				confirmPassword(user, req.body.password)
					.then(
						function () {
							user.remove(function (err) {
								if (err) {
									res.status(500).json({
										error: true,
										msg: 'Internal Server Error'
									});
									return;
								}
								res.status(200).json({
									error: false,
									msg: 'User Successfully Deleted'
								})
							});
						},
						function (error) {
							console.error(error);
							res
								.status(error.status)
								.json(error);
						}
					);
			},
			function (error) {
				console.error(error);
				res
					.status(error.status)
					.json(error);
			}
		);
};

exports.getAll = function (req, res) {
	User.find({}, function (err, data) {
		if (err) {
			res.status(500).json({
				error: true,
				msg: 'Internal Server Error'
			})
		}
		if (data) {
			res.status(200).json({
				error: false,
				msg: 'Found Users',
				data: data
			});
		} else {
			res.status(404).json({
				error: true,
				msg: 'No Users'
			})
		}
	})
};

var getUserBy = function (sParams) {
	return new Promise(function (res, rej) {
		User.findOne(sParams, function (err, data) {
			if (err) {
				console.log(err);
				rej({
					error: true,
					status: 500,
					msg: 'Internal Server Error'
				});
			} else {
				if (!data) {
					rej({
						error: true,
						status: 404,
						msg: 'No Such User'
					})
				} else {
					res({
						error: false,
						status: 200,
						msg: 'Found User',
						data: data
					})
				}
			}
		})
	})
};
var confirmPassword = function (user, pw) {
	return new Promise(function (resolve, reject) {
		if (!user.confirmed) {
			reject({
				error: true,
				status: 401,
				msg: 'Please Confirm Your Emailaddress.'
			})
		}
		user.comparePassword(pw, function (err, isMatch) {
			if (err) {
				console.log(err);
				reject({
					error: true,
					status: 500,
					msg: 'Internal Server Error'
				})
			}
			if (!isMatch) {
				reject({
					error: true,
					status: 401,
					msg: 'Wrong Password'
				})
			} else {
				resolve({
					error: false,
					status: 200,
					msg: 'Password Correct.'
				})
			}
		});
	})
};