const router = require('express').Router();
const db = require('../data/db-helper');
const jwt = require('jsonwebtoken');

const {
    validateLogin,
    validateUser
} = require('./UserValidations');

router.post('/login', validateLogin, (req, res) => {
    const { user } = req;
    const token = generateToken(user);
    return res.status(200).json({
        message: `Welcome back, ${user.username}!`,
        token
    });
});

router.post('/register', validateUser, (req, res) => {
    const { user } = req;
    const token = generateToken(user);
    return db.newUser(req.user)
        .then(user => res.status(201).json({
            message: `${req.user.username} created successfully.`,
            user,
            token
        }))
        .catch(error => res.status(500).json(error));
});

const generateToken = user => {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department,
    };

    const options = {
        expiresIn: '1d',
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = router;