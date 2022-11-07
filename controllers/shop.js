const Product = require('../models/product');

exports.getProduct = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'My Shop',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductById = (req, res, next) => {
  const prodId = req.params.Id;
  Product.findByPk(prodId)
    .then((products) => {
      res.render('shop/product-descp', {
        product: products,
        pageTitle: 'Product Details',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
  // Product.findAll({ where: { id: prodId } })
  // .then((products) => {
  //   res.render('shop/product-descp', {
  //     product: products[0],
  //     pageTitle: 'Product Details',
  //     path: '/products',
  //   });
  // })
  // .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'index',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((product) => {
        res.render('shop/cart', {
          pageTitle: 'cart',
          path: '/cart',
          products: product,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.deleteId;
  req.user
    .getCart()
    .then((cart) => {
      console.log(cart);
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      console.log(products);
      const product = products[0];
      return product.cartItems.destroy();
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // Here the POST body Recieves
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products) {
        product = products[0];
      }
      if (product) {
        oldQuantity = product.cartItems.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProduct(
            products.map((product) => {
              product.orderItems = { quantity: product.cartItems.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect('/order');
    })
    .catch((err) => console.log(err));
};

exports.getOrder = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      console.log(orders);
      res.render('shop/order', {
        pageTitle: 'Orders',
        path: '/order',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
