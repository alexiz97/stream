module.exports = function(sequelize, DataTypes) {
  var Executive = sequelize.define("Executive", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_num: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Executive.associate = function(models) {
    Executive.belongsTo(models.Assignment, {foreignKey: 'executive_id', as: 'executiveAssignments'})
  };
  return Executive;
};



