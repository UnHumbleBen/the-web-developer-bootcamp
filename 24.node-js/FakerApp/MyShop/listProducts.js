//
// Quick exercise to practice installing and using NPM packages.
// Uses faker.js to print a random list of store items.
//
var faker = require('faker');

// Prints welcome message.
console.log("====================")
console.log("WELCOME TO MY SHOP!");
console.log("====================")

// Prints products.
var NUM_PRODUCTS = 10;
for (var i = 0; i < NUM_PRODUCTS; i++) {
    console.log(faker.fake("{{commerce.productName}} - ${{commerce.price}}"));
}