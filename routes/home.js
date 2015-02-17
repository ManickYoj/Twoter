var Twote = require('../model/twote');
var User = require('../model/user');

module.exports = function(req, res) {
	Twote.find().sort({postTime: -1}).populate('user', 'name').exec(function(err, twotes) {
		if (err) return res.sendStatus(500);

		User.find({}, function(err, users) {
		if (err) return res.sendStatus(500);

			res.render('index', {
				name: req.session.name,
				twote: twotes,
				incl_js: ['twote'],
				user: users
			});
		});
	});
}

// Create a new Twote
module.exports.post = function (req, res) {
	// Find the user posting the twote
	User.findOne({name: req.session.name}, function (err, user) {
		if (err) return res.sendStatus(500);

		// Create a new twote, associating a user with it in the process
		Twote.create({text: req.body.text, user: user._id}, function(err, twote) {
			if (err) return res.sendStatus(500);

			console.log('Twote created by %s', twote.user)
			return res.render('../partials/twote', {
				layout: false,
				text: twote.text,
				user: user,
				_id: twote._id
			});
		});
	});	
}

module.exports.login = function(req, res) {
	User.findOrCreate({name: req.body.name}, function (err, user, created) {
		if (err) res.sendStatus(500);

		if (created) console.log('New user, %s, created.', user.name);
		req.session.name = user.name;

		return res.render('../partials/twote-form', {layout: false}, function (err, twoteForm) {
			res.render('../partials/logout', {name: user.name, layout: false}, function(err, logoutData) {
				if (created) res.render('../partials/user', {name:user.name, layout: false}, function(err, userData) {
						res.json({
							layout: false,
							bannerData: twoteForm,
							logoutData: logoutData,
							userData: userData
						});
					});
				else res.json({
							layout: false,
							bannerData: twoteForm,
							logoutData: logoutData
						});
			});
		});
	});
}

module.exports.logout = function(req, res) {
	delete req.session.name;
	return res.render('../partials/login-form', { layout: false });
}

// Delete a twote
module.exports.delete = function (req, res) {
	// Check to ensure user deleting the post is the user that posted it
	Twote.findById(req.body.id).populate('user', 'name').exec(function (err, twote) {

		// Error out if not
		if (req.session.name !== twote.user.name) return res.sendStatus(500);
		else {

			// or delete the posts if so
			Twote.findOneAndRemove({_id: req.body.id}, function (err, twote) {
				if (err) return res.sendStatus(500);
				else return res.sendStatus(200);
			});
		}
	});
}