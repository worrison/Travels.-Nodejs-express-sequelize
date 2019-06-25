var express = require('express');
var router = express.Router();
let travelsController = require('../controllers/travelsController');
let upload = require('../config/multer')

router.get('/', async (req, res) => {
    let perfecto=req.flash("perfecto");
    let error=req.flash("error");
    if (req.session.rol >= 0) {
        let rolUser = req.session.rol
        let travels = await travelsController.listTravels();
        res.render('../views/travels/list', {
            travels,
            rolUser
        });
    } else {
        req.flash('error', 'usuario sin permisos');
        res.redirect('/');

    }
});

router.get('/add', function (req, res) {
    if (req.session.rol == 1) {
        res.render('../views/travels/add');
    } else {
        req.flash('error', 'usuario sin permisos');
        res.redirect('/travels');
    }
});

router.post('/add', upload.array("file"), async function (req, res) {
    if (req.session.rol == 1) {
        let travel = await travelsController.addTravel(req.body,req.session.userId);
        if(!req.files)
        {
            return res.status(500).send('No has seleccionado un archivo valido')
        }else
        {
            let images = await travelsController.uploadImages(travel.id,req.files)
        }
        req.flash('permisos', 'viaje creado de lujo');
        res.render('../views/travels/added', {
            travel
        })

    } else {
        req.flash('permisos', 'usuario sin permisos para crear viaje');
        res.redirect('/travels');
    }
});

router.post('/delete/:id', async function (req, res){
    console.log("borramos",req.params.id)
    if (req.session.rol == 1) {
        let deleteTravel = await travelsController.removeTravel(req.params.id);
    }
})


module.exports = router;