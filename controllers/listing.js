const { response } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClint = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
console.log(listing.geometry);
console.log(listing.geometry.coordinates);
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res) => {
  try {

    let response = await geocodingClint.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();

    // ADD THESE 3 LINES
    console.log("Features:", response.body.features);
    console.log("First Feature:", response.body.features[0]);
    console.log("Geometry:", response.body.features[0]?.geometry);

    let url = req.file.path;
    let filename = req.file.filename;

    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = { url, filename };

    listing.geometry = response.body.features[0].geometry;

    // ADD THESE 2 LINES
    console.log("Before Save:", listing.geometry);

    let savedListing = await listing.save();

    // ADD THESE 2 LINES
    console.log("After Save:", savedListing.geometry);
    console.log("Coordinates:", savedListing.geometry.coordinates);

    req.flash("success", "New listing created!");
    res.redirect("/listings");

  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
};
module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/h_300,w_250");

res.render("listings/show", {
    listing,
    mapToken: process.env.MAP_TOKEN
});
   }



    
module.exports.updateListing = async (req, res) => {

  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
    if(typeof req.file !== "undefined"){
   let url = req.file.path;
    let filename = req.file.filename;
  listing.image = { url, filename};
    await listing.save();
    }
  req.flash("success","Update successfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}