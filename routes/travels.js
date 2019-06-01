var express = require('express');
var router = express.Router();
let travelsController=require('../controllers/travelsController');

/* GET users listing. */
router.get('/', async (req, res) => {
    let travels=await travelsController.listTravels();
    res.render('../views/travels/list',{travels});
});

router.get('/add', function (req, res) {
    res.render('../views/travels/add');
});

router.post('/add', async function(req, res) {
    let travel = await travelsController.addTravel(req.body);
     res.render('../views/travels/added',{travel})
     
  });
module.exports = router;