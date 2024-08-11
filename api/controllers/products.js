const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getAllProducts = (req, res, next) => {
    Product.find()
    .select('-__v')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    Invocation: {
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                };
            })
        };
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.addProduct = (req, res, next) => {

    const productmodel = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    productmodel.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product created successfully',
            createdProduct: {
                id: result._id,
                name: result.name,
                price: result.price,
                response: {
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    });
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
        console.log("From Monggoloyddb: ",doc);
        
        if (doc) {
            res.status(200).json({
                product: doc,
                Invocation: {
                    url: 'http://localhost:3000/products'
                }
            });
        } else{
            res.status(404).json({
                message: "No data found in the database with the Id provided"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.updateProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.updateOne({_id: id},{$set: req.body})
    .then(result => res.status(200).json({
        id: req.body._id,
        name: req.body.name,
        price: req.body.price,
        Invocation: {
            url: 'http://localhost:3000/products/' + id
        }
    }))
    .catch(err => res.status(500).json({
        error: err
    }))
}

exports.deleteProduct = (req, res, next) => { 
    const id = req.params.productId
    Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}