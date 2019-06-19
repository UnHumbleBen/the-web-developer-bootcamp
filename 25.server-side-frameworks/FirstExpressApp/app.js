var express = require("express");
var app = express();

// "/" => "Hi there!"
app.get("/", function (req, res) {
    res.send("Hi there!");
});
// "/bye" => "Goodbye!"
app.get("/bye", function (req, res) {
    res.send("Goodbye!");
});
// "/dog" => "MEOW!"
app.get("/dog", function (req, res) {
    console.log("Someone made a request to /dog");
    res.send("MEOW!");
});

// Tells Express to listen for request (start server)
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server has started!");
});