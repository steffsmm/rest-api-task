const express = require('express');
var bodyParser = require('body-parser');
var app = express();
var {mongoose} = require('./db/mongoose');
var {Product} = require('./Models/product');
var {Order} = require('./Models/order');
var {User} = require('./Models/user');

app.use(bodyParser.json());

app.post('/products',(req,res)=>{
	var product = new Product({
		name: req.body.name
	});
	product.save().then((doc)=>{
		res.send(doc);
	},(e)=>{
		res.status(400).send(e);
	});
})





// app.get('/',(req,res)=>{    
//   res.send('blabla');
// });

app.listen(3000);
