const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingsSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;
    req.flash("error", "You need to be logged in to create a new listing !..");
    return res.redirect("/login");
  }
  next();
};

module.exports.savaUrlredirect = (req, res, next) => {
  if (req.session.originalUrl) {
    res.locals.redirectUrl = req.session.originalUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // if (!listing) {
  //   req.flash("error", "Listing not found");
  //   return res.redirect("/listings");
  // }
  if (!(listing && listing.owner._id.equals(res.locals.currentUser._id))) {
    req.flash("error", "You are not Owner This Listings");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateSechma = (req, res, next) => {
  let { error } = listingsSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not Author This Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
