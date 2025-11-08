import passport from 'passport'
import {Strategy} from 'passport-google-oauth20'
import dotenv from 'dotenv'
dotenv.config()


passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile']
}, async function(accessToken, refreshToken, profile, done){
    done(null, {email: profile.emails[0].value, fullName: profile.displayName, avatar: profile.photos[0].value})
}) )

export default passport