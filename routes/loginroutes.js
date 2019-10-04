const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "itcave",
    password: "Perseusz20^!",
    database: "citybike",
    multipleStatements: true
});

con.connect(function(err){
    if(!err) {
        console.log("Database is connected");
    } else {
        console.log("Error connecting database");
    }
});
exports.register = function(req,res){
    console.log("req",req.body);
    let adres={
        "ulica":req.body.ulica,
        "numer":req.body.numer,
        "kod_pocztowy":req.body.kod_pocztowy,
        "miasto":req.body.miasto
    }
    let konto={
        "login":req.body.login,
        "haslo":req.body.haslo,
        "email":req.body.email,
        "rola":"usr"
    }
    let klient={
        "imie":req.body.imie,
        "nazwisko":req.body.nazwisko,
        "id_adres":0,
        "id_konto":0,
    }
    con.query('SELECT login FROM konto WHERE login = ?', konto.login, function (error, results, fields) {
        if (error) {
            console.log(error);
          res.send({
            "code":400,
            "failed":"error ocurred",
            "error1": error
          })
        }
        else if(!results.length){
            con.query('INSERT INTO konto SET ?', konto, function (error, results1, fields) {
                if (error) {
                    console.log(error);
                  res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error1": error
                  })
                }else{
                    klient.id_konto = results1.insertId;
                    con.query('INSERT INTO adres SET ?', adres, function (error, results2, fields) {
                        if (error) {
                            console.log(error);
                            res.send({
                            "code":400,
                            "failed":"error ocurred",
                            "error2": error
                            })
                        }else{
                            klient.id_adres = results2.insertId;
                            console.log(results1.insertId);
                            console.log(results2.insertId);
                            console.log(klient);
                            con.query('INSERT INTO klient SET ?', klient, function (error, results3, fields) {
                                if (error) {
                                    console.log(error);
                                res.send({
                                    "code":400,
                                    "failed":"error ocurred",
                                    "error3": error
                                })
                                }else{
                                    res.send({
                                        "code":200,
                                        "success":"user registered sucessfully"
                                    });
                                }
                            });
                        }
                    });  
                }
            });  
        }
        else{
            console.log("results: "+results[0].login);
            console.log("konto: "+konto.login);
            res.send({
                "code":200,
                "error":"user already registered"
            });
        }
    });
}

exports.addAdmin = function(req,res){
    console.log("req",req.body);
    let konto={
        "login":req.body.login,
        "haslo":req.body.haslo,
        "email":req.body.email,
        "rola":req.body.rola,
    }
    let pracownik={
        "imie":req.body.imie,
        "nazwisko":req.body.nazwisko,
        "numer_tel":req.body.numer_tel,
        "placa":req.body.placa,
        "id_stanowisko":req.body.id_stanowisko,
        "id_konto":0,
    }
    
    con.query('INSERT INTO konto SET ?', konto, function (error, results1, fields) {
    if (error) {
        console.log(error);
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error1": error
      })
    }else{
        pracownik.id_konto = results1.insertId;
        con.query('INSERT INTO pracownik SET ?', pracownik, function (error, results2, fields) {
        if (error) {
            console.log(error);
            res.send({
            "code":400,
            "failed":"error ocurred",
            "error2": error
            })
        }else{
            res.send({
                "code":200,
                "success":"admin registered sucessfully"
            });
        }});  
    }});
}

exports.login = function(req,res){
var login= req.body.login;
var haslo = req.body.haslo;
con.query('SELECT * FROM konto WHERE login = ?',[login], function (error, results, fields) {
if (error) {
    // console.log("error ocurred",error);
    res.send({
    "code":400,
    "failed":error
    })
}else{
    // console.log('The solution is: ', results);
    if(results.length >0){
        if(results[0].haslo == haslo && results[0].rola == 'adm'){
            req.session.login = login;
            console.log(results[0]);
            req.session.rola = results[0].rola;
            req.session.email = results[0].email;
            res.redirect('/dashboard');
        }
        else if(results[0].haslo == haslo && results[0].rola == 'usr'){
            con.query('SELECT konto.*, klient.id_klient FROM klient, konto WHERE klient.id_konto = konto.id_konto AND konto.login = ?',[login], function (error, results, fields) {
                if (error) {
                    // console.log("error ocurred",error);
                    res.send({
                    "code":400,
                    "failed":error
                    })
                }else{
                    req.session.login = login;
                    req.session.rola = results[0].rola;
                    req.session.email = results[0].email;
                    req.session.id_klient = results[0].id_klient; 
                }
                res.redirect('/home');
            });
        } 
        else{
            res.send({
            "code":204,
            "error":"login and password does not match"
            });
        }
    }
    else{
        res.send({
            "code":204,
            "error":results
        });
    }
}
});
}