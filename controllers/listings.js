const Listing = require("../models/listing.js");
const forwardGeocode = require("../utils/geocoding.js");

module.exports.index = async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: { path: "author",
        } 
    }).populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req,res) => {
    const { listing } = req.body;
    const {lng, lat, formatted_address} = await forwardGeocode(listing.location);
    if (!req.file) {
        req.flash("error", "Image upload failed or missing.");
        return res.redirect("/listings/new");
    }
    const newListing = new Listing({
        ...listing,
         geometry: {
                type: "Point",
                coordinates: [lng, lat]
            },
            formatted_address:formatted_address,
            owner: req.user._id,
            image: {
                url: req.file.path,
                filename: req.file.filename
            }
        });
    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
}

module.exports.updateListing = async (req,res) =>{
    let {id} = req.params;
    const { lng, lat, formatted_address } = await forwardGeocode(req.body.listing.location);
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing,
        geometry: {
                type: "Point",
                coordinates: [lng, lat],
                formatted_address:formatted_address,
            },
        },
        { new: true } 
    );

    if(typeof req.file !== "undefined")  {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}