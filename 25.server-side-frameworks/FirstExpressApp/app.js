const express = require('express');

const app = express();

// "/" => "Hi there!"
app.get('/', (req, res) => {
  res.send('Hi there!');
});
// "/bye" => "Goodbye!"
app.get('/bye', (req, res) => {
  res.send('Goodbye!');
});
// "/dog" => "MEOW!"
app.get('/dog', (req, res) => {
  console.log('Someone made a request to /dog');
  res.send('MEOW!');
});

app.get('/r/:subredditName', (req, res) => {
  const subreddit = req.params.subredditName;
  res.send(`WELCOME TO THE ${subreddit.toUpperCase()} SUBREDDIT!`);
});

app.get('/r/:subredditName/comments/:id/:title', (req, res) => {
  console.log(req.params);
  res.send('welcome to a comments page!');
});

// This needs to be placed last since the first route that matches the request will be run.
app.get('*', (req, res) => {
  res.send('You are a star!');
});


// Tells Express to listen for request (start server)
app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server has started!');
});
