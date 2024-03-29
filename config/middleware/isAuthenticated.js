// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function(req, res, next) {
    // If the user is logged in by email consider him as admin. If logged in by login it's client
    if (req.user) {
      return next();
    }
    // If the user isn't' logged in, redirect them to the login page
    return res.redirect("/");
  };