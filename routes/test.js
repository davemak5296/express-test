var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('test', { title: 'test' });
// });
const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

const cb2 = function (req, res) {
  res.send('Hello from C!')
}

router.get('/', [cb0, cb1, cb2])

router.get('/about', function(req, res, next) {
  res.send('i am sub route');
});

module.exports = router;
