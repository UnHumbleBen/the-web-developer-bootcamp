/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const bodyParser = require('body-parser');
const express = require('express');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const seedDB = require('./seeds');
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const authRoutes = require('./routes/index');

const app = express();


// Avoids URL string parser DeprecationWarning.
// Connect to the database. (Remember to run ./mongod to start up the database).
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

// A middleware which parses form data into `req.body`.
app.use(bodyParser.urlencoded({ extended: true }));
// Serves the public folder.
app.use(express.static(`${__dirname}/public`));

// Specifies the view engine to allow omision of ejs suffix when calling render functions.
app.set('view engine', 'ejs');

// Allows PUT and DELETE requests.
app.use(methodOverride('_method'));

// Connects flash middleware for displaying messages
// https://github.com/jaredhanson/connect-flash
app.use(flash());

// Seed the data base with dummy data.
seedDB();

// ========================
// PASSPORT CONFIGURATION
// ========================

app.use(require('express-session')({
  secret: 'This can be anything you want!',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Makes `currentUser` available for all ejs templates.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});


// Use required routes.

app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


// Starts the servert on @PORT.
app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The YelpCamp server has started!');
});
