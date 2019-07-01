const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

// Specifies the view engine to allow omision of ejs suffix when calling render functions.
app.set('view engine', 'ejs');

const campgrounds = [
  { name: 'Salmon Creek', image: 'https://www.photosforclass.com/download/pixabay-1149402?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732e7cdc9045c65f_960.jpg&user=Free-Photos' },
  { name: 'Granite Hill', image: 'https://www.photosforclass.com/download/pixabay-1867275?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c732e72d6954bcd5c_960.jpg&user=Pexels' },
  { name: 'Mountain Goat\'s Rest', image: 'https://www.photosforclass.com/download/pixabay-1208201?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732e7ddd924fc45a_960.jpg&user=Free-Photos' },
  { name: 'Salmon Creek', image: 'https://www.photosforclass.com/download/pixabay-1149402?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732e7cdc9045c65f_960.jpg&user=Free-Photos' },
  { name: 'Granite Hill', image: 'https://www.photosforclass.com/download/pixabay-1867275?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c732e72d6954bcd5c_960.jpg&user=Pexels' },
  { name: 'Mountain Goat\'s Rest', image: 'https://www.photosforclass.com/download/pixabay-1208201?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732e7ddd924fc45a_960.jpg&user=Free-Photos' },
];

// Renders the landinage page.
app.get('/', (req, res) => {
  res.render('landing');
});

// Renders the campground page.
app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds });
});

// Gets data from form and add it to campgrounds array.
// Redirects back to campgrounds page.
app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const newCampground = { name, image };
  campgrounds.push(newCampground);

  // Redirect is a GET request.
  res.redirect('/campgrounds');
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
