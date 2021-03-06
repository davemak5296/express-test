var express = require('express');
var router = express.Router();
let methodOverride = require('method-override');
let cmModel = require('../models/comments.model');
let usersModel = require('../models/users.model');

router.use(methodOverride('_method'));

const homeAdminGet = ( req, res ) => {
    if (req.session.username == 'admin') {
        let errMsg = req.session.errMsg;
        let sucMsg = req.session.sucMsg;
        cmModel.showCmForAdmin()
            .then ((results) => {
                let cmPerPage = 5;
                let totalPage = Math.ceil( results.length / cmPerPage);
                if ( !req.query.page ) {
                    return res.redirect('/home/admin?page=1');
                } else {
                    if ( totalPage !== 0 && ( req.query.page < 1 || req.query.page > totalPage ) ) {
                        return res.redirect('/home/admin?page=1');
                    } else {
                        req.session.errMsg = undefined;
                        req.session.sucMsg = undefined;
                        return res.render('index', {
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
            })
            .catch((error) => {
                return res.send(error);
            })
    } else {
        return res.redirect('/');
    }
}

const homeGet = ( req, res ) => {
    if ( req.session.loggedin && req.session.username == 'admin') {
        res.redirect('/home/admin');
    } else if (req.session.loggedin) {
        let errMsg = req.session.errMsg;
        let sucMsg = req.session.sucMsg;
        cmModel.showCm()
            .then((results) => {
                let cmPerPage = 5;
                let totalPage = Math.ceil( results.length / cmPerPage);
                if ( !req.query.page ) {
                    return res.redirect('/home?page=1');
                } else {
                    if ( totalPage !== 0 && ( req.query.page < 1 || req.query.page > totalPage ) ) {
                        return res.redirect('/home?page=1');
                    } else {
                        req.session.errMsg = undefined;
                        req.session.sucMsg = undefined;
                        return res.render('index', {
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
            })
            .catch((error) => {
                return res.send(error);
            })
    } else {
        return res.redirect('/');
    }
}

const editCmGet = ( req, res ) => {
    cmModel.showEditCm( req.params['cmId'] )
        .then ((results) => {
            if ( req.session.loggedin ) {
                if ( req.session.username == results[0]['username'] || req.session.username == 'admin') {
                    return res.render('edit', {
                        id: req.params['cmId'],
                        content: results[0]['content'],
                        errMsg: req.session.errMsg
                    })
                } else {
                    req.session.errMsg = 'Unauthorized edit.';
                    return res.redirect('/home');
                }
            } else {
                return res.redirect('/');
            }

        })
        .catch ((error) => {

        })
}

const editCmPut = ( req, res ) => {
    cmModel.editCm (req.body.content, req.params['cmId'])
        .then ((results) => {
            if (req.session.loggedin) {
                req.session.sucMsg = 'Edit successes.';
                return res.redirect('/home');
            } else {
                return res.redirect('/');
            }
        })
        .catch ((error) => {
            return res.send(error);
        })
}

const cmDel = ( req, res ) => {
    cmModel.delCm ( req.params['cmId'])
        .then ((results) => {
            if ( req.session.loggedin ) {
                req.session.sucMsg = 'Delete successes.';
                return res.redirect('/home');
            } else {
                return res.redirect('/');
            }
        })
        .catch ((error) => {
            return res.send(error);
        })
}

const nickPut = ( req, res ) => {
    if ( req.session.loggedin ) {
        usersModel.editNick ( req.body.new_nickname, req.session.username )
            .then (() => {
                req.session.sucMsg = 'Nickname changed.';
                req.session.nickname = req.body.new_nickname;
                return res.redirect('/home');
            })
            .catch ((error) => {
                return res.send(error);
            })
    } else {
        console.log('153');
        return res.redirect('/');
    }
}

const cmUnhide = ( req, res ) => {
    cmModel.unhideCm ( req.params['cmId'])
        .then ((results) => {
            if (req.session.loggedin) {
                req.session.sucMsg = 'Comment is unhidden.';
                return res.redirect('/home');
            } else {
                return res.redirect('/');
            }
        })
        .catch ((error) => {
            return res.send(error);
        })
}

module.exports = {
    homeGet,
    homeAdminGet,
    editCmGet,
    editCmPut,
    cmDel,
    nickPut,
    cmUnhide
}