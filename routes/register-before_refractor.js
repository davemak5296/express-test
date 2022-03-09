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
    // render register.pug according to value of req.session.fill
    let display = [
        'Registration successes!',
        'Nickname used.',
        'Username used.',
        'password unmatched.'
    ];
    if (req.session.fill == undefined ) {  // 
        res.render('register');
    } else if (req.session.fill == false) {
        req.session.fill = undefined;
        res.render('register', {errMsg: 'Please fill in all fields.'})
    } else if ( req.session.fill ) {
        let code = 0;
        connection.query('SELECT nickname,username FROM users', function (err, results, fields) {
            for (let i = 0; i < results.length; i++){
                if (req.session.nickname == results[i]['nickname']) {
                    code = 1;
                    res.render('register', {errMsg: display[code]});
                    break;
                }
                if (req.session.username == results[i]['username']) {
                    code = 2;
                    res.render('register', {errMsg: display[code]});
                    break;
                }
            }
            if ( code == 0 && !req.session.pwIsMatch) {
                code = 3;
                res.render('register', {errMsg: display[code]});
            } else if ( code == 0 ) {
                connection.query({
                    sql: 'INSERT INTO `users`(name, nickname, username, email, password) VALUES(?,?,?,?,?)',
                    values: [
                        req.session.name,
                        req.session.nickname,
                        req.session.username,
                        req.session.email,
                        req.session.password
                    ]
                }, function(error) {
                    if (error) {
                        console.log(error["sqlMessage"]);
                        res.render('register', {errMsg: error["sqlMessage"]});
                    } else {
                        res.render('register', {sucMsg: display[code]});
                    }
                })
            }
        });
    }
});

router.post('/auth', data);

// save context in req.session.{key} in order to bring over to the redirected page.
function data (req, res, next) {
    req.session.fill = Object.values(req.body).every( e => e!== "");  // test if all fields are not empty
    req.session.name = req.body.name;
    req.session.nickname = req.body.nickname;
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.password = req.body.password;
    req.session.pwIsMatch = (req.body.password == req.body.password_re);
    res.redirect('/register');
}
module.exports = router;
