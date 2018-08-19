
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {mongose} = require('./../db/mongoose');
const {Product} = require('./../Models/product');
const {Order} = require('./../Models/order');
const {User} = require('./../Models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  username: "susername1",
  password: "userOnePass",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userOneId, access: "auth",countryCode: "BG"}, 'secret').toString()
  }]
},{
  _id: userTwoId,
  username: "username2",
  password: "userTwoPass",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userTwoId, access: "auth",countryCode: "BG"}, 'secret').toString()
  }]
}];
const products = [
  {
    _id: new ObjectID(),
    id: 1,
    name: "Apple",
    category: "Fruit",
    price: 1
  },
  {
    _id: new ObjectID(),
    id: 2,
    name: "Milk",
    category: "Diary",
    price: 2.50
  }
];

const orders = [
  {
    _id: new ObjectID(),
    id: 1,
    date: "2018-05-29",
    products: [1, 2],
    status: "Delivered"
  },
  {
    _id: new ObjectID(),
    id: "2",
    date: "2018-05-30",
    products: [1],
    status: "Pending"
  }
];

const populateProducts = async () => {
  await Product.remove({})
  return Product.insertMany(products)
};
const populateOrders = async () => {
  await Order.remove({})
  return Order.insertMany(orders)
};
const populateUsers = async () => {
  await User.remove({})
  const userOne = new User(users[0]).save()
  const userTwo = new User(users[1]).save()

  return Promise.all([ userOne, userTwo ])
};


module.exports = {users,products,orders,populateProducts,populateUsers,populateOrders};
