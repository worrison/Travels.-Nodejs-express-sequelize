'use strict';
module.exports = (sequelize, DataTypes) => {
  var hash = sequelize.define('hash', {
    cadena: DataTypes.STRING
  });

    hash.associate = function(models) {
    models.hash.belongsTo(models.user)
  };

  return hash;
};