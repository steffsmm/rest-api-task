var mongoose = require('mongoose');

var Product = mongoose.model('Product',{
	id:{
		type: Number
	},
	name: {
		type: String
	},
	category: {
		type: String
	},
	price: {
		type: Number
	}
});

module.exports = {Product};