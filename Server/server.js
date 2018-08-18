const express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var app = express();
var {mongoose} = require('./db/mongoose');
var {Product} = require('./Models/product');
var {Order} = require('./Models/order');
var {User} = require('./Models/user');

app.use(bodyParser.json());

app.post('/products',(req,res)=>{
	var product = new Product({
		id: req.body.id,
		name: req.body.name,
		category: req.body.category,
		price: req.body.price
	});
	product.save().then((doc)=>{
		res.send(doc);
	},(e)=>{
		res.status(400).send(e);
	});
});

app.get('/products',(req,res)=>{
	Product.find().then((products)=>{
		res.send({products});
	},(e)=>{
		res.status(400).send(e);
	});
});

app.get('/products/:id',(req,res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	Product.findById(id).then((product)=>{
		if(!product){
			return res.status(404).send();
		}

		res.send({product});

	}).catch(()=>{
		res.status(400).send()
	})




})



app.listen(3000);

module.exports = {app};
