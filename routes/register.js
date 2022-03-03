var express = require('express');
var router = express.Router();
const session = require('express-session');

router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
/* GET users listing. */

router.get('/', function (req, res, next) {
    // render register.pug according to value of req.session.fill
    if (req.session.fill == undefined ) {  // 
        res.render('register');
    } else if (req.session.fill) {
        req.session.fill = undefined;
        res.render('register', {msg: 'All are filled.'});
    } else {
        req.session.fill = undefined;
        res.render('register', {msg: 'Please fill in all fields.'})
    }
});

router.post('/auth', data);

// save context in req.session.fill
function data (req, res, next) {
    let isFill = Object.values(req.body).every( e => e!== "");
    req.session.fill = isFill;
    res.redirect('/register');
}
module.exports = router;
