require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) return done(null, existingUser);

      const newUser = new User({
        username: profile.displayName,
        googleId: profile.id,
        email: profile.emails?.[0]?.value || ""
      });
      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err);
    }
  }
));


