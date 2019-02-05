import * as express from 'express';
import {User} from '../interfaces/schemas/User';

const session = require('express-session');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

require('dotenv').config();

export class Authentication {
    private static instance: Authentication;

    constructor() {
    }

    public static getInstance(): Authentication {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication();
        }

        return Authentication.instance;
    }

    public setAuthentication(app: express.Application) {
        passport.use(new BearerStrategy((token, done) => {
            User.findOne({token: token}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user, {scope: 'all'});
            });
        }));

        passport.serializeUser(function (user, done) {
            done(null, user.token);
        });

        passport.deserializeUser(function (token, done) {
            User.findOne({token: token}, function (err, user) {
                done(err, user);
            });
        });

        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });

        app.use(session({
            secret: process.env.SESSION_SECRET, saveUninitialized: true, resave: true,
            cookie: {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            }
        }));
        app.use(passport.initialize());
        app.use(passport.session());
    }
}
