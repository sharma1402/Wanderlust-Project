const Listing = require("../models/listing");
const Booking = require("../models/booking");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Render booking.ejs
module.exports.renderBookingPage = async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  const listing = await Listing.findById(id);

   if (req.user && listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You can't book your own listing.");
    return res.redirect('/listings');
  }

  if (!listing || !startDate || !endDate) {
    req.flash("error", "Invalid booking details.");
    return res.redirect(`/listings/${id}`);
  }

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const totalPrice = days * listing.price;

  res.render("listings/booking.ejs", {
    listing,
    startDate,
    endDate,
    days,
    totalPrice,
  });
};

// Stripe checkout
module.exports.checkOut = async (req, res) => {
  const { startDate, endDate } = req.body;
  const listing = await Listing.findById(req.params.id);

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const totalPrice = days * listing.price;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/bookings/success?listing=${listing._id}&start=${startDate}&end=${endDate}&total=${totalPrice}`,
    cancel_url: `${req.protocol}://${req.get("host")}/listings/${listing._id}`,
    line_items: [{
      price_data: {
        currency: "inr",
        product_data: {
          name: listing.title,
          description: listing.description,
        },
        unit_amount: totalPrice * 100,
      },
      quantity: 1,
    }],
  });

  res.redirect(session.url);
};

//Save booking after Stripe payment
module.exports.bookingSuccess = async (req, res) => {
  const { listing, start, end, total } = req.query;

  const overlapping = await Booking.findOne({
    listing,
    $or: [
      { startDate: { $lte: end, $gte: start } },
      { endDate: { $gte: start, $lte: end } }
    ]
  });

  if (!overlapping) {
    await Booking.create({
      listing,
      user: req.user._id,
      startDate: new Date(start),
      endDate: new Date(end),
      totalPrice: parseFloat(total),
    });
    req.flash("success", "Payment successful! Your booking is confirmed.");
  } else {
    req.flash("error", "Oops! Those dates were just booked.");
  }
  res.redirect("/dashboard");
};

// destroy route
module.exports.destroyBooking = async (req,res) => {
  let {id, bookingId} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull : {bookings: bookingId}});
  await Booking.findByIdAndDelete(bookingId);

  req.flash("success","Booking cancelled!");
  res.redirect("/dashboard");
}
