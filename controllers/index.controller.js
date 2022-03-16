let cmModel = require('../models/comments.model');
var url = require('url');

const indexGet = (req, res) => {
    if ( req.session.loggedin ) {
        res.redirect( url.format({
            pathname: "/home",
            query: req.query
        }) )
    } else {
        cmModel.showCm()
            .then (( results ) => {
                let cmPerPage = 5;
                let totalPage = Math.ceil( results.length / cmPerPage);
                if ( !req.query.page ) {
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
            .catch ((error) => {
                console.log(JSON.stringify(error));
                return res.send(error);
            })
    }
}

const cmPost = ( req, res ) => {
    if (req.session.loggedin) {
        req.session.content = req.body.content;
        cmModel.postCm( req.session )
            .then (() => {
                req.session.sucMsg = 'Comment saved.';
                res.redirect('/home');
            })
            .catch((error) => {
                return res.send(error);
            })
    }
}

const logout = ( req, res ) => {
    if ( req.session.loggedin ) {
        req.session.destroy();
        res.redirect('/');
    } else {
        res.redirect('/');
    }
}

module.exports = {
    indexGet,
    cmPost,
    logout
}