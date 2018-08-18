const request = require('request');


var getVat = (countryCode,callback)=> {
  request({
    url:`https://jsonvat.com/`,
    json: true
  },(error, response, body)=>{
    console.log(response);
    console.log(body.rates);

  })
}