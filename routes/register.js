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
        'All are filled',
        'Nickname used',
        'Username used',
        'password unmatched'
    ];
    if (req.session.fill == undefined ) {  // 
        res.render('register');
    } else if (req.session.fill == false) {
        req.session.fill = undefined;
        res.render('register', {msg: 'Please fill in all fields.'})
    } else if ( req.session.fill ) {
        let errCode = 0;
        connection.query('SELECT nickname,username FROM users', function (err, results, fields) {
            for (let i = 0; i < results.length; i++){
                if (req.session.nickname == results[i]['nickname']) {
                    errCode = 1;
                    break;
                }
                if (req.session.username == results[i]['username']) {
                    errCode = 2;
                    break;
                }
            }
            if ( errCode == 0 && !req.session.pwIsMatch) {
                errCode = 3;
            } 
            res.render('register', {msg: display[errCode]});
            // switch(errCode) {
            //     case 0:
            //         res.render('register', {msg: 'All are filled.'});
            //         break;
            //     case 1:
            //         res.render('register', {msg: 'Nickname used.'});
            //         break;
            //     case 2:
            //         res.render('register', {msg: 'Username used.'})
            //         break;
            //     case 3:
            //         res.render('register', {msg: 'password unmatched.'})
            //         break;
            // }
        });
    }
});

router.post('/auth', data);

// save context in req.session.fill
function data (req, res, next) {
    req.session.fill = Object.values(req.body).every( e => e!== "");
    req.session.nickname = req.body.nickname;
    req.session.username = req.body.username;
    req.session.pwIsMatch = (req.body.password == req.body.password_re);
    res.redirect('/register');
}
module.exports = router;
