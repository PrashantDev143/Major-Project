const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../Utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const ExpressError = require("../Utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn}=require("../middleware.js");
const { isOwner}=require("../middleware.js");
const {validateListing}= require("../middleware.js");
const listingController=require("../controllers/listings.js");
const {index}= listingController;
const {renderNewForm}=listingController;
const {showListing}= listingController;
const {renderEditForm}=listingController;
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,  
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createNewListing)
  );



// ✅ Form to create new listing (keep static first!)
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

router.get("/:id", isLoggedIn, wrapAsync(showListing));




router.get(
  "/:id",isLoggedIn,
  wrapAsync(showListing)
);

// ✅ Edit form
router.get(
  "/:id/edit",
  wrapAsync(renderEditForm)
);



module.exports = router;
