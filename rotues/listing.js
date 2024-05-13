const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingsSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const methodOverrde = require("method-override");
const { isLoggedIn, validateSechma, isOwner } = require("../middelware.js");
const listingconstroller = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// index Routes ,storge the data
router
  .route("/")
  .get(wrapAsync(listingconstroller.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateSechma,
    wrapAsync(listingconstroller.createList)
  );

// newPost
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

// Show ,update,delete
router
  .route("/:id")
  .get(wrapAsync(listingconstroller.showRouts))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateSechma,
    wrapAsync(listingconstroller.updateList)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingconstroller.deleteListings));

//edit Routes
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingconstroller.renderEditFrom)
);

module.exports = router;
