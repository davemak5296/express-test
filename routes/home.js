let express = require('express');
let router = express.Router();
var methodOverride = require('method-override');
let homeCtrl = require('../controllers/home.controller');

router.use(methodOverride('_method'));

router.route('/').get( homeCtrl.homeGet );
router.route('/admin').get( homeCtrl.homeAdminGet );
router.route('/nickname').put( homeCtrl.nickPut );
router.route('/:cmId').get ( homeCtrl.editCmGet );
router.route('/:cmId').put ( homeCtrl.editCmPut );
router.route('/:cmId').delete( homeCtrl.cmDel);
router.route('/admin/:cmId').put (homeCtrl.cmUnhide);

module.exports = router;