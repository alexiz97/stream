module.exports = function(sequelize, DataTypes) {
  var Dont_visit = sequelize.define("Dont_visit", {
    territory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: false,
    }
  });
  return Dont_visit;
};



