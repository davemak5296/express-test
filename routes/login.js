var express = require('express');
var router = express.Router();
let loginCtrl = require('../controllers/login.controller');

router.route('/').get( loginCtrl.loginGet );
router.route('/').post( loginCtrl.loginPost );
// router.route('/').post( (req, res, next) => {
//     loginCtrl.passport.authenticate('local', (error, user, info) => {
//         if (error) {
//             return res.send(error);
//         }
//         if (!user) {
//             req.session.errMsg = info.message;
//             return res.redirect('/login');
//         }
//         req.logIn (user, (err) => {
//             if (err) {
//                 return next(err);
//             }
//             req.session.loggedin = true;
//             req.session.username = req.session.passport.user['username'];
//             req.session.nickname = req.session.passport.user['nickname'];
//             return res.redirect('/home?page=1');
//         });
//     })(req, res, next);
// })

// router.route('/').post( loginCtrl.passport.authenticate('local', { failureRedirect: '/login' }), loginCtrl.loginPost);

module.exports = router;