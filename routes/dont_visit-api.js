// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var isAuthenticatedAdmin = require("../config/middleware/isAuthenticatedAdmin");
//
module.exports = function(app) {
  // DONT VISIT API
  // Route for adding territory
  app.post("/api/addDont_visit", isAuthenticatedAdmin, (req, res) =>{
    console.log(req.body);
    db.Dont_visit.create({
      territory_id: req.body.territory_id,
      address: req.body.address,
      date: req.body.date
    }).then(function() {
      res.json('success');
      console.log('Dodano teren: '+ req.body.name);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for editing Dont_visit
  app.post("/api/editDont_visit", isAuthenticatedAdmin, (req,res) =>{
    db.Dont_visit.update(
      { 
        territory_id: req.body.e_territory_id,
        address: req.body.e_address,
        date: req.body.e_date
      },
      { 
        where: { id: req.body.e_id } 
      }).then(()=>{
        console.log('Zaktualizowano "Nie odwiedzać": ' + req.body.e_address);
        res.send({
          "code":200,
          "success": "success"
        })
      }).catch((err)=>{
        console.log('Nie zaktualizowano "Nie odwiedzać": '+ req.body.e_address + ' Error: ' + err);
        res.send({
          "code":400,
          "failed":"error ocurred",
          "error": err
        })
      })
    });
  // Route for deleting Dont_visits
  app.get("/api/deleteDont_visit", isAuthenticatedAdmin, (req,res) =>{
    db.Dont_visit.destroy({
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
  // Route for listing Dont_visits
  app.get("/api/listDont_visits", isAuthenticatedAdmin, (_req,res) =>{
    db.Dont_visit.findAll({
      attributes: ['id','id_territory','address','date']
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
  // Route for listing Dont_visit data
  app.get("/api/Dont_visitData", isAuthenticatedAdmin, (req,res) =>{
    db.Dont_visit.findAll({
      attributes: ['id','id_territory','address','date'], 
      include: [{ association: "territoryDont_visits"}],
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