var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var schema =  mongoose.Schema({
	name: {type: String, match: /^[A-Za-z ]*$/, unique: true, required: true}
	//twotes: [{type: mongoose.Schema.ObjectId, ref: 'Twote'}]
});

schema.plugin(findOrCreate);
module.exports = mongoose.model('User', schema);