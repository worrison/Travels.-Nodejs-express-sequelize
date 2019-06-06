var createError = require('http-errors');
var flash = require('connect-flash');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var hbs= require('hbs');


/* icons import */
// let library = require('@fortawesome/fontawesome-svg-core');
// let fas = require('@fortawesome/free-solid-svg-icons'); 
// let far = require('@fortawesome/free-regular-svg-icons'); 
// let fab = require('@fortawesome/free-brands-svg-icons'); 

// library.add(fas, far, fab);

/***/

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var travelsRouter = require('./routes/travels');
var ApiRouterTravels = require('./routes/Api/travel');
// var ApiRouterUsers = require('./routes/Api/user');


var app = express();
// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(session({
  secret: 'miClaveSecreta',
  name: 'sesionUsuario',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session;
  next();
});

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travels', travelsRouter);
app.use('/Api/travel', ApiRouterTravels);
// app.use('/Api/user', ApiRouterUsers);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
