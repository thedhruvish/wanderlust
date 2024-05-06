const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingsSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const methodOverrde = require("method-override");
const { isLoggedIn, validateSechma, isOwner } = require("../middelware.js");

// index Routes
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
  })
);

// newPost
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

// Show  rotues
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
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
  })
);

// storge the data
router.post(
  "/",
  validateSechma,
  wrapAsync(async (req, res, next) => {
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    await newList.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
  })
);
//edit Routes
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not Exist !..");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);
//update routes
router.put(
  "/:id",
  validateSechma,
  isOwner,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Bad request");
    }
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", "Successfully The Update");
    res.redirect(`/listings/${listing._id}`);
  })
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let Dele = await Listing.findByIdAndDelete(id);
    console.log(Dele);
    req.flash("success", "Successfully The listings Delete");
    res.redirect("/listings");
  })
);

module.exports = router;
