'use strict';
module.exports = (sequelize, DataTypes) => {
    let user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
    
  }, {
    uniqueKeys: {
        Items_unique: {
            fields: ['email']
        }    
    }
  });

  user.associate = function(models) {
    models.user.hasMany(models.travel)
  };

  return user;
};