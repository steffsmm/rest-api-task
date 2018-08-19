const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Product} = require('./../Models/product');
const {User} = require('./../Models/user');
const {Order} = require('./../Models/order');
const {users,products,orders,populateProducts,populateUsers,populateOrders} = require('./seeds');
var {getOrderDate} = require('./../Models/order');
var {getVat} = require('./../vat/vat');
var {getCountryCode} = require('./../Models/product');
const jwt = require('jsonwebtoken');

beforeEach((done)=>{
	Product.remove({}).then(()=>done());
});

beforeEach(populateProducts);
beforeEach(populateOrders);
beforeEach(populateUsers);

describe('POST /product',()=>{
	it('should post new product',(done)=>{
		var productObj = {
      id: 5,
      name: "Tomato",
      category: "Vegetable",
      price: 2
    };
    var name = productObj.name;
		request(app)
       .post('/products')
       .set('x-auth', users[0].tokens[0].token)
       .send(productObj)
       .expect(200)
       .expect((res) => {
         expect(res.body.name).toBe(name);
       })
       .end((err, res) => {
         if (err) {
           return done(err);
         }
        var name = productObj.name
         Product.find({name}).then((doc) => {
           expect(doc.length).toBe(1);
           done();
         }).catch((e) => done(e));
       });
       
	});


  it('should not create product with invalid body data', (done) => {

     request(app)
       .post('/products')
       .set('x-auth', users[0].tokens[0].token)
       .send({})
       .expect(400)
       .end((err, res) => {
         if (err) {
           return done(err);
         }

         Product.find().then((product) => {
           expect(product.length).toBe(2);
           done();
         }).catch((e) => done(e));
       });
       
   });


});



describe("GET /products", ()=>{
   it("should get all products",(done)=>{
     request(app)
     .get("/products")
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((res)=>{
       expect(res.body.products.length).toBe(2);
     })
     .end(done);

     })
 })



describe("GET /products/:id",()=>{
  it("should return products",(done)=>{
    request(app)
    .get(`/products/${products[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect((res)=>{
      expect(res.body.product.name).toBe(products[0].name);
    }).end(done);

  });

});


describe('DELETE /products/:id', () => {
  it('should remove a product', (done) => {
    var hexId = products[1]._id.toHexString();

    request(app)
      .delete(`/products/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Product.find({_id:hexId}).then((product) => {
          done();
        }).catch((e) => done(e));
      });
  });
});




describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        username: users[1].username,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1].token).toBe(res.headers['x-auth']);
          done();
        }).catch((e) => done(e));
      });
  });
});  


describe('GET /users/me',()=>{
  it('should return user if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString())
      expect(res.body.email).toBe(users[0].email)
    })
    .end(done);
  });
  it('should return 401 if not authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({})
    })
    .end(done);
  });
});




describe('POST /order',()=>{
  it('should post new order',(done)=>{
    var orderObj = {
      id: 1,
      products: [1, 2],
      status: "Processing"
    };
    var status = orderObj.status;
    request(app)
       .post('/orders')
       .set('x-auth', users[0].tokens[0].token)
       .send(orderObj)
       .expect(200)
       .expect((res) => {
         expect(res.body.status).toBe(status);
       })
       .end((err, res) => {
         if (err) {
           return done(err);
         }
         Order.find({status}).then((doc) => {
           expect(doc.length).toBe(1);
           done();
         }).catch((e) => done(e));
       });
       
  });

  it('should not create order with invalid body data', (done) => {

     request(app)
       .post('/orders')
       .set('x-auth', users[0].tokens[0].token)
       .send({})
       .expect(400)
       .end((err, res) => {
         if (err) {
           return done(err);
         }

         Order.find().then((order) => {
           expect(order.length).toBe(2);
           done();
         }).catch((e) => done(e));
       });
       
   });

});

describe('PATCH /orders/:id',()=>{

  it('shoudl update a order',(done)=>{
    var hexID = orders[0]._id.toHexString();
    var products = [1,2,3];
    request(app)
    .patch(`/orders/${hexID}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      products,
      status: "Pending"
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.order.date).toBe(getOrderDate());
      expect(res.body.order.products.join(",")).toBe(products.join(","));
    }).end(done)

  });

});


describe("GET /products/price/:id",()=>{
  it("should return price with vat",(done)=>{
    request(app)
    .get(`/products/price/${products[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect((res)=>{
    }).end((err, res) => {

       if (err) {
         return done(err);
       }

      var countryCode = jwt.verify(users[0].tokens[0].token,'secret').countryCode;

      Product.findById(products[0]._id.toHexString()).then((product)=>{
        var price = product.price;
        getVat("BG",price,(errorMessage, result)=>{
            if (result){
              expect(res.body.vatPrice).toBe(result.vat);
              done()
            }
        })
      }).catch((e) => done(e));
      
    })

  });

});












