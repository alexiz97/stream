module.exports = function(sequelize, DataTypes) {
  var Product_client = sequelize.define("Product_client", {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    client_id: {
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
  return Product_client;
};



