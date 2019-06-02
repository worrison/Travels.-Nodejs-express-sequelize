var express = require('express');
var router = express.Router();
let usersController = require('../controllers/usersController');

/* GET users listing. */
router.get('/', async (req, res) => {
    let users = await usersController.listUsers();
    res.render('../views/users/list', {
        users
    });
});

router.get('/login', function (req, res) {
    res.render('../views/users/login');
});

router.get('/register', function (req, res) {
    res.render('../views/users/register');
});

// router.get('/login', (req, res) => {
//     let error = req.flash('errors');
//     if (req.session.name) {
//         res.redirect('/');
//     } else {
//         res.render('..views/users/login', {
//             error
//         });
//     }
// })

// router.get('/register', function (req, res) {
//     //let error = req.flash('error');
//     // res.render('..views/users/register', {
//     //     error
//     // });
//     res.render('..views/users/register');
// });
  router.post('/register', async (req, res) => {
    let { email, name, password} = req.body;
  
    let isRegistered = await usersController.register(email, password, name);
  
    if(isRegistered){
      res.redirect('/users/login')
    }else{
      req.flash('error', 'No se pudo registrar');
      res.redirect('/users/register');
    }
  });

module.exports = router;