var express = require('express');
var router = express.Router();
const session = require('express-session');
var mysql = require('mysql');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'Dave',
  password : '1996',
  database : 'msg_board_express'
});

router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

router.get('/', function(req, res, next) {
    // console.log(req.session.errMsg);
    let errMsg = req.session.errMsg;
    if ( req.session.errMsg !== "" ){
        req.session.errMsg = undefined;
        res.render('login', {errMsg: errMsg});
    } else {
        res.render('login');
    }
})

router.post('/auth', data)

function data (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    if ( username && password ) {
        connection.query({
            sql: 'SELECT * FROM users WHERE username = ? AND password = ?',
            values: [username, password]
        }, function (error, results, fields) {
            if ( error ) {
                throw error;
            }
            if ( results.length > 0 ) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.password = password;
                req.session.nickname = results[0]['nickname'];
                res.redirect('/home');
            } else {
                req.session.errMsg = 'Incorrect username and/or password.'
                res.redirect('/login');
            }
        })
    } else {
        req.session.errMsg = 'Please fill in all fields.'
        res.redirect('/login');
    }
}

module.exports = router;