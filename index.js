// Utility Imports
var express = require('express');
var mongoose = require('mongoose');
var hbs = require('express-handlebars');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Startup
var app = express();

// Config
var PORT = process.env.PORT || 3000;

var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);

var hbsOptions = {
	defaultLayout: 'main',
	extname: 'hbs'
};

app.engine('hbs', hbs(hbsOptions));
app.set('views', path.join(__dirname, 'views', 'pages'));
app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Routing Table
var home = require('./routes/home');
app.get('/', home);
app.post('/login', home.login);
app.post('/logout', home.logout);
app.post('/twote', home.post);
app.post('/delete', home.delete);

// Listen
app.listen(PORT);