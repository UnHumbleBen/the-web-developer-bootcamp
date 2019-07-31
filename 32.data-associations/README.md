# Associations
Associations allows us to have multiple related collection
in our web app.


## Introduction to Associations
For example, in our YelpCamp app, we have a collection
of campgrounds. Eventually, we are going to have a collection
of users and comments. We want these collections to be associated
with each other. That is, each user is associated to a campground
they posted on, or the comments they make.


## Types of Associations
There are three main types of associations.
* One-to-One
* One-to-Many
* Many-to-Many

Let's consider an example of each one of these.
### One-to-One
Every book has one publisher.
### One-to-Many
One user can have multiple photos or posts.
This is the most common type of association.
### Many-to-Many
Students can sign up for multiple courses, and each course
has multiple students.

Let's look at how we model these associations in 
[MongoDB](https://docs.mongodb.com/manual/applications/data-models-relationships/).


## Embedded Documents
We can set up these associations (also called relationships)
by using [embeded documents](https://docs.mongodb.com/manual/applications/data-models-relationships/).
We will not be making an app this time. Instead, we will
create a database collection that models the relationship.

### Users and Posts Example
Specifially, we are going to model a One-to-Many relationship
between users and posts. Every single user makes multiple posts.
We want to associate each post to the user that created it.

#### Setup
Let's start by installing [Mongoose](https://mongoosejs.com).
```bash
npm i mongoose
```
Then, we create a file called `embed.js` and include mongoose.
```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog_demo', { useNewUrlParser: true });
```

Now, let's define a schema for our user and posts. Each user
should have an email and name. Each post should have a title,
and the content of the title.
```js
// Defines user schema.
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
});
const User = mongoose.model('User', userSchema);

// Defines post schema.
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model('Post', postSchema);
```
Now, let's add one user and one post to our database.
```js
const newUser = new User({
  email: 'charlie@brown.edu',
  name: 'Charlie Brown',
});

newUser.save((err, user) => {
  if (err) {
    console.log(err);
  } else {
    console.log(user);
  }
});

const newPost = new Post({
  title: 'Reflections on Apples',
  content: 'They are delicious.',
});

newPost.save((err, post) => {
  if (err) {
    console.log(err);
  } else {
    console.log(post);
  }
});
```
We printed the our new data entries to the console for
more visibility. Run `node embed.js` to check that everything
is working correctly.

#### Associating Users to Posts
Now, let's actually model the relationship. It's quite simple
actually. We add an additional field to our user's schema.
```js
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  posts: [postSchema], // <-- Added a new field!
});
```
Each user will now have an array of his or her posts. There
is a minor error here however, which is that `postSchema` has
not been defined yet, so move the definition of `postSchema`
so that it comes before `userSchema`.
Let's see this new schema in action.
```js
const newUser = new User({
  email: 'hermione@hogwarts.edu',
  name: 'Hermione Granger',
});

newUser.posts.push({
  title: 'How to Brew Polyjuice Potion',
  content: 'Just kidding. Go to the potions class to learn it!',
});

newUser.save((err, user) => {
  if (err) {
    console.log(err);
  } else {
    console.log(user);
  }
});
```
We are adding a new user named "Hermione Granger", and associating
her with a post titled "How to Brew Polyjuice Potion" (yummy!)
Before you run this, make sure you comment out the new user and post
you made before to avoid adding duplicates to the database.
Now, when you run `node embed.js`, you should see,
```console
{
  _id: <some random id>,
  email: 'hermione@hogwarts.edu',
  name: 'Hermione Granger',
  posts: [
    {
      _id: <another random id>,
      title: 'How to Brew Polyjuice Potion',
      content: 'Just kidding. Go to the potions class to learn it!'
    }
  ],
  __v: 0
}
```
We can even add posts to existing users! Let's give Hermione
another post.
```js
User.findOne({ name: 'Hermione Granger' }, (err, user) => {
  if (err) {
    console.log(err);
  } else {
    user.posts.push({
      title: 'Three Things I Really Hate',
      content: 'Voldemort. Vodemort. Voldemort.',
    });
    user.save((_err, _user) => {
      if (_err) {
        console.log(_err);
      } else {
        console.log(_user);
      }
    });
  }
});
```
We are using the mongoose model's [`findOne()`](https://mongoosejs.com/docs/api.html#model_Model.findOne)
function to query for the user. Then we push the new post
and save it. Remember to comment out the previous code
to avoid duplicates before running `node embded.js`
```console
  name: 'Hermione Granger',
  posts: [
    {
      _id: 5d22e97166017267924e8b47,
      title: 'How to Brew Polyjuice Potion',
      content: 'Just kidding. Go to the potions class to learn it!'
    },
    {
      _id: 5d22ef10226c876fede4cf5e,
      title: 'Three Things I Really Hate',
      content: 'Voldemort. Vodemort. Voldemort.'
    }
  ],
  __v: 1
}
```
And there you have it, one user with multiple posts.
Next, we will look at Object References.


## Referencing Data
We learned how to use embeded documents in the previous
section. Now we will learn another way to associate data using
[object references](https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-referencing).
Let's copy `embeded.js` to a new file called `reference.js`.
```bash
cp embeded.js reference.js
```
We only need the schemas we defined previously, so delete all the
lines after we define `User` schema. The file should now look like
this.

Filename: references.js
```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog_demo', { useNewUrlParser: true });

// Defines post schema.
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model('Post', postSchema);

// Defines user schema.
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});
const User = mongoose.model('User', userSchema);

```
To avoid overriding what we have already accomplished in the
previous section, we will write into a different database.
We can simply change the url mongoose connects to from
`mongodb://localhost/blog_demo` to `mongodb://localhost/blog_demo_2`

Filename: references.js
```js
mongoose.connect('mongodb://localhost/blog_demo_2', { useNewUrlParser: true });
```

### Using References to Add Posts to a User
Previously, we created an array of posts for each user.
Now, we will stil use an array, but instead of an array of post,
we use an array of ids of other posts. Let's see this in action.

We changed the `posts` attribute from an array of `PostSchema`, to
an array of objects. The object has two properties, `type` and `ref`. The `type` is an `ObjectId` and `ref` is `"Post"`, indicating
that the object is a reference to a `Post` using the `Post`'s
`ObjectId`

Let's quickly check that this new Schema is working by adding
a user.

Filename: references.js
```js
// --snip--

User.create({
  email: 'bob@gmail.com',
  name: 'Bob Belcher',
});
```

Running `node references.js` should add this new user to the data
base `blog_demo_2`. Let's verify that. Run `mongo` in the command
line and enter these two commands. You should get something like.

```console
> use blog_demo_2
switched to db blog_demo_2
> db.users.find()
{ "_id" : ObjectId(<random object id>), "posts" : [ ], "email" : "bob@gmail.com", "name" : "Bob Belcher", "__v" : 0 }
```

Now comment out the code above where we created this user,
so that we don't create this document when we run the program again.
Let's now create a new post.

Filename: references.js
```js
// --snip--

Post.create({
  title: 'How to cook the best burger',
  content: 'blah blah blah blah blah',
}, (err, post) => {
  console.log(post);
});

// User.create({
//   email: 'bob@gmail.com',
//   name: 'Bob Belcher',
// });
```

Very similar to how we created `User`, but this time, we added an
callback which logs the `post` to the console.

Running `node reference.js` should output:

```console
{
  _id: <random object id>,
  title: 'How to cook the best burger',
  content: 'blah blah blah blah blah',
  __v: 0
}
```

This post has it's own `_id` different from Bob.

Again, we should comment out or delete the code for creating the
post to avoid duplication. In this case, we modify the code
because we will add another post, only this time we will actually
save it to the user.

Filename: references.js
```js
// --snip--

Post.create({
  title: 'How to cook the best burger pt. 2',
  content: 'blah blah blah blah blah',
}, (err, post) => {
  User.findOne({ email: 'bob@gmail.com' }, (_err, foundUser) => {
    if (_err) {
      console.log(err);
    } else {
      foundUser.posts.push(post);
      foundUser.save((__err, data) => {
        if (__err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    }
  });
});
```

We added `'pt. 2'` to the `title`. Then we add a callback which
queries for Bob, our user we created earlier. When it finds Bob,
it pushes the newly created post to the `posts` field of Bob.
Then it `save` this change to the database. Lastly, we have a
callback to log the new document for Bob. Running
`node reference.js` now outputs

```console
{
  posts: [ <post object id> ],
  _id: <user object id>,
  email: 'bob@gmail.com',
  name: 'Bob Belcher',
  __v: 1
}
```

In more recent versions of mongoose, the output may include the
entire post object, rather than just the id.

```console
{
  posts: [
    {
      _id: <post object id>,
      title: 'How to cook the best burger pt. 2',
      content: 'blah blah blah blah blah',
      __v: 0
    }
  ],
  _id: <user object id>,
  email: 'bob@gmail.com',
  name: 'Bob Belcher',
  __v: 1
}
```

After adding another object, the console should only
show the object id's. Let's add one more. Again we rewrite the
code above.

Filename: references.js
```js
// --snip--

Post.create({
  title: 'How to cook the best burger pt. 3',
  content: 'gibberish stuff for part 3',
}, (err, post) => {
  User.findOne({ email: 'bob@gmail.com' }, (_err, foundUser) => {
    if (_err) {
      console.log(err);
    } else {
      foundUser.posts.push(post);
      foundUser.save((__err, data) => {
        if (__err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    }
  });
});
```

Now, when we run `node references.js`, we see,

```console
{
  posts: [ <post 2 id>, <post 3 id> ],
  _id: <user id>,
  email: 'bob@gmail.com',
  name: 'Bob Belcher',
  __v: 2
}
```

Now, we can comment out the post creation code. Okay, we can
add references to posts, but how do we actually access them?

### Finding Posts
