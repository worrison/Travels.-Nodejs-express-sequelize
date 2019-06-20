var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  let error= req.flash('permisos');
  res.render('index', { title: 'Travels',error});
});

module.exports = router;
