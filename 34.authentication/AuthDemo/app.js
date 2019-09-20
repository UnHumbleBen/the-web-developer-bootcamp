/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const localStrategy = require('passport-local');
// const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');


mongoose.connect('mongodb://localhost:27017/AuthCamp', { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();

// Assigns the "view engine" setting to "ejs", which allows us to omit the ".ejs" extension
// for the arguments to the res.render function.
app.set('view engine', 'ejs');
// Mounts a middleware which parses urlencoded bodies and only looks at requests where the
// `Content-Type` header matches the `type` options. A new `body` object containing the parsed
// data is populated on the `request` object as `req.body`. This object will contain key-value
// pairs, where the value can be any type since `extended` is true.
app.use(bodyParser.urlencoded({ extended: true }));

// Mounts a simple session middleware, which is no longer included in the Express core.
app.use(require('express-session')({
  // Used to sign the session ID cookie.
  secret: 'There is a 10 billion percent chance Senku will win',
  // Avoids forcing save even if the session was never modified.
  resave: false,
  // Avoids forcing a session that is uninitialized to be saved to the store.
  saveUninitialized: false,
}));
// Mounts the middle ware to initialize Passport.
app.use(passport.initialize());
// Mounts the middleware to initialize the usage of persistent login sessions.
app.use(passport.session());

// Generates a function that that is used in Passport's localStrategy.
// Mounts a strategy which requires a verify callback. This verify callback
// provided by User.authenticate, which accepts the user's credientials (username
// and password) and calls done providing a user.
// eslint-disable-next-line new-cap
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============================
// Routes
// ============================


app.get('/', (req, res) => {
  res.render('home');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

app.get('/secret', isLoggedIn, (req, res) => {
  res.render('secret');
});

// Auth Routes

// Shows sign up form.
app.get('/register', (req, res) => {
  res.render('register');
});

// Handling user sign up.
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Registers a new user instance with the collected password from the form.
  //
  // The callback arguments `err` is the error thrown by the hashing algorithm,
  // or `null` if there is no error. `user` is the `User` getting authenticated
  // if the authentication was successful, false otherwise.
  User.register(new User({ username }), password, (err) => {
    if (err) {
      console.log(err);
      res.render('register');
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secret');
      });
    }
  });
});

// Login routes.


// Render login form.
app.get('/login', (req, res) => {
  res.render('login');
});

// Login logic.
app.post('/login', passport.authenticate('local', {
  // The route to redirect to upon successful authentication.
  successRedirect: '/secret',
  // The route to redirect to upon failed authentication.
  failureRedirect: '/login',
}));

app.get('/logout', (req, res) => {
  // Removes the req.user property and clears the login session.
  req.logout();
  res.redirect('/');
});


app.listen(process.env.PORT, process.env.IP, () => {
  console.log('server started...');
});
