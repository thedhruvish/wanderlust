const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://cdn.louisfeedsdc.com/wp-content/uploads/green-certified-homes-florida-home-brokers_4111117.jpg",
    set: (v) =>
      v === ""
        ? "https://cdn.louisfeedsdc.com/wp-content/uploads/green-certified-homes-florida-home-brokers_4111117.jpg"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    // console.log(listing.reviews);
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
