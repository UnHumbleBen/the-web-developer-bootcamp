/* eslint-disable no-console */
const rp = require('request-promise');


rp('http://jsonplaceholder.typicode.com/users/1')
  .then((body) => {
    const parsedData = JSON.parse(body);
    console.log(`${parsedData.name} lives in ${parsedData.address.city}.`);
  })
  .catch((err) => {
    console.log('Error!', err);
  });
