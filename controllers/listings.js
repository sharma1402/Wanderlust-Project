const Listing = require("../models/listing.js");
const forwardGeocode = require("../utils/geocoding.js");
const Booking = require("../models/booking");

module.exports.index = async (req,res) =>{
    let allListings;

    if (req.user) {
      allListings = await Listing.find({ owner: { $ne: req.user._id } }); // exclude current user's listings
    } else {
      allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
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
    const bookings = await Booking.find({ listing: listing._id });
    const bookedDates = bookings.map(b => ({
      from: b.startDate.toISOString().split("T")[0],
      to: b.endDate.toISOString().split("T")[0]
    }));

    res.render("listings/show.ejs", { listing, bookedDates });
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
              filename: req.file.filename,
          },
        });
    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success","New Listing Created!");
    res.redirect("/dashboard");
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

module.exports.filter = async (req, res) => {
  let { id } = req.params;
  let allListings = await Listing.find({ category: { $all: [id] } });
  if (allListings.length != 0) {
    res.locals.success = `Listings Filtered by ${id}!`;
    res.render("listings/index.ejs", { allListings });
  } else {
    req.flash("error", `No listing for ${id}!`);
    res.redirect("/listings");
  }
};

module.exports.search = async (req, res) => {
  let input = req.query.q.trim().replace(/\s+/g, " ");
  if (input == "" || input == " ") {
    req.flash("error", "Please enter search query!");
    res.redirect("/listings");
  }

  let data = input.split("");
  let element = "";
  let flag = false;
  for (let index = 0; index < data.length; index++) {
    if (index == 0 || flag) {
      element = element + data[index].toUpperCase();
    } else {
      element = element + data[index].toLowerCase();
    }
    flag = data[index] == " ";
  }

  let allListings = await Listing.find({
    title: { $regex: element, $options: "i" },
  });
  if (allListings.length != 0) {
    res.locals.success = "Listings searched by Title!";
    res.render("listings/index.ejs", { allListings });
    return;
  }

  if (allListings.length == 0) {
    allListings = await Listing.find({
      category: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by Category!";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    allListings = await Listing.find({
      country: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by Country!";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }

  if (allListings.length == 0) {
    allListings = await Listing.find({
      location: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by Location!";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }

  const intValue = parseInt(element, 10);
  const intDec = Number.isInteger(intValue);

  if (allListings.length == 0 && intDec) {
    allListings = await Listing.find({ price: { $lte: element } }).sort({
      price: 1,
    });
    if (allListings.length != 0) {
      res.locals.success = `Listings searched by price less than Rs ${element}!`;
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    req.flash("error", "No listings found based on your search!");
    res.redirect("/listings");
  }
};

module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/dashboard");
};