/* eslint-disable no-console */
const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// Renders the landing page.
router.get('/', (req, res) => {
  res.render('landing');
});

// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username });
  User.register(new User(newUser), password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Welcome to YelpCamp ${user.username}!`);
        res.redirect('/campgrounds');
      });
    }
  });
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handling logic logic
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}));

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/campgrounds');
});


module.exports = router;
