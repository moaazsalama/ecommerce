const joi = require('joi')
const cartItemSchema = joi.object({
    productName: joi.string().required(),
    productId: joi.string().required(),
    quantity: joi.number().required(),
    price: joi.number().required()
});
const schema = joi.object({
    products: joi.array().items(cartItemSchema).required().min(1)
});
const validateCart = (cart) => {

    return schema.validate(cart);
}
module.exports = { validateCart, schema };