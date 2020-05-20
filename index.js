// * Express
const express = require('express');
const server = express();

// * Environment Variables
require('dotenv').config()

server.use(express.json());

// * Express Sessions
const session = require('express-session');

server.use(session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // Timing in ticks. Set as 24 hours.
        secure: process.env.ENV === 'development' ? false : true,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
}));

// * Routes
const Users = require('./Routes/Users');
const Auth = require('./Routes/Auth');

server.use('/api/users', Users);
server.use('/auth', Auth);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`API started on port ${port}.`)); 