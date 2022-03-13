const session = require('express-session');
const crypto = require('crypto');
import usersModel from '../models/users.model';

router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

const regGet = ( req, res ) => {
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
}

const regPost = ( req, res ) => {
    const values = req.body;
    let isFill = Object.values(req.body).every( e => e!== "");  // test if all fields are not empty
    let salt = crypto.randomBytes(16).toString('base64');

    usersModel.showUserForReg()
        .then(( results ) => {  // nickname/password not used.
            if ( isFill ) {
                if ( req.body.password !== req.body.password_re ) {
                    req.session.errMsg = 'Password unmatched.';
                    res.redirect('/register');
                } else {  // successful case: all input OK
                    crypto.pbkdf2( req.body.password, salt, 310000, 32, 'sha256', function (error, hashedPassword) {
                        if (error) { throw error; }
                        usersModel.createUser( req.body, hashedPassword.toString('base64'), salt)
                            .then((results) => {
                                req.session.sucMsg = 'Registration successes!';
                                res.redirect('/register');
                            })
                            .catch((err)=>{
                                throw err;
                            })
                    })
                }
            } else {
                req.session.errMsg = 'Please fill in all fields.';
                res.redirect('/register');
            }
        })
        .catch(( err ) => {  // error or nickname/username used.
            if ( typeof err !== Array ) {
                throw err;
            } else {
                if ( req.body.nickname == err[0]['nickname'] ) {
                    req.session.errMsg = 'Nickname used.';
                    res.redirect('/register');
                } else if ( req.body.username == err[0]['username'] ) {
                    req.session.errMsg = 'Username used.';
                    res.redirect('/register');
                }
            }
        })
}

export default {
    regGet,
    regPost
};