let models = require('../models');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;


function listUsers()
{
    return models.user.findAll()
}

async function register(email,password,name){
    if(email !="" & password !="" & name !="")
    {
        let userLf = await models.user.findAll({ where: { email: email } });
        console.log("usuario",userLf.length);
        if(userLf.length === 0)//no existe en la base de datos el usuario
        {
                let hash = await bcrypt.hash(password, SALT_ROUNDS );
                let user = {
                password: hash,
                email, 
                name,
                }
               
                return models.user.create(user);
        }
        
    }
}
        

async function checkLogin(email, password){
    
    let user = await models.user.findAll({ where: { email: email } })
    if(user.length === 0){
        return null 
    }else{
        // Comparar contraseñas
        let match = await bcrypt.compare(password, user[0].password);
        return match ? user[0] : null;
    }    
}
async function actived(email){
    console.log('valor email',email);
    let user = await models.user.findAll({ where: { email: email } })
    console.log('usuario',user);
    return user.active===1 ? true:false
}

module.exports = {
    listUsers,
    register,
    checkLogin,
    actived
};