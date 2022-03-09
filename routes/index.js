var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    if ( req.session.loggedin ) {
        res.redirect('/home');
    } else {
        res.render('index', { title: '留言板' });
    }
});

module.exports = router;
