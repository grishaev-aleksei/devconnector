const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('./../../config/keys');
const passport = require('passport');

const User = require('./../../models/User');
const validateRegisterInput = require('./../../validation/register');

router.get('/test', (req, res) => {
    res.json({
        msg: 'Users works'
    })
});

router.post('/register', async (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const user = await User.findOne({email: req.body.email});
    if (user) {
        errors.email = 'email already exists';
        return res.status(400).json(errors);
    } else {
        try {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar,
            });

            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);
            const savedUser = await newUser.save();
            res.json(savedUser);
        } catch (e) {
            console.log(e.message)
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email});
        if (!user) {
            res.status(404).json({email: 'User not found'})
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (passwordCheck) {
            const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar
            };
            const token = await jwt.sign(payload, keys.jwtSecret, {expiresIn: '1h'});
            res.json({
                success: true,
                tokenType: 'Bearer',
                token
            })
        } else {
            res.status(404).json({password: 'Password incorrect'})
        }
    } catch (e) {
        console.log(e.message)
    }
});

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
});


module.exports = router;