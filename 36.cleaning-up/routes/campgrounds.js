/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();

const Campground = require('../models/campground');

// ========================
// CAMPGROUNDS ROUTES
// ========================


// INDEX route.
// Renders the campground page.
router.get('/', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

// CREATE route.
// Gets data from form and add it to campgrounds database.
// Redirects back to campgrounds page.
router.post('/', isLoggedIn, (req, res) => {
  const { name, image, description } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = {
    name, image, description, author,
  };
  console.log(req.user);
  // Create a new campground and save it to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
      console.log(`Added ${newlyCreated}`);
    }
  });
});

// NEW route.
// Redirects to campground form page.
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW route.
// Note that this needs to go after the NEW route due to pattern matching.
router.get('/:id', (req, res) => {
  // Find the campgroud with the provided ID
  // Uses populate in order to fill in all the comment references with the
  // actual comment.
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});

module.exports = router;
