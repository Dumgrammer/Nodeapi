const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET to products'
    });
});
//Alam mo na to kung ano endpoints syempre  

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'POST to products',
        createdProduct: product
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    //Eto binding id's for scpecifics

    if (id === 'special') {
        
        res.status(200).json({
            message: 'GET specific ID of Products',
            id: id
        });

    } else {
        res.status(404).json({
            message: 'Not Found'
        })
    }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated'
    });
});

router.delete('/:productId', (req, res, next) => { 
    res.status(200).json({
        message: 'Deleted'
    });
});


module.exports = router; 