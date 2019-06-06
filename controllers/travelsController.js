let models = require('../models');

function listTravels()
{
    return models.travel.findAll({
        include: [{
          model: models.user
        }]
      })
}

// {
//     where:{
//         userId:req.session.userId
//     }
// }

function addTravel(travel)
{
    return models.travel.create(travel);
}
module.exports = {
    listTravels,
    addTravel
};