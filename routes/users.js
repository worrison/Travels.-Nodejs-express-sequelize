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
  let perfecto;
  let error;

  if (req.session.rol == 1) {
    let users = await usersController.listUsers();
    res.render('../views/users/list', {
      users,
      perfecto
    });
  } else {
    req.flash('error', 'usuario sin permisos');
    error = req.flash("error")
    res.redirect('/');
  }
});

router.get('/destroy', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


router.get('/login', (req, res) => {
  let error = req.flash('error');
  let perfecto;
  if (req.session.name) {
    res.redirect('/');
  } else {
    req.flash("perfecto", "logueate mamon")
    perfecto = req.flash("perfecto")
    res.render('users/login', {
      error,
      perfecto
    });
  }
});

router.post('/login', async (req, res) => {
  let perfecto = req.flash("perfecto");
  let error = req.flash("error");
  let email = req.body.email;
  let password = req.body.password;
  let actived = await usersController.actived(email)
  if (actived) {
    if (!email || !password) {
      req.flash('error', 'Falta usuario o contraseña');
      error = req.flash("error");
      res.redirect('/users/login')
    } else {
      let user = await usersController.checkLogin(email, password);
      if (user) {
        req.session.email = user.email;
        req.session.name = user.name;
        req.session.userId = user.id;
        req.session.rol = user.rol;
        req.session.logginDate = new Date();
        res.redirect('/users');
      } else {
        req.flash('error', 'Usuario o contraseña inválido');
        res.redirect('/users/login');
      }
    }
  } else {
    req.flash('error', 'Active su cuenta');
    res.redirect('/users/login')
  }
});

router.get('/register', function (req, res) {
  res.render('../views/users/register');
});

router.post('/register', async (req, res) => {
  let perfecto = req.flash("perfecto");
  let error = req.flash("error");

  let {
    email,
    name,
    password
  } = req.body;
  let isRegistered = await usersController.register(email, password, name);
  let idUser = await usersController.userId(email)
  let hash = await usersController.hashear(idUser[0].id, idUser[0].password)

  if (isRegistered) {

    let message = {
      to: email,
      subject: 'ACTIVACIÓN DE USUARIO',
      template: 'email-template',
      context: {
        name: 'Activación de cuenta',
        url: "http://127.0.0.1:3000/users/active/" + hash.cadena
      },
      attachments: [{
        filename: 'paciencia.jpg',
        path: `${__dirname}/../paciencia.jpg`,
        content: 'aqui tienes'
      }]
    }

    EMAIL.transportar.sendMail(message, (error, info) => {
      if (error) {
        req.flash('error', 'se registró pero no se pudo mandar el email de activación de su cuenta');
        res.redirect('/users/register')
      } else {
        EMAIL.transportar.close();
        req.flash('perfecto', 'comprueba su email para activar su cuenta');
        res.redirect('/users/login')
      }

    })
  } else {
    req.flash('error', 'No se pudo registrar faltan cmapos por rellenar');
    res.redirect('/users/register');
  }
});


router.get('/active/:hash', async function (req, res) {
  let encript = encodeURIComponent(req.params.hash)
  let active = await usersController.active(encript);
  req.flash('perfecto', 'usuario activado');
  res.render('../views/users/login');
});

router.get('/password/forgot', function (req, res) {
  res.render('../views/users/paswordForgot');
});

router.post('/password/forgot', async function (req, res) {
  let email = req.body.email;
  let exist = await usersController.userExist(email)
  let hashByUserId = await usersController.hashByUserId(exist.id)
  if (exist.email.length > 0) {
    let message = {
      to: exist.email,
      subject: 'RECUPERACION DE PASSWORD',
      template: 'recoveryPassword',
      context: {
        name: 'recuperación de password',
        url: "http://127.0.0.1:3000/users/password/recovery/" + hashByUserId
      },
      attachments: [{
        filename: 'paciencia.jpg',
        path: `${__dirname}/../paciencia.jpg`,
        content: 'aqui tienes'
      }]
    }

    EMAIL.transportar.sendMail(message, (error, info) => {
      let perfecto;
      let error;
      if (error) {
        req.flash('error', 'No se consiguió recuperar la password de su cuenta');
        error = req.flash("error")
        res.redirect('/users/password/recovery/')
      } else {
        EMAIL.transportar.close();
        req.flash('perfecto', 'comprueba su email para recuperar su password');
        perfecto = req.flash("perfecto");
        res.redirect('/users/password/forgot')
      }

    })
  } else {
    req.flash('error', 'No existe usuario con este email');
    res.redirect('/password/recovery/')
  }
});

// router.get('/password/recovery/', async function (req, res) {
//   res.render('../views/users/passwordRecovery');
// });

router.get('/password/recovery/:hash', async function (req, res) {
  let encript = encodeURIComponent(req.params.hash)
  res.render('../views/users/passwordRecovery', {
    encript
  });
});

router.post('/password/recovery/:hash', async function (req, res) {
  let perfecto = req.flash("perfecto");
  let encript = encodeURIComponent(req.params.hash)
  let idUser = await usersController.userIdByHash(encript);
  let password = req.body.password
  let updateUser = await usersController.updatePassword(idUser, password)

  req.flash('perfecto', 'actualizada la password');
  res.render('users/login', {
    perfecto
  });
});

router.get('/edit/:id', async function (req, res) {
  if (req.session.rol == 1) {
    let idUser = req.params.id;
    let userData = await usersController.findUserById(idUser)

    res.render('../views/users/editUser', {
      userData
    });
  }
});
router.post('/edit/:id', async function (req, res) {
  if (req.session.rol == 1) {
    let perfecto;
    let idUser = req.params.id;
    let admin = req.body.admin;
    let active = req.body.active;
    let sendEmail = req.body.email;
    let user = await usersController.findUserById(idUser)
    console.log("email", sendEmail);

    if (sendEmail == "on") {
      console.log("hola");
      let hashByUserId = await usersController.hashByUserId(idUser)
      console.log("dato", hashByUserId);
      console.log(user.email);
      let message = {
        to: user.email,
        subject: 'ACTIVACIÓN DE USUARIO',
        template: 'email-template',
        context: {
          name: 'Activación de cuenta',
          url: "http://127.0.0.1:3000/users/active/" + hashByUserId
        },
        attachments: [{
          filename: 'paciencia.jpg',
          path: `${__dirname}/../paciencia.jpg`,
          content: 'aqui tienes'
        }]
      }

      EMAIL.transportar.sendMail(message, (error, info) => {
        if (error) {
          req.flash('error', 'se registró pero no se pudo mandar el email de activación de su cuenta');
          res.redirect('/users/register')
        } else {
          EMAIL.transportar.close();
          req.flash('perfecto', 'comprueba su email para activar su cuenta');
          res.redirect('/users/login')
        }

      })
    }
    //por defecto si no marcas ningun valor en el check box es undefined
    admin != "on" ? admin = 0 : admin = 1
    active != "on" ? active = 0 : active = 1
    let updateUser = await usersController.updateStates(idUser, admin, active)
    req.flash('perfecto', 'actualizado el usuario');
    perfecto = req.flash('perfecto');
    res.redirect('/users/');
  }
});

module.exports = router;