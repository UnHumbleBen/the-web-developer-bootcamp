const express = require('express');

const app = express();

// Handles requests to the home page.
app.get('/', (_req, res) => {
  res.render('home.ejs');
});

// Handles requests to /fallinlovewith.
app.get('/fallinlovewith/:thing', (req, res) => {
  const { thing } = req.params;
  res.render('love.ejs', { thingVar: thing });
});

app.get('/posts', (_req, res) => {
  const posts = [
    { title: 'Post 1', author: 'Susy' },
    { title: 'My adorable pet bunny', author: 'Charlie' },
    { title: 'Can you believe this pomsky?', author: 'Colt' },
  ];

  res.render('posts.ejs', { posts });
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('Server is listening!');
});
