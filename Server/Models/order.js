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
		type: Array,
    	required: true
	},
	status: {
		type: String,
    	required: true,
    	default: "Pending"
	}
});

var getOrderDate = function(){
	var date = new Date();
	return [date.getFullYear(),date.getMonth() + 1,date.getDate()].join("-");
}


module.exports = {Order,getOrderDate};