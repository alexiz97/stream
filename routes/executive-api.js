// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var isAuthenticatedAdmin = require("../config/middleware/isAuthenticatedAdmin");
//
module.exports = function(app) {
  // Executive API
  // Route for adding territory
  app.post("/api/addExecutive", isAuthenticatedAdmin, (req, res) =>{
    console.log(req.body);
    db.Executive.create({
      name: req.body.name,
      type: req.body.type,
      phone_num: req.body.phone_num
    }).then(function() {
      res.json('success');
      console.log('Dodano teren: '+ req.body.name);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for editing Executive
  app.post("/api/editExecutive", isAuthenticatedAdmin, (req,res) =>{
    db.Executive.update(
      { 
        name: req.body.e_name,
        type: req.body.e_type,
        phone_num: req.body.e_phone_num
      },
      { 
        where: { id: req.body.e_id } 
      }).then(()=>{
        console.log('Zaktualizowano przydzial: ' + req.body.e_address);
        res.send({
          "code":200,
          "success": "success"
        })
      }).catch((err)=>{
        console.log('Nie zaktualizowano przydzia: '+ req.body.e_address + ' Error: ' + err);
        res.send({
          "code":400,
          "failed":"error ocurred",
          "error": err
        })
      })
    });
  // Route for deleting Executives
  app.get("/api/deleteExecutive", isAuthenticatedAdmin, (req,res) =>{
    db.Executive.destroy({
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
  // Route for listing Executives
  app.get("/api/listExecutives", isAuthenticatedAdmin, (_req,res) =>{
    db.Executive.findAll({
      attributes: ['id','name','type','phone_num']
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
  // Route for listing Executive data
  app.get("/api/ExecutiveData", isAuthenticatedAdmin, (req,res) =>{
    db.Executive.findAll({
      attributes: ['id','name','type','phone_num'], 
      include: [{ association: "executiveAssignments"}],
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

};