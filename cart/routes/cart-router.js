const express = require('express');
const CartCtrl = require('../controllers/cart-ctrl');
const router = express.Router();
/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create a new cart.
 *     description: Endpoint to create a new cart.
 *     requestBody:
 *       required: true
 *       content:
 *        form-data:
 *          schema:
 *           type: object
 *           required:
 *             - userId
 *             - products
 *           properties:
 *             userId:
 *               type: string
 *               default: 1
 *             products:
 *               type: array
 * 
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: johndoe 
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *             
 *  
 *     responses:
 *       200:
 *         description: Cart created successfully.
 */
router.post('/cart', CartCtrl.addProductsToCart);
router.get('/cart', CartCtrl.getProductsFromCart);
/**
 * @swagger
 * /api:
 *  get:
 *   description: Use to check if service is running
 *   responses:
 *      '200':
 *       description: A successful response
 * 
 */
router.get('/', CartCtrl.checkServiceRunning);
// increase 
router.get('/cart/increase/:productId', CartCtrl.increaseProductCount);
// decrease
router.get('/cart/decrease/:productId', CartCtrl.decreaseProductCount);
// remove
router.delete('/cart/remove/:productId', CartCtrl.removeProduct);
// clear
router.delete('/cart/clear', CartCtrl.clearCart);



module.exports = router;