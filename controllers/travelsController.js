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
  let travelAdd={
    destino: travel.destino,
    fecha_salida: travel.fecha_salida,
    fecha_llegada: travel.fecha_salida,
    precio: travel.precio,
    descuento: travel.descuento,
    userId: userId
  }
  return models.travel.create(travelAdd);
}
function removeTravel(travelId)
{
 
  return models.travel.destroy({ where: { id: travelId } }).then()
}

function uploadImages(idTravel,urlImage)
{
  let images=urlImage.map((image)=>{return {url:image.filename,travelId:idTravel}})
  models.image.bulkCreate(images)
}
module.exports = {
    listTravels,
    addTravel,
    uploadImages,
    removeTravel
};