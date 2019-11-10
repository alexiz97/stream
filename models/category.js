module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING(126),
      allowNull: false,
      unique: true
    },
    parent_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    }
  });
  return Category;
};



