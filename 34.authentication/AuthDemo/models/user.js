const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Applies the passportLocalMongoose plugin, adding certain
// properties to UserSchema.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
