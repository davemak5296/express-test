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
        if ( req.session.username == 'admin') {
            connection.query(
                {
                    sql: 'SELECT C.id, C.username, U.nickname, C.content, C.created_at, C.is_hide FROM comments as C LEFT JOIN users as U ON C.username = U.username ORDER BY C.created_at DESC'
                },
                function (error, results, fields){
                    let cmPerPage = 5;
                    let totalPage = Math.ceil( results.length / cmPerPage);
                    if (error) {
                        throw error;
                    } else if ( !req.query.page ) {
                        res.redirect('/home?page=1');
                    } else {
                        if ( req.query.page < 1 || req.query.page > totalPage) {
                            res.redirect('/?page=1');
                        } else {
                            req.session.errMsg = undefined;
                            req.session.sucMsg = undefined;
                            res.render('index', {
                                nickname: req.session.nickname,
                                results: results,
                                errMsg: errMsg,
                                sucMsg: sucMsg,
                                currentPage: req.query.page,
                                cmPerPage: cmPerPage,
                                totalPage: totalPage
                            })
                        }
                    }
                }
            )
        } else {
            connection.query(
                {
                    sql: 'SELECT C.id, C.username, U.nickname, C.content, C.created_at, C.is_hide FROM comments as C LEFT JOIN users as U ON C.username = U.username WHERE is_hide = 0 ORDER BY C.created_at DESC'
                },
                function (error, results, fields) {
                    let cmPerPage = 5;
                    let totalPage = Math.ceil( results.length / cmPerPage);
                    if (error) {
                        throw error;
                    } else if ( !req.query.page ) {
                        res.redirect('/home?page=1');
                    } else {
                        if ( req.query.page < 1 || req.query.page > totalPage) {
                            res.redirect('/?page=1');
                        } else {
                            req.session.errMsg = undefined;
                            req.session.sucMsg = undefined;
                            res.render('index', {
                                nickname: req.session.nickname,
                                results: results,
                                errMsg: errMsg,
                                sucMsg: sucMsg,
                                currentPage: req.query.page,
                                cmPerPage: cmPerPage,
                                totalPage: totalPage
                            })
                        }
                    }
                }
            )
        }
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

router.put('/nickname', function (req, res, next) {
    if ( req.session.loggedin ) {
        if ( req.body.new_nickname ) {
            connection.query({
                sql: 'UPDATE users SET nickname = ? WHERE username = ?',
                values: [ req.body.new_nickname, req.session.username ]
            }, function (error, results, fields) {
                req.session.sucMsg = 'Nickname changed.';
                req.session.nickname = req.body.new_nickname;
                res.redirect('/home');
            })
        } else {
            req.session.errMsg = 'Please enter new nickname.';
            res.redirect('/');
        }
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

router.delete('/:cmId', function (req, res, next) {
    if ( req.session.loggedin ) {
        connection.query({
            sql: 'UPDATE comments SET is_hide = 1 WHERE id = ?',
            values: [ req.params['cmId']]
        }, function (error, results, fields) {
            if ( error ) {
                throw error;
            } else {
                req.session.sucMsg = 'Delete successes.';
                res.redirect('/home');
            }
        })
    } else {
        res.redirect('/');
    }

})

router.put('/admin/:cmId', function (req, res, next) {
    if ( req.session.username == 'admin') {
        connection.query({
            sql: 'UPDATE comments SET is_hide = 0 WHERE id = ?',
            values: [ req.params['cmId']]
        }, function (error, results, fields){
            req.session.sucMsg = 'Comment is unhidden.';
            res.redirect('/home');
        })
    } else {
        res.redirect('/');
    }
})

module.exports = router;