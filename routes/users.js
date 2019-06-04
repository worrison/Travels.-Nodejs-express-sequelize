let express = require('express');
let router = express.Router();
let usersController = require('../controllers/usersController');

/* GET users listing. */
router.get('/', async (req, res) => {
  if (req.session.rol == 1) {
    let users = await usersController.listUsers();
    res.render('../views/users/list', {
        users
    });
  }
  else{
    req.flash('permisos', 'usuario sin permisos');
    res.redirect('/');
  }
});

router.get('/destroy', (req, res) => {
  req.session.destroy();
  res.redirect('/');
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
    if(user){
        req.session.email = user.email;
        req.session.name = user.name;
        req.session.userId = user.id;
        req.session.rol = user.rol;
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
    console.log("registrado",isRegistered);
    if(isRegistered){
      res.redirect('/users/login')
    }else{
      req.flash('permisos', 'No se pudo registrar faltan cmapos por rellenar');
      res.redirect('/users/register');
    }
});

module.exports = router;