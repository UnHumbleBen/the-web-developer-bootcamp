/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog_demo_2', { useNewUrlParser: true });

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

// Post.create({
//   title: 'How to cook the best burger pt. 3',
//   content: 'gibberish stuff for part 3',
// }, (err, post) => {
//   User.findOne({ email: 'bob@gmail.com' }, (_err, foundUser) => {
//     if (_err) {
//       console.log(err);
//     } else {
//       foundUser.posts.push(post);
//       foundUser.save((__err, data) => {
//         if (__err) {
//           console.log(err);
//         } else {
//           console.log(data);
//         }
//       });
//     }
//   });
// });

// User.create({
//   email: 'bob@gmail.com',
//   name: 'Bob Belcher',
// });
