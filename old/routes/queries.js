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


exports.addRower = function(req,res){
    let rower = {
        "marka": req.body.marka,
        "model": req.body.model,
        "lokalizacja": req.body.lokalizacja,
        "id_stacja": req.body.id_stacja,
        "id_stan": req.body.id_stan
    }
    con.query('INSERT INTO rower SET ?', rower, function (error, results1, fields) {
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
                "success":"rower added sucessfully"
            });
    }});
}

exports.deleteRower = function(req,res){
    let id_rower = req.query.id_rower;
    con.query('DELETE FROM rower WHERE id_rower = ?', id_rower, function (error, results1, fields) {
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
                "success":"rower deleted sucessfully"
            });
    }});
}

exports.editRower = function(req,res){
    let id_rower = req.body.id_rower;
    let rower = {
        "marka": req.body.marka,
        "model": req.body.model,
        "lokalizacja": req.body.lokalizacja,
        "id_stacja": req.body.id_stacja,
        "id_stan": req.body.id_stan
    }
    console.log(id_rower, rower);
    con.query(`UPDATE rower SET ? WHERE id_rower = ?`, [rower, id_rower], function (error, results1, fields) {
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
                "success":"rower edited sucessfully"
            });
    }});
}

exports.listRowery = function(req,res){
    let sess = req.session;
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT rower.id_rower, rower.marka, rower.model, rower.lokalizacja, stan_roweru.stan, stacja.nazwa FROM rower, stacja, stan_roweru WHERE rower.id_stacja = stacja.id_stacja AND rower.id_stan = stan_roweru.id_stan;', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}
exports.listRoweryStacja = function(req,res){
    let sess = req.session;
    let id_stacja = req.query.id_stacja;
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT rower.id_rower, rower.marka, rower.model, rower.lokalizacja, stan_roweru.stan, stacja.nazwa FROM rower, stacja, stan_roweru WHERE stan_roweru.id_stan = ? AND stacja.id_stacja = ? AND rower.id_stacja = stacja.id_stacja AND rower.id_stan = stan_roweru.id_stan;', [1, id_stacja], function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.fullRowerData = function(req,res){
    let sess = req.session;
    let id = req.query.id_rower;
    console.log(req.query);
    console.log(id);
    if(sess.login && sess.rola == 'adm') {
        con.query(`SELECT * FROM rower WHERE id_rower = ${id};`, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.addStacja = function(req,res){
    let adres={
        "ulica":req.body.ulica,
        "numer":req.body.numer,
        "kod_pocztowy":req.body.kod_pocztowy,
        "miasto":req.body.miasto
    }
    let stacja = {
        "nazwa": req.body.nazwa,
        "lokalizacja": req.body.lokalizacja,
        "id_adres": null
    }
    con.query('INSERT INTO adres SET ?', adres, function (error, results2, fields) {
        if (error) {
            console.log(error);
            res.send({
            "code":400,
            "failed":"error ocurred",
            "error2": error
            })
        }else{
            stacja.id_adres = results2.insertId;
            con.query('INSERT INTO stacja SET ?', stacja, function (error, results3, fields) {
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
                        "success":"stacja added sucessfully"
                    });
            }});
        }});  
}

exports.deleteStacja = function(req,res){
    let id_stacja = req.query.id_stacja;
    con.query('DELETE FROM stacja WHERE id_stacja = ?', id_stacja, function (error, results1, fields) {
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
                "success":"stacja deleted sucessfully"
            });
    }});
}

exports.editStacja = function(req,res){
    let id_stacja = req.body.id_stacja;
    let id_adres = req.body.id_adres;
    let adres={
        "id_adres":id_adres,
        "ulica":req.body.ulica,
        "numer":req.body.numer,
        "kod_pocztowy":req.body.kod_pocztowy,
        "miasto":req.body.miasto
    }
    let stacja = {
        "nazwa": req.body.nazwa,
        "lokalizacja": req.body.lokalizacja,
        "id_adres": req.body.id_adres
    }
    console.log(id_stacja, stacja);
    con.query(`UPDATE adres SET ? WHERE id_adres = ?`, [adres, id_adres], function (error, results2, fields) {
        if (error) {
            console.log(error);
            res.send({
            "code":400,
            "failed":"error ocurred",
            "error2": error
            })
        }else{
            con.query(`UPDATE stacja SET ? WHERE id_stacja = ?`, [stacja, id_stacja], function (error, results3, fields) {
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
                        "success":"user edited sucessfully"
                    });
            }});
        }});
}

exports.listStacja = function(req,res){
    let sess = req.session;
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT stacja.id_stacja, stacja.nazwa, stacja.lokalizacja, adres.ulica, adres.numer, adres.miasto FROM stacja, adres WHERE stacja.id_adres = adres.id_adres;', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.fullStacjaData = function(req,res){
    let sess = req.session;
    let id = req.query.id_stacja;
    console.log(id);
    if(sess.login && sess.rola == 'adm') {
        con.query(`SELECT stacja.id_stacja, adres.id_adres, stacja.nazwa, stacja.lokalizacja, stacja.id_adres, stacja.nazwa, adres.ulica, adres.numer, adres.kod_pocztowy, adres.miasto FROM stacja, adres WHERE stacja.id_adres = adres.id_adres AND id_stacja = ${id};`, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.deleteUser = function(req,res){
    let id_konto = req.query.id_konto;
    con.query(`DELETE FROM konto WHERE id_konto = ?`, id_konto, function (error, results3, fields) {
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
                "success":"user deleted sucessfully"
            });
    }});
}

exports.editUser = function(req,res){
    console.log("req",req.body);
    let id_konto = req.body.id_konto;
    let id_adres = req.body.id_adres;
    let id_klient = req.body.id_klient;
    let adres={
        "id_adres":id_adres,
        "ulica":req.body.ulica,
        "numer":req.body.numer,
        "kod_pocztowy":req.body.kod_pocztowy,
        "miasto":req.body.miasto
    }
    let konto={
        "id_konto":id_konto,
        "login":req.body.login,
        "haslo":req.body.haslo,
        "email":req.body.email,
        "rola":req.body.rola
    }
    let klient={
        "id_klient":id_klient,
        "imie":req.body.imie,
        "nazwisko":req.body.nazwisko,
        "id_adres":id_adres,
        "id_konto":id_konto
    }
    
    con.query(`UPDATE konto SET ? WHERE id_konto = ?`, [konto, id_konto], function (error, results1, fields) {
    if (error) {
        console.log(error);
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error1": error
      })
    }else{
        con.query(`UPDATE adres SET ? WHERE id_adres = ?`, [adres, id_adres], function (error, results2, fields) {
        if (error) {
            console.log(error);
            res.send({
            "code":400,
            "failed":"error ocurred",
            "error2": error
            })
        }else{
            con.query(`UPDATE klient SET ? WHERE id_klient = ?`, [klient, id_klient], function (error, results3, fields) {
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
                        "success":"user edited sucessfully"
                    });
            }});
        }});  
    }});
}

exports.fullUserData = function(req,res){
    let sess = req.session;
    let id = req.query.id_konto;
    console.log(req.query);
    console.log(id);
    if(sess.login && sess.rola == 'adm') {
        con.query(`SELECT adres.id_adres, konto.id_konto, klient.id_klient, konto.login, konto.haslo, konto.rola, konto.email, klient.imie, klient.nazwisko, adres.ulica, adres.numer, adres.kod_pocztowy, adres.miasto FROM konto, klient, adres WHERE konto.id_konto = ${id} AND konto.id_konto = klient.id_konto AND klient.id_adres = adres.id_adres;`, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}


exports.listUsers = function(req,res){
    let sess = req.session;
    if(sess.login && sess.rola == 'adm') {
        con.query('SELECT konto.id_konto, klient.imie, klient.nazwisko, konto.login, konto.email FROM konto, klient WHERE konto.id_konto = klient.id_konto;', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.addWypozycz = function(req,res){
    let start = new Date().toLocaleString("pl-PL");
    start = new Date(start);
    let end = new Date().toLocaleString("pl-PL");
    end = new Date(end);
    end.setTime(end.getTime() + (1*60*60*1000)); 
    console.log(req.session);
    console.log(end);
    start.toISOString().slice(0, 19).replace('T', ' ');
    end.toISOString().slice(0, 19).replace('T', ' ');
    let wypozyczenie={
        "id_klient":req.session.id_klient,
        "id_rower":req.query.id_rower,
        "id_stacja": 0,
        "czas_od":start,
        "czas_do":end,
        "skonczone": 0
    }
    let rower={
        "id_stan": 2
    }
    con.query('SELECT id_stacja FROM rower WHERE id_rower = ?', req.query.id_rower, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send({
            "code":400,
            "failed":"error ocurred",
            "error2": error
            })
        }else{
            console.log(results);
            wypozyczenie["id_stacja"] = results[0]["id_stacja"];
            con.query('UPDATE rower SET ? WHERE id_rower = ?', [rower, req.query.id_rower], function (error, results2, fields) {
                if (error) {
                    console.log(error);
                    res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error2": error
                    })
                }else{
                    con.query('INSERT INTO wypozyczenie SET ?', wypozyczenie, function (error, results2, fields) {
                        if (error) {
                            console.log(error);
                            res.send({
                            "code":400,
                            "failed":"error ocurred",
                            "error2": error
                            })
                        }else{
                            con.query('UPDATE rower SET ? WHERE id_rower = ?', [rower, req.query.id_rower], function (error, results2, fields) {
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
                                        "success":"rower wypozyczony sucessfully"
                                    });
                                }}); 
                        }});
                }}); 
        }});
    
      
}

exports.endWypozycz = function(req,res){
    let id_stacja = req.body.id_stacja;
    let id_rower = req.body.id_rower;
    let koszt = req.body.koszt;
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    console.log(id_stacja);
    console.log(id_rower);
    console.log(koszt);
    con.query('SELECT dolary FROM klient WHERE id_klient = ?', req.session.id_klient, function (error, results1, fields) {
        if (error) {
            console.log(error);
          res.send({
            "code":400,
            "failed":"error ocurred",
            "error3": error
          })
        }else{
            console.log(results1);
            let bilans = results1[0].dolary;
            bilans = bilans - koszt;
            console.log(bilans);
            if(bilans > 0){
            con.query('UPDATE klient SET dolary = ? WHERE id_klient = ?', [bilans, req.session.id_klient], function (error, results2, fields) {
                if (error) {
                    console.log(error);
                  res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error3": error
                  })
                }else{
                    console.log(results2);
                    con.query('UPDATE wypozyczenie SET skonczone=1, czas_do=now() WHERE id_rower = ?', [id_rower], function (error, results3, fields) {
                        if (error) {
                            console.log(error);
                          res.send({
                            "code":400,
                            "failed":"error ocurred",
                            "error3": error
                          })
                        }else{
                            console.log(results3);
                            con.query('UPDATE rower SET id_stan=1 WHERE id_rower = ?', [id_rower], function (error, results4, fields) {
                                if (error) {
                                    console.log(error);
                                  res.send({
                                    "code":400,
                                    "failed":"error ocurred",
                                    "error3": error
                                  })
                                }else{
                                    console.log(results4);
                                    res.send({
                                        "code":200,
                                        "success":"wypo ended sucessfully"
                                    });
                            }});
                    }});
            }});
        }
    }});
}

exports.listWypozycz = function(req,res){
    let sess = req.session;
    let id = sess.id_klient;
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT wypozyczenie.*, rower.marka, rower.model FROM wypozyczenie, rower WHERE wypozyczenie.id_rower = rower.id_rower AND wypozyczenie.id_klient = ?', id, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                results.forEach(element => {
                    if(!element.skonczone){
                        let stawka = 12;
                        let start = element.czas_od;
                        let end = new Date();
                        end = end.toLocaleString("pl-PL");
                        end = new Date(end);
                        let hours = Math.abs(start - end) / 36e5;
                        console.log(start);
                        console.log(end);
                        console.log(hours);
                        hours = Math.ceil(hours);
                        console.log(hours);
                        element['koszt'] = hours*stawka;
                    }
                });
                
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.showDolary = function(req,res){
    let sess = req.session;
    let id = sess.id_klient;
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT dolary FROM klient WHERE id_klient = ?', id, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}
exports.getStacjeData = function(req, res){
    let sess = req.session;
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT lokalizacja, nazwa FROM stacja', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.getRoweryData = function(req, res){
    let sess = req.session;
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT id_rower, marka, id_stan, lokalizacja FROM rower', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.addDolary = function(req,res){
    let sess = req.session;
    let id = sess.id_klient;
    let dolary = req.body.dolary;
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('UPDATE klient SET dolary = (dolary + ?) WHERE id_klient = ?', [dolary, id], function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.getWypozyczeniaByData = function(req,res){
    let sess = req.session;
    let headers = ["Id wypożyczenia","Imię", "Nazwisko", "Marka", "Model", "Czas od", "Czas do"];
    let entities = ["id_wypozyczenia", "imie", "nazwisko", "marka", "model", "czas_od", "czas_do"];
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT wypozyczenie.id_wypozyczenia, klient.imie, klient.nazwisko, rower.marka, rower.model, wypozyczenie.czas_od, wypozyczenie.czas_do FROM wypozyczenie, klient, rower WHERE klient.id_klient = wypozyczenie.id_klient AND rower.id_rower = wypozyczenie.id_rower AND czas_od > ? AND czas_do < ?', [req.body.czas_od, req.body.czas_do], function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results,
                    "header": headers,
                    "entity": entities
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.getStanRowery = function(req,res){
    let sess = req.session;
    let headers = ["Stan","Id Roweru", "Marka", "Model", "Lokalizacja", "Nazwa stacji"];
    let entities = ["stan", "id_rower", "marka", "model", "lokalizacja", "nazwa"];
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT stan_roweru.stan, rower.id_rower, rower.marka, rower.model, rower.lokalizacja, rower.id_stacja, stacja.nazwa FROM stan_roweru, rower, stacja WHERE stan_roweru.id_stan = rower.id_stan AND rower.id_stacja = stacja.id_stacja AND stan_roweru.id_stan = ?', req.body.id_stan, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results,
                    "header": headers,
                    "entity": entities
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}

exports.getNajWypozyczen = function(req,res){
    let sess = req.session;
    let headers = ["Id stacji","Nazwa stacji"];
    let entities = ["id_stacja", "nazwa"];
    if(sess.login && sess.rola == 'adm' || sess.rola == 'usr') {
        con.query('SELECT stacja.id_stacja, stacja.nazwa FROM stacja WHERE id_stacja = (SELECT stacja.id_stacja FROM wypozyczenie, stacja WHERE wypozyczenie.id_stacja = stacja.id_stacja GROUP BY wypozyczenie.id_stacja ORDER BY wypozyczenie.id_stacja ASC LIMIT 1)', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                    "error": error
                })
            }else{
                res.send({
                    "code":200,
                    "success":results,
                    "header": headers,
                    "entity": entities
                })
            };
        });
    }else{
        res.send({
            "code":200,
            "error":'Authorisation issue'
        })
    };
}