'use strict';
module.exports = (sequelize, DataTypes) => {
    let user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.BOOLEAN,
    active: {
      type:DataTypes.BOOLEAN,
      defaultValue : 0
    }

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