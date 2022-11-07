const express = require('express');
const route = express.Router();
const bodyParser = require('body-parser');

route.use(bodyParser.urlencoded({ extended: true }));

const adminController = require('../controllers/admin');

route.get('/add-product', adminController.getAddProduct);

route.post('/accept', adminController.postAddProduct);

route.get('/edit-product/:Id', adminController.getEditProduct);

route.post('/edit-product', adminController.postEditProduct);

route.post('/delete-product', adminController.postDeleteProduct);

route.get('/products', adminController.getProducts);

module.exports = route;
