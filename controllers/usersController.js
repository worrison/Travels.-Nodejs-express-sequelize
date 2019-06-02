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

async function checkLogin(email, password){
    
    let user = await models.user.findAll({ where: { email: email } })
    if(user.length === 0){
        return null 
    }else{
        // Comparar contraseñas
        let match = await bcrypt.compare(password, user[0].password);
        console.log("resultado", match);
        console.log("user", user[0].id);
        return match ? user[0] : null;
    }
           
}

module.exports = {
    listUsers,
    register,
    checkLogin
};