const express = require('express');

const app = express();

// Handles requests to the home page.
app.get('/', (req, res) => {
  res.render('home.ejs');
});

// Handles requests to /fallinlovewith.
app.get('/fallinlovewith/:thing', (req, res) => {
  const { thing } = req.params;
  res.render('love.ejs', { thingVar: thing });
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('Server is listening!');
});
