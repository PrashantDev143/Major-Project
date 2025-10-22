const Listing=require("../models/listings.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };


  module.exports.renderNewForm=(req, res) => {

 
  res.render("listings/new.ejs");
};


module.exports.showListing=async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).
    populate({
      path:"reviews",
    populate:{
      path:"author"
    }}).
    populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings"); // 🔑 prevents double response
    }

    res.render("listings/show.ejs", { listing });
  };



  module.exports.renderEditForm=async (req, res, next) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);
  
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings"); // 🔑 prevents crash
      }
  
      res.render("listings/edit.ejs", { listing });
    };




    module.exports.createNewListing=async (req, res) => {
        let url = req.file.path;
        let filename=req.file.filename;
        req.body.listing.image={url,filename};

      const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success", "Successfully made a new listing!");
        return res.redirect("/listings"); // 🔑 added return
      };





      module.exports.updateListing=async (req, res) => {
         let { id } = req.params;

// ✅ First, find the listing
const listing = await Listing.findById(id);
if (!listing) {
  req.flash("error", "Listing not found");
  return res.redirect("/listings");
}

// ✅ (Optional) Ownership check — uncomment if needed
// if (!listing.owner._id.equals(res.locals.currentUser._id)) {
//   req.flash("error", "You don't have permission to edit");
//   return res.redirect(`/listings/${id}`);
// }

// ✅ Handle image only if a new file was uploaded
if (req.file) {
  let url = req.file.path;
  let filename = req.file.filename;
  req.body.listing.image = { url, filename };
}

// ✅ Update the listing
const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

req.flash("success", "Listing updated!");
res.redirect(`/listings/${id}`);
};











        module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings"); // 🔑
    }

    req.flash("success", "Listing deleted!");
    return res.redirect("/listings"); // 🔑
  };