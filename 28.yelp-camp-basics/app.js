const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  const campgrounds = [
    { name: 'Salmon Creek', image: 'https://www.photosforclass.com/download/pixabay-1149402?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732e7cdc9045c65f_960.jpg&user=Free-Photos' },
    { name: 'Granite Hill', image: 'https://www.photosforclass.com/download/pixabay-1189929?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732e7cdc9045c65f_960.jpg&user=Noel_Bauza' },
    { name: 'Mountain Goat\'s Rest', image: 'https://www.photosforclass.com/download/pixabay-1208201?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732e7ddd924fc45a_960.jpg&user=Free-Photos' },
  ];
  res.render('campgrounds', { campgrounds });
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The YelpCamp server has started!');
});
