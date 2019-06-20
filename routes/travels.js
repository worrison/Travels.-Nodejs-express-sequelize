var express = require('express');
var router = express.Router();
let travelsController = require('../controllers/travelsController');
let upload = require('../config/multer')

/* GET users listing. */
router.get('/', async (req, res) => {
    if (req.session.rol >= 0) {
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

router.post('/add', upload.array("file"), async function (req, res) {
    if (req.session.rol == 1) {
        console.log("idusuariologueado",req.session.userId);
        let travel = await travelsController.addTravel(req.body,req.session.userId);
        console.log("sale Id???",travel.id);
        if(!req.files)
        {
            return res.status(500).send('No has seleccionado un archivo valido')
        }else
        {
            let images = await travelsController.uploadImages(travel.id,req.files)
        }
           
        
        
        res.render('../views/travels/added', {
            travel
        })
    } else {
        req.flash('permisos', 'usuario sin permisos para crear viaje');
        res.redirect('/travels');
    }
});


module.exports = router;