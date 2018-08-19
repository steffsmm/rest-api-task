const request = require('request');
const _ = require('lodash');

var getVat = (countryCode,price,callback)=> {
  request({
    url:`https://jsonvat.com/`,
    json: true
  },(error, response, body)=>{
  	if(!error && response.statusCode === 200){
  		var vatObj = _.filter(body.rates, function(o) { return o.code==countryCode });
  		
  		var vat = vatObj[0].periods[0].rates.standard;

  		callback(undefined,{
         vat: price + ((price*vat)/100)
       });
  	}else{
  		callback(error);
  	}
    

  })
}

module.exports = {getVat};

