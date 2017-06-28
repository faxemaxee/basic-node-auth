const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', router);

//MIDDLEWARE TO CHECK TOKEN
router.use(function (req, res, next) {
	if (req.path === '/login' ||
		req.path === '/register' ||
		(req.path.indexOf('/verify') !== -1) ||
		req.path === '/') return next();

	var token = req.body.token || req.headers['x-access-token'] || req.headers['Authorization'];

	if (token) {

		jwt.verify(token, config.secret, function (err, decoded) {
			if (err) {
				return res.status(403).json({
					error: true,
					msg: 'Failed to authenticate token.'
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});

	} else {
		return res.status(403).json({
			error: true,
			message: 'No token provided.'
		});

	}
});

//ROUTES
const userRoute = require('./routes/user.route.js');


//ENDPOINTS
router.get('/', function (req, res) {
	res.json({message: 'hooray! welcome to our api!'});
});

//USER
router.route('/user/')
	.put(userRoute.update)
	.delete(userRoute.delete);
router.route('/user/password')
	.put(userRoute.updatePassword);

router.route('/users/').get(userRoute.getAll);


router.route('/register')
	.post(userRoute.create);
router.route('/verify/:username/:code')
	.get(userRoute.verify);
router.route('/login')
	.post(userRoute.login);


app.listen((process.env.PORT || 1337), function () {
	console.log('listening on ' + (process.env.PORT || 1337));
});