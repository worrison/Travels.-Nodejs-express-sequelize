let models = require('../models');

function listTravels()
{
    return models.travel.findAll({
        include: [{
          model: models.user
        }]
      })
}

function addTravel(travel,userId)
{
  console.log("usuario",);
    let travelAdd={
      destino: travel.destino,
      fecha_salida: travel.fecha_salida,
      fecha_llegada: travel.fecha_salida,
      precio: travel.precio,
      descuento: travel.descuento,
      userId:userId
    }
    return models.travel.create(travelAdd);
}

function uploadImages(idTravel,urlImage)
{
  console.log("hola",urlImage);
  let images=urlImage.map((image)=>{return {url:image.filename,travelId:idTravel}})
  // let img = {
  //   url: urlImage.originalname,
  //   travelId:idTravel
  //   }
  models.image.bulkCreate(images)
}
module.exports = {
    listTravels,
    addTravel,
    uploadImages
};