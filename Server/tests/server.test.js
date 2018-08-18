const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Product} = require('./../Models/product');

// beforeEach((done)=>{
// 	Product.remove({}).then(()=>done());
// });

describe('POST /product',()=>{
	it('should post new product',(done)=>{
		var name = "Apple";

		request(app)
		.post('/products')
		.send({name})
		.expect(200)
		.expect((res)=>{
			expect(res.body.name).toBe(name);
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			Product.find().then((todos)=>{
				expect(todos.length).toBe(1);
				expect(todos[0].name).toBe(name);
			}).catch((e)=>{
				done(e);
			});
		});
	});
});