let models = require('../models');

function listTravels()
{
    return models.travel.findAll()
}

function addTravel(travel)
{
    return models.travel.create(travel);
}
module.exports = {
    listTravels,
    addTravel
};