import * as express from 'express';
import {User} from '../interfaces/schemas/User';

const passport = require('passport');
const passportJWT = require('passport-jwt');

require('dotenv').config();

export class Authentication {
    private static instance: Authentication;

    private constructor() {
    }

    public static getInstance(): Authentication {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication();
        }

        return Authentication.instance;
    }

    public setAuthentication(app: express.Application) {
        passport.use(new passportJWT.Strategy({
            secretOrKey: process.env.SESSION_SECRET,
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
        }, async (user, done) => {
            try {
                return done(null, await this.serializeUser(user))
            } catch (error) {
                done(error);
            }
        }));

        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });

        app.use(passport.initialize());
        app.use(passport.session());
    }


    private async serializeUser(user: any) {
        return User.findById(user._id);
    }
}
