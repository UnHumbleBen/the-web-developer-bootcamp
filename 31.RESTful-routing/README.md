# RESTful Routing

# Introduction
## What is REST?
* stands for REpresentational State Transfer (but no one really remembers this).
* is a convention for mapping between HTTP routes and CRUD
  * CRUD stands for CREATE, READ, UPDATE, and DESTROY
## Why Does it Matter?
* Consider a blog with these routes...
  * CREATE  
    * /createBlog
  * READ
    * /allBlogs
  * UPDATE
    * /updateBlog/:id
  * DESTROY
    * /destroyBlog/:id
* Not so reliable... names are hard to predict.
## Examples
* Follow the RESTful convention:
  * INDEX   
    * /blogs
    * GET
    * Shows all the blogs.
  * NEW     
    * /blogs/new
    * GET
    * Shows a form to add a blog.
  * CREATE
    * /blogs
    * POST
    * Creates a new blog and redirects somewhere.
      * In our YelpCamp, we redirected to the INDEX route.
  * SHOW
    * /blogs/:id
    * GET
    * Shows one specific blog.
  * Edit
    * /blogs/:id/edit
    * GET
    * Shows the edit form for a blog.
  * UPDATE
    * /blogs/:id
    * PUT
    * Updates a blog post, and then redirects somewhere.
  * DESTROY
    * /blogs/:id
    * DELETE
    * Deletes a blog post, and then redirects somewhere.
* Notice that some routes have the same path.
  * INDEX and CREATE have the path "/blogs."
  * SHOW, UPDATE, and DESTROY have the path "/blogs/:id."
  * Yet, they are still different because of their HTTP verb.

# RESTful Blog App
* We will be using a new framework called Samantic UI https://semantic-ui.com/
* We will use Express. REST is really the bread and butter of Express.
## Setup
Make a new directory for the app.
```
mkdir RESTfulBlogApp
cd RESTfulBLOGAPP
```
Install dependencies.
```
npm init`
npm i express mongoose body-parser ejs`
```
Create entry point file.
```
`touch app.js`
```
Require dependencies.
```javascript
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
```
Configure mongoose.
```javascript
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true });
```
Set up Express app by configuring the view engine, static assets directory, and body parser.
```javascript
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
```
At the bottom of `app.js`, add a listener to start the connection on `PORT`.
```javascript
app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server is running!');
});
```
Make sure that MongoDB is running. Run `./mongodb` if it is not.
Test that the listener is working with
```
PORT=8000 node app.js
```
You should see
```
Server is running!
```
Almost there! Now we just need to define a schema for the blog posts. Every blog post should have a title, image, body and date. By default, the date should be the time the user enter the post. We can define this model and insert it mongoose with the following.
```javascript
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', blogSchema);
```
And now we are all set! We can start making routes now!
## INDEX
