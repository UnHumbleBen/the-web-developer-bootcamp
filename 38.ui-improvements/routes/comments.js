/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');

const Comment = require('../models/comment');

const { isLoggedIn, checkCommentOwnership } = require('../middleware');

// NEW route. Comments NEW
// Redirects to comment form page.
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash('error', 'Campground not found');
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// POST route. Comments CREATE
// Retrieves form data from route above and add new comment to database.
router.post('/', isLoggedIn, (req, res) => {
  // Lookup campground using ID.
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err2, comment) => {
        if (err2) {
          req.flash('error', 'Something went wrong');
          console.log(err2);
        } else {
          // Add username and id to comment.
          const newComment = comment;
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          // Save comment.
          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          console.log(newComment);
          req.flash('success', 'Successfully added comment');
          // eslint-disable-next-line no-underscore-dangle
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// COMMENT EDIT ROUTE
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
    }
  });
});

// COMMENT UPDATE ROUTE
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;
