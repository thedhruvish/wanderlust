const Listing = require("../models/listing.js");

//index
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
};

// show Routs
module.exports.showRouts = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not Exist !..");
    res.redirect("/listings");
  }
  //   console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

// stroge the data
module.exports.createList = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newList = new Listing(req.body.listing);
  newList.owner = req.user._id;
  newList.image = { url, filename };
  await newList.save();
  req.flash("success", "Successfully made a new listing");
  res.redirect("/listings");
};

//edit Routes
module.exports.renderEditFrom = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not Exist !..");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalUrl });
};

// update
module.exports.updateList = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Bad request");
  }
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
  }
  await listing.save();

  req.flash("success", "Successfully The Update");
  res.redirect(`/listings/${listing._id}`);
};
// delete
module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let Dele = await Listing.findByIdAndDelete(id);
  console.log(Dele);
  req.flash("success", "Successfully The listings Delete");
  res.redirect("/listings");
};
