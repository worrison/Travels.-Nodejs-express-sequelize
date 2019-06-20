let express = require('express');
let router = express.Router();
let travelsController = require('../../controllers/travelsController');

router.get('/', async (req, res) => {
        let travels = await travelsController.listTravels();
        res.send(travels);
});

router.post('/', async function (req, res) {
        let travel = await travelsController.addTravel(req.body);
        res.send(travel)
});

module.exports = router;