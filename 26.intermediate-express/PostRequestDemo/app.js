const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/addfriend', (req, res) => {
  res.send('You have reached the post route!');
});

app.get('/friends', (req, res) => {
  const friends = [
    'Tony',
    'Miranda',
    'Justin',
    'Pierre',
    'Lily'
  ];

  res.render('friends', {friends});
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log("Server started!");
});