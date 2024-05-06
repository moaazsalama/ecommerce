const Cart = require('../models/cart-model')
const cartValidator = require('../validator/cart-validator')
const db = require('../db/index')

getProductsFromCart = async (req, res) => {
    console.log(req.user.uid);
    await Cart.find({ userId: req.user.uid }, (err, cart) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!cart) {
            return res
                .status(404)
                .json({ success: false, error: `Cart not found` });
        }
        //remove _id from response aslso in products
        console.log(cart);
        if (cart.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }
        cart[0]._doc._id = undefined;
        // console.log(cart[0]._doc.products);
        let newProducts = [];
        cart[0]._doc.products.forEach(product => {
            product._id = undefined;
            const newProduct = {
                productId: product.productId,
                quantity: product.quantity,
                productName: product.productName,
                price: product.price

            };
            newProducts.push(newProduct);

        });
        cart[0]._doc.products = newProducts;

        return res.status(200).json({ success: true, data: cart[0] });
    }).catch(err => console.log(err));
}
const updateOrCreateCart = async (userId, newProducts) => {
    // Check if a cart with the specified user ID exists
    const existingCart = await Cart.findOne({ userId });

    if (existingCart) {
        // If a cart exists
        newProducts.forEach(newProduct => {
            // Check if the product already exists in the cart
            const existingProductIndex = existingCart.products.findIndex(product => product.productId === newProduct.productId);

            if (existingProductIndex !== -1) {
                // If the product exists, update the count by adding the count of the new product
                existingCart.products[existingProductIndex].quantity += newProduct.quantity;
            } else {
                // If the product does not exist, append it to the products list
                existingCart.products.push(newProduct);
            }
        });

        // Save the updated cart
        await existingCart.save();
        return existingCart;
    } else {
        // If no cart exists, create a new cart with the user ID and products
        const newCart = new Cart({
            userId,
            products: newProducts
        });
        await newCart.save();
        return newCart;
    }
};
addProductsToCart = (req, res) => {
    const body = req.body;
    console.log("hello");
    const userId = req.user.uid;
    // Validate request
    const { error } = cartValidator.validateCart(body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message,
        });
    }
    let cart = new Cart(body);
    console.log(cart);

    updateOrCreateCart(userId, cart.products)
        .then((cart) => {
            return res.status(201).json({
                success: true,
                id: cart._id,
                message: 'Cart updated!',
            });
        })
        .catch((error) => {
            return res.status(400).json({
                success: false,
                error: error,
            });
        });




}

checkServiceRunning = (req, res) => {
    res.send('Hello World! - from shopping cart service.');
}
// increase
increaseProductCount = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.uid;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(404).send('Cart not found');
    }
    const product = cart.products.find(product => product.productId === productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    product.quantity++;
    await cart.save();
    res.send('Product count increased successfully');

}
//decrease
decreaseProductCount = async (req, res) => {
    //get userId and productId from request params
    const { productId } = req.params;
    const userId = req.user.uid;
    const cart = await Cart.findOne({
        userId
    });
    if (!cart) {
        return res.status(404).send('Cart not found');
    }
    const product = cart.products.find(product => product.productId === productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    if (product.quantity === 1) {
        return res.status(400).send('Product count cannot be less than 1');
    }
    product.quantity--;
    await cart.save();
    res.send('Product count decreased successfully');
}
// remove product
removeProduct = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.uid;
    const cart = await Cart.findOne({
        userId
    });
    if (!cart) {
        return res.status(404).send('Cart not found');
    }
    const productIndex = cart.products.findIndex(product => product.productId === productId);
    if (productIndex === -1) {
        return res.status(404).send('Product not found');
    }
    cart.products.splice(productIndex, 1);
    await cart.save();
    res.send('Product removed successfully');
}
// clear cart
clearCart = async (req, res) => {
    const userId = req.user.uid;
    const cart = await Cart.findOne

        ({ userId });
    if (!cart) {
        return res.status(404).send('Cart not found');
    }
    cart.products = [];
    await cart.save();
    res.send('Cart cleared successfully');
}

module.exports = {
    getProductsFromCart,
    addProductsToCart,
    checkServiceRunning,
    decreaseProductCount,
    increaseProductCount,
    removeProduct,
    clearCart

};
