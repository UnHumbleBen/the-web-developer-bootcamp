const express = require('express');
const request = require('request');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('search');
});

app.get('/results', (req, res) => {
  const { search } = req.query;
  request(`https://www.omdbapi.com/?apikey=18e337fe&s=${search}`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      res.render('results', { data });
    }
  });
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('Movie App has started!');
});
