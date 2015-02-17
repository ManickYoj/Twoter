// Utility Imports
var express = require('express');
var mongoose = require('mongoose');
var hbs = require('express-handlebars');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Authentication/Authorization
var devconf = require('./oauth.js')
var session = require('express-session');
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

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

// OAuth config
passport.use(new FacebookStrategy({
		clientID: process.env.FB_CLIENTID || devconf.facebook.clientID,
		clientSecret: process.env.FB_CLIENTSECRET || devconf.facebook.clientSecret,
		callbackURL: process.env.FB_CALLBACKURL || devconf.facebook.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
 		process.nextTick(function () {
   		return done(null, profile);
 	});
}));


// Middleware

// passport serialize and deserialize
passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(obj, done) { done(null, obj); });

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
app.use(passport.initialize());
app.use(passport.session());

// Routing Table
var home = require('./routes/home');
app.get('/', home);
app.post('/login', home.login);
app.post('/logout', home.logout);
app.post('/twote', home.post);
app.post('/delete', home.delete);

app.get('/auth/facebook',
	passport.authenticate('facebook'),
	function(req, res){
});

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/' }),
	function(req, res) {
 		res.redirect('/');
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

// Listen
app.listen(PORT);