import * as express from 'express';
import {User} from '../../schemas/User';

const passport = require('passport');
const passportJWT = require('passport-jwt');

require('dotenv').config();

export class Authentication {

    constructor(app: express.Application) {
        this.createAuthenticationMethod(app);
        app.use(passport.initialize());
        app.use(passport.session());
    }

    private createAuthenticationMethod(app: express.Application) {
        passport.use(new passportJWT.Strategy({
            secretOrKey: process.env.SESSION_SECRET,
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
        }, async (user, done) => {
            try {
                return done(null, await this.deserializeUser(user))
            } catch (error) {
                done(error);
            }
        }));
    }


    private async deserializeUser(user: any) {
        return User.findById(user._id);
    }
}
