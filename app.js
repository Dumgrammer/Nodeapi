const express = require('express');
const app = express();
const morgan = require('morgan');
const parser = require('body-parser');
const mongoose = require('mongoose');

const prouductRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://bastianlacap55:' 
    + process.env.mongodbpass + 
    '@nodeapi.sqejkvo.mongodb.net/?retryWrites=true&w=majority&appName=Nodeapi'
);
mongoose.Promise = global.Promise;

//Libraries
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(parser.urlencoded({extended: false}));
app.use(parser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"),
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
            return res.status(200).json({

            });
        }
        next();
});

//This would behave like a middleware
app.use('/products', prouductRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
//Error handler for request
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


//Error handler for functions
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;
