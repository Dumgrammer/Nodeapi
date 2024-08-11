const express = require('express');
const router = express.Router();
const multer = require('multer');

const AuthGuard = require('../middleware/auth-guard');
const Productcontroller = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type.'), false);
    }
}

const upload = multer({storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', AuthGuard, Productcontroller.getAllProducts);

router.post('/', AuthGuard, upload.single('productImage'), Productcontroller.addProduct);

router.get('/:productId', AuthGuard, Productcontroller.getProduct);

router.put('/:productId', AuthGuard, Productcontroller.updateProduct);

router.delete('/:productId', AuthGuard, Productcontroller.deleteProduct);


module.exports = router; 