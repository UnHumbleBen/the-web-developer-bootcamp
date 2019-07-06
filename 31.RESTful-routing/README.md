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