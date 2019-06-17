'use strict';
module.exports = (sequelize, DataTypes) => {
  var image = sequelize.define('image', {
    url: DataTypes.STRING
  });

  image.associate = function(models) {
    models.image.belongsTo(models.travel)
  };

  return image;
};