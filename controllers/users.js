const User = require("../models/user.js");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res) =>{
    try{
        let {username, email, password} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "Email is already registered. Please log in instead.");
            return res.redirect("/login");
        }
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next();
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
  }

module.exports.renderLoginForm = (req,res) => {
    const redirectUrl = req.session.redirectUrl || "/listings";
    res.render("./users/login.ejs", { redirectUrl });
}

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = req.body.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        } 
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}

module.exports.renderDashboard = async(req, res) => {
    const userId = req.user._id;

    const myListings = await Listing.find({ owner: userId });
    const myBookings = await Booking.find({ user: userId }).populate("listing");

    res.render("users/dashboard.ejs", { myListings, myBookings });
}

// Show confirmation form
module.exports.renderDeleteForm = (req, res) => {
    res.render("users/delete");
};

// Handle deletion
module.exports.deleteAccount = async (req, res) => {
    const { password } = req.body;

    const user = await User.findById(req.user._id);

    // If it's a Google OAuth user (no password), allow deletion directly
    if (user.googleId || !user.authenticate) {
        await User.findByIdAndDelete(req.user._id);
        req.logout(() => {
            req.flash("success", "Your account and data were deleted.");
            res.redirect("/listings");
        });
        return;
    }

    // Validate password for local users
    const isValid = await user.authenticate(password);
    if (!isValid.user) {
        req.flash("error", "Incorrect password.");
        return res.redirect("/delete");
    }

    await User.findByIdAndDelete(req.user._id);
    req.logout(() => {
        req.flash("success", "Your account and data were deleted.");
        res.redirect("/listings");
    })
};