const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CartItem = new Schema(
    {
        productName: { type: String, required: true },
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    },
    { timestamps: true },
)
module.exports = mongoose.model('cartItems', CartItem);
