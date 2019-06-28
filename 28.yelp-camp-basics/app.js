const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  const campgrounds = [
    { name: 'Salmon Creek', image: 'https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732e7ddd924fc45a_340.jpg' },
    { name: 'Granite Hill', image: 'https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732e7ddd924fc45a_340.jpg' },
    { name: 'Mountain Goat\'s Rest', image: 'https://www.photosforclass.com/download/pixabay-1208201?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732e7ddd924fc45a_960.jpg&user=Free-Photos' },
  ];
  res.render('campgrounds', { campgrounds });
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The YelpCamp server has started!');
});
