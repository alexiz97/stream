module.exports = function(sequelize, DataTypes) {
  var Territory = sequelize.define("Territory", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Territory.associate = function(models) {
    Territory.hasMany(models.Dont_visit, {foreignKey: 'territory_id', as: 'territoryDont_visits'})
    Territory.hasMany(models.Assignment, {foreignKey: 'territory_id', as: 'territoryAssignments'})
  };
  return Territory;
};



