/* eslint-disable no-underscore-dangle */
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// All the middleware goes here.
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // If user is logged in.
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else if (foundCampground.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', 'You don\'t have permission to do that');
        res.redirect('back');
      }
    });
  } else {
    // User is not logged in, redirects back to where they came from.
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  // If user is logged in.
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', 'Campground not found');
        // Error finding comment.
        res.redirect('back');
      } else if (foundComment.author.id.equals(req.user._id)) {
        // User owns the comment.
        next();
      } else {
        // User does not owns the comment.
        req.flash('error', 'You don\'t have permission to do that');
        res.redirect('back');
      }
    });
  } else {
    // User is not logged in, redirects back to where they came from.
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please Login First!');
  return res.redirect('/login');
};

module.exports = middlewareObj;
