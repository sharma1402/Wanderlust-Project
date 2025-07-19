const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");
const { cloudinary } = require("../cloudConfig.js");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        unique: true,
    }
});

// automatically implements user, password hashing and salting
userSchema.plugin(passportLocalMongoose);

// Mongoose middleware to delete user's related data
userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getQuery());

  if (user) {
    const userListings = await Listing.find({ owner: user._id });

    for (let listing of userListings) {
      for (let image of listing.images) {
        await cloudinary.uploader.destroy(image.filename);
      }
    }

    await Listing.deleteMany({ owner: user._id });
    await Booking.deleteMany({ user: user._id });
    await Review.deleteMany({ author: user._id });
  }

  next();
});

module.exports = mongoose.model('User', userSchema);