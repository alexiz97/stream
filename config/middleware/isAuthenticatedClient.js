// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function(req, res, next) {
    // If the user is logged in by login consider him as client
    if(req.user){
      if (req.user.type === "Client") {
        return next();
      }
    }
    
    // If the user isn't' logged in, redirect them to the login page
    return res.redirect("/");
  };