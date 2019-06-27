const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({"extended": true}));

app.set('view engine', 'ejs');
const friends = [
  'Tony',
  'Miranda',
  'Justin',
  'Pierre',
  'Lily'
];

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/addfriend', (req, res) => {
  const {newfriend} = req.body;

  friends.push(newfriend);
  res.redirect('/friends');
});

app.get('/friends', (req, res) => {
  res.render('friends', {friends});
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log("Server started!");
});