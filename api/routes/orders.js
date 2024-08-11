const express = require('express');
const router = express.Router();
const AuthGuard = require('../middleware/auth-guard');

const Ordercontroller = require('../controllers/orders');

router.get('/', AuthGuard, Ordercontroller.ordersGetAll);

router.post('/', AuthGuard, Ordercontroller.createOrder);
 
router.get('/:orderId', AuthGuard, Ordercontroller.getOrder);

router.delete('/:orderId', AuthGuard, Ordercontroller.deleteOrder);

module.exports = router