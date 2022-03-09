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

router.get('/', function (req, res, next) {
    if ( req.session.loggedin ) {
        res.render('index', {
            nickname: req.session.nickname
        })
    } else {
        res.redirect('/');
    }
})

module.exports = router;