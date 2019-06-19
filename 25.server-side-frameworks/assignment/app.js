const express = require('express');

const app = express();

// HTTP GET request for homepage.
app.get('/', (req, res) => {
  res.send('Hi there, welcome to my assignment!');
});

// Contains the sounds for various animals.
const sounds = {
  pig: 'oink',
  cow: 'moo',
  dog: 'woof woof!',
  cat: 'meow',
  rat: 'squeak',
};

/**
 * HTTP GET request for speak.
 * Sends a HTTP response with @animal saying the sound.
 * Example: Visiting "/speak/pig" prints "The pig says oink".
 */
app.get('/speak/:animal', (req, res) => {
  const { animal } = req.params;
  res.send(`The ${animal} says ${sounds[animal.toLowerCase()]}`);
});

/**
 * HTTP GET request for repeat.
 * Sends a HTTP response with @word repeated @number times.
 * Example: Visiting "/repeat/hello/3" prints "hello hello hello".
 */
app.get('/repeat/:word/:number', (req, res) => {
  const { word } = req.params;
  let { number } = req.params;
  number = parseInt(number, 10);
  let string = '';
  for (let i = 0; i < number; i += 1) {
    string += `${word} `;
  }
  res.send(string);
});

// Handles GET request for all other paths.
app.get('*', (req, res) => {
  res.send('Sorry, page not found...What are you doing with your life?');
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('Now serving your app!');
});
