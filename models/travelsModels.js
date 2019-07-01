'use strict';
module.exports = (sequelize, DataTypes) => {
  var travel = sequelize.define('travel', {
    destino: DataTypes.STRING,
    fecha_salida: DataTypes.DATE,
    fecha_llegada: DataTypes.DATE,
    precio: DataTypes.DECIMAL,
    individuos: DataTypes.DECIMAL,
    disponibilidad: DataTypes.DECIMAL,//TIEMPO QUE ESTARÁ DISPONIBLE LA OFERTA
    descuento: DataTypes.DECIMAL,
  });

  travel.associate = function(models) {
    models.travel.belongsTo(models.user)
    models.travel.hasMany(models.image)
    models.travel.hasOne(models.mainImage)
  };

  return travel;
};