let express = require('express');
let router = express.Router();
let usersController = require('../controllers/usersController');
let hbs = require('nodemailer-express-handlebars');
const EMAIL = require('../config/emailConfig')


let options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: './views/email_templates/layout',
    defaultLayout: 'email-body.hbs',
    partialsDir: './views/email_templates/partials/'
  },
  viewPath: 'views/email_templates',
  extName: '.hbs'
};
EMAIL.transportar.use('compile', hbs(options));

/* GET users listing. */
router.get('/', async (req, res) => {
  if (req.session.rol == 1) {
    let users = await usersController.listUsers();
    res.render('../views/users/list', {
      users
    });
  } else {
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
  if (req.session.name) {
    res.redirect('/');
  } else {
    res.render('../views/users/login', {
      error
    });
  }
});

router.post('/login', async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let actived = await usersController.actived(email)
  if (actived) {
    if (!email || !password) {
      req.flash('errors', 'Falta usuario o contraseña');
      res.redirect('/users/login')
    } else {
      let user = await usersController.checkLogin(email, password);
      if (user) {
        req.session.email = user.email;
        req.session.name = user.name;
        req.session.userId = user.id;
        req.session.rol = user.rol;
        req.session.logginDate = new Date();
        res.redirect('/travels');
      } else {
        req.flash('errors', 'Usuario o contraseña inválido');
        res.redirect('/users/login');
      }
    }
  } else {
    req.flash('errors', 'Active su cuenta');
    res.redirect('/users/login')
  }
});

router.get('/register', function (req, res) {
  res.render('../views/users/register');
});

router.post('/register', async (req, res) => {

  let { email,name,password} = req.body;
  let isRegistered = await usersController.register(email, password, name);
  let idUser = await usersController.userId(email)
  let hash = await usersController.hashear(idUser[0].id,idUser[0].password)

  if (isRegistered) {

    let message = {
      to: email,
      subject: 'ACTIVACIÓN DE USUARIO',
      template: 'email-template',
      context: {
        name: 'Activación de cuenta',
        url: "http://127.0.0.1:3000/users/active/"+ hash.cadena
      },
      attachments: [{
        filename: 'paciencia.jpg',
        path: `${__dirname}/../paciencia.jpg`,
        content: 'aqui tienes'
      }]
    }

    EMAIL.transportar.sendMail(message, (error, info) => {
      if (error) {
        req.flash('activar', 'se registró pero no se pudo mandar el email de activación de su cuenta');
        res.redirect('/users/register')
      } else {
        EMAIL.transportar.close();
        req.flash('activar', 'comprueba su email para activar su cuenta');
        res.redirect('/users/login')
      }

    })
  } else 
  {
    req.flash('permisos', 'No se pudo registrar faltan cmapos por rellenar');
    res.redirect('/users/register');
  }
});


router.get('/active/:hash', async function (req, res) {
  let encript=encodeURIComponent(req.params.hash)
  let active = await usersController.active(encript);
  res.render('../views/users/register');
});

module.exports = router;