const db = require('../data/db-helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateUser = async (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.password || !req.body.department || !req.body.role) return res.status(400).json({ message: `Invalid POST request. Make sure 'username', 'password', 'department', and 'role' are in the body of the request.` });
    
    const exists = await db.getUserByName(req.body.username);
    if (exists) return res.status(400).json({ message: `Username already exists.` });
    
    if (typeof req.body.role === 'string') req.body.role = parseInt(req.body.role); 
    req.body.password = await bcrypt.hashSync(req.body.password, 10);

    req.user = req.body;
    next();
};

const validateUpdate = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: `Nothing was provided in the body to update.` });
    if (!req.params.id || parseInt(req.params.id) <= 0) return res.status(400).json({ message: `A valid, positive integer, ID must be provided.` });
    if (!req.body.username && !req.body.password) return res.status(400).json({ message: `A username and/or password must be provided to update.` });

    if (req.body.username) {
        const exists = await db.getUserByName(req.body.username);
        if (exists) return res.status(400).json({ message: `Username already exists.` });
    }

    if (req.body.password) req.body.password = await bcrypt.hashSync(req.body.password, 10);

    req.user = req.body;
    next();
};

const validateLogin = async (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.password) return res.status(400).json({ message: `Invalid POST request. Make sure 'username' and 'password' are in the body of the request.` });

    const user = await db.getUserByName(req.body.username);

    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const correctPassword = await bcrypt.compareSync(req.body.password, user.password);

    if (!correctPassword) return res.status(400).json({ message: 'Invalid credentials.' });

    req.user = user;
    next();
};

const protected = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) return res.status(400).json({ message: `Client must provide authorization information.`})
    
    jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
        if (err) return res.status(400).json({ message: `Client provided invalid authorization information.` });
        else {
            req.jwt = token;
            next();
        }
    })
}

module.exports = {
    validateUser,
    validateUpdate,
    validateLogin,
    protected
} 