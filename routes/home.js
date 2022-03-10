var express = require('express');
var router = express.Router();
const session = require('express-session');
var mysql = require('mysql');
var methodOverride = require('method-override');
const { connect } = require('.');

router.use(methodOverride('_method'));

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'Dave',
  password : '1996',
  database : 'msg_board_express'
});

router.get('/', function (req, res, next) {
    if ( req.session.loggedin ) {
        let errMsg = req.session.errMsg;
        let sucMsg = req.session.sucMsg;
        connection.query({
            sql: 'SELECT C.id, C.username, U.nickname, C.content, C.created_at, C.is_hide FROM comments as C LEFT JOIN users as U ON C.username = U.username WHERE is_hide = 0 ORDER BY C.created_at DESC'
        }, function (error, results, fields) {
            if (error) {
                throw error;
            }
            req.session.errMsg = undefined;
            req.session.sucMsg = undefined;
            res.render('index', {
                nickname: req.session.nickname,
                results: results,
                errMsg: errMsg,
                sucMsg: sucMsg
            })
        })
    } else {
        res.redirect('/');
    }
})

router.get('/:cmId', function (req, res, next) {
    if ( req.session.loggedin ) {
        connection.query({
            sql: 'SELECT content,username FROM comments WHERE id = ?',
            values: [ req.params['cmId'] ]
        }, function (error, results, fields) {
            // compare author of specific comment id with username of the loggedin user.
            if ( req.session.username == results[0]['username'] ) {
                res.render('edit', {
                    id: req.params['cmId'],
                    content: results[0]['content'],
                    errMsg: req.session.errMsg
                })
            } else {
                req.session.errMsg = 'Unauthorized edit.';
                res.redirect('/home');
            }
        })
    } else {
        res.redirect('/');
    }
})

router.put('/:cmId', function (req, res, next) {
    if ( req.session.loggedin ) {
        if ( req.body.content ) {
            connection.query({
                sql: 'UPDATE comments SET content = ? WHERE id = ?',
                values: [ req.body.content, req.params['cmId']]
            }, function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    req.session.sucMsg = 'Edit successes.';
                    res.redirect('/home');
                }
            })
        } else {
            req.session.errMsg = 'Please writes your comments.';
            res.redirect('/home/'+req.params['cmId']);
        }
    } else {
        res.redirect('/');
    }
})

module.exports = router;