var express = require('express');
import regCtrl from '../controllers/register.controller';
var router = express.Router();

router.route('/').get( regCtrl.regGet );
router.route('/').post( regCtrl.regPost );

module.exports = router;