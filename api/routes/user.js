const express = require('express');
const router = express.Router();

const Usercontroller = require('../controllers/user');
const AuthGuard = require('../middleware/auth-guard');

router.post('/register', Usercontroller.userRegister);

router.post('/login', Usercontroller.userLogin);

router.delete('/:userId', AuthGuard, Usercontroller.accountDelete);

module.exports = router