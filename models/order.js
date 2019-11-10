module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define("Order", {
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    order_id_subiekt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    }
  });
  return Order;
};



