// Docs @ https://www.npmjs.com/package/passport-jwt
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

// model
const User = mongoose.model('users');

// key
const keys = require('../config/keys');

// options is an object literal containing options to control how the token is extracted from the request or verified.
const opts = {};

// jwtFromRequest (REQUIRED) Function that accepts a request as the only parameter and returns either
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// secretOrKey is a string or buffer containing the secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature. REQUIRED unless secretOrKeyProvider is provided.
opts.secretOrKey = keys.secretOfKey;

module.exports = (passport) => {
  //   jwt_payload is an object literal containing the decoded JWT payload.
  //   done is a passport error first callback accepting arguments done(error, user, info)

  passport.use(
    // new JwtStrategy(options, verify)
    new JwtStrategy(opts, (jwt_payload, done) => {
      // console.log(jwt_payload); 
      User.findById(jwt_payload.id) // this id comes from the jwt payload. verified with console.log
      .then(user => {
        if(user){

          // done is a passport error first callback accepting arguments done(error, user, info)
          return done(null, user);
        }
        return done(null, false); // if there is no user then return false.
      })
      .catch( err => console.log(err));
    }),
  );
};
