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
/* GET users listing. */

router.get('/', function (req, res, next) {
    let errMsg = ( !req.session.errMsg ) ? undefined : req.session.errMsg;
    let sucMsg = ( !req.session.sucMsg ) ? undefined : req.session.sucMsg;
    if ( !errMsg && !sucMsg){
        res.render('register');
    } else {
        req.session.errMsg = undefined;
        req.session.sucMsg = undefined;
        res.render('register', {
            errMsg: errMsg,
            sucMsg: sucMsg
        })
    }
})

router.post('/auth', data);

function data (req, res, next) {
    let isFill = Object.values(req.body).every( e => e!== "");  // test if all fields are not empty
    if ( isFill ) {
        connection.query( 'SELECT nickname,username FROM users', function(error, results, fields) {
            for (let i=0; i<results.length; i++) {
                if (req.body.nickname == results[i]['nickname']) {  // err case 1: all filled but nickname used.
                    req.session.errMsg = 'Nickname used.';
                    break;
                } else if ( req.body.username == results[i]['username']) { // err case 2: all filled but username used.
                    req.session.errMsg = 'Username used.';
                    break;
                }
            }
            if ( !req.session.errMsg && (req.body.password !== req.body.password_re) ) { // err case 3: all filled but password and password confirmation are unmatched.
                req.session.errMsg = 'Password unmatched.';
            }
            if ( req.session.errMsg ) {
                res.redirect('/register');
            } else {  // successful
                connection.query({
                    sql: 'INSERT INTO `users`(name, nickname, username, email, password) VALUES(?,?,?,?,?)',
                    values: [
                        req.body.name,
                        req.body.nickname,
                        req.body.username,
                        req.body.email,
                        req.body.password
                    ]
                }, function(error) {
                    if (error) {
                        throw error;
                    } else {
                        req.session.sucMsg = 'Registration successes!';
                    }
                    res.redirect('/register');
                })
            }
        })
    } else {  // err case 4: some fields are unfilled.
        req.session.errMsg = 'Please fill in all fields.';
        res.redirect('/register');
    }
}
module.exports = router;