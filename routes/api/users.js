const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('./../../models/User');

router.get('/test', (req, res) => {
    res.json({
        msg: 'Users works'
    })
});

router.post('/register', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (user) {
        res.status(400).json({email: 'email already exists'})
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
            res.json({message: 'Success'})
        } else {
            res.status(404).json({password: 'Password incorrect'})
        }
    } catch (e) {
        console.log(e.message)
    }
});


module.exports = router;