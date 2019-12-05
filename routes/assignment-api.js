// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var isAuthenticatedAdmin = require("../config/middleware/isAuthenticatedAdmin");
//
module.exports = function(app) {
  // ASSIGNMENT API
  // Route for adding territory
  app.post("/api/addAssignment", isAuthenticatedAdmin, (req, res) =>{
    let dateA, dateR;
    console.log("TUUUTAJ" + req.body.dateOfAssignment);
    if(req.body.dateOfAssignment === ''){
      dateA = null;
    }
    else{
      dateA = req.body.dateOfAssignment;
    }
    if(req.body.dateOfReturn === ''){
      dateR = null;
    }
    else{
      dateA = req.body.dateOfReturn;
    }
    db.Assignment.create({
      territory_id: req.body.territory_id,
      executive_id: req.body.executive_id,
      dateOfAssignment: dateA,
      dateOfReturn: dateR,
      serviceYear: req.body.serviceYear
    }).then(function() {
      res.json('success');
      console.log('Dodano teren: '+ req.body.name);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for editing Assignment
  app.post("/api/editAssignment", isAuthenticatedAdmin, (req,res) =>{
    let dateA, dateR;
    if(req.body.e_dateOfAssignment !== ''){
      dateA = new Date(Date.parse(req.body.e_dateOfAssignment));
    }
    else{dateA = null}
    if(req.body.e_dateOfReturn !== ''){
      dateR = new Date(Date.parse(req.body.e_dateOfReturn));
    }
    else{dateR = null}
    db.Assignment.update(
      { 
        territory_id: req.body.e_territory_id,
        executive_id: req.body.e_executive_id,
        dateOfAssignment: dateA,
        dateOfReturn: dateR,
        serviceYear: req.body.e_serviceYear
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
  // Route for deleting Assignments
  app.get("/api/deleteAssignment", isAuthenticatedAdmin, (req,res) =>{
    db.Assignment.destroy({
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
  // Route for listing Assignments
  app.get("/api/listAssignments", isAuthenticatedAdmin, (_req,res) =>{
    db.Assignment.findAll({
      attributes: ['id','territory_id','executive_id','dateOfAssignment','dateOfReturn','serviceYear'],
      include: [{ association: "territoryAssignments"}],
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
  // Route for listing Assignment data
  app.get("/api/AssignmentData", isAuthenticatedAdmin, (req,res) =>{
    db.Assignment.findAll({
      attributes: ['id','territory_id','executive_id','dateOfAssignment','dateOfReturn','serviceYear'], 
      include: [{ association: "territoryAssignments"}],
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