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
                hash=encodeURIComponent(hash);
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
    return user[0].active
}

async function userId(email)
{
     let usuarioId= models.user.findAll({ where: { email: email } })
     return usuarioId
}

async function active(hashLink)
{
    console.log("hola usuario",hashLink);

     let userIdByHash = await models.hash.findAll({ where: { cadena: hashLink } })
     console.log("ojete",userIdByHash[0].id);
     let user = await models.user.update({active:1},{where:{id: userIdByHash[0].userId}} )
     return user
}

async function hashear(id,pass)
{
    console.log("idididi",id);
    let combinacion=pass + id
    let hashLink={
        cadena:combinacion,
        userId:id
        }
        await models.hash.create(hashLink)
    return  hashLink
}

module.exports = {
    listUsers,
    register,
    checkLogin,
    actived,
    active,
    userId,
    hashear
};