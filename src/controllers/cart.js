const Cart = require('../models/cart');

exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      let httpStatus = 200;
      let response = "Successful";
      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          condition = { user: req.user._id, 'cartItems.product': product };
          update = {
            $set: {
              'cartItems.$': {
                product: item.product,
                price: item.price,
                quantity: item.quantity + cartItem.quantity,
              },
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        Cart.findOneAndUpdate(condition, update)
        .exec((error, _cart)=>{
          if (error) {
            httpStatus = 400;
            response = error;
          } 
          if (_cart) {
            response = _cart;
          }
        })
      });
      return res.status(httpStatus).json({message: response});
    } else {
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });

      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error: error });
        if (cart) {
          return res.status(201).json({ cart: cart });
        }
      });
    }
  });
};
