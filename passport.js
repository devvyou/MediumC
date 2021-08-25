const LocalStrategy = require('passport-local').Strategy,
    passport = require('passport'),
    Admin = require('./database/models/Admin');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    (email, password, done) => {

        // Find the mail into the database
        Admin.findOne({ email }, async (err, user) => {

            if (err) { return done(err); }

            // Check if the admin's email and the email insert are not the equal
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            // Comparing the password with the admin's password 
            const isValid = await user.validatePassword(password);

            // Check if they don't match 
            if (!isValid) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            // All checks passed
            return done(null, user)

        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, user) => {
        done(err, user);
    });
});
