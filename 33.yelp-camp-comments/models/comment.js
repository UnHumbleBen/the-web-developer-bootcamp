
const mongoose = require('mongoose');

// Sets up the schema (a representation of what makes up a comment).
const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
});

module.exports = mongoose.model('Comment', commentSchema);
