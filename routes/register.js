let express = require('express');
let router = express.Router();
let regCtrl = require('../controllers/register.controller');

router.route('/').get( regCtrl.regGet );
router.route('/').post( regCtrl.regPost );

module.exports = router;