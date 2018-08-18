var mongoose = require('mongoose');

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

module.exports = {Product};