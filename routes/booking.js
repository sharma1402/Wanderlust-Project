const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.js");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync.js");

// Rendering booking.ejs
router.get("/confirm/:id", isLoggedIn, bookingController.renderBookingPage);

//Stripe Checkout
router.post("/checkout/:id", isLoggedIn, wrapAsync(bookingController.checkOut));

//success payment
router.get("/success", isLoggedIn, bookingController.bookingSuccess);

// destroy route for booking
router.delete("/:id/:bookingId", isLoggedIn, bookingController.destroyBooking);

module.exports = router;
