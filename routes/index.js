let express = require('express');
let router = express.Router();
let indexCtrl = require('../controllers/index.controller');

router.route('/').get( indexCtrl.indexGet );
router.route('/comment').post( indexCtrl.cmPost );

module.exports = router;