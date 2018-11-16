/* eslint-disable */

// auth for user

const express = require('express');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');
// require keys
const keys = require('../../config/keys');
// require model
const User = require('../../models/User');
const router = express.Router();

// @router  GET to /api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({
  msg: 'Users Works'
}));

// @router  GET to /api/users/register
// @desc    Tests users route
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ // check to see if user email is already in db
      email: req.body.email
    })
    .then((user) => {
      if (user) { // if user is there return a message
        return res.status(400).json({
          email: 'Email already exists'
        });
      } else {
        // notes in 10
        const avatar = gravatar.url(req.body.email, {
          s: '200', // size 200
          r: 'pg', // rating
          d: 'mm', // default
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @router    GET api/users/login
// @desc      Login user / return JWT token
// @access    Public
router.post('/login', (req, res) => {
  //  get user infor
  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({
      email // ES6 here
    })
    .then(user => { // a promise 
      // check for user
      if (!user) { // if user does not exsi
        return res.status(404).json({
          email: 'User email not found'
        });
      }

      // check password
      // console.log(user.password) // see hashed password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched
            const payload = { id: user.id, name: user.name, avatar: user.avatar } // create jwt payload
            // Sign token
            // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            // this is Asynchronous because a callback is given
            jwt.sign(
              payload, 
              keys.secretOfKey, 
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token // this is placed in the header
                })
              }); // expires in 1h
          } else {
            return res.status(400).json({
              password: 'Password Incorrect '
            })
          }
        })
    })
});

// @router  GET to /api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({msg: 'Success'})
});

module.exports = router;

// Docs refered
// https://github.com/auth0/node-jsonwebtoken#readme