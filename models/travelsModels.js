'use strict';
module.exports = (sequelize, DataTypes) => {
  var travel = sequelize.define('travel', {
    destino: DataTypes.STRING,
    fecha_salida: DataTypes.DATE,
    fecha_llegada: DataTypes.DATE,
    precio: DataTypes.DECIMAL,
    descuento: DataTypes.DECIMAL,
    ruta_img: DataTypes.STRING
  });

  travel.associate = function(models) {
    models.travel.belongsTo(models.user)
  };

  return travel;
};