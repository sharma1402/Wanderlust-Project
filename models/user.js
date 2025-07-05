const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
    }
});

// automatically implements user, password hashing and salting
userSchema.plugin(passportLocalMongoose);

// Mongoose middleware to delete user's related data
userSchema.pre("findOneAndDelete", async function (next) {
    const user = await this.model.findOne(this.getQuery());

    if (user) {
        await Listing.deleteMany({ owner: user._id });
        await Booking.deleteMany({ user: user._id });
        await Review.deleteMany({ author: user._id });
    }

    next();
});

module.exports = mongoose.model('User', userSchema);