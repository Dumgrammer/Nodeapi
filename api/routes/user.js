const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const argon = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/register', async (req, res, next) => {
  try {

        const existingUser = await User.find({email: req.body.email});

        if(existingUser.length > 0){
            return res.status(400).json({
                message: 'Email already in use'
            });
        }

        const hash = await argon.hash(req.body.password, 10);
        const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
        });
        const savedUser = await user.save();
        console.log(savedUser);
        res.status(200).json({ 
            message: 'User registered'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error registering user'
        });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        
        const existingUser = await User.findOne({email: req.body.email});
        
        if (!existingUser) {
            return res.status(401).json({
                message: 'Invalid Credentials!'
            });
        }

        const verifiedPassword = await argon.verify(existingUser.password, req.body.password);
        if (verifiedPassword) {
            const token = jwt.sign({
                email: existingUser.email,
                userId: existingUser._id
            },process.env.jwt_key,
            {
                expiresIn: "1h"
            })
            return res.status(200).json({
                message: "Logged in successully!",
                token: token
            });
        } else {
            return res.status(401).json({
                message: "Invalid Credentials!"
            })
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
});

router.delete('/:userId', async (req, res, next) => {
    try {

        const id = req.params.userId;
        const result = await User.deleteOne({_id: id});

        if(result.deletedCount === 0){
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: 'User Deleted!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            err: error
        });
    }
});

module.exports = router