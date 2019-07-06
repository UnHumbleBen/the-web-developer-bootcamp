/* eslint-disable no-console */
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Configures the Express app.
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configures Mongoose and model.
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', blogSchema);

// Sets the RESTful routes.

// Redirects the root route to index.
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// Handles the index route.
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log('Error!');
    } else {
      res.render('index', { blogs });
    }
  });
});

// Handles the new route.
app.get('/blogs/new', (req, res) => {
  res.render('new');
});
// Handles the create route.
app.post('/blogs', (req, res) => {
  // Creates the blog.
  Blog.create(req.body.blog, (err) => {
    if (err) {
      res.render('new');
    } else {
      // Redirects to index.
      res.redirect('/blogs');
    }
  });
});
// Handles the show route.
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', { blog: foundBlog });
    }
  });
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server is running!');
});
