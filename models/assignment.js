module.exports = function(sequelize, DataTypes) {
  var Assignment = sequelize.define("Assignment", {
    territory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    executive_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
    },
    dateOfAssignment: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      unique: false,
    },
    dateOfReturn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      unique: false,
    },
    serviceYear: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
  return Assignment;
};



