const mongoose = require('mongoose');
const CartItem = require('./cart-item-model');
const Schema = mongoose.Schema;



const Cart = new Schema(
    {
        userId: { type: String, required: true },
        products: [CartItem.schema],
    },
    { timestamps: true },
)
module.exports = mongoose.model('carts', Cart);