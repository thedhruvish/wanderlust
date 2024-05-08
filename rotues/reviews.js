const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ReviewController = require("../controller/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middelware.js");

// review routes 
// creaete  a review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewController.createReview)
);

// DELETE REVIE
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewController.deleteReview)
);

module.exports = router;
