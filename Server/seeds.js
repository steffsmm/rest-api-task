var mongoose = require("mongoose");
var {User} = require('./Models/user');



var data = {
            username: "username",
            password: "password"
        };


function seedDB() {
    User.find({username:data.username,password:data.password}).then((doc)=>{
		if (doc.length>0){
			console.log("found" ,doc)
		}else{
			
				var user = new User(data);
				user.save();	
		}
	},(e)=>{
		console.log("e",e);
	})


}

module.exports = {seedDB};