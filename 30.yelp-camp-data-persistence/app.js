/* eslint-disable no-console */
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// Avoids URL string parser DeprecationWarning.
mongoose.set('useNewUrlParser', true);
// Connect to the database. (Remember to run ./mongod to start up the database).
mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({ extended: true }));

// Specifies the view engine to allow omision of ejs suffix when calling render functions.
app.set('view engine', 'ejs');

// Sets up the schema (a representation of what makes up a campground).
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: 'Granite Creek',
//     image: 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjLwZDTrJzjAhXLrVQKHc7fCtoQjRx6BAgBEAU&url=https%3A%2F%2Funsplash.com%2Fsearch%2Fphotos%2Fcamping&psig=AOvVaw0ENum51jvA307I6Im6v_l7&ust=1562366968792379',
//   }, (err, campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('NEWLY CREATED CAMPGROUND: ');
//       console.log(campground);
//     }
//   },
// );

// Renders the landinage page.
app.get('/', (req, res) => {
  res.render('landing');
});

// Renders the campground page.
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds', { campgrounds: allCampgrounds });
    }
  });
  // res.render('campgrounds', { campgrounds });
});

// Gets data from form and add it to campgrounds array.
// Redirects back to campgrounds page.
app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const newCampground = { name, image };
  // Create a new campground and save it to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// Redirects to the form page.
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

// Starts the servert on @PORT.
app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The YelpCamp server has started!');
});
