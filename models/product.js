module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    product_id_subiekt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: false
    },
    description: {
      type: DataTypes.STRING(10000),
      allowNull: false,
      unique: false
    },
    img_url: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    }
  });
  return Product;
};



