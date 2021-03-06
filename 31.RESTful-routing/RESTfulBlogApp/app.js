/* eslint-disable no-console */
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

// Configures the Express app.
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true, useFindAndModify: false });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

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
  // Sanitizes the body of the blog.
  req.body.blog.body = req.sanitize(req.body.blog.body);
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
// Edit route.
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', { blog: foundBlog });
    }
  });
});
// Update route.
app.put('/blogs/:id', (req, res) => {
  // Sanitizes the body of the blog.
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});
// Destroy route.
app.delete('/blogs/:id/', (req, res) => {
  // Destroys the blog.
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server is running!');
});
