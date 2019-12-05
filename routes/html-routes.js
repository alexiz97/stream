// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
//
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticatedAdmin = require("../config/middleware/isAuthenticatedAdmin");
var isAuthenticatedClient = require("../config/middleware/isAuthenticatedClient");
//
module.exports = function(app) {
//
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if(req.user){
      if (req.user.type === "Client") {
        res.redirect("/client");
      }
    }
    res.sendFile(path.join(__dirname, '../private', 'login_client.html'));
  });
//
  app.get("/panel", function(req, res) {
    // If the user already has an account send them to the members page
    if(req.user){
      if (req.user.type === "Admin") {
        res.redirect("/admin");
      }
    }
    res.sendFile(path.join(__dirname, '../private', 'login_admin.html'));
  });
//
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be 
  //redirected to the signup page
  app.get("/admin", isAuthenticatedAdmin, function(req, res) {
    res.sendFile(path.join(__dirname, '../private', 'admin.html'));
  });
  app.get("/adminView", isAuthenticatedAdmin, function(req, res) {
    res.sendFile(path.join(__dirname, '../private', 'client.html'));
  });
  app.get("/client", isAuthenticatedClient, function(req, res) {
    res.sendFile(path.join(__dirname, '../private', 'client.html'));
  });
};