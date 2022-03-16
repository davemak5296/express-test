var express = require('express');
var router = express.Router();
let loginCtrl = require('../controllers/login.controller');

router.route('/').get( loginCtrl.loginGet );
router.route('/').post( loginCtrl.passport.authenticate('local', { failureRedirect: '/login' }), loginCtrl.loginPost);

module.exports = router;