//store the authentication strategies we will configure (是不是相当于吧mongoose里的方法结合到apassport里？？)
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

//User.authenticate === function(username,password,done)确认某user被authenticate了
//use static authenicate method of model in LocalStrategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false); 
            }
            else if (user) {
                return done(null, user);  //user found
            }
            else {
                return done(null, false);  //can't find the user
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false}); //don't use session

exports.verifyAdmin = function(req, res, next) {
    if (req.user.admin){
        next();
    }
    else {
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};