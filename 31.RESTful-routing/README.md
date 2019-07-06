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
* We will be using a new framework called [Semantic UI](https://semantic-ui.com/)
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
touch app.js
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
Let's just check to make sure that we setup MongoDB correctly by making a test blog post.
```javascript
Blog.create({
  title: 'Test Blog',
  image: '<random image url>',
  body: 'Hello! This is a blog post!',
});
```
Now run the app! If everything was setup properly we should be able to see the dog in our database. So run `mongo`
```
> show dbs
> use restful_blog_app
> db.blogs.find()
```
Should output the following...
```
{ "_id" : ObjectId("<random id>"), "title" : "Test Blog", "image" : "<random image url>", "body" : "Hello! This is a blog post!", "created" : ISODate("2019-07-06T05:07:16.631Z"), "__v" : 0 }
```
Now that we are confident that we setup our database correctly, we can delete the ```Blog.create ...``` from our code.
Now we are all set! We can start making routes now!
## INDEX
This is the route where we show all our blog posts.
Recall that REST conventions dictates that this
route should be a `GET` request to `/blogs`.
We can handle that request with the following.
```javascript
app.get('/blogs', (req, res) => {
  res.render('index');
});
```
But what is `'index'`? Recall that our view engine was set to `ejs`.
This means we need to create a template file in `views` (the default directory Express looks in)
called `index.ejs`.
```
mkdir views
touch views/index.ejs
```
and let's just add a simple template into this file to test
that our INDEX route is connected properly.
```html
<h1>Index Page!</h1>
```
Start up our server again with
```
PORT=8000 node app.js
```
Now, if you go to [localhost:8000/blogs](localhost:8000/blogs),
you should see that header tag.
Notice that we don't get a response with [localhost:8000/](locahost:8000/)
That is a bit annoying. By convention most webpages, such as Facebook and Reddit
have the root redirect to the index page. We can do that by adding this to `app.js`.
```javascript
app.get('/', (req, res) => {
  res.redirect('/blogs');
});
```
Now if we start up the server with ```PORT=8000 node app.js```,
[localhost:8000/](locahost:8000/) takes to our index page. Great!
Now we can add the functionality for our index page.
We need to query the database for all the blogs and then pass it in
to our `index.ejs` template so we can display them all.
So, let's rewrite out request handle for `/blogs`.
```javascript
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log('Error!');
    } else {
      res.render('index', { blogs });
    }
  });
});
```
Notice that we call `Blog.find()`, to find all the blogs, which we can than
use in the call back function to pass it in to the template file with
```javascript
res.render('index', { blogs });
```
In the template file, `views/index.ejs`, we write
```js
<% blogs.forEach(function(blog) { %>
  <div>
    <h2><%=blog.title%></h2>
    <img src="<%= blog.image %>">
    <span><%= blog.created %></span>
    <p><%= blog.body %></p>
  </div>
<% }) %>
```
Now when we run `PORT=8000 node app.js`, we see our first blog page!
We will see how to add new blogs using the NEW and CREATE routes, but first,
let's make our layout a tidier with Semantic UI.
## Layout