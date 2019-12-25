const mongoose = require('mongoose');

// Sets up the schema (a representation of what makes up a campground).
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

campgroundSchema.pre('remove', async function removeComment() {
  await Comment.remove({
    _id: {
      $in: this.comments,
    },
  });
});

module.exports = mongoose.model('Campground', campgroundSchema);
