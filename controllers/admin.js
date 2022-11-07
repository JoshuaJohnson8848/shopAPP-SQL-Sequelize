const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-products', {
    pageTitle: 'add-product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  req.user
    .createProduct({
      // Here the Data in the Request is a sequelize Object Not a general JS Object
      // So it Contains Magical Helper Functions that Why we use  ( CreateProduct ) Function in Request
      // Otherwise we have to Mention the User Explicitly
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      console.log('PRODUCT CREATED');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.editing;
  if (!editMode) {
    return res.render('/');
  }
  const prodId = req.params.Id;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        res.redirect('/');
      }
      res.render('admin/edit-Products', {
        pageTitle: 'edit-product',
        path: '/admin/edit-products',
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log());
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
    })
    .then((product) => {
      console.log('PRODUCT UPDATED');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // console.log(product.__proto__);
  req.user
    .getProducts()
    // Product.findAll()
    .then((products) => {
      const product = products[0];
      if (!product) {
        res.redirect('/');
      }
      res.render('admin/admin-products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log('PRODUCT DELETED');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
