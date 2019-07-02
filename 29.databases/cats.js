const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost/cat_app');

const catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

const Cat = mongoose.model("Cat", catSchema);

// Adds a new cat to the DB

// let george = new Cat({
//   name: "Mrs. Norris",
//   age: 7,
//   temperament: "Evil"
// });

// george.save((err, cat) => {
//   if (err) {
//     console.log('Something went wrong!');
//   } else {
//     console.log('Cat saved to the database.')
//     console.log(cat);
//   }
// });

Cat.create({
  temperament: 'Bland',
}, (err, cat) => {
  console.log('Adding new cat...');
  if (err) {
    console.log(err);
  } else {
    console.log(cat);
  }
});

// Retrieves all cats from DB and logs each one to console.

Cat.find({}, (err, cats) => {
  if (err) {
    console.log('Error!');
    console.log(err);
  } else {
    console.log('Displaying all the cats...');
    console.log(cats);
  }
})
