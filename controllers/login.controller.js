const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
let usersModel = require('../models/users.model');

const loginGet = (req, res) => {
    if (req.session.errMsg) {
        let errMsg = req.session.errMsg;
        req.session.errMsg = undefined;
        return res.render('login', {errMsg: errMsg});
    }
    return res.render('login');
}

passport.use( new LocalStrategy( (username, password, done) => {  // done: (err, user, info)
    usersModel.showUserForLogin( username )
        .then ((results) => {
            if ( (username && password)) {
                crypto.pbkdf2( password, results[0]['salt'], 310000, 32, 'sha256', function (error, hashedPassword ) {
                    if (error) { throw error;}
                    if ( crypto.timingSafeEqual( Buffer.from(results[0]['hashed_password'], 'base64'), hashedPassword ) == false ) {
                        return done(null, false, { message: 'Incorrect password.'})
                    } else {
                        return done(null, results);
                    }
                })
            }
        })
        .catch ((error) => {
            return done(null, false, {message: 'User does not exists.'});
        })
    }
))

passport.serializeUser( function (user, cb) {
    cb(null, {
        id: user[0]['id'],
        username: user[0]['username'],
        nickname: user[0]['nickname']
    });
});

passport.deserializeUser( function (user, cb) {
    cb(null, user);
});

const loginPost = (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return res.send(error);
        }
        if (!user) {
            req.session.errMsg = info.message;  // set in new LocalStrategies above
            return res.redirect('/login');
        }
        req.logIn (user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.loggedin = true;
            req.session.username = req.session.passport.user['username'];
            req.session.nickname = req.session.passport.user['nickname'];
            return res.redirect('/home?page=1');
        });
    })(req, res, next);
}

module.exports = {
    loginGet,
    loginPost,
}