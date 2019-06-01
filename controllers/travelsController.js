let models = require('../models');

function listTravels()
{
    return models.travel.findAll()
}

module.exports = {
    listTravels
};