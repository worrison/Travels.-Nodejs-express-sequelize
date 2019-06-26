let models = require('../models');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;


async function listUsers()
{
    return await models.user.findAll()
}
async function findUserById(id)
{
    return await models.user.findOne({ where: { id: id } })
}

async function register(email,password,name){

    if(email !="" & password !="" & name !="")
    {
        let userLf = await models.user.findAll({ where: { email: email } });
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
        let match = await bcrypt.compare(password, user[0].password);
        return match ? user[0] : null;
    }    
}

async function actived(email){

    let user = await models.user.findAll({ where: { email: email } })
    return user[0].active
}

async function userId(email){

     let usuarioId= models.user.findAll({ where: { email: email } })
     return usuarioId
}

async function active(hashLink){

     let userIdByHash = await models.hash.findAll({ where: { cadena: hashLink } })
     let user = await models.user.update({active:1} , { where: {id: userIdByHash[0].userId}} )
     return user
}

async function hashear(id,pass){

    let hash = encodeURIComponent(pass);
    let combinacion = hash + id
    let hashLink={
        cadena:combinacion,
        userId:id
        }
        await models.hash.create(hashLink)
    return  hashLink
}

async function userExist(email)
{
    console.log("email llegado",email)
     let user = await models.user.findOne({ where: { email: email } })
     console.log("usuario encontrado",user)
     return user.length ? null:user
}
async function hashByUserId(userId)
{
    let hash = await models.hash.findOne({ where: { userId: userId }, order: [
        ['createdAt', 'DESC']
    ], })
    return hash.cadena
}
async function userIdByHash(hash)
{
    let userId = await models.hash.findOne({ where: { cadena: hash } })
    return userId.userId
}
async function updatePassword(id,password)
{   console.log("id del usuario",id)
    let passwordHash=await bcrypt.hash(password, SALT_ROUNDS );
    hashear(id,passwordHash)
    let updatePassUser=await models.user.update({password : passwordHash},{ where: { id: id } })
    return updatePassUser
    
}

async function updateStates(idUser,admin,active)
{  
    
    let updateStateUser=await models.user.update({rol : admin, active : active},{ where: { id: idUser } })
    return updateStateUser
    
}
module.exports = {
    listUsers,
    register,
    checkLogin,
    actived,
    active,
    userId,
    hashear,
    userExist,
    hashByUserId,
    userIdByHash,
    updatePassword,
    findUserById,
    updateStates
};