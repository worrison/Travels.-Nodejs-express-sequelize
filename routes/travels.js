var express = require('express');
var router = express.Router();
let travelsController = require('../controllers/travelsController');
let upload = require('../config/multer')

router.get('/', async (req, res) => {
    let perfecto=req.flash("perfecto");
    let error=req.flash("error");
    // if (req.session.rol >= 0) {
        let rolUser = req.session.rol
        let travels = await travelsController.listTravels();
        let imagesTravels = await travelsController.getAllImages()
        // console.log("eaea",imagesTravels[0].images[0].url)
        console.log("eaea",imagesTravels[13].images[0].url)

        // let dataTravel = {
        //     travel:{...travels},
        //     mainImage:""
        // }
        // let datos=[dataTravel]



        // console.log(travels[0].id);
        // for(let i=0; i<travels.length; i++)
        // {
        //     datos[i].dataTravel.travel=travels[i];
        //     try{
        //         let imagesTravels = await travelsController.getListImages(travels[i].id)
        //         datos[i].dataTravel.mainImage=imagesTravels[0];
        //     }
        //     catch(e)
        //     {
        //         return "error"
        //     }
        

        // }
    
        res.render('../views/travels/list', {
            travels,
            imagesTravels,
            rolUser
        });
    // } else {
    //     req.flash('error', 'usuario sin permisos');
    //     res.redirect('/');

    // }
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

// router.get('/edit/:idTravel', async function (req,res){
//     let idTravel=req.params.idTravel;
//     console.log("estas?",idTravel);
//     let dataTravel=await travelsController.detailTravel(idTravel);
//     res.render('../views/travels/edit',{
//         dataTravel
//     });
// })

router.get('/detail/:idTravel', async function (req,res){
    let idTravel=req.params.idTravel;
    console.log("estas?",idTravel);
    let dataTravel=await travelsController.detailTravel(idTravel);
    let listImages=await travelsController.getListImages(idTravel);
    let mainImage=listImages[0].url;
    console.log("imagenes",listImages[0].url);
    res.render('../views/travels/detail',{
        dataTravel,
        listImages,
        mainImage
    });
})


module.exports = router;