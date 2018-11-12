/* eslint-disable eol-last */
// auth for user

const express = require('express');

const router = express.Router();

// @router  GET to /api/users/users
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

module.exports = router;