var mongoose = require('mongoose');

var User = mongoose.model('User',{
	user: {
		type: String,
    	required: true,
    	unique: true,
    	trim: true
	},
	password: {
		type: String,
    	required: true
	}
});

module.exports = {User};