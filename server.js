const moment = require('moment-timezone');

moment().tz("Europe/Warsaw").format();



const express = require("express");

const session = require("express-session");

const app = express();

const router = express.Router();

const mysql = require('mysql');

const login = require('./routes/loginroutes');

const queries = require('./routes/queries');

const bodyParser = require('body-parser');

const redis = require('redis');

const redisStore = require('connect-redis')(session);

const client  = redis.createClient();

const http = require('http').Server(app);

const io = require('socket.io')(http);

const port = process.env.PORT || 3010;

const fs = require('fs');



app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();

});

app.use(session({

  secret: 'cdghu24b0',

  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),

  saveUninitialized: false,

  resave: false

}));



//router

app.use('/api', router);



//logowanie

app.post('/register',login.register);

app.post('/login',login.login);

app.post('/addAdmin',login.addAdmin);



//uzytkownicy

app.post('/editUser',queries.editUser);

app.get('/listUsers',queries.listUsers);

app.get('/fullUserData',queries.fullUserData);

app.get('/deleteUser',queries.deleteUser);



//rowery

app.post('/addRower',queries.addRower);

app.post('/editRower',queries.editRower);

app.get('/deleteRower',queries.deleteRower);

app.get('/listRowery',queries.listRowery);

app.get('/fullRowerData',queries.fullRowerData);

app.get('/listRoweryStacja',queries.listRoweryStacja);



//mapa

app.get('/getRoweryData',queries.getRoweryData);

app.get('/getStacjeData',queries.getStacjeData);



//stacje

app.post('/addStacja',queries.addStacja);

app.post('/editStacja',queries.editStacja);

app.get('/deleteStacja',queries.deleteStacja);

app.get('/listStacja',queries.listStacja);

app.get('/fullStacjaData',queries.fullStacjaData);



//wypozyczenia

app.get('/addWypozycz',queries.addWypozycz);

app.get('/listWypozycz',queries.listWypozycz);

app.post('/endWypozycz',queries.endWypozycz);



//dolary

app.post('/addDolary',queries.addDolary);

app.get('/showDolary',queries.showDolary);



//raporty

app.post('/getWypozyczeniaByData',queries.getWypozyczeniaByData);

app.post('/getStanRowery',queries.getStanRowery);

app.post('/getNajWypozyczen',queries.getNajWypozyczen);



app.get('/', function(req, res){

  let sess = req.session;

  if(sess.login && sess.rola == 'usr') {

    res.sendFile(__dirname + '/home.html');

  }

  else if(sess.login && sess.rola == 'adm') {

    res.sendFile(__dirname + '/dashboard.html');

  }

  res.sendFile(__dirname + '/index.html');

});



app.get('/register', function(req, res){

  let sess = req.session;

  if(sess.login && sess.rola == 'usr') {

    res.sendFile(__dirname + '/home.html');

  }

  else if(sess.login && sess.rola == 'adm') {

    res.sendFile(__dirname + '/dashboard.html');

  }

  res.sendFile(__dirname + '/register.html');

});



app.get('/home',(req,res) => {

  let sess = req.session;

  if(sess.login && sess.rola == 'usr') {

    res.sendFile(__dirname + '/home.html');

  }

  else if(sess.login && sess.rola == 'adm') {

    res.sendFile(__dirname + '/dashboard.html');

  }

  else {

    res.redirect('/');

  }

});



app.get('/userData',(req,res) => {

  let sess = req.session;

  console.log(sess);

  if(sess.login) {

    res.json({ 

      login: sess.login,

      email: sess.email

    });

  }

  else {

    res.redirect('/');

  }

});





app.get('/dashboard',(req,res) => {

  let sess = req.session;

  if(sess.login && sess.rola === 'adm') {

    res.sendFile(__dirname + '/dashboard.html');

  }

  else {

    res.redirect('/');

  }

});



app.get('/logout',(req,res) => {

  req.session.destroy((err) => {

      if(err) {

          return console.log(err);

      }

      res.redirect('/');

  });



});



//http.listen(3010);



http.listen(port, function(){

  console.log('listening on *:' + port);

});





io.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });

  socket.on('my other event', function (data) {

    console.log(data);

  });

});