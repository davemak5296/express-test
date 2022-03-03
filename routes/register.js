var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('register')
});

router.post('/auth', data);

// function reg (req, res, next) {
//     if (req.fill == undefined) {
//         res.render('register');
//     } else if ( req.fill ) {
//         res.render('register', {msg: 'All are filled.'});
//     } else {
//         res.render('register', {msg: 'please fill in all fields.'});
//     }
// }

function data (req, res, next) {
    let isFill = Object.values(req.body).every( e => e!== "");
    req.fill = isFill;
    if( isFill ) {
        res.render('register', {msg: 'All are filled.'});
    } else {
        res.render('register', {msg: 'please fill in all fields.'});
    }
}
module.exports = router;
