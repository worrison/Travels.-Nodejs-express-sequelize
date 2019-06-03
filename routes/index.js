var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let error= req.flash('permisos');
  res.render('index', { title: 'Travels',error});
});

module.exports = router;
