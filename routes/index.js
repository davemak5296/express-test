var express = require('express');
var router = express.Router();
const session = require('express-session');
var mysql = require('mysql');
var url = require('url');
var querystring = require('querystring');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'Dave',
  password : '1996',
  database : 'msg_board_express'
});

router.get('/', function (req, res, next) {
    if ( req.session.loggedin ) {
        res.redirect( url.format({
            pathname: "/home",
            query: req.query
        }) )
    } else {
        connection.query({
            sql: 'SELECT C.id, C.username, U.nickname, C.content, C.created_at, C.is_hide FROM comments_pspt as C LEFT JOIN users_pspt as U ON C.username = U.username WHERE is_hide = 0 ORDER BY C.created_at DESC'
        }, function (error, results, fields) {
            let cmPerPage = 5;
            let totalPage = Math.ceil( results.length / cmPerPage);
            if (error) {
                throw error;
            } else if ( !req.query.page ) {
                res.redirect('/?page=1');
            } else {
                if ( totalPage !== 0 && (req.query.page < 1 || req.query.page > totalPage) ) {
                    res.redirect('/?page=1');
                } else {
                    res.render('index', {
                        results: results,
                        currentPage: req.query.page,
                        cmPerPage: cmPerPage,
                        totalPage: totalPage
                    })
                }
            }
        })
    }
});

router.post('/comment', function (req, res, next) {
    if ( req.session.loggedin ) {
        if ( req.body.content !== "" ) {
            req.session.content = req.body.content;
            connection.query({
                sql: 'INSERT INTO comments_pspt(username, content) VALUES(?,?)',
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
