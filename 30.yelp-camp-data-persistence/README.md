# YelpCamp

* Add Loading Page
* Add Campgrounds Page that lists all campgrounds

## Each Campground has:
* Name
* Image

## Layout and Basic Styling
* Create our header and footer partials
* Add in Bootstrap

## Creating New Campgrounds
* Setup new campground POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

## Style the campgrounds page
* Add a better header/title
* Make campgrounds display in the grid.

## Style the Navbar and Form
* Add a navbar to all templates
* Style the new campground form

## RESTful Routes (note the table below is clearer when raw.)
name    url        verb  desc.
==========================================================
INDEX   /dogs      GET   Display a list of dog
NEW     /dogs/new  GET   Displays a form to make a new dog
CREATE  /dogs      POST  Add new dog to database
SHOW    /dogs/:id  GET   Show info about one dog

note: you need at least two routes to send a post request.
in this case: NEW and CREATE.