const router = require('express').Router();
const db = require('../data/db-helper');

const {
    validateUpdate,
    protected
} = require('./UserValidations');

router.get('/', protected, (req, res) => {
    return db.getUsersByDepartment(req.jwt.department)
        .then(users => res.status(200).json({
            message: 'Presenting all users in same department.',
            users
        }))
        .catch(error => res.status(500).json(error));
});

router.get('/:id', protected, (req, res) => {
    if (req.params.id === 'all') return db.getAllUsers()
        .then(users => res.status(200).json({
            message: 'Presenting all users.',
            users,
        }))
        .catch(error => res.status(500).json(error));

    return db.getUserByID(req.params.id)
        .then(user => user ? res.status(200).json({
            message: `Prersenting user with ID: ${req.params.id}`,
            user,
        }) : res.status(404).json({ message: `User not found.` }))
        .catch(error => res.status(500).json(error));
});

router.put('/:id', protected, validateUpdate, (req, res) => {
    return db.updateUser(req.params.id, req.user)
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json(error));
})

router.delete('/:id', protected, (req, res) => {
    return db.removeUser(req.params.id)
        .then(res => res.status(200).json({ message: `Succesfully removed ID: ${req.params.id}` }))
        .catch(error => res.status(500).json(error));
})

module.exports = router; 