'use strict';
module.exports = (sequelize, DataTypes) => {
  var travel = sequelize.define('travel', {
    destino: DataTypes.STRING,
    fecha_salida: DataTypes.DATE,
    fecha_llegada: DataTypes.DATE,
    precio: DataTypes.DECIMAL,
    descuento: DataTypes.DECIMAL,
  });

  travel.associate = function(models) {
    models.travel.belongsTo(models.user)
    models.travel.hasMany(models.image)
  };

  return travel;
};