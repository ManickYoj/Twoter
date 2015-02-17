var mongoose = require('mongoose');

var lengthValidator = function (input) {
	return input.length < 140
}

var schema =  mongoose.Schema({
	text: {type: String, match: /^[A-Za-z0-9 .,!?'":;]*$/ ,validate: [lengthValidator, 'Twote too long.']},
	postTime: {type: Date, default: Date.now},
	user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Twote', schema);