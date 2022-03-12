var express = require('express');
var router = express.Router();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
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

passport.use( new LocalStrategy( (username, password, cb) => {
    connection.query(
        {
            sql: 'SELECT * FROM users_pspt WHERE username = ?',
            values: [ username ]
        },
        function (error, results, fields) {
            if (error) { throw error; }
            if ( !results ) {
                return cb(null, false, { message: 'Incorrect.'})
            }
            crypto.pbkdf2( password, results[0]['salt'], 310000, 32, 'sha256', function (error, hashedPassword ) {
                if (error) { throw error;}
                if ( crypto.timingSafeEqual( Buffer.from(results[0]['hashed_password'], 'base64'), hashedPassword ) == false ) {
                    console.log( Buffer.from( results[0]['hashed_password'], 'base64'));
                    console.log(hashedPassword);
                    return cb(null, false, { errMsg: 'Incorrect.'})
                }
                return cb(null, results);
            })
        }
    )

}))
passport.serializeUser( function (user, cb) {
    // console.log(`user is ${JSON.stringify(user)}`);
    cb(null, {id: user[0]['id'], username: user[0]['username']});
    // process.nextTick(function () {
    //     cb(null, {id: user[0]['id'], username: user[0]['username']});
    // });
});

passport.deserializeUser( function (user, cb) {
    console.log(user);
    cb(null, user);
    // process.nextTick( function () {
    //     return cb(null, user);
    // });
});

router.get('/', function(req, res, next) {
    let errMsg = req.session.errMsg;
    if ( req.session.errMsg !== "" ){
        req.session.errMsg = undefined;
        res.render('login', {errMsg: errMsg});
    } else {
        res.render('login');
    }
})
// router.post('/auth', function (req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//         if(err) throw error;
//         if(!user){ return res.redirect('/login'); }
//         req.login(user,next)
//     }),
//     function (req, res) {
//         res.redirect('/home?page=1');
//     }
// })
router.post('/auth',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        // console.log(req.user[0]['username']);
        // console.log(req.session.passport.user);
        res.redirect('/home?page=1');
    }
);

// router.post('/auth', data)

// function data (req, res, next) {
//     let username = req.body.username;
//     let password = req.body.password;
//     if ( username && password ) {
//     } else {
//         req.session.errMsg = 'Please fill in all fields.'
//         res.redirect('/login');
//     }

// }

// function data (req, res, next) {
//     let username = req.body.username;
//     let password = req.body.password;
//     if ( username && password ) {
//         connection.query({
//             sql: 'SELECT * FROM users WHERE username = ? AND password = ?',
//             values: [username, password]
//         }, function (error, results, fields) {
//             if ( error ) {
//                 throw error;
//             }
//             if ( results.length > 0 ) {
//                 req.session.loggedin = true;
//                 req.session.username = username;
//                 req.session.password = password;
//                 req.session.nickname = results[0]['nickname'];
//                 res.redirect('/home');
//             } else {
//                 req.session.errMsg = 'Incorrect username and/or password.'
//                 res.redirect('/login');
//             }
//         })
//     } else {
//         req.session.errMsg = 'Please fill in all fields.'
//         res.redirect('/login');
//     }
// }

module.exports = router;