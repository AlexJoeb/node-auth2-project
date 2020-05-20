// * Knex Database (DBMS)
const knex = require('knex');
const config = require('../knexfile.js');
const db = knex(config[process.env.ENV || 'development']);

const getAllUsers = () => db('users as u')
    .join('roles as r', 'r.id', '=', 'u.role')
    .select('u.id', 'u.username', 'u.department', 'r.role');

const getUserByID = id => db('users as u')
    .where('u.id', id)
    .join('roles as r', 'r.id', '=', 'u.role')
    .select('u.id', 'u.username', 'u.department', 'r.role')
    .first();

const getUserByName = name => db('users as u')
    .where('u.username', name)
    .join('roles as r', 'r.id', '=', 'u.role')
    .select('u.id', 'u.username', 'u.department', 'r.role')
    .first();

const getUsersByDepartment = department => db('users as u')
    .where('u.department', department)
    .join('roles as r', 'r.id', '=', 'u.role')
    .select('u.id', 'u.username', 'u.department', 'r.role');

const newUser = user => db('users')
    .insert(user)
    .then(([id]) => getUserByID(id))
    .catch(error => error);

const removeUser = id => db('users')
    .where({ id })
    .del();

const updateUser = (id, update) => db('users')
    .where({ id })
    .update(update)
    .then(resp => resp)
    .catch(error => error);

module.exports = {
    getAllUsers,
    getUserByID,
    getUserByName,
    getUsersByDepartment,
    newUser,
    removeUser,
    updateUser,
};