const Listing = require("../models/listing");
const Review = require("../models/review");
// creaete  a review
module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);

  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  console.log(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Successfully The Add a New Review");
  res.redirect(`/listings/${listing._id}`);
};

// delete a review

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Successfully The Delete a New Review");

  res.redirect(`/listings/${id}`);
};
