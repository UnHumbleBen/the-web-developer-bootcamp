/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Campground = require('./models/campground');

const Comment = require('./models/comment');

const seedDB = require('./seeds');

// Avoids URL string parser DeprecationWarning.
// Connect to the database. (Remember to run ./mongod to start up the database).
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

// A middleware which parses form data into `req.body`.
app.use(bodyParser.urlencoded({ extended: true }));
// Serves the public folder.
app.use(express.static(`${__dirname}/public`));

// Specifies the view engine to allow omision of ejs suffix when calling render functions.
app.set('view engine', 'ejs');

// Seed the data base with dummy data.
seedDB();

// Renders the landing page.
app.get('/', (req, res) => {
  res.render('landing');
});

// ========================
// CAMPGROUNDS ROUTES
// ========================

// INDEX route.
// Renders the campground page.
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
  // res.render('campgrounds', { campgrounds });
});

// CREATE route.
// Gets data from form and add it to campgrounds database.
// Redirects back to campgrounds page.
app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const newCampground = { name, image, description };
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
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW route.
// Note that this needs to go after the NEW route due to pattern matching.
app.get('/campgrounds/:id', (req, res) => {
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

// ========================
// COMMENTS ROUTES
// ========================

// NEW route.
// Redirects to comment form page.
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// POST route.
// Retrieves form data from route above and add new comment to database.
app.post('/campgrounds/:id/comments', (req, res) => {
  // Lookup campground using ID.
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err2, comment) => {
        if (err2) {
          console.log(err2);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
      // Create new comment.
    }
  });
});

// Starts the servert on @PORT.
app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The YelpCamp server has started!');
});
