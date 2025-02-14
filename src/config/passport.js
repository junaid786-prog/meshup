const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const config = require("./config");
const User = require("../models/user");

console.log({
    consumerKey: config.twitterConsumerKey,
    consumerSecret: config.twitterConsumerSecret,
    callbackURL: config.twitterCallbackUrl,
});

passport.use(
    new TwitterStrategy(
        {
            consumerKey: config.twitterConsumerKey,
            consumerSecret: config.twitterConsumerSecret,
            callbackURL: config.twitterCallbackUrl,
        },
        async (token, tokenSecret, profile, done) => {
            console.log("token", token, tokenSecret, profile);

            try {
                let user = await User.findOne({ twitterHandle: profile.username });
                if (!user) {
                    user = await User.create({
                        username: profile.username,
                        displayName: profile.displayName,
                        email: profile.emails && profile.emails[0].value ? profile.emails[0].value : `${profile.username}@twitter.com`,
                        password: "twitter-oauth",
                        twitterHandle: profile.username,
                        profileImage: profile.photos && profile.photos[0].value ? profile.photos[0].value : "",
                        metaData: {
                            followers: profile._json.followers_count,
                            following: profile._json.friends_count,
                            tweets: profile._json.statuses_count,
                        }
                    });
                }
                return done(null, user);
            } catch (error) {
                console.log(error);
                
                return done(error, false);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
