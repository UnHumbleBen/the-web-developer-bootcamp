const express = require('express');

const app = express();

// Specifies the public/ to be the directory from which to serve static assets.
app.use(express.static('public'));
// Sets the view engine to allow ommission of extension of view files.
app.set('view engine', 'ejs');

// Handles requests to the home page.
app.get('/', (_req, res) => {
  res.render('home');
});

// Handles requests to /fallinlovewith.
app.get('/fallinlovewith/:thing', (req, res) => {
  const { thing } = req.params;
  res.render('love', { thingVar: thing });
});

app.get('/posts', (_req, res) => {
  const posts = [
    { title: 'Post 1', author: 'Susy' },
    { title: 'My adorable pet bunny', author: 'Charlie' },
    { title: 'Can you believe this pomsky?', author: 'Colt' },
  ];

  res.render('posts', { posts });
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('Server is listening!');
});
