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
        let errMsg = req.session.errMsg;
        let sucMsg = req.session.sucMsg;
        connection.query({
            sql: 'SELECT C.id, C.username, U.nickname, C.content, C.created_at, C.is_hide FROM comments as C LEFT JOIN users as U ON C.username = U.username WHERE is_hide = 0 ORDER BY C.created_at DESC'
        }, function (error, results, fields) {
            if (error) {
                throw error;
            }
            for(let i = 0; i < results.length; i++) {
                console.log(results[i]);
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


module.exports = router;