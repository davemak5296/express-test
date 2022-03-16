const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
let usersModel = require('../models/users.model');

const loginGet = (req, res) => {
    let errMsg = req.session.errMsg;
    if ( req.session.errMsg !== "" ){
        req.session.errMsg = undefined;
        res.render('login', {errMsg: errMsg});
    } else {
        res.render('login');
    }
}

passport.use( new LocalStrategy( (username, password, cb) => {
    usersModel.showUserForLogin( username )
        .then ((results) => {
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
        })
        .catch ((error) => {
            return res.send(error);
        })
}))

passport.serializeUser( function (user, cb) {
    cb(null, {
        id: user[0]['id'],
        username: user[0]['username'],
        nickname: user[0]['nickname']
    });
});

passport.deserializeUser( function (user, cb) {
    console.log(user);
    cb(null, user);
});

const loginPost = (req, res) => {
    req.session.loggedin = true;
    req.session.username = req.session.passport.user['username'];
    req.session.nickname = req.session.passport.user['nickname'];
    res.redirect('/home?page=1');
}

module.exports = {
    loginGet,
    loginPost,
    passport
}