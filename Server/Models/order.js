var mongoose = require('mongoose');

var Order = mongoose.model('Order',{
	id: {
		type: Number,
    	required: true
	},
	date: {
		type: String,
    	required: false
	},
	products: {
		type: Object,
    	required: true
	},
	status: {
		type: String,
    	required: true,
    	default: "Pending"
	}
});


module.exports = {Order};