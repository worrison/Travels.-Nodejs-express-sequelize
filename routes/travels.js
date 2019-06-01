var express = require('express');
var router = express.Router();
let travelsController=require('../controllers/travelsController');

/* GET users listing. */
router.get('/', async (req, res) => {
    let travels=await travelsController.listTravels();
    res.render('../views/travels/list',{travels});
});

module.exports = router;