/* eslint-disable no-console */
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
  posts: [postSchema],
});
const User = mongoose.model('User', userSchema);

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

// const newUser = new User({
//   email: 'hermione@hogwarts.edu',
//   name: 'Hermione Granger',
// });

// newUser.posts.push({
//   title: 'How to Brew Polyjuice Potion',
//   content: 'Just kidding. Go to the potions class to learn it!',
// });

// newUser.save((err, user) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });

// const newPost = new Post({
//   title: 'Reflections on Apples',
//   content: 'They are delicious.',
// });

// newPost.save((err, post) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });
