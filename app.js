const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItems = require('./models/cart-items');
const Order = require('./models/order');
const OrderItems = require('./models/order-items');

dotenv.config({ path: './config/.env' });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const errController = require('./controllers/404');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      // Here the ( user ) is the Sequelise Data from the Database with User Data and with some Helper functions
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
// This Will Only Executes when there a Existing User in the Database
// All the Products are Based on this User . The Data From the Request Can be Used for Future Purposes

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use(errController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItems });
Product.belongsToMany(Cart, { through: CartItems });
Order.belongsTo(User);
User.hasMany(Order);
Product.belongsToMany(Order, { through: OrderItems });
Order.belongsToMany(Product, { through: OrderItems });

sequelize
  // .sync({ force: true })
  // This Will Overwrite the Table in the Database . So This is Not Neccessary for All the Functions
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Joshua', email: 'test@gmail.com' });
    }
    return user;
    // Applying ( Promise.resolve )
    // Here We Use .then() in the Next Block , So it Automatically Convert the Object to a Promise
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then((user) => {
    app.listen(process.env.PORT, () => {
      console.log(`Server Is Running At PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
