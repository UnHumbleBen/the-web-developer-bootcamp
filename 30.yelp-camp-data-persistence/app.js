/* eslint-disable no-console */
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// Avoids URL string parser DeprecationWarning.
// Connect to the database. (Remember to run ./mongod to start up the database).
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));

// Specifies the view engine to allow omision of ejs suffix when calling render functions.
app.set('view engine', 'ejs');

// Sets up the schema (a representation of what makes up a campground).
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: 'Granite Creek',
//     image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
//     description: 'This is a huge granite hill, no bathrooms. No water. Beautiful granite',
//   }, (err, campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('Created new campground: ');
//       console.log(campground);
//     }
//   },
// );

// Renders the landinage page.
app.get('/', (req, res) => {
  res.render('landing');
});

// Renders the campground page (INDEX route).
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds: allCampgrounds });
    }
  });
  // res.render('campgrounds', { campgrounds });
});

// (CREATE route).
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
    }
  });
});

// Redirects to the form page (NEW route).
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

// SHOW route.
// Note that this needs to go after the NEW route due to pattern matching.
app.get('/campgrounds/:id', (req, res) => {
  // Find the campgroud with the provided ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { campground: foundCampground });
    }
  });
});

// Starts the servert on @PORT.
app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The YelpCamp server has started!');
});
