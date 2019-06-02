let models = require('../models');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

function listUsers()
{
    return models.user.findAll()
}

async function register(email,password,name){

    let hash = await bcrypt.hash(password, SALT_ROUNDS );
    let user = {
        password: hash,
        email, 
        name,
    }
    return models.user.create(user);
}

module.exports = {
    listUsers,
    register
};