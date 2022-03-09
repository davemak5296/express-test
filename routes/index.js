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
        res.redirect('/home');
    } else {
        res.render('index', { title: '留言板' });
    }
});

router.post('/comment', function (req, res, next) {
    if ( req.session.loggedin ) {
        if ( req.body.content !== "" ) {
            req.session.content = req.body.content;
            connection.query({
                sql: 'INSERT INTO comments(username, content) VALUES(?,?)',
                values: [
                    req.session.username,
                    req.session.content
                ]
            }, function (error, results, fields) {
                req.session.sucMsg = 'Comment saved.';
                res.redirect('/home');
            })
        } else {
            req.session.errMsg = 'Please write your comments.';
            res.redirect('/home');
        }
    } else {
        res.redirect('/');
    }
})

module.exports = router;
