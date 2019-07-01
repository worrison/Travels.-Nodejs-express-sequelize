'use strict'

module.exports = (sequelize, DataTypes) => {
    let mainImage = sequelize.define('mainImage', {        
    })

    mainImage.associate = function (models) {
        models.mainImage.belongsTo(models.travel)
        models.mainImage.belongsTo(models.image)
    }

    return mainImage
}