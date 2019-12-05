// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var isAuthenticatedAdmin = require("../config/middleware/isAuthenticatedAdmin");
//
module.exports = function(app) {
  // TERRITORY API
  // Route for adding territory
  app.post("/api/addTerritory", isAuthenticatedAdmin, (req, res) =>{
    console.log(req.body);
    db.Territory.create({
      name: req.body.name,
      number: req.body.number,
      type: req.body.type
    }).then(function() {
      res.json('success');
      console.log('Dodano teren: '+ req.body.name);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for editing territory
  app.post("/api/editTerritory", isAuthenticatedAdmin, (req,res) =>{
    db.Territory.update(
      { name: req.body.et_name,
        number: req.body.et_number,
        type: req.body.et_type
      },
      { 
        where: { id: req.body.et_id } 
      }).then(()=>{
        console.log('Zaktualizowano teren: ' + req.body.e_name);
        res.send({
          "code":200,
          "success": "success"
        })
      }).catch((err)=>{
        console.log('Nie zaktualizowano teren: '+ req.body.e_name + ' Error: ' + err);
        res.send({
          "code":400,
          "failed":"error ocurred",
          "error": err
        })
      })
    });
  // Route for deleting Territorys
  app.get("/api/deleteTerritory", isAuthenticatedAdmin, (req,res) =>{
    db.Territory.destroy({
      where: {
        id: req.query.id_territory
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
  // Route for listing Territorys
  app.get("/api/listTerritories", isAuthenticatedAdmin, (_req,res) =>{
    db.Territory.findAll({
      attributes: ['id','name','number','type'],
      include: [{ association: "territoryDont_visits"}],
      include: [{ association: "territoryAssignments"}],
      include: [{ model: db.Executive}],
      order: [
        ['number', 'ASC'], ["territoryAssignments", 'updatedAt', 'desc']
    ],
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
  // Route for listing Territory data
  app.get("/api/TerritoryData", isAuthenticatedAdmin, (req,res) =>{
    db.Territory.findAll({
      attributes: ['id','name','number','type'], 
      
      where: {
        id: req.query.id_territory
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