const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


var UserSchema = new mongoose.Schema({
	username: {
		type: String,
    	unique: true,
    	required: true,
    	trim: true,
    	minlength: 1
	},
	password: {
		type: String,
    	required: true,
    	minlength: 6
	},
	tokens:[{
		access:{
			type: String,
			required: true
		},
		token:{
			type: String,
			required: true
		}
	}]
});




UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(),access,countryCode: "BG"}, 'secret',{expiresIn:"1h"}).toString();

  user.tokens.push({access,token});

  return user.save().then(()=>{
    return token;
  })
};
UserSchema.methods.removeToken = function(token){
	var user = this;
	return user.update({
		$pull: {
			tokens: {token}
		}
	});


};

UserSchema.methods.toJSON = function(){
	var user = this;
	var userObj = user.toObject();

	return _.pick(userObj,['_id','username']);
};
UserSchema.statics.findByToken = function(token){
	var User = this;
	var decoded;

	try{
		decoded = jwt.verify(token,'secret');
	}catch(e){
		return Promise.reject();
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function(username,password){
	var User = this;
	
	return User.findOne({username,password}).then((user)=>{
		if(!user){
			return Promise.reject();
		}

		return user;
	})
};

var User = mongoose.model('User', UserSchema);
module.exports = {User};