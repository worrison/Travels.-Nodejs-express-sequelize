let models = require('../models');

function listUsers()
{
    return models.user.findAll()
}

module.exports = {
    listUsers
};