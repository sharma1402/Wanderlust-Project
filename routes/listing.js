const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index)) 
    // for creating listing we have used post 
    .post(
    isLoggedIn, 
    validateListing, 
    upload.single('listing[image]'), //multer is processing data here
    wrapAsync(listingController.createListing)
    );

// new route
router.get("/new", 
    isLoggedIn, 
    listingController.renderNewForm
);

router.get("/filter/:id", wrapAsync(listingController.filter));

router.get("/search", wrapAsync(listingController.search));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn, 
    isOwner, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing)
)
.delete(
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.destroyListing)
);

// Edit route
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync (listingController.renderEditForm)
);

module.exports = router;