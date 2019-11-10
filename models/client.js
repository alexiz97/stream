// Requiring bcrypt for password hashing. Using the bcryptjs version as 
//the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
//
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {
  var Client = sequelize.define("Client", {
    name: {
      type: DataTypes.STRING(126),
      allowNull: false,
      unique: true
    },
    login: {
      type: DataTypes.STRING(126),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(126),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_id_subiekt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  // Creating a custom method for our User model. 
  //This will check if an unhashed password entered by the 
  //user can be compared to the hashed password stored in our database
  Client.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password

  //This is a fix by Samaila Philemon Bala in case you want to use ES6
//and the above is not working
Client.beforeCreate(client => {
    client.password = bcrypt.hashSync(
      client.password,
       bcrypt.genSaltSync(10),
       null
     );
   });
  // User.hook("beforeCreate", function(user) {
  //   user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  // });
  return Client;
};



