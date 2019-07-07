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
Our blog is devoid of any style right now. Let's change that. We should add some
a header and footer to our html. Then we can include Semantic UI to add a simple
nav.
### Adding Header and Footer Partials
First, let's add our header and footer partials.
Type this into the command line in your project directory
to make create partial files.
```
mkdir views/partials
touch views/partials/header.ejs
touch views/partials/footer.ejs
```
In `header.ejs`,
```js
<html>
  <head>
    <title>Blog App</title>
  </head>
  <body>
    <p>From the header file!</p>
```
In `footer.ejs`,
```js
    <p>From the footer file.</p>
  </body>
</html>
```
The paragraph tags are for testing purposes.
We will remove them shortly. Now, let's include these partials into `index.ejs`.
At the top of the file,
```js
<% include partials/header %>
```
At the bottom of the file,
```js
<% include partials/footer %>
```
When you run `PORT=8000 node app.js` and go to [`localhost:8000/](localhost:8000/), you should
see the index page with those paragraphs at the top and bottom of the page.
### Semantic UI
To simplify things, we will use a [CDN](https://cdnjs.com/libraries/semantic-ui). Which we will
include in our `header.ejs` file.
```html
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">
```
Now when you run `port=8000 node app.js`, the font changes slightly.
### Adding a Navbar
The Semantic UI docs details how to make a [menu](https://semantic-ui.com/collections/menu.html).
So, we add the following to our `header.ejs`, below the body tag
```js
    <div class="ui fixed inverted menu">
      <div class="ui container">
        <div class="header item"><i class="code icon"></i>Blog Site</div>
        <a href="/" class="item">Home</a>
        <a href="/blogs/new" class="item">New Post</a>
      </div>
    </div>
```
There is a lot going on here, all of which can be found in the docs.
All UI defined elements have `ui` in their class name. In our code,
the first two lines contains elements with `ui` as a class. This helps
us distinguish which elements are distinguished UI elements, and what
elements are part of a distinguished UI element. In our case,
all elements with class `item` are part of the UI `menu` collection.
The `fixed` and `inverted` classes are variations of the `menu`, which
fixes our navbar to the top of the page and inverts the colors.
We also added a UI `container` div to restrict the width of our menu.
We have three `item` elements. The first one is our logo, so we give it
two extra properties, [`header`](https://semantic-ui.com/collections/menu.html#header)
to give it the bold font, and an [icon](https://semantic-ui.com/elements/icon.html).
The last two elements are standard link tags. Phew, that was a lot to swallow.
Now we have a navbar! Although, it is blocking the top part of our index page now.
Let's fix that.
### Adding Our Own Styles
Let's make a new directory for our own stylesheet. In our project directory, run
```bash
mkdir public/
mkdir public/stylesheets
touch public/stylesheets/app.css
```
Then we can link to it in `header.ejs` by adding
```html
    <link rel="stylesheet" type="text/css" href="stylesheets/app.css">
```
You may be wondering why we wrote `stylesheets/app.css`
instead of `public/stylesheets/app.css`.
Recall that when we included the header and footer partials,
we just specified relative paths from within the `views` directory
since all the files were inside of `views`. Now, things are different
because our style sheet is not inside of the `views` folder, but instead
the `public` folder. How can we access it? Well, if you recall, in `app.js`
we had this line.
```js
app.use(express.static('public'));
```
This line tells Express to serve up all files within the `public/` directory.
In fact if you run `PORT=8000 node app.js` and go to your browser's developer tool
to view `Sources`. You will see `stylesheets/` listed there, but not `public/`.
In short, when we specify paths, we specify them relative to where there are
served in the frontend, not backend. Now, let's continue by adding our
own styles inside of our newly created `app.css`.
```css
i.icon {
  font-size: 2em;
}
```
This just makes the icon a bit bigger by doubling the font size. We will look
at how to fix our navbar issue later. For now, let's add the NEW and CREATE
routes so we can create new blog posts.
## NEW and CREATE
### NEW
You may have noticed that we already included a link tag to make a new post above.
We have a link tag in our menu to go to `/blogs/new`, but we do not have a handler
for that request yet. Let's do that now. In app.js, add
```js
app.get('/blogs/new', (req, res) => {
  res.render('new');
});
```
Pretty straightforward. We just render the form page. Create that page with
```
touch views/new.ejs
```
and add
```js
<% include partials/header %>
<div class="ui main text container segment">
  <div class="ui huge header">New Blog</div>
</div>
<% include partials/footer %>
```
As usual, we wrap the file with the partials. Inside, we are using another
element from UI Semantics. Here we are using a [text container](https://semantic-ui.com/elements/container.html#/definition),
which wraps a single column of text to an appropriate width.
We also use [segment](https://semantic-ui.com/elements/segment.html) to group the
form elements together. We will see the use of `main` later.
For our header, we use the [huge header](https://semantic-ui.com/elements/header.html) class.

When you go to `/blogs/new`, something strange happens. The font size of
our icon is no longer 2em. What is going on here?
If you look in the developer console, you will notice a curious error.
```console
Refused to apply style from 'http://localhost:8000/blogs/stylesheets/app.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
```
Notice how it's looking inside of the blogs directory? This is because `new.ejs`
is inside of `blogs` in it's frontend path (`/blogs/new`). Why didn't we have this
problem with the index page? Well, the index page was at `/blogs`, so its relative
path to search is `/stylesheets/app.css`, which is correct. So how do we fix this problem
for `/blogs/ejs`? How do we tell the browser to look for the stylesheet from the root?
Let's look at how we linked our stylesheet in `header.ejs`.
```html
    <link rel="stylesheet" type="text/css" href="stylesheets/app.css">
```
Adding a slash to the front of the path fixes it.
```html
    <link rel="stylesheet" type="text/css" href="/stylesheets/app.css">
```
Great! Now we can finally fix our annoying menu problem. We want to move the navbar up so
that it does not block our container element. How do we move the container element down?
We can add some margin to the top in our `app.css`.
```css
.container {
  margin-top: 7.0em;
}
```
But remember we also but a container inside of the menu? So we want to be more specific.
```css
.container.main {
  margin-top: 7.0em;
}
```
Now we can add a form to `new.ejs`,
```html
  <form action="/blogs" method="POST">
    <input type="text" name="blog[title]" placeholder="title">
    <input type="text" name="blog[image]" placeholder="image">
    <input type="text" name="blog[body]" placeholder="body">
    <input type="submit">
  </form>
```
And with that, we are finished with the new route;
however, it does not work without the create route.
### CREATE
You may be wondering, how come we named our input tags with `blog[field_name]`
rather than just `field_name`. The answer is that it tells
body-parser to store all those fields under the `blog` object, which we
can access with `req.body.blog`, much more concise than having to destructure
each one of the field_names seperately. Let's see it in action in `app.js`,
```js
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
```
Now, when you enter a new post into the form, it should redirect to index
and you should see the new post.
### UI Form
We can now add some UI Semantic to our form using the [form collection](https://semantic-ui.com/collections/form.html).
We can rewrite the form in `new.ejs`.
```html
  <form class="ui form" action="/blogs" method="POST">
    <div class="field">
      <label>Title</label>
      <input type="text" name="blog[title]" placeholder="title">
    </div>
    <div class="field">
      <label>Image</label>
      <input type="text" name="blog[image]" placeholder="image">
    </div>
    <div class="field">
      <label>Body</label>
      <textarea name="blog[body]"></textarea>
    </div>
    <button class="ui violet basic button" type="submit">Submit</button>
  </form>
```
Essentially, follow the first template in the form collection,
but we added our own [basic button](https://semantic-ui.com/elements/button.html).
## SHOW
Usually, the CREATE route redirects to the SHOW route, not the INDEX, so let's create it.
### Adding Links to the Show Page
Firstly, the index plage should have a link to the SHOW page under each dog. So in `index.ejs`,
underneathe the paragraph tag, we add
```js
    <a href="/blogs/<%= blog._id %>">Read More</a>
```
### Adding the SHOW Route
We can handle this request in `app.js` by adding a handler
```js
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', { blog: foundBlog });
    }
  });
});
```
Use `req.params.id` to parse the id and query the database.
We then pass the database entry we queried into the show template as `blog`.
Now we need to create that template.
```bash
touch views/show.ejs
```
### Styling
Here's the gist of it.
```js
<% include partials/header %>
<div class="ui main text container segment">
  <div class="ui items">
    <div class="item">
      <div class="image">
        <img class="ui centered rounded image" src="<%= blog.image %>">
      </div>
      <div class="content">
        <div class="header"><%= blog.title %></div>
        <div class="meta">
          <span><%= blog.created.toDateString() %></span>
        </div>
        <div class="description">
          <p><%= blog.body %></p>
        </div>
      </div>
    </div>
  </div>
</div>
<% include partials/footer %>
```
Let's break this down. As usual we include the partials at the top and bottom.
We have seen this `ui main text container segment` class used before in the form.
Likewise, we have seen `ui huge header` earlier also, only this time, the header is
`blog.title`. We use the [`items`](https://semantic-ui.com/views/item.html) class for
displaying collections of content, which in this case is the blog contents.
We use [`image`](https://semantic-ui.com/elements/image.html) class for styling the image.

Slight aside, we can give the user the option to input html into their post by changing
one character in our `show.ejs`.
```js
          <p><%- blog.body %></p>
```
Did you catch it? We changed the `=` to a `-`, which outputs the raw, or unescaped
version of the text. Great! The user can add HTML to style of their posts.
They might also be able to run scripts on your site now also... careful! We will
come back to input scantization later.

You may have noticed that our index page shows everything inside the blog already.
This is problematic for long posts, we only want to only see part of the body.
This is a pretty simple fix, we can use the JavaScript substring function.
Replacing the body paragraph tag in `index.ejs` with
```js
    <p><%= blog.body.substring(0, 100) %> . . .</p>
```
## EDIT and UPDATE
Very similar to NEW and CREATE.
### Add Edit Route
In `app.js` add
```js
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', { blog: foundBlog });
    }
  });
});
```
This route queries the database with the id and passes the queried blog
to the template.
### Add Edit Form
Make a new file called `views/edit.ejs` by copying `views/new.ejs`.
We are using the new form as a template and making some changes.
```bash
cp views/new.ejs views/edit.ejs
```
First, let's replace our placeholders by inserting what the blog's fields were.
```html
  <!--  -->
  <div class="ui huge header">Edit <%= blog.title %></div>
  <!--  -->
      <input type="text" name="blog[title]" value="<%= blog.title %>" required>
  <!--  -->
      <input type="text" name="blog[image]" value="<%= blog.image %>" required>
  <!--  -->
      <textarea name="blog[body]" required><%= blog.body %></textarea>
  <!--  -->
```
Rewriting the `value` fields preloads the blogs' title and image url onto the form.
`textarea` works similarly by putting the body into the inner HTML.

Our submit button still goes to the CREATE route however, so we need to change that.
```html
  <form class="ui form" action="/blogs/<%= blog._id %>" method="PUT">
```
Except... this doesn't work. Forms do not accept PUT requests unfortunately.
They default to GET requests. Why?
Let's leave that discussion for [somewhere else](https://softwareengineering.stackexchange.com/questions/114156/why-are-there-are-no-put-and-delete-methods-on-html-forms).
How do we get around this? We will use [method-override](https://www.npmjs.com/package/method-override).
### Add Method-Override
Install method-override.
```bash
npm i method-override
```
Include it in `app.js`.
```js
const methodOverride = require('method-override');
// ....
app.use(methodOverride('_method'));
```
This tells the middleware function to take the argument of the query string `"_method"` and override
the method with the argument.

In `edit.ejs` change the form tag.
```html
  <form class="ui form" action="/blogs/<%= blog._id %>?_method=PUT" method="POST">
```
We added the query string `"_method=PUT"` which the method-override middleware will signal the middleware
to override the POST request as a PUT request.

Now we need to handle this request.
### Add Update Route
In `app.js` add
```js
app.put('/blogs/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});
```
Here we are using a new method called `findByIdAndUpdate()`, which is actually deprecated,
so we need to update our options when we connect the to MongoDB by setting the option
`useFindAndModify` to `false`.
```js
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true, useFindAndModify: false });
```
Looking back at the update route, `findByIdAndUpdate()` finds the blog post via the id
and replaces it with `req.body.blog` which contains the new blog object.
Great! Now when we update the blog, it really updates! Just one more route to go, hang in there!

## DESTROY
Let's add a button inside of `show.ejs` for delete.
```html
    <div class="item">
    <!--  -->
      <form action="/blogs/<%= blog._id %>?_method=DELETE" method="POST">
        <button class="ui red basic button">Delete</button>
      </form>
    </div>
```
Again, we are using the method-override middleware by passing in the query string,
`"?_method=DELETE"` and sending a `POST` request.

Now we added the Destory route handler in `app.js`.
```js
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
```
Seems like a simpler version of Update, huh? And that is it! We have completed all the
RESTful routes.

## Where is Our Edit Button?
We do not have a nice way to edit a blog right now, so let's add a button.
Add this to `show.ejs`
```html
    <div class="item">
    <!--  -->
      <div>
        <a class="ui orange basic button" href="/blogs/<%= blog._id %>/edit">Edit</a>
      </div>
    <!--  -->
```
