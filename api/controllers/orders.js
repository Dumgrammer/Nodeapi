const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/product');

exports.ordersGetAll = (req, res, next) => {
    Order.find()
    .select('-__v')
    .populate('product', '-__v')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    Invocation: {
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                };
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    });
}

exports.getAll = async(req, res, next) => {
    try {
       const allOrders = await Order.find()
       .select('-__v')
       .populate('product', '-__v')
       .exec();

       if (allOrders !== null) {
        return res.status(200).json({
            order: allOrders
        })
       } else {
        return res.status(404).json({
            message: "No Order found"
        });
       }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            err: error
        })
    }
}

exports.createOrder = (req, res, next) => {

    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            placedOrder: {
                id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                url: 'http://localhost/orders' + result ._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

}

exports.getOrder = (req, res, next) => { 
    const id = req.params.orderId;
    Order.findById(id)
    .select('-__v')
    .populate('product', '-__v')
    .exec()
    .then(order => {
        console.log("From Monggoloyd DB: " + order);
        if(order) {
            res.status(200).json({
                order: order,
                Invocation: {
                    url: 'http://localhost:3000/orders'
                }
            });
        } else{
         res.status(404).json({
            message: "Data not found"
         })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}

exports.deleteOrder = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            Result: result,
            url: 'http://localhost:3000/orders'
        });
    })
    .catch(err=> {
        res.status(404).json({
            error: err,
            Message: "No order data found",
            
        })
    })
}