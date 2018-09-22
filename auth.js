const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: "887422672206-87qlnhcmlhve079rbgl60vmarll0g5i0.apps.googleusercontent.com",
            clientSecret: "9uCCAniUdyL4mZvAIaDjqHGa",
            callbackURL: "http://acpul.org:8888/oauth2callback"
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};
