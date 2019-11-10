// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var isAuthenticatedAdmin = require("../config/middleware/isAuthenticatedAdmin");
//
module.exports = function(app) {

  // USERS API
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login_admin", passport.authenticate("adminLocal"), (req, res) =>{
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/admin");
  });
  app.post("/api/login_client", passport.authenticate("clientLocal"), (req, res) =>{
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/client");
  });
  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/addAdmin", isAuthenticatedAdmin, (req, res) =>{
    console.log(req.body);
    db.Admin.create({
      email: req.body.email,
      password: req.body.password,
      type: "Admin"
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for logging user out
  app.get("/logout", (req, res) =>{
    req.logout();
    res.redirect("/");
  });
  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", isAuthenticatedAdmin, (req, res) =>{
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // CLIENTS API
  // Route for adding client
  app.post("/api/addClient", isAuthenticatedAdmin, (req, res) =>{
    console.log(req.body);
    db.Client.create({
      name: req.body.name,
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
      client_id_subiekt: req.body.id_subiekt,
      type: "Client"
    }).then(function() {
      res.json('success');
      console.log('Dodano klienta: '+ req.body.name);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for editing client
  app.post("/api/editClient", isAuthenticatedAdmin, (req,res) =>{
    db.Client.update(
      { name: req.body.e_name,
        login: req.body.e_login,
        email: req.body.e_email,
        password: req.body.e_password,
        client_id_subiekt: req.body.e_client_id_subiekt
      },
      { 
        where: { id: req.body.e_id } 
      }).then(()=>{
        console.log('Zaktualizowano użytkownika: ' + req.body.e_name);
        res.send({
          "code":200,
          "success": "success"
        })
      }).catch((err)=>{
        console.log('Nie zaktualizowano użytkownika: '+ req.body.e_name + ' Error: ' + err);
        res.send({
          "code":400,
          "failed":"error ocurred",
          "error": err
        })
      })
    });
  // Route for deleting clients
  app.get("/api/deleteClient", isAuthenticatedAdmin, (req,res) =>{
    db.Client.destroy({
      where: {
        id: req.query.id_konto
      }
    }).then(()=>{
      res.send({
        "code":200,
        "success": "success"
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });
  // Route for listing clients
  app.get("/api/listClients", isAuthenticatedAdmin, (_req,res) =>{
    db.Client.findAll({
      attributes: ['id','name','login','email','client_id_subiekt']
    }).then((data)=>{
      res.send({
        "code":200,
        "success": data
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });
  // Route for listing client data
  app.get("/api/clientData", isAuthenticatedAdmin, (req,res) =>{
    db.Client.findAll({
      attributes: ['id','name','login','email','client_id_subiekt'], 
      where: {
        id: req.query.id_konto
      }
    }).then((data)=>{
      res.send({
        "code":200,
        "success": data
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });
  // Route for listing client's shared products
  app.get("/api/clientsProducts", isAuthenticatedAdmin, (req,res) =>{
    db.Product_client.findAll({
      attributes: ['product_id','discount'], 
      where: {
        client_id: req.query.id
      }
    }).then((data)=>{
      res.send({
        "code":200,
        "success": data
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });

  // PRODUCTS API
  // Route for adding product
  app.post("/api/addProduct", isAuthenticatedAdmin, (req, res) =>{
    console.log(req.body);
    db.Product.create({
      name: req.body.name,
      description: req.body.description,
      img_url: req.body.img_url,
      category_id: req.body.category_id,
      product_id_subiekt: req.body.id_subiekt
    }).then(function() {
      res.json('success');
      console.log('Dodano produkt: '+ req.body.name);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for editing client
  app.post("/api/editProduct", isAuthenticatedAdmin, (req,res) =>{
    db.Product.update(
      { 
        name: req.body.p_name,
        description: req.body.p_description,
        img_url: req.body.p_img_url,
        category_id: req.body.p_category_id,
        product_id_subiekt: req.body.p_product_id_subiekt
      },
      { 
        where: { id: req.body.p_id } 
      }).then((a)=>{
        console.log('Zaktualizowano produkt: ' + req.body.p_name + " " +a);
        res.send({
          "code":200,
          "success": "success"
        })
      }).catch((err)=>{
        console.log('Nie zaktualizowano produktu: '+ req.body.p_name + ' Error: ' + err);
        res.send({
          "code":400,
          "failed":"error ocurred",
          "error": err
        })
      })
    });
  // Route for deleting clients
  app.get("/api/deleteProduct", isAuthenticatedAdmin, (req,res) =>{
    db.Product.destroy({
      where: {
        id: req.query.id
      }
    }).then(()=>{
      res.send({
        "code":200,
        "success": "success"
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });
  // Route for listing clients
  app.get("/api/listProducts", isAuthenticatedAdmin, (_req,res) =>{
    db.Product.findAll({
      attributes: ['id','name','category_id']
    }).then((data)=>{
      res.send({
        "code":200,
        "success": data
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });
  // Route for listing client data
  app.get("/api/productData", isAuthenticatedAdmin, (req,res) =>{
    db.Product.findAll({
      attributes: ['id','name','description','img_url','category_id','product_id_subiekt'], 
      where: {
        id: req.query.id
      }
    }).then((data)=>{
      res.send({
        "code":200,
        "success": data
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });
  // Route for listing product sharing
  app.get("/api/productSharing", isAuthenticatedAdmin, (req,res) =>{
    db.Product_client.findAll({
      attributes: ['client_id','discount'], 
      where: {
        product_id: req.query.id
      }
    }).then((data)=>{
      res.send({
        "code":200,
        "success": data
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });

    // CATEGORIES API
  // Route for adding product
  app.post("/api/addCategory", isAuthenticatedAdmin, (req, res) =>{
    console.log(req.body);
    db.Category.create({
      name: req.body.name,
      parent_category_id: req.body.parent_category_id,
    }).then(function(data) {
      res.send({
        "code":200,
        "success": data
      })
      console.log('Dodano kategorię: '+ req.body.name);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for editing client
  app.post("/api/editCategory", isAuthenticatedAdmin, (req,res) =>{
    db.Category.update(
      { 
        name: req.body.e_name,
        parent_category_id: req.body.e_parent_category_id,
        parent_discount: req.body.e_discount
      },
      { 
        where: { id: req.body.e_id } 
      }).then(()=>{
        console.log('Zaktualizowano kategorię: ' + req.body.e_name);
        res.send({
          "code":200,
          "success": "success"
        })
      }).catch((err)=>{
        console.log('Nie zaktualizowano kategorii: '+ req.body.e_name + ' Error: ' + err);
        res.send({
          "code":400,
          "failed":"error ocurred",
          "error": err
        })
      })
    });
  // Route for deleting clients
  app.get("/api/deleteCategory", isAuthenticatedAdmin, (req,res) =>{
    db.Category.destroy({
      where: {
        id: req.query.id
      }
    }).then(()=>{
      res.send({
        "code":200,
        "success": "success"
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });
  // Route for listing clients
  app.get("/api/listCategories", isAuthenticatedAdmin, (_req,res) =>{
    db.Category.findAll({
      attributes: ['id','name','parent_category_id','discount']
    }).then((data)=>{
      res.send({
        "code":200,
        "success": data
      })
    }).catch((err)=>{
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": err
      })
    });
  });


};