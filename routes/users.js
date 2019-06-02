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


router.get('/login', (req, res) => {
    let error = req.flash('errors');
    if(req.session.name){
      res.redirect('/');
    }else{
      res.render('../views/users/login', {
        error
      });
    }
  });

  router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    
    if(!email || !password){
      req.flash('errors', 'Falta usuario o contraseña');
      res.redirect('/users/login')
    } else {
      let user = await usersController.checkLogin(email,password);
      console.log("resultado controller",user.email)
      if(user){
        req.session.email = user.email;
        req.session.name = user.name;
        req.session.userId = user.id;
        req.session.logginDate = new Date();
        res.redirect('/travels');
      }else{
        req.flash('errors', 'Usuario o contraseña inválido');
        res.redirect('/users/login');
      }
    }
  
  });

router.get('/register', function (req, res) {
    res.render('../views/users/register');
});

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