const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var app = express();
var {mongoose} = require('./db/mongoose');
var {Product} = require('./Models/product');
var {Order} = require('./Models/order');
var {User} = require('./Models/user');
var {authenticate} = require('./middlewere/authenticate');
app.use(bodyParser.json());

app.post('/products',authenticate,(req,res)=>{
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

app.get('/products/:id',authenticate,(req,res)=>{
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


app.delete('/products/:id',authenticate,(req,res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}


	Product.findByIdAndRemove(id).then((product)=>{
		if(!product){
			return res.status(404).send();
		}


		res.send(product)
	}).catch((e)=>{
		res.status(400).send();
	});
});

app.patch('/products/:id',authenticate,(req,res)=>{
	var id = req.params.id;
	var body = _.pick(req.body, ['name','category','price']);

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	Product.findByIdAndUpdate(id,{$set:body},{new:true}).then((product)=>{
		if(!product){
			return res.status(404).send();
		}


		res.send({product});
	}).catch((e)=>{
		res.status(400).send();
	});

});

app.post('/users',(req,res)=>{
	var body = _.pick(req.body, ['username','password'])
	var user = new User(body);
	user.save().then((user)=>{
		//res.send(doc);
		return user.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth', token).send(user);
	}).catch((e)=>{
		res.status(400).send(e);
	});
});



app.get('/users/me',authenticate,(req,res)=>{
	
		res.send(req.user);
	
});

app.post('/users/login',(req,res)=>{
	var body = _.pick(req.body,['username','password']);

	User.findByCredentials(body.username,body.password).then((user)=>{
		user.generateAuthToken().then((token)=>{
			res.header('x-auth', token).send(user);
		});
	}).catch((e)=>{
		res.status(400).send();
	})
})

app.delete('/users/me/token',authenticate,(req,res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	}),()=>{
		res.status(400).send();
	};
})

app.listen(3000);

module.exports = {app};
