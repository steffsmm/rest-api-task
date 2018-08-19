var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var Product = mongoose.model('Product',{
	id:{
		type: Number,
    	required: true
	},
	name: {
		type: String,
    	required: true
	},
	category: {
		type: String,
    	required: true
	},
	price: {
		type: Number,
    	required: true
	}
});

var getCountryCode = function(req){
	return jwt.verify(req.header('x-auth'),'secret').countryCode;
};



module.exports = {Product,getCountryCode};