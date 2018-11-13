/* eslint-disable */

// auth for user

const express = require('express');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
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
      email
    })
    .then(user => {
      // check for user
      if (!user) {
        return res.status(404).json({
          email: 'User email not found'
        });
      }

      // check password
      // console.log(user.password) // see hashed password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            res.json({
              msg: 'Success'
            })
          } else {
            return res.status(400).json({
              password: 'Password Incorrect '
            })
          }
        })
    })

});

module.exports = router;