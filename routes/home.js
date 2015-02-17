var Twote = require('../model/twote');
var User = require('../model/user');

module.exports = function(req, res) {
	if (req.isAuthenticated())
		Twote.find().sort({postTime: -1}).populate('user', 'name').exec(function(err, twotes) {
			if (err) return res.sendStatus(500);

			User.find({}, function(err, users) {
			if (err) return res.sendStatus(500);
				res.render('index', {
					name: req.user.displayName,
					twote: twotes,
					incl_js: ['twote'],
					user: users
				});
			});
		});
	else return res.render('index');
}

// Create a new Twote
module.exports.post = function (req, res) {
	// Find the user posting the twote
	User.findOne({name: req.user.displayName}, function (err, user) {
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
	User.findOrCreate({name: req.user.displayName}, function (err, user, created) {
		if (err) res.sendStatus(500);
		if (created) console.log('New user, %s, created.', user.name);
		return res.redirect('/');
	});
}

module.exports.logout = function(req, res) {
	req.logout();
	return res.redirect('/');
	//return res.render('../partials/login-form', { layout: false });
}

// Delete a twote
module.exports.delete = function (req, res) {
	// Check to ensure user deleting the post is the user that posted it
	Twote.findById(req.body.id).populate('user', 'name').exec(function (err, twote) {

		// Error out if not
		if (req.user.displayName !== twote.user.name) return res.sendStatus(500);
		else {

			// or delete the posts if so
			Twote.findOneAndRemove({_id: req.body.id}, function (err, twote) {
				if (err) return res.sendStatus(500);
				else return res.sendStatus(200);
			});
		}
	});
}