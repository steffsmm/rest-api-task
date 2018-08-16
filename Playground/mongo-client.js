const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/',(err,db)=>{
	if (err){
		console.log('Unable to connect');
	}
	console.log('Connected');


	db.close();
})