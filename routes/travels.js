var express = require('express');
var router = express.Router();
let travelsController = require('../controllers/travelsController');

/* GET users listing. */
router.get('/', async (req, res) => {
    if (req.session.rol == 1) {
        let travels = await travelsController.listTravels();
        res.render('../views/travels/list', {
            travels
        });
    } else {
        req.flash('permisos', 'usuario sin permisos');
        res.redirect('/');

    }
});

router.get('/add', function (req, res) {
    if (req.session.rol == 1) {
        res.render('../views/travels/add');
    } else {
        req.flash('permisos', 'usuario sin permisos');
        res.redirect('/travels');
    }
});

router.post('/add', async function (req, res) {
    if (req.session.rol == 1) {
        let travel = await travelsController.addTravel(req.body);
        res.render('../views/travels/added', {
            travel
        })
    } else {
        req.flash('permisos', 'usuario sin permisos para crear viaje');
        res.redirect('/travels');
    }
});


module.exports = router;