var express = require('express');
var router = express.Router();
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
var mysql = require('mysql');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'Dave',
  password : '1996',
  database : 'msg_board_express'
});

router.get('/', function (req, res, next) {
    if ( req.session.loggedin ) {
        req.session.destroy();
        res.redirect('/');
    } else {
        res.redirect('/');
    }
})

module.exports = router;